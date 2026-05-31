import { useState, useEffect } from 'react';
import './Attendance.css';

export default function AttendancePage() {
  const [events, setEvents] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // null, 'tech', 'nontech', 'cultural'
  const [selectedEvent, setSelectedEvent] = useState(null); // null, event object
  const [attendees, setAttendees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchEventAttendance(selectedEvent.id || selectedEvent.title);
    } else {
      setAttendees([]);
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch('http://localhost:5000/api/events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error("Error loading events for attendance:", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchEventAttendance = async (eventId) => {
    setLoadingAttendees(true);
    try {
      const res = await fetch(`http://localhost:5000/api/attendance?eventId=${encodeURIComponent(eventId)}`);
      const data = await res.json();
      if (data.success) {
        setAttendees(data.attendance);
      }
    } catch (err) {
      console.error("Error loading attendance sheet:", err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const handleExportCSV = () => {
    if (attendees.length === 0) return;
    
    const headers = ['Student Name', 'Email', 'College Name', 'Department', 'Role', 'Checked-In Time'];
    const rows = attendees.map(att => [
      att.studentName,
      att.email,
      att.collegeName || 'N/A',
      att.department || 'N/A',
      att.role || 'Participant',
      att.checkedInAt ? new Date(att.checkedInAt).toLocaleString() : 'N/A'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedEvent.title.replace(/\s+/g, '_')}_Attendance_Sheet.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const techEvents = events.filter(e => e.categoryGroup === 'tech');
  const nonTechEvents = events.filter(e => e.categoryGroup === 'nontech');
  const culturalEvents = events.filter(e => e.categoryGroup === 'cultural');

  const getFilteredEvents = () => {
    if (selectedGroup === 'tech') return techEvents;
    if (selectedGroup === 'nontech') return nonTechEvents;
    if (selectedGroup === 'cultural') return culturalEvents;
    return [];
  };

  const getGroupName = () => {
    if (selectedGroup === 'tech') return 'Tech Events';
    if (selectedGroup === 'nontech') return 'Non-Tech Events';
    if (selectedGroup === 'cultural') return 'Cultural Events';
    return '';
  };

  const getGroupIcon = () => {
    if (selectedGroup === 'tech') return '🖥️';
    if (selectedGroup === 'nontech') return '🎤';
    if (selectedGroup === 'cultural') return '🎭';
    return '';
  };

  const filteredAttendees = attendees.filter(att => 
    (att.studentName && att.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (att.collegeName && att.collegeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (att.email && att.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="attendance-page">
      {loadingEvents ? (
        <div className="attendance-loading">Fetching attendance data...</div>
      ) : selectedGroup === null ? (
        /* LEVEL 1: CATEGORY PORTALS */
        <div className="attendance-categories-view">
          <div className="attendance-header">
            <h1>Attendance Register</h1>
            <p>Access attendance sheets containing name and college logs based on category divisions.</p>
          </div>

          <div className="attendance-portal-grid">
            {/* TECH CARD */}
            <div className="attendance-portal-card att-tech" onClick={() => setSelectedGroup('tech')}>
              <div className="card-top-bar"></div>
              <div className="card-icon-box">🖥️</div>
              <h2>Tech Attendance</h2>
              <p>Logs for Hackathons, Workshops, and Tech Seminars.</p>
              <span className="card-stat-text">{techEvents.length} Events Listed</span>
              <button className="card-nav-btn">Open Register →</button>
            </div>

            {/* NON-TECH CARD */}
            <div className="attendance-portal-card att-nontech" onClick={() => setSelectedGroup('nontech')}>
              <div className="card-top-bar"></div>
              <div className="card-icon-box">🎤</div>
              <h2>Non-Tech Attendance</h2>
              <p>Logs for Debates, Quizzes, Stock Trading, and Pitches.</p>
              <span className="card-stat-text">{nonTechEvents.length} Events Listed</span>
              <button className="card-nav-btn">Open Register →</button>
            </div>

            {/* CULTURAL CARD */}
            <div className="attendance-portal-card att-cultural" onClick={() => setSelectedGroup('cultural')}>
              <div className="card-top-bar"></div>
              <div className="card-icon-box">🎭</div>
              <h2>Cultural Attendance</h2>
              <p>Logs for DJ Nights, Cosplays, Comedy, and Dance battles.</p>
              <span className="card-stat-text">{culturalEvents.length} Events Listed</span>
              <button className="card-nav-btn">Open Register →</button>
            </div>
          </div>
        </div>
      ) : selectedEvent === null ? (
        /* LEVEL 2: EVENT SELECTOR FOR SELECT CATEGORY */
        <div className="attendance-events-view">
          <div className="view-navigation">
            <button className="btn-back-link" onClick={() => setSelectedGroup(null)}>
              ← Back to Divisions
            </button>
          </div>

          <div className="view-title-bar">
            <span className="title-badge">{getGroupIcon()}</span>
            <div>
              <h2>{getGroupName()} Attendance</h2>
              <p>Select an event to load its student attendance logs.</p>
            </div>
          </div>

          <div className="attendance-events-list">
            {getFilteredEvents().length === 0 ? (
              <div className="empty-register-box">
                <p>No events listed in this category.</p>
              </div>
            ) : (
              getFilteredEvents().map(evt => (
                <div key={evt.id} className="attendance-event-item" onClick={() => setSelectedEvent(evt)}>
                  <div className="event-item-left">
                    {evt.img ? (
                      <img src={evt.img} alt={evt.title} className="event-item-img" />
                    ) : (
                      <div className="event-item-fallback" style={{ background: evt.gradient || '#6366f1' }}>
                        {evt.emoji || '📅'}
                      </div>
                    )}
                    <div className="event-item-texts">
                      <h4>{evt.title}</h4>
                      <span>📍 {evt.venue} | 📅 {evt.day} {evt.month} 2025</span>
                    </div>
                  </div>
                  <button className="btn-view-sheet">
                    Open Sheet →
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* LEVEL 3: ATTENDANCE SHEET LOGS TABLE */
        <div className="attendance-sheet-view">
          <div className="view-navigation">
            <button className="btn-back-link" onClick={() => setSelectedEvent(null)}>
              ← Back to {getGroupName()} List
            </button>
          </div>

          <div className="sheet-header-panel">
            <div className="header-panel-left">
              <h2>{selectedEvent.title} Attendance</h2>
              <span className="event-venue-tag">📍 {selectedEvent.venue}</span>
              <span className="event-type-badge">{selectedEvent.category}</span>
            </div>
            
            <div className="header-panel-actions">
              <button 
                className="btn-export-csv" 
                onClick={handleExportCSV}
                disabled={attendees.length === 0}
              >
                📥 Export CSV Sheet
              </button>
            </div>
          </div>

          <div className="sheet-filter-row">
            <div className="sheet-search-wrap">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search attendee by name or college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="sheet-count-summary">
              Total Present: <strong>{attendees.length}</strong>
            </div>
          </div>

          {loadingAttendees ? (
            <div className="sheet-loading">Loading sheet logs...</div>
          ) : (
            <div className="sheet-table-card">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>College Name</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Checked-In Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendees.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="empty-sheet-row">
                          {attendees.length === 0 
                            ? 'No students checked into this event yet.' 
                            : 'No matching records found.'}
                        </td>
                      </tr>
                    ) : (
                      filteredAttendees.map((att, idx) => (
                        <tr key={att.ticketId || idx}>
                          <td><strong>{att.studentName}</strong></td>
                          <td>{att.email}</td>
                          <td>{att.collegeName || 'Knowledge Institute of Technology'}</td>
                          <td>{att.department || 'B.Tech CSE'}</td>
                          <td>
                            <span className={`role-badge ${att.role === 'Team Leader' ? 'role-leader' : 'role-member'}`}>
                              {att.role || 'Participant'}
                            </span>
                          </td>
                          <td className="time-text">
                            ⏱️ {att.checkedInAt ? new Date(att.checkedInAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
