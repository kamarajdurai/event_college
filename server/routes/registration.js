/**
 * Registration Routes
 * POST /api/register         - Register student for an event → returns ticket
 * GET  /api/registrations    - List all registrations (admin)
 * GET  /api/ticket/:ticketId - Get a single ticket by ID
 * POST /api/verify           - Verify ticket at venue (scan QR)
 */

const express = require('express');
const router  = express.Router();

const { generateTicketId }         = require('../utils/ticketGenerator');
const { generateQRCodeDataURL }    = require('../utils/qrGenerator');
const { initFirebase }             = require('../config/firebase');

// ─── In-memory fallback store (used when Firebase is not configured) ──────────
const inMemoryStore = [];
const inMemoryAttendanceStore = [];

// ─── Helper: get storage (Firestore or in-memory) ────────────────────────────
function getStore() {
  const { db } = initFirebase();
  return db;
}

// ─── POST /api/register ───────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      college,
      eventId,
      eventName,
      eventCategory,
      eventDate,
      eventVenue,
      teamSize,
      teamMembers,  // array of { name, email }
      userId,       // Firebase Auth UID (optional)
      department,
      paymentOption,
      paymentMethod,
      transactionId,
      paymentScreenshot,
    } = req.body;

    // ── Validate required fields ──────────────────────────────────────────────
    if (!name || !email || !eventName) {
      return res.status(400).json({
        success: false,
        message: 'name, email, and eventName are required fields.',
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    const db = getStore();

    // ── Duplicate check ───────────────────────────────────────────────────────
    if (db) {
      const existing = await db
        .collection('registrations')
        .where('email', '==', email.toLowerCase())
        .where('eventId', '==', eventId || eventName)
        .get();

      if (!existing.empty) {
        const existingData = existing.docs[0].data();
        return res.status(409).json({
          success: false,
          message: 'You are already registered for this event.',
          ticketId: existingData.ticketId,
        });
      }
    } else {
      const dup = inMemoryStore.find(
        (r) =>
          r.email.toLowerCase() === email.toLowerCase() &&
          (r.eventId || r.eventName) === (eventId || eventName)
      );
      if (dup) {
        return res.status(409).json({
          success: false,
          message: 'You are already registered for this event.',
          ticketId: dup.ticketId,
        });
      }
    }

    // ── Generate unique Ticket ID ─────────────────────────────────────────────
    let ticketId;
    let isUnique = false;

    while (!isUnique) {
      ticketId = generateTicketId(eventName);

      if (db) {
        const snap = await db
          .collection('registrations')
          .where('ticketId', '==', ticketId)
          .get();
        isUnique = snap.empty;
      } else {
        isUnique = !inMemoryStore.find((r) => r.ticketId === ticketId);
      }
    }

    // ── Generate QR Code ──────────────────────────────────────────────────────
    const qrCodeDataURL = await generateQRCodeDataURL({
      ticketId,
      eventId:   eventId || eventName,
      eventName,
      name,
      email,
    });

    // ── Build registration object ─────────────────────────────────────────────
    const registration = {
      ticketId,
      name:         name.trim(),
      email:        email.toLowerCase().trim(),
      phone:        phone || null,
      college:      college || null,
      department:   department || null,
      eventId:      eventId || eventName,
      eventName:    eventName.trim(),
      eventCategory: eventCategory || 'General',
      categoryGroup: req.body.categoryGroup || 'tech',
      eventDate:    eventDate || null,
      eventVenue:   eventVenue || null,
      teamSize:     teamSize || 1,
      teamMembers:  teamMembers || [],
      userId:       userId || null,
      qrCode:       qrCodeDataURL,     // base64 PNG
      status:       'confirmed',        // confirmed | cancelled | used
      registeredAt: new Date().toISOString(),
      checkedIn:    false,
      checkedInAt:  null,
      paymentOption: paymentOption || 'free',
      paymentMethod: paymentMethod || null,
      transactionId: transactionId || null,
      paymentScreenshot: paymentScreenshot || null,
    };

    // ── Save to Firestore or in-memory ────────────────────────────────────────
    if (db) {
      await db.collection('registrations').doc(ticketId).set(registration);
      console.log(`✅ Saved to Firestore: ${ticketId}`);

      if (userId) {
        try {
          const userRef = db.collection('users').doc(userId);
          const userSnap = await userRef.get();
          if (userSnap.exists) {
            const userData = userSnap.data();
            const registrationsList = userData.registrations || [];
            
            // Check if ticket already exists in the list
            const exists = registrationsList.some(r => r.ticketId === ticketId);
            if (!exists) {
              registrationsList.push({
                ticketId,
                eventId: registration.eventId,
                eventName: registration.eventName,
                eventCategory: registration.eventCategory,
                eventDate: registration.eventDate,
                eventVenue: registration.eventVenue,
                registeredAt: registration.registeredAt,
                status: registration.status
              });
              await userRef.update({
                registrations: registrationsList
              });
              console.log(`✅ Updated registrations history for user: ${userId}`);
            }
          }
        } catch (uErr) {
          console.error(`Error updating user registrations history:`, uErr);
        }
      }
    } else {
      inMemoryStore.push(registration);
      console.log(`📝 Saved to memory: ${ticketId} (${name})`);
    }

    // ── Respond with ticket ───────────────────────────────────────────────────
    return res.status(201).json({
      success: true,
      message: 'Registration successful! Your ticket is ready.',
      ticket: {
        ticketId,
        name:        registration.name,
        email:       registration.email,
        college:     registration.college,
        eventName:   registration.eventName,
        eventDate:   registration.eventDate,
        eventVenue:  registration.eventVenue,
        teamSize:    registration.teamSize,
        status:      registration.status,
        registeredAt:registration.registeredAt,
        qrCode:      qrCodeDataURL,    // frontend renders this as <img src={qrCode} />
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─── GET /api/ticket/:ticketId ────────────────────────────────────────────────
router.get('/ticket/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const db = getStore();

    let ticket;
    if (db) {
      const doc = await db.collection('registrations').doc(ticketId).get();
      if (!doc.exists) {
        return res.status(404).json({ success: false, message: 'Ticket not found.' });
      }
      ticket = doc.data();
    } else {
      ticket = inMemoryStore.find((r) => r.ticketId === ticketId);
      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket not found.' });
      }
    }

    return res.json({ success: true, ticket });
  } catch (err) {
    console.error('Get ticket error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── POST /api/verify ─────────────────────────────────────────────────────────
// Called when staff scans QR code at venue entrance
router.post('/verify', async (req, res) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId) {
      return res.status(400).json({ success: false, message: 'ticketId is required.' });
    }

    const db = getStore();
    let ticket;

    if (db) {
      const doc = await db.collection('registrations').doc(ticketId).get();
      if (!doc.exists) {
        return res.status(404).json({ success: false, valid: false, message: 'Invalid ticket.' });
      }
      ticket = doc.data();

      if (ticket.checkedIn) {
        return res.status(200).json({
          success: true,
          valid: false,
          message: `⚠️ Already checked in at ${ticket.checkedInAt}`,
          ticket,
        });
      }

      // Mark as checked in
      const checkedInTime = new Date().toISOString();
      await db.collection('registrations').doc(ticketId).update({
        checkedIn:   true,
        checkedInAt: checkedInTime,
        status:      'used',
      });

      // Store leader's attendance details in dedicated attendance collection
      await db.collection('attendance').doc(`${ticketId}-leader`).set({
        ticketId: ticketId,
        eventId: ticket.eventId || ticket.eventName || 'TBD',
        eventName: ticket.eventName || 'TBD',
        eventCategory: ticket.eventCategory || 'General',
        categoryGroup: ticket.categoryGroup || 'tech',
        studentName: ticket.name || 'TBD',
        collegeName: ticket.college || 'Knowledge Institute of Technology',
        email: ticket.email || 'TBD',
        department: ticket.department || 'B.Tech CSE',
        checkedInAt: checkedInTime,
        role: 'Team Leader'
      });

      // Store team members' attendance if they exist
      if (ticket.teamMembers && Array.isArray(ticket.teamMembers)) {
        for (let i = 0; i < ticket.teamMembers.length; i++) {
          const m = ticket.teamMembers[i];
          await db.collection('attendance').doc(`${ticketId}-member-${i}`).set({
            ticketId: ticketId,
            eventId: ticket.eventId || ticket.eventName || 'TBD',
            eventName: ticket.eventName || 'TBD',
            eventCategory: ticket.eventCategory || 'General',
            categoryGroup: ticket.categoryGroup || 'tech',
            studentName: m.name || 'TBD',
            collegeName: m.college || ticket.college || 'Knowledge Institute of Technology',
            email: m.email || 'TBD',
            department: m.department || ticket.department || 'B.Tech CSE',
            checkedInAt: checkedInTime,
            role: 'Member'
          });
        }
      }
    } else {
      const idx = inMemoryStore.findIndex((r) => r.ticketId === ticketId);
      if (idx === -1) {
        return res.status(404).json({ success: false, valid: false, message: 'Invalid ticket.' });
      }
      ticket = inMemoryStore[idx];
      if (ticket.checkedIn) {
        return res.status(200).json({
          success: true,
          valid: false,
          message: `⚠️ Already checked in at ${ticket.checkedInAt}`,
          ticket,
        });
      }
      const checkedInTime = new Date().toISOString();
      inMemoryStore[idx].checkedIn   = true;
      inMemoryStore[idx].checkedInAt = checkedInTime;
      inMemoryStore[idx].status      = 'used';

      // Store leader's attendance details in in-memory store
      inMemoryAttendanceStore.push({
        ticketId: ticketId,
        eventId: ticket.eventId || ticket.eventName || 'TBD',
        eventName: ticket.eventName || 'TBD',
        eventCategory: ticket.eventCategory || 'General',
        categoryGroup: ticket.categoryGroup || 'tech',
        studentName: ticket.name || 'TBD',
        collegeName: ticket.college || 'Knowledge Institute of Technology',
        email: ticket.email || 'TBD',
        department: ticket.department || 'B.Tech CSE',
        checkedInAt: checkedInTime,
        role: 'Team Leader'
      });

      // Store team members' attendance details in in-memory store
      if (ticket.teamMembers && Array.isArray(ticket.teamMembers)) {
        ticket.teamMembers.forEach((m, memberIdx) => {
          inMemoryAttendanceStore.push({
            ticketId: ticketId,
            eventId: ticket.eventId || ticket.eventName || 'TBD',
            eventName: ticket.eventName || 'TBD',
            eventCategory: ticket.eventCategory || 'General',
            categoryGroup: ticket.categoryGroup || 'tech',
            studentName: m.name || 'TBD',
            collegeName: m.college || ticket.college || 'Knowledge Institute of Technology',
            email: m.email || 'TBD',
            department: m.department || ticket.department || 'B.Tech CSE',
            checkedInAt: checkedInTime,
            role: 'Member'
          });
        });
      }
    }

    return res.json({
      success: true,
      valid:   true,
      message: `✅ Welcome, ${ticket.name}! Check-in successful.`,
      ticket,
    });
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/registrations ───────────────────────────────────────────────────
// Admin route: list all registrations for an event
router.get('/registrations', async (req, res) => {
  try {
    const { eventId, eventName } = req.query;
    const db = getStore();

    let results = [];

    if (db) {
      let query = db.collection('registrations').orderBy('registeredAt', 'desc');
      if (eventId)   query = query.where('eventId', '==', eventId);
      if (eventName) query = query.where('eventName', '==', eventName);
      const snap = await query.get();
      results = snap.docs.map((d) => {
        const data = d.data();
        delete data.qrCode; // Don't send QR base64 in list view
        return data;
      });
    } else {
      results = inMemoryStore
        .filter((r) => {
          if (eventId   && r.eventId   !== eventId)   return false;
          if (eventName && r.eventName !== eventName) return false;
          return true;
        })
        .map(({ qrCode, ...rest }) => rest); // strip qrCode from list
    }

    return res.json({ success: true, count: results.length, registrations: results });
  } catch (err) {
    console.error('List registrations error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/my-tickets ──────────────────────────────────────────────────────
router.get('/my-tickets', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const db = getStore();
    let results = [];

    if (db) {
      const snap = await db.collection('registrations')
                           .where('email', '==', email.toLowerCase())
                           .get();
      results = snap.docs.map(d => d.data());
      results.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
    } else {
      results = inMemoryStore.filter(r => r.email.toLowerCase() === email.toLowerCase());
      results.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
    }

    return res.json({ success: true, count: results.length, tickets: results });
  } catch (err) {
    console.error('Fetch user tickets error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/registrations/stats ────────────────────────────────────────────
router.get('/registrations/stats', async (req, res) => {
  try {
    const { eventId } = req.query;
    const db = getStore();

    if (db) {
      let query = db.collection('registrations');
      if (eventId) query = query.where('eventId', '==', eventId);
      const snap = await query.get();
      const docs = snap.docs.map((d) => d.data());

      return res.json({
        success: true,
        stats: {
          total:     docs.length,
          confirmed: docs.filter((d) => d.status === 'confirmed').length,
          checkedIn: docs.filter((d) => d.checkedIn).length,
          cancelled: docs.filter((d) => d.status === 'cancelled').length,
        },
      });
    } else {
      const store = eventId ? inMemoryStore.filter((r) => r.eventId === eventId) : inMemoryStore;
      return res.json({
        success: true,
        stats: {
          total:     store.length,
          confirmed: store.filter((r) => r.status === 'confirmed').length,
          checkedIn: store.filter((r) => r.checkedIn).length,
          cancelled: store.filter((r) => r.status === 'cancelled').length,
        },
      });
    }
  } catch (err) {
    console.error('Stats error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/attendance ──────────────────────────────────────────────────────
router.get('/attendance', async (req, res) => {
  try {
    const { eventId } = req.query;
    const db = getStore();

    let results = [];

    if (db) {
      let query = db.collection('attendance');
      if (eventId) {
        query = query.where('eventId', '==', eventId);
      }
      const snap = await query.get();
      results = snap.docs.map((d) => d.data());

      // Self-healing migration for existing check-ins (before attendance collection existed)
      if (results.length === 0 && eventId) {
        const regSnap = await db.collection('registrations')
          .where('eventId', '==', eventId)
          .where('checkedIn', '==', true)
          .get();
        
        if (!regSnap.empty) {
          const batch = db.batch();
          const tempResults = [];
          
          for (const doc of regSnap.docs) {
            const ticket = doc.data();
            const timeNow = ticket.checkedInAt || new Date().toISOString();
            
            const leaderAttendance = {
              ticketId: ticket.ticketId,
              eventId: ticket.eventId || ticket.eventName || 'TBD',
              eventName: ticket.eventName || 'TBD',
              eventCategory: ticket.eventCategory || 'General',
              categoryGroup: ticket.categoryGroup || 'tech',
              studentName: ticket.name || 'TBD',
              collegeName: ticket.college || 'Knowledge Institute of Technology',
              email: ticket.email || 'TBD',
              department: ticket.department || 'B.Tech CSE',
              checkedInAt: timeNow,
              role: 'Team Leader'
            };
            
            const leaderRef = db.collection('attendance').doc(`${ticket.ticketId}-leader`);
            batch.set(leaderRef, leaderAttendance);
            tempResults.push(leaderAttendance);
            
            if (ticket.teamMembers && Array.isArray(ticket.teamMembers)) {
              ticket.teamMembers.forEach((m, idx) => {
                const memberAttendance = {
                  ticketId: ticket.ticketId,
                  eventId: ticket.eventId || ticket.eventName || 'TBD',
                  eventName: ticket.eventName || 'TBD',
                  eventCategory: ticket.eventCategory || 'General',
                  categoryGroup: ticket.categoryGroup || 'tech',
                  studentName: m.name || 'TBD',
                  collegeName: m.college || ticket.college || 'Knowledge Institute of Technology',
                  email: m.email || 'TBD',
                  department: m.department || ticket.department || 'B.Tech CSE',
                  checkedInAt: timeNow,
                  role: 'Member'
                };
                const memberRef = db.collection('attendance').doc(`${ticket.ticketId}-member-${idx}`);
                batch.set(memberRef, memberAttendance);
                tempResults.push(memberAttendance);
              });
            }
          }
          await batch.commit();
          results = tempResults;
        }
      }
    } else {
      results = inMemoryAttendanceStore.filter((r) => {
        if (eventId && r.eventId !== eventId) return false;
        return true;
      });

      // Self-healing migration for in-memory registrations check-ins
      if (results.length === 0 && eventId) {
        const checkedRegs = inMemoryStore.filter(r => r.eventId === eventId && r.checkedIn);
        checkedRegs.forEach(ticket => {
          const timeNow = ticket.checkedInAt || new Date().toISOString();
          const leaderAttendance = {
            ticketId: ticket.ticketId,
            eventId: ticket.eventId || ticket.eventName || 'TBD',
            eventName: ticket.eventName || 'TBD',
            eventCategory: ticket.eventCategory || 'General',
            categoryGroup: ticket.categoryGroup || 'tech',
            studentName: ticket.name || 'TBD',
            collegeName: ticket.college || 'Knowledge Institute of Technology',
            email: ticket.email || 'TBD',
            department: ticket.department || 'B.Tech CSE',
            checkedInAt: timeNow,
            role: 'Team Leader'
          };
          inMemoryAttendanceStore.push(leaderAttendance);
          results.push(leaderAttendance);

          if (ticket.teamMembers && Array.isArray(ticket.teamMembers)) {
            ticket.teamMembers.forEach((m, idx) => {
              const memberAttendance = {
                ticketId: ticket.ticketId,
                eventId: ticket.eventId || ticket.eventName || 'TBD',
                eventName: ticket.eventName || 'TBD',
                eventCategory: ticket.eventCategory || 'General',
                categoryGroup: ticket.categoryGroup || 'tech',
                studentName: m.name || 'TBD',
                collegeName: m.college || ticket.college || 'Knowledge Institute of Technology',
                email: m.email || 'TBD',
                department: m.department || ticket.department || 'B.Tech CSE',
                checkedInAt: timeNow,
                role: 'Member'
              };
              inMemoryAttendanceStore.push(memberAttendance);
              results.push(memberAttendance);
            });
          }
        });
      }
    }

    // Sort by checked-in time (newest first)
    results.sort((a, b) => new Date(b.checkedInAt) - new Date(a.checkedInAt));

    return res.json({ success: true, count: results.length, attendance: results });
  } catch (err) {
    console.error('List attendance error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.inMemoryStore = inMemoryStore;
router.inMemoryAttendanceStore = inMemoryAttendanceStore;
module.exports = router;
