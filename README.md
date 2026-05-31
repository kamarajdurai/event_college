# EventHub

Student Event Registration Platform with QR Code Ticket Generation.

## Project Structure

```
event_clg/
├── client/          ← React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── TicketModal.jsx   ← Ticket display with QR code
│   │   │   └── AvatarInitial.jsx
│   │   ├── pages/
│   │   │   ├── EventDetailsPage.jsx
│   │   │   ├── TechEventsPage.jsx
│   │   │   ├── NonTechEventsPage.jsx
│   │   │   ├── CulturalEventsPage.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── firebase.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   └── package.json
│
├── server/          ← Node.js + Express backend
│   ├── routes/
│   │   └── registration.js  ← All API endpoints
│   ├── utils/
│   │   ├── ticketGenerator.js  ← Unique ticket ID (e.g. CS25A7B6)
│   │   └── qrGenerator.js      ← QR code PNG/base64
│   ├── config/
│   │   └── firebase.js         ← Firebase Admin SDK
│   ├── index.js                ← Express server (port 5000)
│   └── .env
│
└── package.json     ← Root: run both client + server together
```

## Getting Started

### Install all dependencies
```bash
npm run install:all
```

### Run both client and server together
```bash
npm run dev
```

Or run separately:
```bash
npm run client     # React frontend → http://localhost:5173
npm run server     # API backend  → http://localhost:5000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Register student → returns ticket + QR |
| `GET` | `/api/ticket/:ticketId` | Get ticket by ID |
| `POST` | `/api/verify` | Verify/check-in ticket (QR scan) |
| `GET` | `/api/registrations` | List all registrations |
| `GET` | `/api/registrations/stats` | Registration stats |

## Firebase Admin (Firestore)

To persist data to Firestore, place your `serviceAccountKey.json` in `server/`:

1. Go to **Firebase Console → Project Settings → Service Accounts**
2. Click **Generate new private key**
3. Save the file as `server/serviceAccountKey.json`

Without it, registrations are stored in-memory (dev mode).
