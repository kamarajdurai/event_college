/**
 * Event Photo Gallery Routes
 * POST   /api/events/:eventId/photos            - Upload a photo (admin)
 * GET    /api/events/:eventId/photos            - Fetch photos for a specific event
 * DELETE /api/events/:eventId/photos/:photoId   - Delete a photo (admin)
 */

const express = require('express');
const router  = express.Router();
const { initFirebase } = require('../config/firebase');

// ─── In-memory fallback store ────────────────────────────────────────────────
let inMemoryPhotosStore = [
  // Seed some initial placeholder data for demo purposes
  {
    id: 'seed-photo-1',
    eventId: 'web3-hackathon',
    caption: 'Teams collaborating during the ideation phase.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    uploadedAt: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  },
  {
    id: 'seed-photo-2',
    eventId: 'web3-hackathon',
    caption: 'Presenting DApp prototypes to the jury.',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    uploadedAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: 'seed-photo-3',
    eventId: 'neon-dj-night',
    caption: 'Students dancing under the laser lights.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    uploadedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

function getStore() {
  const { db } = initFirebase();
  return db;
}

// ─── GET /api/events/:eventId/photos ─────────────────────────────────────────
router.get('/events/:eventId/photos', async (req, res) => {
  try {
    const { eventId } = req.params;
    const db = getStore();

    let results = [];

    if (db) {
      const snap = await db.collection('event_photos')
                           .where('eventId', '==', eventId)
                           .orderBy('uploadedAt', 'desc')
                           .get();
      results = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Prepopulate default seeds if Firestore is empty for this event
      if (results.length === 0) {
        const seedPhotos = inMemoryPhotosStore.filter(p => p.eventId === eventId);
        if (seedPhotos.length > 0) {
          const batch = db.batch();
          for (const photo of seedPhotos) {
            const docRef = db.collection('event_photos').doc(photo.id);
            batch.set(docRef, photo);
          }
          await batch.commit();
          results = [...seedPhotos];
        }
      }
    } else {
      // In-Memory Fallback
      results = inMemoryPhotosStore.filter(p => p.eventId === eventId);
      // Sort newest first
      results.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    }

    return res.json({ success: true, count: results.length, photos: results });
  } catch (err) {
    console.error('Fetch photos error:', err);
    return res.status(500).json({ success: false, message: 'Server error loading event gallery.' });
  }
});

// ─── POST /api/events/:eventId/photos ────────────────────────────────────────
router.post('/events/:eventId/photos', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { image, caption } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image data is required.' });
    }

    const newPhoto = {
      id: 'photo-' + Date.now() + '-' + Math.round(Math.random() * 1000),
      eventId,
      image, // base64 payload or URL
      caption: caption || '',
      uploadedAt: new Date().toISOString()
    };

    const db = getStore();

    if (db) {
      await db.collection('event_photos').doc(newPhoto.id).set(newPhoto);
      console.log(`✅ Saved event photo to Firestore: ${newPhoto.id} for event ${eventId}`);
    } else {
      inMemoryPhotosStore.unshift(newPhoto); // Add to beginning
      console.log(`📝 Saved event photo to memory: ${newPhoto.id} for event ${eventId}`);
    }

    return res.status(201).json({ success: true, message: 'Photo uploaded successfully!', photo: newPhoto });
  } catch (err) {
    console.error('Upload photo error:', err);
    return res.status(500).json({ success: false, message: 'Server error saving photo.' });
  }
});

// ─── DELETE /api/events/:eventId/photos/:photoId ─────────────────────────────
router.delete('/events/:eventId/photos/:photoId', async (req, res) => {
  try {
    const { eventId, photoId } = req.params;
    const db = getStore();

    if (db) {
      const docRef = db.collection('event_photos').doc(photoId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return res.status(404).json({ success: false, message: 'Photo not found.' });
      }
      
      // Verify eventId matches
      if (docSnap.data().eventId !== eventId) {
        return res.status(400).json({ success: false, message: 'Photo does not belong to this event.' });
      }

      await docRef.delete();
      console.log(`🗑️ Deleted event photo from Firestore: ${photoId}`);
    } else {
      const idx = inMemoryPhotosStore.findIndex(p => p.id === photoId && p.eventId === eventId);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Photo not found.' });
      }
      inMemoryPhotosStore.splice(idx, 1);
      console.log(`🗑️ Deleted event photo from memory: ${photoId}`);
    }

    return res.json({ success: true, message: 'Photo deleted successfully.' });
  } catch (err) {
    console.error('Delete photo error:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting photo.' });
  }
});

module.exports = router;
