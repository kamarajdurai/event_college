import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ManageEventsPage from './pages/ManageEventsPage';
import ScannerPage from './pages/ScannerPage';
import AttendancePage from './pages/AttendancePage';
import BroadcastPage from './pages/BroadcastPage';
import AvatarInitial from './components/AvatarInitial';

import './App.css';

const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  manageEvents: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  qrScanner: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8V5a2 2 0 0 1 2-2h3M15 3h3a2 2 0 0 1 2 2v3M4 16v3a2 2 0 0 0 2 2h3M15 21h3a2 2 0 0 0 2-2v-3" />
      <rect x="8" y="8" width="3" height="3" rx="0.5" />
      <rect x="13" y="8" width="3" height="3" rx="0.5" />
      <rect x="8" y="13" width="3" height="3" rx="0.5" />
      <rect x="13" y="13" width="3" height="3" rx="0.5" />
    </svg>
  ),
  attendanceSheet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <polyline points="9 13 11 15 15 11" />
    </svg>
  ),
  broadcastAlerts: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
      <circle cx="19" cy="17" r="2.5" fill="currentColor" />
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
};

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(''); // 'admin' or 'staff'
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'dark';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDark]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch role from Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRole(data.role || 'admin'); // Default to admin for easier testing if role isn't written yet
          } else {
            setRole('admin'); // Fallback to admin role for setup
          }
        } catch (err) {
          console.error("Firestore user fetch error, defaulting to admin role for demo:", err);
          setRole('admin');
        }
      } else {
        setUser(null);
        setRole('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (loggedInUser, userRole) => {
    setUser(loggedInUser);
    setRole(userRole || 'admin');
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setRole('');
      setActiveNav('dashboard');
    });
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="spinner"></div>
        <p>Loading EventHub Coordinator Portal...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const welcomeName = user.displayName || user.email?.split('@')[0] || 'Coordinator';

  return (
    <div className="admin-app-layout">
      {/* Dynamic Background Blobs */}
      <div className="auth-glow-blob blob-one"></div>
      <div className="auth-glow-blob blob-two"></div>
      <div className="auth-glow-blob blob-three"></div>
      <div className="auth-glow-blob blob-four"></div>
      <div className="auth-noise-overlay"></div>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      
      {/* Sidebar Component */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">⚙️</span>
          <div>
            <h1>HubAdmin</h1>
            <p>Coordinator Workspace</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="sidebar-profile">
          <AvatarInitial name={welcomeName} photoURL={user.photoURL} size={48} />
          <div className="profile-text">
            <strong>{welcomeName}</strong>
            <span className="badge-role">{role.toUpperCase()}</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button 
            className={`menu-item ${activeNav === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveNav('dashboard'); setSidebarOpen(false); }}
          >
            {Icons.dashboard}
            Dashboard
          </button>
          
          {role === 'admin' && (
            <button 
              className={`menu-item ${activeNav === 'manage-events' ? 'active' : ''}`}
              onClick={() => { setActiveNav('manage-events'); setSidebarOpen(false); }}
            >
              {Icons.manageEvents}
              Manage Events
            </button>
          )}

          <button 
            className={`menu-item ${activeNav === 'scanner' ? 'active' : ''}`}
            onClick={() => { setActiveNav('scanner'); setSidebarOpen(false); }}
          >
            {Icons.qrScanner}
            QR Scanner
          </button>

          <button 
            className={`menu-item ${activeNav === 'attendance' ? 'active' : ''}`}
            onClick={() => { setActiveNav('attendance'); setSidebarOpen(false); }}
          >
            {Icons.attendanceSheet}
            Attendance Sheet
          </button>

          <button 
            className={`menu-item ${activeNav === 'broadcast' ? 'active' : ''}`}
            onClick={() => { setActiveNav('broadcast'); setSidebarOpen(false); }}
          >
            {Icons.broadcastAlerts}
            Broadcast Alerts
          </button>

          <div className="menu-divider"></div>

          <button className="menu-item menu-logout" onClick={handleLogout}>
            {Icons.logout}
            Log Out
          </button>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="admin-main-wrap">
        <header className="admin-topbar">
          <button className="hamburger-trigger" onClick={() => setSidebarOpen(o => !o)}>
            ☰
          </button>
          <div className="topbar-title">
            {activeNav === 'dashboard' ? 'Analytics Dashboard' : activeNav === 'manage-events' ? 'Event Catalogue Editor' : activeNav === 'scanner' ? 'Entrance QR Verification' : activeNav === 'broadcast' ? 'Broadcast Alerts Hub' : 'Attendance Register'}
          </div>
          <div className="topbar-user">
            <button className="theme-toggle-btn" onClick={() => setIsDark(d => !d)} title="Toggle Theme">
              {isDark ? '☀️' : '🌙'}
            </button>
            <span className="user-badge">{role.toUpperCase()}</span>
            <span className="user-name">Hi, {welcomeName}</span>
          </div>
        </header>

        <main className="admin-page-content">
          {activeNav === 'dashboard' ? (
            <DashboardPage user={user} role={role} onNavigate={setActiveNav} />
          ) : activeNav === 'manage-events' && role === 'admin' ? (
            <ManageEventsPage />
          ) : activeNav === 'scanner' ? (
            <ScannerPage />
          ) : activeNav === 'attendance' ? (
            <AttendancePage />
          ) : activeNav === 'broadcast' ? (
            <BroadcastPage user={user} />
          ) : (
            <div style={{ padding: 40, textAlign: 'center' }}>Page not found.</div>
          )}
        </main>
      </div>
    </div>
  );
}
