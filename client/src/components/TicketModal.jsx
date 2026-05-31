import React, { useRef } from 'react';
import './TicketModal.css';
import AvatarInitial from './AvatarInitial';


const Icons = {
  close: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  download: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  share: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
      <polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  ),
  check: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  calendar: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  pin: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  lightning: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  code: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  scan: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
    </svg>
  )
};

export default function TicketModal({ ticket, user, onClose }) {
  const ticketRef = useRef(null);

  if (!ticket) return null;

  const handleDownload = () => {
    const win = window.open('', '_blank', 'width=700,height=520');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Ticket – ${ticket.ticketId}</title>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family: 'Segoe UI', sans-serif; background:#f4f5f8; display:flex; justify-content:center; align-items:center; min-height:100vh; padding: 20px; }
          .ticket { display:flex; width:640px; background:#fff; border-radius:24px; overflow:hidden; color:#1e293b; box-shadow:0 20px 50px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; position:relative; }
          .left { flex:1; padding:28px 24px; background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%); color: #fff; position:relative; overflow:hidden; }
          .left::before { content:''; position:absolute; inset:0; background: url('/ticket_city_bg.png') no-repeat center right; background-size: cover; opacity: 0.35; mix-blend-mode: overlay; pointer-events:none; }
          .badge { background:rgba(255,255,255,0.15); color:#fff; font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:4px 12px; border-radius:20px; display:inline-flex; align-items:center; gap:4px; margin-bottom:14px; border: 1px solid rgba(255,255,255,0.2); }
          h1 { font-size:24px; font-weight:800; margin-bottom:6px; line-height:1.2; }
          .desc { font-size:12px; color:rgba(255,255,255,0.8); margin-bottom:18px; line-height:1.4; }
          .code-icon-container { width:52px; height:52px; border-radius:12px; border:2px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.08); margin-bottom:16px; font-size: 22px; font-weight: bold; }
          .divider-line { height: 1px; background: rgba(255,255,255,0.2); margin: 16px 0; position:relative; }
          .meta { display:flex; flex-direction:column; gap:10px; }
          .meta-item { display:flex; align-items:center; gap:8px; font-size:13px; color:#fff; font-weight: 500; }
          .right { width:220px; padding:28px 20px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; background:#fff; position:relative; border-left: 2px dashed #cbd5e1; }
          .tid-label { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:#8b5cf6; font-weight:700; }
          .tid-wrap { border-top: 1.5px solid #cbd5e1; border-bottom: 1.5px solid #cbd5e1; padding: 4px 12px; margin: 4px 0; text-align:center; position:relative; }
          .tid { font-size:18px; font-weight:800; letter-spacing:1px; color:#1e293b; font-family: monospace; }
          .star { color: #8b5cf6; font-size: 8px; margin-top: 4px; display:block; text-align:center; }
          .qr { width:120px; height:120px; border-radius:12px; border:1px solid #cbd5e1; padding: 4px; background:#fff; }
          .scan-btn { background:#f5f3ff; color:#7c3aed; font-size:10px; font-weight:700; padding:6px 12px; border-radius:20px; border: 1px solid #ddd6fe; text-transform:uppercase; }
          .notch-top, .notch-bot { position:absolute; width:22px; height:22px; background:#f4f5f8; border-radius:50%; left:-11px; z-index: 10; border: 1px solid #e2e8f0; }
          .notch-top { top:-11px; }
          .notch-bot { bottom:-11px; }
          .notch-right { position:absolute; right:-11px; top:50%; transform:translateY(-50%); width:22px; height:22px; background:#f4f5f8; border-radius:50%; border: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="left">
            <span class="badge">⚡ Hackathon</span>
            <h1>${ticket.eventName}</h1>
            <p class="desc">Your registration is confirmed. Present this ticket at the venue.</p>
            <div class="code-icon-container">&lt;/&gt;</div>
            <div class="divider-line"></div>
            <div class="meta">
              ${ticket.eventDate ? `<div class="meta-item">📅 ${ticket.eventDate}</div>` : ''}
              ${ticket.eventVenue ? `<div class="meta-item">📍 ${ticket.eventVenue}</div>` : ''}
            </div>
          </div>
          <div class="right">
            <div class="notch-top"></div>
            <div class="notch-bot"></div>
            <div class="notch-right"></div>
            <div class="tid-label">TICKET ID</div>
            <div class="tid-wrap">
              <div class="tid">${ticket.ticketId}</div>
            </div>
            <span class="star">★</span>
            <img class="qr" src="${ticket.qrCode}" alt="QR Code"/>
            <div class="scan-btn">Scan at Venue</div>
          </div>
        </div>
        <script>window.onload = () => { window.print(); }</script>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="tm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="tm-container">
        
        {/* Success Header */}
        <div className="tm-success-header">
          <div className="tm-success-icon">
            <span className="tm-check-circle">{Icons.check}</span>
          </div>
          <h2>Registration Confirmed! 🎉</h2>
          <p>Your ticket has been generated. Save or download it before closing.</p>
        </div>

        {/* ─── Ticket Card ─── */}
        <div className="tm-ticket" ref={ticketRef}>
          
          {/* Left Section (Gradient & Skyline) */}
          <div className="tm-ticket-left">
            {/* Background city overlay */}
            <div className="tm-ticket-city-overlay" />
            
            <div className="tm-ticket-notch tm-notch-top" />
            <div className="tm-ticket-notch tm-notch-bottom" />

            <span className="tm-event-badge">
              <span className="tm-badge-icon">{Icons.lightning}</span>
              {ticket.eventCategory || 'HACKATHON'}
            </span>
            
            <h3 className="tm-event-name">{ticket.eventName}</h3>
            
            <p className="tm-event-desc">
              Your registration is confirmed. Present this ticket at the venue.
            </p>

            <div className="tm-code-icon-container">
              <span className="tm-code-icon">{Icons.code}</span>
            </div>

            <div className="tm-ticket-divider-line" />

            <div className="tm-ticket-meta">
              {ticket.eventDate && (
                <div className="tm-meta-item">
                  <span className="tm-meta-icon">{Icons.calendar}</span>
                  {ticket.eventDate}
                </div>
              )}
              {ticket.eventVenue && (
                <div className="tm-meta-item">
                  <span className="tm-meta-icon">{Icons.pin}</span>
                  {ticket.eventVenue}
                </div>
              )}
            </div>
          </div>

          {/* Perforated divider */}
          <div className="tm-perforated" />

          {/* Right Section – QR */}
          <div className="tm-ticket-right">
            <div className="tm-right-notch-edge" />
            <div className="tm-ticket-notch tm-notch-left-mid" />
            <div className="tm-ticket-notch tm-notch-right-mid" />
            
            <div className="tm-ticket-id-label">TICKET ID</div>
            
            <div className="tm-ticket-id-wrapper">
              <div className="tm-ticket-id">{ticket.ticketId}</div>
            </div>
            
            <div className="tm-ticket-id-star">★</div>

            <div className="tm-qr-wrap">
              <img
                src={ticket.qrCode}
                alt={`QR Code for ${ticket.ticketId}`}
                className="tm-qr-img"
              />
            </div>

            <div className="tm-scan-badge">
              <span className="tm-scan-icon">{Icons.scan}</span>
              Scan at Venue
            </div>
          </div>
        </div>

        {/* ─── Registrant Info Card ─── */}
        <div className="tm-info-card">
          <div className="tm-info-card-left">
            <div className="tm-info-avatar-wrap">
              <div className="tm-info-avatar">
                <AvatarInitial
                  name={ticket.name || user?.displayName || 'Student'}
                  photoURL={user?.photoURL}
                  size={56}
                  style={{ border: 'none', boxShadow: 'none' }}
                />
              </div>
            </div>

            <div className="tm-info-details-grid">
              <div className="tm-info-col">
                <span className="tm-info-field-label">NAME</span>
                <span className="tm-info-field-val">{ticket.name || 'Student'}</span>
              </div>
              <div className="tm-info-col">
                <span className="tm-info-field-label">EMAIL</span>
                <span className="tm-info-field-val">{ticket.email || 'student@college.edu'}</span>
              </div>
              <div className="tm-info-col">
                <span className="tm-info-field-label">COLLEGE</span>
                <span className="tm-info-field-val">{ticket.college || 'Knowledge institute of technology'}</span>
              </div>
              <div className="tm-info-col">
                <span className="tm-info-field-label">STATUS</span>
                <span className="tm-status-pill">
                  <span className="tm-pill-check">✓</span> Confirmed
                </span>
              </div>
            </div>
          </div>

          <div className="tm-info-card-right">
            <img src="/ticket_star_3d.png" alt="Ticket Illustration" className="tm-ticket-3d-img" />
          </div>
        </div>

        {/* ─── Actions ─── */}
        <div className="tm-actions-row">
          <button className="tm-btn-download-new" onClick={handleDownload}>
            {Icons.download} Download / Print Ticket
          </button>
          <button className="tm-btn-share-new">
            {Icons.share} Share Ticket
          </button>
        </div>

        <button className="tm-close-btn-round" onClick={onClose} title="Close">
          {Icons.close}
        </button>
      </div>
    </div>
  );
}
