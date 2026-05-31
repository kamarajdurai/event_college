/**
 * Events Management CRUD Routes (Firestore Collections: tech_events, nontech_events, cultural_events)
 * GET    /api/events                       - Get all events (optional ?category=tech|nontech|cultural)
 * POST   /api/events                       - Create a new event (saves to specific collection)
 * PUT    /api/events/:categoryGroup/:id    - Update event in specific collection
 * DELETE /api/events/:categoryGroup/:id    - Delete event from specific collection
 */

const express = require('express');
const router  = express.Router();
const { initFirebase } = require('../config/firebase');

// ─── Default Tech Events ──────────────────────────────────────────────────────
const defaultTechEvents = [
  {
    id: 'web3-hackathon',
    title: 'Web3 & DApps Hackathon',
    desc: 'Build decentralized applications in a 48-hour coding marathon.',
    category: 'Hackathon',
    categoryGroup: 'tech',
    day: '10', month: 'MAY',
    venue: 'Block D, Tech Lab',
    time: '09:00 AM – 09:00 AM (48 Hrs)',
    img: '/tech_event.png',
    color: '#6366f1',
  },
  {
    id: 'ar-vr-workshop',
    title: 'AR/VR Development Workshop',
    desc: 'Hands-on training in Augmented and Virtual Reality using Unity.',
    category: 'Workshop',
    categoryGroup: 'tech',
    day: '15', month: 'MAY',
    venue: 'Lab 5, VR Center',
    time: '10:00 AM – 02:00 PM',
    img: '/ai_ml_card.png',
    color: '#6366f1',
  },
  {
    id: 'quantum-computing',
    title: 'Quantum Computing Future',
    desc: 'Deep dive into the future of computing with quantum mechanics.',
    category: 'Seminar',
    categoryGroup: 'tech',
    day: '22', month: 'MAY',
    venue: 'Main Auditorium',
    time: '11:00 AM – 01:00 PM',
    img: '/cybersec_card.png',
    color: '#6366f1',
  },
  {
    id: 'fintech-summit',
    title: 'Fintech Innovation Summit',
    desc: 'Discover how technology is disrupting the financial sector.',
    category: 'Seminar',
    categoryGroup: 'tech',
    day: '02', month: 'JUN',
    venue: 'Conference Room 1',
    time: '02:00 PM – 04:30 PM',
    img: '/cloud_card.png',
    color: '#6366f1',
  }
];

// ─── Default Non-Tech Events ──────────────────────────────────────────────────
const defaultNonTechEvents = [
  {
    id: 'startup-pitch',
    title: 'Shark Tank Startup Pitch',
    desc: 'Pitch your most innovative business ideas to investors.',
    category: 'Competition',
    categoryGroup: 'nontech',
    day: '26', month: 'MAY',
    venue: 'Seminar Hall',
    time: '10:00 AM – 01:00 PM',
    img: '/quiz_card.png',
  },
  {
    id: 'mun-2025',
    title: 'Model United Nations (MUN)',
    desc: 'Simulate UN committees and debate on global issues.',
    category: 'Debate',
    categoryGroup: 'nontech',
    day: '28', month: 'MAY',
    venue: 'Auditorium',
    time: '09:00 AM – 05:00 PM',
    img: '/debate_card.png',
  },
  {
    id: 'escape-room',
    title: 'Escape Room Challenge',
    desc: 'Solve puzzles and riddles to escape the mystery room in time.',
    category: 'Competition',
    categoryGroup: 'nontech',
    day: '02', month: 'JUN',
    venue: 'Block C Basement',
    time: '10:00 AM – 04:00 PM',
    img: null,
    gradient: 'linear-gradient(135deg,#3b0764 0%,#6d28d9 50%,#4c1d95 100%)',
    emoji: '🔐',
  }
];

// ─── Default Cultural Events ──────────────────────────────────────────────────
const defaultCulturalEvents = [
  {
    id: 'neon-dj-night',
    title: 'Neon Glow DJ Night',
    desc: 'Dance to the beats of top DJs under neon lights and lasers.',
    category: 'Music',
    categoryGroup: 'cultural',
    day: '27', month: 'MAY',
    venue: 'Open Air Arena',
    time: '07:00 PM – 11:00 PM',
    img: '/cultural_event.png',
  },
  {
    id: 'street-dance',
    title: 'Street Dance Battle',
    desc: 'Witness epic b-boying and hip-hop dance crew battles.',
    category: 'Dance',
    categoryGroup: 'cultural',
    day: '30', month: 'MAY',
    venue: 'Main Ground',
    time: '04:00 PM – 08:00 PM',
    img: '/cultural_hero.png',
  },
  {
    id: 'cosplay-con',
    title: 'Cosplay & Anime Convention',
    desc: 'Dress up as your favorite anime or comic character and win prizes.',
    category: 'Fest',
    categoryGroup: 'cultural',
    day: '04', month: 'JUN',
    venue: 'Indoor Stadium',
    time: '10:00 AM – 06:00 PM',
    img: null,
    gradient: 'linear-gradient(135deg,#431407 0%,#c2410c 50%,#9a3412 100%)',
    emoji: '🦸‍♂️',
  }
];

// In-memory store mirroring the three database collections
let inMemoryStore = {
  tech: [...defaultTechEvents],
  nontech: [...defaultNonTechEvents],
  cultural: [...defaultCulturalEvents]
};

function getStore() {
  const { db } = initFirebase();
  return db;
}

// ─── Helper: Get Collection Name ──────────────────────────────
function getCollectionName(categoryGroup) {
  const group = (categoryGroup || 'tech').toLowerCase();
  if (group === 'tech') return 'tech_events';
  if (group === 'nontech') return 'nontech_events';
  if (group === 'cultural') return 'cultural_events';
  return 'tech_events'; // fallback
}

// ─── GET /api/events ──────────────────────────────────────────
router.get('/events', async (req, res) => {
  try {
    const { category } = req.query; // 'tech', 'nontech', or 'cultural'
    const db = getStore();

    let eventsList = [];

    if (db) {
      if (category) {
        // Query specific collection
        const colName = getCollectionName(category);
        const snap = await db.collection(colName).get();
        eventsList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Prepopulate defaults if collection is empty
        if (eventsList.length === 0) {
          console.log(`DB collection ${colName} empty. Prepopulating defaults...`);
          const batch = db.batch();
          const defaults = category === 'tech' ? defaultTechEvents : category === 'nontech' ? defaultNonTechEvents : defaultCulturalEvents;
          for (const evt of defaults) {
            const docRef = db.collection(colName).doc(evt.id);
            batch.set(docRef, evt);
          }
          await batch.commit();
          eventsList = [...defaults];
        }
      } else {
        // Query all three collections and combine
        const cols = ['tech_events', 'nontech_events', 'cultural_events'];
        for (const col of cols) {
          const snap = await db.collection(col).get();
          const colEvents = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Prepopulate if completely empty
          if (colEvents.length === 0) {
            const batch = db.batch();
            const defaults = col === 'tech_events' ? defaultTechEvents : col === 'nontech_events' ? defaultNonTechEvents : defaultCulturalEvents;
            for (const evt of defaults) {
              const docRef = db.collection(col).doc(evt.id);
              batch.set(docRef, evt);
            }
            await batch.commit();
            eventsList.push(...defaults);
          } else {
            eventsList.push(...colEvents);
          }
        }
      }
    } else {
      // In-Memory Fallback
      if (category) {
        eventsList = inMemoryStore[category.toLowerCase()] || [];
      } else {
        eventsList = [
          ...inMemoryStore.tech,
          ...inMemoryStore.nontech,
          ...inMemoryStore.cultural
        ];
      }
    }

    return res.json({ success: true, count: eventsList.length, events: eventsList });
  } catch (err) {
    console.error('Fetch events error:', err);
    return res.status(500).json({ success: false, message: 'Server error loading events.' });
  }
});

// ─── POST /api/events ─────────────────────────────────────────
router.post('/events', async (req, res) => {
  try {
    const { title, desc, category, categoryGroup, day, month, venue, time, img, gradient, emoji } = req.body;

    if (!title || !category || !categoryGroup) {
      return res.status(400).json({ success: false, message: 'Title, category, and categoryGroup are required.' });
    }

    const group = categoryGroup.toLowerCase();
    const newEvent = {
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.round(Math.random() * 1000),
      title,
      desc: desc || '',
      category,
      categoryGroup: group,
      day: day || '01',
      month: (month || 'MAY').toUpperCase(),
      venue: venue || 'TBD',
      time: time || 'TBD',
      img: img || null,
      gradient: gradient || null,
      emoji: emoji || null,
      createdAt: new Date().toISOString()
    };

    const db = getStore();

    if (db) {
      const colName = getCollectionName(group);
      await db.collection(colName).doc(newEvent.id).set(newEvent);
    } else {
      if (!inMemoryStore[group]) inMemoryStore[group] = [];
      inMemoryStore[group].push(newEvent);
    }

    return res.status(201).json({ success: true, message: 'Event created successfully!', event: newEvent });
  } catch (err) {
    console.error('Create event error:', err);
    return res.status(500).json({ success: false, message: 'Server error saving event.' });
  }
});

// ─── PUT /api/events/:categoryGroup/:eventId ──────────────────
router.put('/events/:categoryGroup/:eventId', async (req, res) => {
  try {
    const { categoryGroup, eventId } = req.params;
    const updates = req.body;

    const group = categoryGroup.toLowerCase();
    const db = getStore();

    if (db) {
      const colName = getCollectionName(group);
      const docRef = db.collection(colName).doc(eventId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return res.status(404).json({ success: false, message: `Event not found in ${colName} collection.` });
      }

      await docRef.update(updates);
      const updatedSnap = await docRef.get();
      return res.json({ success: true, event: { id: eventId, ...updatedSnap.data() } });
    } else {
      const list = inMemoryStore[group] || [];
      const idx = list.findIndex(e => e.id === eventId);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: `Event not found in memory group ${group}.` });
      }

      inMemoryStore[group][idx] = { ...inMemoryStore[group][idx], ...updates };
      return res.json({ success: true, event: inMemoryStore[group][idx] });
    }
  } catch (err) {
    console.error('Update event error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating event.' });
  }
});

// ─── DELETE /api/events/:categoryGroup/:eventId ───────────────
router.delete('/events/:categoryGroup/:eventId', async (req, res) => {
  try {
    const { categoryGroup, eventId } = req.params;
    const group = categoryGroup.toLowerCase();
    const db = getStore();

    if (db) {
      const colName = getCollectionName(group);
      const docRef = db.collection(colName).doc(eventId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return res.status(404).json({ success: false, message: `Event not found in ${colName} collection.` });
      }

      await docRef.delete();
    } else {
      const list = inMemoryStore[group] || [];
      const idx = list.findIndex(e => e.id === eventId);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: `Event not found in memory group ${group}.` });
      }
      inMemoryStore[group].splice(idx, 1);
    }

    return res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (err) {
    console.error('Delete event error:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting event.' });
  }
});

module.exports = router;
