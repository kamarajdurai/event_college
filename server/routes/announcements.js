const express = require('express');
const router = express.Router();
const { initFirebase } = require('../config/firebase');
const registrationRouter = require('./registration');

let inMemoryAnnouncements = [
  {
    id: 'ann-welcome',
    title: 'Welcome to EventHub! 🎉',
    body: 'Explore the events catalog, register for tech, non-tech, or cultural events, and download your entry QR tickets instantly in the My Tickets tab.',
    targetType: 'all',
    alertLevel: 'info',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    sender: 'Event Committee'
  },
  {
    id: 'ann-security',
    title: 'Important: QR Verification At Entrance',
    body: 'Please have your QR tickets ready on your phone or printed before entering the event halls. Verification checkpoints are set up at all entry doors.',
    targetType: 'all',
    alertLevel: 'warning',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    sender: 'Security Team'
  }
];

function getStore() {
  const { db } = initFirebase();
  return db;
}

// POST /api/announcements - Create an announcement
router.post('/', async (req, res) => {
  try {
    const { title, body, targetType, targetEventId, targetEventName, alertLevel, sender } = req.body;
    if (!title || !body || !targetType || !alertLevel) {
      return res.status(400).json({ success: false, message: 'Title, body, targetType, and alertLevel are required.' });
    }

    const newAnnouncement = {
      id: 'ann-' + Date.now() + '-' + Math.round(Math.random() * 1000),
      title: title.trim(),
      body: body.trim(),
      targetType,
      targetEventId: targetType === 'event' ? targetEventId : null,
      targetEventName: targetType === 'event' ? targetEventName : null,
      alertLevel,
      timestamp: new Date().toISOString(),
      sender: sender || 'Coordinator'
    };

    const db = getStore();
    if (db) {
      await db.collection('announcements').doc(newAnnouncement.id).set(newAnnouncement);
    } else {
      inMemoryAnnouncements.unshift(newAnnouncement);
    }

    return res.status(201).json({ success: true, message: 'Announcement broadcasted successfully!', announcement: newAnnouncement });
  } catch (err) {
    console.error('Create announcement error:', err);
    return res.status(500).json({ success: false, message: 'Server error creating announcement.' });
  }
});

// GET /api/announcements - Fetch announcements
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    const db = getStore();
    let userEventIds = [];

    // 1. Fetch user registrations to know which events they are attending
    if (db) {
      const snap = await db.collection('registrations')
                           .where('email', '==', email.toLowerCase())
                           .get();
      userEventIds = snap.docs.map(doc => doc.data().eventId);
    } else {
      // Access registration router's in-memory store
      const store = registrationRouter.inMemoryStore || [];
      userEventIds = store
        .filter(r => r.email.toLowerCase() === email.toLowerCase())
        .map(r => r.eventId);
    }

    // 2. Fetch all announcements
    let allAnnouncements = [];
    if (db) {
      const snap = await db.collection('announcements').get();
      allAnnouncements = snap.docs.map(doc => doc.data());
      
      // If Firestore collection is empty, prepopulate with defaults
      if (allAnnouncements.length === 0) {
        try {
          const batch = db.batch();
          for (const ann of inMemoryAnnouncements) {
            const docRef = db.collection('announcements').doc(ann.id);
            batch.set(docRef, ann);
          }
          await batch.commit();
        } catch (dbErr) {
          console.error('Error auto-seeding announcements in Firestore:', dbErr);
        }
        allAnnouncements = [...inMemoryAnnouncements];
      }
    } else {
      allAnnouncements = [...inMemoryAnnouncements];
    }

    // If no email is provided, return all announcements (admin view)
    if (!email) {
      allAnnouncements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return res.json({ success: true, count: allAnnouncements.length, announcements: allAnnouncements });
    }

    // 3. Filter announcements: targetType === 'all' OR targetEventId matches one of user's registered event IDs
    const filtered = allAnnouncements.filter(ann => {
      if (ann.targetType === 'all') return true;
      if (ann.targetType === 'event' && userEventIds.includes(ann.targetEventId)) return true;
      return false;
    });

    // Sort by timestamp desc (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.json({ success: true, count: filtered.length, announcements: filtered });
  } catch (err) {
    console.error('Fetch announcements error:', err);
    return res.status(500).json({ success: false, message: 'Server error loading announcements.' });
  }
});

// DELETE /api/announcements/:id - Delete an announcement
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getStore();

    if (db) {
      const docRef = db.collection('announcements').doc(id);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return res.status(404).json({ success: false, message: 'Announcement not found.' });
      }
      await docRef.delete();
    } else {
      const idx = inMemoryAnnouncements.findIndex(ann => ann.id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Announcement not found.' });
      }
      inMemoryAnnouncements.splice(idx, 1);
    }

    return res.json({ success: true, message: 'Announcement deleted successfully.' });
  } catch (err) {
    console.error('Delete announcement error:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting announcement.' });
  }
});

module.exports = router;
