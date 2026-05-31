import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './Scanner.css';

const API_BASE = 'http://localhost:5000/api';

export default function ScannerPage() {
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [manualTicketId, setManualTicketId] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    // Initialize Scanner on mount
    const scanner = new Html5QrcodeScanner(
      "admin-qr-reader", 
      { fps: 10, qrbox: { width: 250, height: 250 } }, 
      /* verbose= */ false
    );
    scannerRef.current = scanner;

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      // Cleanup on unmount
      scanner.clear().catch(console.error);
    };
  }, []);

  const onScanSuccess = async (decodedText) => {
    // Avoid double fetching
    if (loading || checkingIn || (ticketData && ticketData.ticketId === decodedText)) return;
    
    // Pause scanning after discovering QR
    if (scannerRef.current) {
      try {
        scannerRef.current.pause();
      } catch (e) {
        console.error("Scanner pause error:", e);
      }
    }

    fetchTicketDetails(decodedText);
  };

  const onScanFailure = (error) => {
    // Silent fail for non-matching frames
  };

  const fetchTicketDetails = async (ticketId) => {
    setLoading(true);
    setError('');
    setTicketData(null);
    setSuccessMessage('');

    try {
      const res = await fetch(`${API_BASE}/ticket/${ticketId}`);
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        setError(data.message || 'Ticket verification failed. Ticket ID not recognized.');
      } else {
        setTicketData(data.ticket);
      }
    } catch (err) {
      setError('Connection to verification server failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!manualTicketId.trim()) return;

    if (scannerRef.current) {
      try {
        scannerRef.current.pause();
      } catch (e) {
        console.error("Scanner pause error:", e);
      }
    }

    fetchTicketDetails(manualTicketId.trim().toUpperCase());
  };

  const handleAcceptAttendee = async () => {
    if (!ticketData) return;
    setCheckingIn(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: ticketData.ticketId }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSuccessMessage(`✅ Welcome, ${ticketData.name}! Attendance registered.`);
        // Update ticketData state locally to show used
        setTicketData(prev => ({ ...prev, checkedIn: true, status: 'used' }));
      } else {
        setError(data.message || 'Check-in failed.');
      }
    } catch (err) {
      setError('Connection error processing check-in.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleResetScanner = () => {
    setTicketData(null);
    setError('');
    setSuccessMessage('');
    setManualTicketId('');
    if (scannerRef.current) {
      try {
        scannerRef.current.resume();
      } catch (e) {
        console.error("Scanner resume error:", e);
      }
    }
  };

  return (
    <div className="scanner-portal">
      <div className="scanner-layout">
        
        {/* LEFT COLUMN: SCANNER PANEL */}
        <div className="scanner-card panel-camera">
          <h2>Venue Entrance Camera</h2>
          <p>Scan attendee ticket QR codes to check details</p>
          
          <div className="camera-frame">
            <div id="admin-qr-reader" style={{ width: '100%' }}></div>
          </div>
          
          <button onClick={handleResetScanner} className="btn-resume-scan">
            🔄 Resume Camera Stream
          </button>

          <div className="manual-entry-divider">
            <span>OR</span>
          </div>

          <form onSubmit={handleManualSearch} className="manual-entry-form">
            <div className="manual-input-wrap">
              <input
                type="text"
                placeholder="Enter Ticket ID (e.g. CS25A7B6)"
                value={manualTicketId}
                onChange={(e) => setManualTicketId(e.target.value)}
              />
              <button type="submit" disabled={loading || checkingIn}>
                Verify ID
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: ACTION SHEET & VERIFICATION */}
        <div className="scanner-card panel-results">
          <h2>Verification Panel</h2>
          
          {loading && (
            <div className="verify-state state-loading">
              <div className="spinner"></div>
              <p>Fetching ticket logs...</p>
            </div>
          )}

          {error && (
            <div className="verify-state state-error">
              <span className="state-icon">⚠️</span>
              <h3>Invalid Ticket Code</h3>
              <p>{error}</p>
              <button onClick={handleResetScanner} className="btn-action-primary">Scan Next</button>
            </div>
          )}

          {successMessage && (
            <div className="verify-state state-success">
              <span className="state-icon">🎉</span>
              <h3>Check-In Approved</h3>
              <p>{successMessage}</p>
              <button onClick={handleResetScanner} className="btn-action-primary">Scan Next Ticket</button>
            </div>
          )}

          {!loading && !error && !successMessage && !ticketData && (
            <div className="verify-state state-idle">
              <span className="state-icon">📷</span>
              <h3>Waiting for QR Scan</h3>
              <p>Point the camera stream at a student ticket QR to fetch details.</p>
            </div>
          )}

          {/* ATTENDEE DETAIL SHEET */}
          {ticketData && !loading && !successMessage && (
            <div className="attendee-details-sheet">
              <div className="sheet-header">
                <span className={`status-pill pill-${ticketData.status}`}>
                  {ticketData.status === 'confirmed' ? '✓ Verified' : ticketData.status === 'used' ? '✓ Attended' : '🚫 Cancelled'}
                </span>
                <h3>{ticketData.eventName}</h3>
                <span className="ticket-id-tag">ID: <code>{ticketData.ticketId}</code></span>
              </div>

              <div className="sheet-body">
                <div className="sheet-row">
                  <span className="sheet-label">Attendee Name</span>
                  <span className="sheet-value">{ticketData.name}</span>
                </div>
                <div className="sheet-row">
                  <span className="sheet-label">Email Address</span>
                  <span className="sheet-value">{ticketData.email}</span>
                </div>
                <div className="sheet-row">
                  <span className="sheet-label">College / Institute</span>
                  <span className="sheet-value">{ticketData.college || 'Not specified'}</span>
                </div>

                {ticketData.teamSize > 1 && (
                  <>
                    <div className="sheet-divider"></div>
                    <div className="sheet-row">
                      <span className="sheet-label">Team Members ({ticketData.teamSize})</span>
                      <ul className="sheet-team-list">
                        {ticketData.teamMembers && ticketData.teamMembers.map((m, idx) => (
                          <li key={idx}>👥 {m.name} ({m.email})</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              <div className="sheet-footer">
                {ticketData.status === 'confirmed' ? (
                  <button 
                    onClick={handleAcceptAttendee} 
                    className="btn-action-accept"
                    disabled={checkingIn}
                  >
                    {checkingIn ? 'Checking In...' : '✅ Accept Student'}
                  </button>
                ) : (
                  <div className="already-used-banner">
                    {ticketData.status === 'used' ? (
                      <p>⚠️ Attendance already logged for this ticket.</p>
                    ) : (
                      <p>🚫 This registration has been cancelled.</p>
                    )}
                    <button onClick={handleResetScanner} className="btn-action-primary">
                      Scan Next Ticket
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
