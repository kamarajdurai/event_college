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

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(''); // 'admin' or 'staff'
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            📊 Dashboard
          </button>
          
          {role === 'admin' && (
            <button 
              className={`menu-item ${activeNav === 'manage-events' ? 'active' : ''}`}
              onClick={() => { setActiveNav('manage-events'); setSidebarOpen(false); }}
            >
              📅 Manage Events
            </button>
          )}

          <button 
            className={`menu-item ${activeNav === 'scanner' ? 'active' : ''}`}
            onClick={() => { setActiveNav('scanner'); setSidebarOpen(false); }}
          >
            📷 QR Scanner
          </button>

          <button 
            className={`menu-item ${activeNav === 'attendance' ? 'active' : ''}`}
            onClick={() => { setActiveNav('attendance'); setSidebarOpen(false); }}
          >
            📋 Attendance Sheet
          </button>

          <button 
            className={`menu-item ${activeNav === 'broadcast' ? 'active' : ''}`}
            onClick={() => { setActiveNav('broadcast'); setSidebarOpen(false); }}
          >
            📣 Broadcast Alerts
          </button>

          <div className="menu-divider"></div>

          <button className="menu-item menu-logout" onClick={handleLogout}>
            🚪 Log Out
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
