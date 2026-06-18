import React, { useState, useEffect } from 'react';
import './EventPage.css'; // Reusing base styles where possible
import TicketModal from '../components/TicketModal';
import { API_BASE_URL } from '../config';

const API_BASE = API_BASE_URL;

export default function MyTicketsPage({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetchTickets(user.email);
    } else {
      setError('You must be logged in to view your tickets.');
      setLoading(false);
    }
  }, [user]);

  const fetchTickets = async (email) => {
    try {
      const res = await fetch(`${API_BASE}/my-tickets?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setTickets(data.tickets);
      } else {
        setError(data.message || 'Failed to load tickets.');
      }
    } catch (err) {
      setError('Cannot connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span style={{ padding: '4px 10px', borderRadius: '12px', background: '#dcfce7', color: '#166534', fontSize: '12px', fontWeight: 'bold' }}>Confirmed</span>;
      case 'used':
        return <span style={{ padding: '4px 10px', borderRadius: '12px', background: '#f3f4f6', color: '#4b5563', fontSize: '12px', fontWeight: 'bold' }}>Checked In</span>;
      case 'cancelled':
        return <span style={{ padding: '4px 10px', borderRadius: '12px', background: '#fee2e2', color: '#991b1b', fontSize: '12px', fontWeight: 'bold' }}>Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="ep-page tickets-page">
      {selectedTicket && <TicketModal ticket={selectedTicket} user={user} onClose={() => setSelectedTicket(null)} />}
      
      <div className="tickets-header">
        <h1 className="tickets-title">My Tickets & Registrations</h1>
        <p className="tickets-subtitle">View all the events you have registered for and access your entry QR codes.</p>
      </div>

      {loading ? (
        <div className="tickets-loading">Loading your tickets...</div>
      ) : error ? (
        <div className="tickets-error">{error}</div>
      ) : tickets.length === 0 ? (
        <div className="tickets-empty">
          <div className="tickets-empty-icon">🎟️</div>
          <h3 className="tickets-empty-title">No Tickets Found</h3>
          <p className="tickets-empty-desc">You haven't registered for any events yet. Explore events and register to get your tickets!</p>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map(ticket => (
            <div key={ticket.ticketId} className="ticket-card">
              {/* Card Header */}
              <div className="ticket-card-header">
                <h3 className="ticket-card-title">{ticket.eventName}</h3>
                <div className="ticket-card-icon">🎟️</div>
              </div>
              
              {/* Card Body */}
              <div className="ticket-card-body">
                <div className="ticket-detail-row">
                  <div className="ticket-detail-col">
                    <div className="ticket-label">Date & Time</div>
                    <div className="ticket-value">{ticket.eventDate || 'TBD'}</div>
                  </div>
                </div>

                <div className="ticket-detail-row">
                  <div className="ticket-detail-col">
                    <div className="ticket-label">Venue</div>
                    <div className="ticket-value">{ticket.eventVenue || 'TBD'}</div>
                  </div>
                </div>

                <div className="ticket-card-footer">
                  <div>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <button 
                    onClick={() => setSelectedTicket(ticket)}
                    className="ticket-view-btn"
                  >
                    View Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
