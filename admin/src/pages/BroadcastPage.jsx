import { useState, useEffect } from 'react';
import './Broadcast.css';
import { API_BASE_URL } from '../config';

const API_BASE = API_BASE_URL;

export default function BroadcastPage({ user }) {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  
  // Form states
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetType, setTargetType] = useState('all'); // 'all' or 'event'
  const [targetEventId, setTargetEventId] = useState('');
  const [alertLevel, setAlertLevel] = useState('info'); // 'info', 'warning', 'critical'
  
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success'|'error', text: '' }

  useEffect(() => {
    fetchEvents();
    fetchAnnouncements();
  }, []);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch(`${API_BASE}/events`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error("Error fetching events for broadcast selection:", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const res = await fetch(`${API_BASE}/announcements`);
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      console.error("Error loading past broadcasts:", err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setStatusMessage({ type: 'error', text: 'Please fill out both the title and message fields.' });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    // Resolve target details
    let selectedEventName = '';
    if (targetType === 'event' && targetEventId) {
      const matchedEvent = events.find(evt => evt.id === targetEventId);
      selectedEventName = matchedEvent ? matchedEvent.title : '';
    }

    const payload = {
      title: title.trim(),
      body: body.trim(),
      targetType,
      targetEventId: targetType === 'event' ? targetEventId : null,
      targetEventName: targetType === 'event' ? selectedEventName : null,
      alertLevel,
      sender: user?.displayName || user?.email?.split('@')[0] || 'Coordinator'
    };

    try {
      const res = await fetch(`${API_BASE}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Announcement broadcasted successfully!' });
        setTitle('');
        setBody('');
        setTargetType('all');
        setTargetEventId('');
        setAlertLevel('info');
        fetchAnnouncements(); // Refresh log
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to broadcast announcement.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Cannot connect to server. Please check your connection.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete and revoke this announcement? Students will no longer see it.')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/announcements/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Announcement deleted and revoked.' });
        fetchAnnouncements();
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to delete announcement.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Server error. Failed to delete.' });
    }
  };

  return (
    <div className="broadcast-page">
      {statusMessage && (
        <div className={`status-banner ${statusMessage.type}`}>
          <span>{statusMessage.type === 'success' ? '✅' : '⚠️'} {statusMessage.text}</span>
          <button className="close-banner" onClick={() => setStatusMessage(null)}>×</button>
        </div>
      )}

      <div className="broadcast-grid">
        {/* LEFT COLUMN: COMPOSE FORM */}
        <div className="broadcast-card compose-card">
          <h2>📣 Compose Broadcast Alert</h2>
          <p className="card-subtitle">Send urgent updates, scheduling changes, or general announcements to students.</p>

          <form onSubmit={handleSendBroadcast} className="broadcast-form">
            <div className="form-group">
              <label>Message Title</label>
              <input
                type="text"
                placeholder="e.g., Venue Change: Web3 Hackathon"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Target Audience</label>
                <select 
                  value={targetType} 
                  onChange={(e) => {
                    setTargetType(e.target.value);
                    if (e.target.value === 'all') setTargetEventId('');
                  }}
                >
                  <option value="all">All Registered Students</option>
                  <option value="event">Specific Event Attendees</option>
                </select>
              </div>

              {targetType === 'event' && (
                <div className="form-group flex-1 anim-fade-in">
                  <label>Select Target Event</label>
                  {loadingEvents ? (
                    <select disabled><option>Loading events...</option></select>
                  ) : (
                    <select 
                      value={targetEventId} 
                      onChange={(e) => setTargetEventId(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Event --</option>
                      {events.map(evt => (
                        <option key={evt.id} value={evt.id}>{evt.title}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Alert Severity Level</label>
              <div className="severity-selector">
                <label className={`severity-option info ${alertLevel === 'info' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="severity"
                    value="info"
                    checked={alertLevel === 'info'}
                    onChange={() => setAlertLevel('info')}
                  />
                  <span className="dot"></span>
                  <span className="label-text">🔵 General Info</span>
                </label>

                <label className={`severity-option warning ${alertLevel === 'warning' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="severity"
                    value="warning"
                    checked={alertLevel === 'warning'}
                    onChange={() => setAlertLevel('warning')}
                  />
                  <span className="dot"></span>
                  <span className="label-text">⚠️ Schedule / Update</span>
                </label>

                <label className={`severity-option critical ${alertLevel === 'critical' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="severity"
                    value="critical"
                    checked={alertLevel === 'critical'}
                    onChange={() => setAlertLevel('critical')}
                  />
                  <span className="dot"></span>
                  <span className="label-text">🚨 Urgent Alert</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Message Content</label>
              <textarea
                placeholder="Type your announcement detail here... Keep it concise and clear."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-send-broadcast" disabled={submitting}>
              {submitting ? 'Broadcasting Alert...' : '🚀 Send Broadcast'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: RECENT LOGS */}
        <div className="broadcast-card logs-card">
          <h2>📋 Broadcast History</h2>
          <p className="card-subtitle">Active announcements visible in student feeds. Revoking deletes them.</p>

          <div className="broadcast-logs-container">
            {loadingAnnouncements ? (
              <div className="logs-loading">Retrieving announcement logs...</div>
            ) : announcements.length === 0 ? (
              <div className="logs-empty">
                <div className="empty-icon">📣</div>
                <p>No announcements broadcasted yet.</p>
              </div>
            ) : (
              <div className="logs-list">
                {announcements.map((ann) => (
                  <div key={ann.id} className={`log-item severity-${ann.alertLevel}`}>
                    <div className="log-item-header">
                      <div className="log-title-wrap">
                        <span className="log-badge-dot"></span>
                        <h4>{ann.title}</h4>
                      </div>
                      <button 
                        className="btn-revoke" 
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        title="Delete & Revoke alert"
                      >
                        Delete
                      </button>
                    </div>

                    <p className="log-body">{ann.body}</p>

                    <div className="log-item-footer">
                      <span className="log-target">
                        🎯 {ann.targetType === 'all' ? 'All Students' : `Event: ${ann.targetEventName || ann.targetEventId}`}
                      </span>
                      <span className="log-time">
                        ⏱️ {new Date(ann.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (
                        {new Date(ann.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
