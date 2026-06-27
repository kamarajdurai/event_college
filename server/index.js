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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];

Object.keys(process.env).forEach(key => {
  if (key.startsWith('FRONTEND_')) {
    const val = process.env[key];
    if (val) {
      const origins = val.split(',').map(url => url.trim().replace(/\/$/, ''));
      allowedOrigins.push(...origins);
    }
  }
});

app.use(cors({
  origin: allowedOrigins,
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
app.get('/api/cors-debug', (req, res) => {
  res.json({
    FRONTEND_URL: process.env.FRONTEND_URL,
    allowedOrigins: allowedOrigins
  });
});

const registrationRoutes = require('./routes/registration');
const eventRoutes = require('./routes/events');
const announcementRoutes = require('./routes/announcements');
const photoRoutes = require('./routes/photos');

app.use('/api', registrationRoutes);
app.use('/api', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api', photoRoutes);

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
