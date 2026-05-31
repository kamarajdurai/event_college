import React, { useState, useEffect } from 'react';
import './EventDetails.css';
import TicketModal from '../components/TicketModal';
import RegistrationModal from '../components/RegistrationModal';


const Icons = {
  share: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  bookmark: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  pin: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="#2563eb" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10" fill="#2563eb"/><polyline points="8 12 11 15 16 9"/></svg>,
  info: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  shield: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="none" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#22c55e"/><polyline points="9 12 11 14 15 10" stroke="white"/></svg>,
  userOutline: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  mailOutline: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  phoneOutline: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  buildingOutline: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="22"/><line x1="15" y1="22" x2="15" y2="22"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="8" y1="6" x2="8.01" y2="6"/><line x1="16" y1="6" x2="16.01" y2="6"/><line x1="12" y1="6" x2="12.01" y2="6"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="16" y1="10" x2="16.01" y2="10"/><line x1="12" y1="10" x2="12.01" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="16" y1="14" x2="16.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/></svg>,
  heart: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  eventCat: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  usersGroup: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  calendarDead: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  org: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
};

const API_BASE = 'http://localhost:5000/api';

export default function EventDetailsPage({ onBack, evt, user }) {
  const [activeTab, setActiveTab] = useState('About');

  // Fallback defaults if evt is missing
  const event = evt || {
    id: 'codesprint-2025',
    title: 'CodeSprint 2025',
    desc: '24-hour coding challenge to build innovative solutions and win exciting prizes.',
    category: 'Hackathon',
    day: '25',
    month: 'MAY',
    venue: 'Seminar Hall, Block A',
    time: '09:00 AM – 06:00 PM',
    img: '/tech_event.png'
  };

  const [ticket, setTicket] = useState(null);  // holds ticket after success
  const [showRegModal, setShowRegModal] = useState(false);



  return (
    <>
    {ticket && <TicketModal ticket={ticket} user={user} onClose={() => setTicket(null)} />}
    {showRegModal && (
      <RegistrationModal 
        event={event} 
        user={user} 
        onClose={() => setShowRegModal(false)} 
        onSuccess={(tkt) => setTicket(tkt)} 
      />
    )}
    <div className="event-details-page">
      {/* Breadcrumbs */}
      <div className="ed-breadcrumbs">
        <span className="ed-bc-link" onClick={onBack}>Home</span>
        <span className="ed-bc-sep">›</span>
        <span className="ed-bc-link" onClick={onBack}>Tech Events</span>
        <span className="ed-bc-sep">›</span>
        <span className="ed-bc-curr">{event.title}</span>
      </div>

      <div className="ed-main-layout">
        {/* Left Column */}
        <div className="ed-left-col">
          {/* Hero Image */}
          <div className="ed-hero">
            <img src={event.img || '/tech_event.png'} alt={event.title} className="ed-hero-img" />
            <div className="ed-date-badge">
              <div className="ed-db-day">{event.day}</div>
              <div className="ed-db-month">{event.month}</div>
              <div className="ed-db-year">2025</div>
            </div>
          </div>

          {/* Header Info */}
          <div className="ed-header-card">
            <div className="ed-hc-top">
              <span className="ed-badge">{event.category}</span>
              <div className="ed-hc-actions">
                <button className="ed-icon-btn">{Icons.share}</button>
                <button className="ed-icon-btn">{Icons.bookmark}</button>
              </div>
            </div>
            <h1 className="ed-title">{event.title}</h1>
            <p className="ed-subtitle">{event.desc}</p>
            
            <div className="ed-meta-row">
              <div className="ed-meta-item">
                <span className="ed-meta-icon">{Icons.pin}</span>
                <span>{event.venue}</span>
              </div>
              <div className="ed-meta-item">
                <span className="ed-meta-icon">{Icons.clock}</span>
                <span>{event.time}</span>
              </div>
              <div className="ed-meta-item">
                <span className="ed-meta-icon">{Icons.users}</span>
                <span>120+ Participants</span>
              </div>
            </div>
          </div>

          {/* Tabs Content */}
          <div className="ed-content-card">
            <div className="ed-tabs">
              {['About', 'Schedule', 'Prizes', 'Rules', 'FAQ'].map(t => (
                <button 
                  key={t} 
                  className={`ed-tab ${activeTab === t ? 'active' : ''}`}
                  onClick={() => setActiveTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="ed-tab-content">
              {/* About Section */}
              <div className="ed-about-layout">
                <div className="ed-about-main">
                  <h3 className="ed-section-title">About the Event</h3>
                  <p className="ed-p">{event.title} is an amazing {event.category.toLowerCase()} where students come together to showcase their skills. Join us for a great experience!</p>
                  
                  <h4 className="ed-section-subtitle">What to Expect?</h4>
                  <ul className="ed-checklist">
                    <li><span className="ed-check-icon">{Icons.check}</span> Solve real-world problems</li>
                    <li><span className="ed-check-icon">{Icons.check}</span> Learn from industry mentors</li>
                    <li><span className="ed-check-icon">{Icons.check}</span> Exciting prizes and goodies</li>
                    <li><span className="ed-check-icon">{Icons.check}</span> Networking with like-minded developers</li>
                  </ul>
                </div>
                
                <div className="ed-about-side">
                  <div className="ed-side-item">
                    <span className="ed-si-icon">{Icons.eventCat}</span>
                    <div className="ed-si-text">
                      <div className="ed-si-label">Event Type</div>
                      <div className="ed-si-val">Team Event</div>
                    </div>
                  </div>
                  <div className="ed-side-item">
                    <span className="ed-si-icon">{Icons.usersGroup}</span>
                    <div className="ed-si-text">
                      <div className="ed-si-label">Team Size</div>
                      <div className="ed-si-val">2 - 4 Members</div>
                    </div>
                  </div>
                  <div className="ed-side-item">
                    <span className="ed-si-icon">{Icons.calendarDead}</span>
                    <div className="ed-si-text">
                      <div className="ed-si-label">Registration Ends</div>
                      <div className="ed-si-val">20 May 2025, 11:59 PM</div>
                    </div>
                  </div>
                  <div className="ed-side-item">
                    <span className="ed-si-icon">{Icons.org}</span>
                    <div className="ed-si-text">
                      <div className="ed-si-label">Organized By</div>
                      <div className="ed-si-val">Coding Club, ABC College</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ed-org-card-container">
              <h3 className="ed-section-title">Organized By</h3>
              <div className="ed-org-card">
                <div className="ed-org-logo">{"</>"}</div>
                <div className="ed-org-info">
                  <h4>Coding Club, ABC College</h4>
                  <p>Empowering students to explore, learn and build innovative solutions.</p>
                </div>
                <button className="ed-org-btn">View Organizer Profile</button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="ed-right-col">
          <div className="ed-reg-card">
            <h2 className="ed-reg-title">Register for this Event</h2>
            
            <div className="ed-reg-section">
              <h3>Registration Open</h3>
              <p>Secure your spot in this event by clicking below to register.</p>
            </div>

            <div className="ed-reg-details-list">
              <div className="ed-reg-detail-row-item">
                <span className="ed-reg-detail-lbl">Event Fee</span>
                <span className="ed-reg-detail-val">₹100 / Member</span>
              </div>
              <div className="ed-reg-detail-row-item">
                <span className="ed-reg-detail-lbl">Team Size</span>
                <span className="ed-reg-detail-val">1 - 4 Members</span>
              </div>
              <div className="ed-reg-detail-row-item">
                <span className="ed-reg-detail-lbl">Status</span>
                <span className="ed-reg-status-badge">Active</span>
              </div>
            </div>

            <button
              onClick={() => setShowRegModal(true)}
              className="ed-reg-submit"
              style={{ marginTop: '16px' }}
            >
              Register for Event
            </button>

            <button className="ed-reg-wishlist">
              <span className="ed-wishlist-icon">{Icons.heart}</span> Add to Wishlist
            </button>

            <div className="ed-success-box">
              <div className="ed-sb-icon">{Icons.shield}</div>
              <div className="ed-sb-text">
                <strong>Secure Registration</strong>
                <p>Your information is safe with us.</p>
              </div>
            </div>
          </div>

          {/* Contact Organizers Card */}
          <div className="ed-organizers-card">
            <h2 className="ed-reg-title" style={{ fontSize: '16px', marginBottom: '12px' }}>Event Organizers</h2>
            <div className="ed-orgs-section">
              <div className="ed-orgs-group">
                <span className="ed-orgs-lbl">STAFF COORDINATOR</span>
                <span className="ed-orgs-val">{event.staffName || 'Dr. K. Arulmani'}</span>
                <a href={`tel:${event.staffPhone || '+919442034914'}`} className="ed-orgs-phone">
                  📞 {event.staffPhone || '+91 94420 34914'}
                </a>
              </div>

              <div className="ed-orgs-group">
                <span className="ed-orgs-lbl">STUDENT COORDINATOR</span>
                <span className="ed-orgs-val">{event.studentName || 'Santhosh Kumar R'}</span>
                <a href={`tel:${event.studentPhone || '+918667087612'}`} className="ed-orgs-phone">
                  📞 {event.studentPhone || '+91 86670 87612'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
