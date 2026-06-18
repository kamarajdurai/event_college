import { useState, useEffect } from 'react';
import './Dashboard.css';
import { API_BASE_URL } from '../config';

export default function DashboardPage({ user, role, onNavigate }) {
  const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0, checkedIn: 0, checkInRate: 0 });
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch events
        const evRes = await fetch(`${API_BASE_URL}/events`);
        const evData = await evRes.json();
        const totalEvs = evData.success ? evData.count : 0;

        // Fetch registrations stats
        const statRes = await fetch(`${API_BASE_URL}/registrations/stats`);
        const statData = await statRes.json();
        const regStats = statData.success ? statData.stats : { total: 0, checkedIn: 0 };

        // Fetch recent registrations list
        const regListRes = await fetch(`${API_BASE_URL}/registrations`);
        const regListData = await regListRes.json();
        const regList = regListData.success ? regListData.registrations.slice(0, 5) : [];

        const checkInRate = regStats.total > 0 ? Math.round((regStats.checkedIn / regStats.total) * 100) : 0;

        setStats({
          totalEvents: totalEvs,
          totalRegistrations: regStats.total,
          checkedIn: regStats.checkedIn,
          checkInRate
        });

        setRegistrations(regList);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="status-badge status-confirmed">Confirmed</span>;
      case 'used':
        return <span className="status-badge status-attended">Attended</span>;
      case 'cancelled':
        return <span className="status-badge status-cancelled">Cancelled</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const welcomeName = user?.displayName || user?.email?.split('@')[0] || 'Coordinator';

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Welcome back, {welcomeName}! 👋</h1>
          <p>Here's an overview of the event registrations and attendance today.</p>
        </div>
        <div className="role-indicator">
          <span className="role-dot"></span>
          <span>{role.toUpperCase()} Portal</span>
        </div>
      </div>

      {loading ? (
        <div className="dashboard-loading">Loading Analytics Dashboard...</div>
      ) : (
        <>
          {/* STATS TILES */}
          <div className="stats-grid">
            <div className="stat-tile">
              <div className="tile-icon icon-purple">📅</div>
              <div className="tile-info">
                <h3>{stats.totalEvents}</h3>
                <p>Total Events</p>
              </div>
            </div>

            <div className="stat-tile">
              <div className="tile-icon icon-blue">📋</div>
              <div className="tile-info">
                <h3>{stats.totalRegistrations}</h3>
                <p>Registered Students</p>
              </div>
            </div>

            <div className="stat-tile">
              <div className="tile-icon icon-green">✅</div>
              <div className="tile-info">
                <h3>{stats.checkedIn}</h3>
                <p>Checked In Attendees</p>
              </div>
            </div>

            <div className="stat-tile">
              <div className="tile-icon icon-orange">📈</div>
              <div className="tile-info">
                <h3>{stats.checkInRate}%</h3>
                <p>Attendance Rate</p>
              </div>
              <div className="tile-progress-bar">
                <div className="tile-progress-fill" style={{ width: `${stats.checkInRate}%` }}></div>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* LEFT COLUMN: RECENT REGISTRATIONS */}
            <div className="dashboard-card recent-registrations">
              <div className="card-header">
                <h2>Recent Registrations</h2>
                <button className="view-all-btn" onClick={() => onNavigate('scanner')}>
                  Go to Scanner →
                </button>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Attendee</th>
                      <th>Event</th>
                      <th>Ticket ID</th>
                      <th>Registered</th>
                      <th>Status</th>
                      <th>Payment Proof</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="empty-row">No attendee registrations logged yet.</td>
                      </tr>
                    ) : (
                      registrations.map((reg) => (
                        <tr key={reg.ticketId}>
                          <td>
                            <div className="attendee-cell">
                              <strong>{reg.name}</strong>
                              <span>{reg.email}</span>
                            </div>
                          </td>
                          <td>{reg.eventName}</td>
                          <td><code>{reg.ticketId}</code></td>
                          <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                          <td>{getStatusBadge(reg.status)}</td>
                          <td>
                            {reg.paymentScreenshot ? (
                              <button 
                                className="view-proof-btn" 
                                onClick={() => setSelectedProof(reg)}
                              >
                                View Proof
                              </button>
                            ) : (
                              <span className="no-proof-text">N/A</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT COLUMN: QUICK PORTALS */}
            <div className="dashboard-card quick-portals">
              <h2>Quick Actions</h2>
              <div className="portals-list">
                {role === 'admin' && (
                  <div className="portal-item" onClick={() => onNavigate('manage-events')}>
                    <div className="portal-icon">🛠️</div>
                    <div className="portal-details">
                      <h3>Manage Events (CRUD)</h3>
                      <p>Create, update, view, or remove active college events.</p>
                    </div>
                  </div>
                )}
                <div className="portal-item" onClick={() => onNavigate('scanner')}>
                  <div className="portal-icon">📷</div>
                  <div className="portal-details">
                    <h3>QR Ticket Scanner</h3>
                    <p>Open camera stream to scan tickets and accept student check-ins.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Verification proof modal */}
      {selectedProof && (
        <div className="proof-modal-overlay" onClick={() => setSelectedProof(null)}>
          <div className="proof-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="proof-modal-header">
              <h2>Payment Verification Proof</h2>
              <button className="proof-modal-close" onClick={() => setSelectedProof(null)}>×</button>
            </div>
            <div className="proof-modal-body">
              <div className="proof-details-grid">
                <div className="proof-detail-item">
                  <strong>Student Name:</strong>
                  <span>{selectedProof.name}</span>
                </div>
                <div className="proof-detail-item">
                  <strong>Email:</strong>
                  <span>{selectedProof.email}</span>
                </div>
                <div className="proof-detail-item">
                  <strong>Event:</strong>
                  <span>{selectedProof.eventName}</span>
                </div>
                <div className="proof-detail-item">
                  <strong>UPI Transaction ID:</strong>
                  <span className="code-font">{selectedProof.transactionId || 'N/A'}</span>
                </div>
                <div className="proof-detail-item">
                  <strong>Registered At:</strong>
                  <span>{new Date(selectedProof.registeredAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="proof-image-container">
                <h3>Uploaded screenshot:</h3>
                {selectedProof.paymentScreenshot ? (
                  <img src={selectedProof.paymentScreenshot} alt="Payment Proof Screenshot" className="proof-image" />
                ) : (
                  <div className="no-screenshot-alert">No screenshot upload found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
