/**
 * EventHub Backend Server
 * ─────────────────────────────────────────────
 * Handles student event registrations with:
 *  • Unique ticket ID generation (e.g. CS25A7B6)
 *  • QR code generation per ticket
 *  • Firebase Firestore storage (with in-memory fallback)
 *  • Ticket verification (QR scan at venue)
 */

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const { initFirebase } = require('./config/firebase');

// ─── App setup ────────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));   // allow base64 QR in responses
app.use(express.urlencoded({ extended: true }));

// ─── Request logger ───────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  const time = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log(`[${time}] ${req.method} ${req.path}`);
  next();
});

// ─── Initialize Firebase (non-blocking) ──────────────────────────────────────
initFirebase();

// ─── Routes ───────────────────────────────────────────────────────────────────
const registrationRoutes = require('./routes/registration');
const eventRoutes = require('./routes/events');
const announcementRoutes = require('./routes/announcements');

app.use('/api', registrationRoutes);
app.use('/api', eventRoutes);
app.use('/api/announcements', announcementRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    status:  'ok',
    service: 'EventHub Registration API',
    version: '1.0.0',
    time:    new Date().toISOString(),
    endpoints: {
      register:      'POST /api/register',
      getTicket:     'GET  /api/ticket/:ticketId',
      verifyTicket:  'POST /api/verify',
      listAll:       'GET  /api/registrations?eventId=xxx',
      stats:         'GET  /api/registrations/stats?eventId=xxx',
    },
  });
});

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n══════════════════════════════════════════════');
  console.log(`  🎟️  EventHub Registration Server`);
  console.log(`  🚀  Running on  → http://localhost:${PORT}`);
  console.log(`  📋  API Docs    → http://localhost:${PORT}/`);
  console.log('══════════════════════════════════════════════\n');
});

module.exports = app;
