import { useState, useEffect } from 'react'
import './App.css'
import AvatarInitial from './components/AvatarInitial'
import TechEventsPage from './pages/TechEventsPage'
import NonTechEventsPage from './pages/NonTechEventsPage'
import CulturalEventsPage from './pages/CulturalEventsPage'
import AuthPage from './pages/AuthPage'
import EventDetailsPage from './pages/EventDetailsPage'
import ProfilePage from './pages/ProfilePage'
import MyTicketsPage from './pages/MyTicketsPage'
import NotificationsPage from './pages/NotificationsPage'

/* ─── SVG ICONS ─────────────────────────────────────────── */
const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  upcoming: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  categories: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  registrations: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  tickets: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  notifications: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  help: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  chevronDown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  scanner: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  ),
}

/* ─── DATA ─────────────────────────────────────────────── */
const navItems = [
  { id: 'dashboard', label: 'Dashboard', iconKey: 'dashboard' },
  { id: 'upcoming', label: 'Upcoming Events', iconKey: 'upcoming' },
  {
    id: 'categories', label: 'Event Categories', iconKey: 'categories',
    expandable: true,
    children: [
      { id: 'tech', label: 'Tech Events', dotColor: '#6366f1' },
      { id: 'nontech', label: 'Non-Tech Events', dotColor: '#a855f7' },
      { id: 'cultural', label: 'Cultural Events', dotColor: '#f97316' },
    ],
  },
  { id: 'registrations', label: 'My Registrations', iconKey: 'registrations' },
  { id: 'tickets', label: 'My Tickets', iconKey: 'tickets' },
  { id: 'notifications', label: 'Notifications', iconKey: 'notifications', badge: 2 },
  { id: 'profile', label: 'Profile', iconKey: 'profile' },
  { id: 'settings', label: 'Settings', iconKey: 'settings' },
  { id: 'help', label: 'Help & Support', iconKey: 'help' },
]

const categories = [
  {
    id: 'tech',
    navId: 'tech',
    title: 'Tech Events',
    desc: 'Hackathons, Workshops, Seminars and more.',
    img: '/tech_event.png',
    icon: '🖥️',
    count: '12 Events',
    countType: 'blue',
    btnType: 'blue',
  },
  {
    id: 'nontech',
    navId: 'nontech',
    title: 'Non-Tech Events',
    desc: 'Quiz, Debates, Workshops and more.',
    img: '/nontech_event.png',
    icon: '🎤',
    count: '8 Events',
    countType: 'blue',
    btnType: 'blue',
  },
  {
    id: 'cultural',
    navId: 'cultural',
    title: 'Cultural Events',
    desc: 'Dance, Music, Drama, Fine Arts and more.',
    img: '/cultural_event.png',
    icon: '🎭',
    count: '10 Events',
    countType: 'orange',
    btnType: 'orange',
  },
]

const upcomingEvents = [
  {
    id: 'codesprint',
    title: 'CodeSprint 2025',
    subtitle: 'Hackathon',
    img: '/tech_event.png',
    date: '25 May 2025',
    venue: 'Seminar Hall',
    btnType: 'blue',
  },
  {
    id: 'debate',
    title: 'Debate Championship',
    subtitle: 'Inter-College Debate',
    img: '/nontech_event.png',
    date: '28 May 2025',
    venue: 'Auditorium',
    btnType: 'blue',
  },
  {
    id: 'rangotsav',
    title: 'Rangotsav 2025',
    subtitle: 'Annual Cultural Fest',
    img: '/cultural_event.png',
    date: '30 May 2025',
    venue: 'Main Auditorium',
    btnType: 'orange',
  },
]

const registeredEvents = [
  { id: 'codesprint', name: 'CodeSprint 2025', date: '25 May 2025', img: '/tech_event.png' },
  { id: 'debate', name: 'Debate Championship', date: '28 May 2025', img: '/nontech_event.png' },
  { id: 'rangotsav', name: 'Rangotsav 2025', date: '30 May 2025', img: '/cultural_event.png' },
]

/* ─── COMPONENTS ────────────────────────────────────────── */

function Sidebar({ open, onClose, activeNav, setActiveNav, onLogout, unreadCount }) {
  const [catOpen, setCatOpen] = useState(true)

  const handleNavClick = (id) => {
    setActiveNav(id)
    onClose()
  }

  return (
    <>
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">★</div>
          <div className="sidebar-logo-text">
            <h1>EventHub</h1>
            <p>Explore. Register. Participate.</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map(item => {
            if (item.expandable) {
              const isChildActive = item.children.some(c => c.id === activeNav)
              return (
                <div key={item.id}>
                  <button
                    className={`nav-item ${isChildActive ? 'active' : ''}`}
                    onClick={() => setCatOpen(o => !o)}
                  >
                    <span className="nav-item-icon">{Icons[item.iconKey]}</span>
                    <span className="nav-item-label">{item.label}</span>
                    <span className={`nav-chevron ${catOpen ? 'open' : ''}`}>
                      {Icons.chevronDown}
                    </span>
                  </button>
                  {catOpen && (
                    <div className="nav-submenu">
                      {item.children.map(child => (
                        <button
                          key={child.id}
                          className={`nav-subitem ${activeNav === child.id ? 'sub-active' : ''}`}
                          onClick={() => handleNavClick(child.id)}
                        >
                          <span className="sub-dot" style={{ background: child.dotColor }} />
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            const badgeVal = item.id === 'notifications' ? unreadCount : item.badge;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-item-icon">{Icons[item.iconKey]}</span>
                <span className="nav-item-label">{item.label}</span>
                {badgeVal > 0 && <span className="nav-badge">{badgeVal}</span>}
              </button>
            )
          })}

          <div className="nav-divider" />

          <button className="nav-item logout" onClick={onLogout}>
            <span className="nav-item-icon">{Icons.logout}</span>
            <span className="nav-item-label">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  )
}

const TopbarSearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

function Topbar({ onMenuClick, showSearch, user, onProfileClick, unreadCount, onNotifClick }) {
  const defaultName = user?.email?.split('@')[0] || 'User'
  const displayName = user?.displayName || defaultName
  const firstName = displayName.split(' ')[0]

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger-btn" onClick={onMenuClick} aria-label="Toggle menu">
          ☰
        </button>
      </div>

      {showSearch && (
        <div className="topbar-search-wrap">
          <TopbarSearchIcon />
          <input className="topbar-search" type="text" placeholder="Search events..." />
        </div>
      )}

      <div className="topbar-right">
        <button className="notif-btn" aria-label="Notifications" onClick={onNotifClick}>
          🔔
          {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
        </button>
        <div className="user-profile" onClick={onProfileClick} style={{ cursor: 'pointer' }}>
          <AvatarInitial
            name={displayName}
            photoURL={user?.photoURL}
            size={36}
            style={{ border: '2px solid #fff', boxShadow: '0 2px 8px rgba(99,102,241,0.2)' }}
          />
          <div className="user-info">
            <span className="user-name">Hi, {firstName}</span>
            <span className="user-role">Student</span>
          </div>
          <span className="user-chevron">▾</span>
        </div>
      </div>
    </header>
  )
}

function HeroBanner({ user }) {
  const defaultName = user?.email?.split('@')[0] || 'User'
  const displayName = user?.displayName || defaultName
  const firstName = displayName.split(' ')[0]

  return (
    <div className="hero-banner-new">
      {/* Decorative Dots Pattern */}
      <svg className="hero-dots-pattern" viewBox="0 0 30 40" width="30" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="2" fill="#cbd5e1" />
        <circle cx="15" cy="5" r="2" fill="#cbd5e1" />
        <circle cx="25" cy="5" r="2" fill="#cbd5e1" />
        <circle cx="5" cy="15" r="2" fill="#cbd5e1" />
        <circle cx="15" cy="15" r="2" fill="#cbd5e1" />
        <circle cx="25" cy="15" r="2" fill="#cbd5e1" />
        <circle cx="5" cy="25" r="2" fill="#cbd5e1" />
        <circle cx="15" cy="25" r="2" fill="#cbd5e1" />
        <circle cx="25" cy="25" r="2" fill="#cbd5e1" />
        <circle cx="5" cy="35" r="2" fill="#cbd5e1" />
        <circle cx="15" cy="35" r="2" fill="#cbd5e1" />
        <circle cx="25" cy="35" r="2" fill="#cbd5e1" />
      </svg>

      {/* Floating Sparkles & Rings */}
      <svg className="hero-sparkle outline spark-top-left-blue" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
      </svg>
      <span className="hero-pill-orange orange-pill-top-left"></span>
      <span className="hero-cross-blue cross-left">+</span>
      
      <svg className="hero-sparkle filled spark-middle-top-yellow" viewBox="0 0 24 24" fill="#fbbf24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
      </svg>
      
      <span className="hero-ring ring-bottom-left"></span>
      
      <svg className="hero-sparkle outline spark-bottom-left-blue" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
      </svg>
      
      <svg className="hero-sparkle outline spark-right-purple" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
      </svg>
      <span className="hero-cross-purple cross-right">+</span>
      
      <div className="hero-text-new">
        <h2 className="hero-welcome">Welcome back,</h2>
        
        <div className="hero-name-container">
          <span className="hero-name">{firstName}!</span>
          <div className="hero-hand-wave-wrap">
            <span className="hero-hand-wave">👋</span>
            <svg className="hero-wave-lines" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 5 C 6 8, 6 12, 3 15" />
              <path d="M7 3 C 11 7, 11 13, 7 17" />
            </svg>
          </div>
          <svg className="hero-underline-name" viewBox="0 0 200 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10 C60 14, 130 14, 195 8" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        
        <div className="hero-sub-wrap">
          <span className="hero-vertical-bar"></span>
          <div className="hero-sub-text-container">
            <p className="hero-sub-text">
              Discover and register for <br />
              <span className="hero-sub-highlight">exciting events.</span>
            </p>
            <svg className="hero-underline-sub" viewBox="0 0 150 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 5 C50 8, 100 8, 140 5 C100 12, 50 15, 20 12" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* 3D Illustration */}
      <div className="hero-illustration-container">
        <img src="/hero_illustration.png" alt="Events Illustration" className="hero-illustration-new" />
      </div>
    </div>
  )
}

function CategoryCard({ cat, onNavigate }) {
  return (
    <div
      className="category-card"
      onClick={() => onNavigate(cat.navId)}
      style={{ cursor: 'pointer' }}
    >
      <div className="category-img-wrap">
        <img src={cat.img} alt={cat.title} />
        <div className="category-icon-badge">{cat.icon}</div>
      </div>
      <div className="category-body">
        <h3>{cat.title}</h3>
        <p>{cat.desc}</p>
        <div className="category-footer">
          <span className={`event-count ${cat.countType === 'orange' ? 'orange' : ''}`}>
            {cat.count}
          </span>
          <button
            className={`explore-btn ${cat.btnType === 'orange' ? 'orange' : ''}`}
            onClick={e => { e.stopPropagation(); onNavigate(cat.navId) }}
          >
            Explore →
          </button>
        </div>
      </div>
    </div>
  )
}

function UpcomingEventCard({ evt }) {
  return (
    <div className="upcoming-card">
      <img src={evt.img} alt={evt.title} className="upcoming-card-img" />
      <div className="upcoming-card-content">
        <div className="upcoming-card-title">{evt.title}</div>
        <div className="upcoming-card-subtitle">{evt.subtitle}</div>
      </div>
      <div className="upcoming-meta">
        <div className="meta-row">
          <span className="meta-icon">📅</span>
          <span>{evt.date}</span>
        </div>
        <div className="meta-row">
          <span className="meta-icon">📍</span>
          <span>{evt.venue}</span>
        </div>
      </div>
      <button className={`register-btn ${evt.btnType === 'orange' ? 'orange' : ''}`}>
        Register Now
      </button>
    </div>
  )
}

function ProfileCard({ user, onNavigate }) {
  const defaultName = user?.email?.split('@')[0] || 'User'
  const displayName = user?.displayName || defaultName
  const email = user?.email || 'user@example.com'

  return (
    <div className="profile-card">
      <AvatarInitial
        name={displayName}
        photoURL={user?.photoURL}
        size={72}
        style={{ margin: '0 auto 12px' }}
      />
      <div className="profile-card-name">{displayName}</div>
      <div className="profile-card-info">B.Tech CSE</div>
      <div className="profile-card-info">2nd Year</div>
      <div className="profile-card-email">{email}</div>
      <button className="view-profile-btn" onClick={() => onNavigate('profile')}>View Profile</button>
    </div>
  )
}

function RegisteredEventsPanel({ onNavigate }) {
  return (
    <div className="panel-card">
      <div className="panel-header">
        <span className="panel-title">My Registered Events</span>
        <span className="panel-view-all" onClick={() => onNavigate('tickets')} style={{cursor: 'pointer'}}>View All</span>
      </div>

      {registeredEvents.map(evt => (
        <div className="reg-event-item" key={evt.id}>
          <img src={evt.img} alt={evt.name} className="reg-event-img" />
          <div className="reg-event-info">
            <div className="reg-event-name">{evt.name}</div>
            <div className="reg-event-date">{evt.date}</div>
            <div className="reg-event-status">Registered</div>
          </div>
        </div>
      ))}

      <button className="view-tickets-btn" onClick={() => onNavigate('tickets')}>
        🎟️ View My Tickets
      </button>
    </div>
  )
}

function QuickLinksPanel() {
  const links = [
    { icon: '📋', label: 'Event Guidelines' },
    { icon: '❓', label: 'Frequently Asked Questions' },
    { icon: '📞', label: 'Contact Support' },
  ]
  return (
    <div className="panel-card">
      <div className="panel-header">
        <span className="panel-title">Quick Links</span>
      </div>
      {links.map(l => (
        <div className="quick-link-item" key={l.label}>
          <span className="quick-link-icon">{l.icon}</span>
          {l.label}
        </div>
      ))}
    </div>
  )
}

/* ─── APP ───────────────────────────────────────────────── */
export default function App() {
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [previousNav, setPreviousNav] = useState('tech')
  const [selectedEvent, setSelectedEvent] = useState(null)

  // -- Announcements / Broadcaster States --
  const [announcements, setAnnouncements] = useState([])
  const [readNotifications, setReadNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('readNotifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  })
  const [activeToast, setActiveToast] = useState(null)

  const fetchAnnouncements = async (email) => {
    try {
      const res = await fetch(`http://localhost:5000/api/announcements?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        const fetched = data.announcements || [];
        setAnnouncements(fetched);

        const savedRead = JSON.parse(localStorage.getItem('readNotifications') || '[]');
        
        // Find newest unread announcement within last 3 minutes
        const freshUnread = fetched.find(ann => {
          if (savedRead.includes(ann.id)) return false;
          const ageMs = Date.now() - new Date(ann.timestamp).getTime();
          return ageMs > 0 && ageMs < 180000; 
        });

        if (freshUnread && (!activeToast || activeToast.id !== freshUnread.id)) {
          setActiveToast(freshUnread);
          if (freshUnread.alertLevel === 'critical') {
            try {
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
              audio.volume = 0.4;
              audio.play();
            } catch (soundErr) {
              console.warn("Audio alert failed (browser permission):", soundErr);
            }
          }
          setTimeout(() => {
            setActiveToast(current => current?.id === freshUnread.id ? null : current);
          }, 7000);
        }
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchAnnouncements(user.email);
      const interval = setInterval(() => {
        fetchAnnouncements(user.email);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [user, readNotifications]);

  const handleMarkAllAsRead = () => {
    const allIds = announcements.map(ann => ann.id);
    setReadNotifications(allIds);
    localStorage.setItem('readNotifications', JSON.stringify(allIds));
  };

  const handleMarkSingleAsRead = (id) => {
    if (!readNotifications.includes(id)) {
      const updated = [...readNotifications, id];
      setReadNotifications(updated);
      localStorage.setItem('readNotifications', JSON.stringify(updated));
    }
  };

  const unreadCount = announcements.filter(ann => !readNotifications.includes(ann.id)).length;

  const navigateToEventDetails = (evt, categoryNav) => {
    setSelectedEvent(evt);
    setPreviousNav(categoryNav);
    setActiveNav('event-details');
  };

  if (!user) {
    return <AuthPage onLogin={setUser} />
  }

  return (
    <div className="app">
      {/* Real-time floating toast alert overlay */}
      {activeToast && (
        <div className={`live-toast-alert severity-${activeToast.alertLevel}`} onClick={() => {
          handleMarkSingleAsRead(activeToast.id);
          setActiveNav('notifications');
          setActiveToast(null);
        }}>
          <div className="toast-icon">
            {activeToast.alertLevel === 'critical' ? '🚨' : activeToast.alertLevel === 'warning' ? '⚠️' : '📢'}
          </div>
          <div className="toast-content">
            <div className="toast-tag">
              {activeToast.alertLevel === 'critical' ? 'CRITICAL ALERT' : activeToast.alertLevel === 'warning' ? 'SCHEDULE UPDATE' : 'NEW UPDATE'}
            </div>
            <h4>{activeToast.title}</h4>
            <p>{activeToast.body}</p>
          </div>
          <button className="toast-close-btn" onClick={(e) => {
            e.stopPropagation();
            handleMarkSingleAsRead(activeToast.id);
            setActiveToast(null);
          }}>×</button>
        </div>
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onLogout={() => { setUser(null); setActiveNav('dashboard') }}
        unreadCount={unreadCount}
      />

      <div className="main-content">
        <Topbar
          user={user}
          onMenuClick={() => setSidebarOpen(o => !o)}
          showSearch={['tech', 'nontech', 'cultural'].includes(activeNav)}
          onProfileClick={() => setActiveNav('profile')}
          unreadCount={unreadCount}
          onNotifClick={() => setActiveNav('notifications')}
        />

        {activeNav === 'tech' ? (
          <TechEventsPage onNavigateToEvent={(evt) => navigateToEventDetails(evt, 'tech')} />
        ) : activeNav === 'nontech' ? (
          <NonTechEventsPage onNavigateToEvent={(evt) => navigateToEventDetails(evt, 'nontech')} />
        ) : activeNav === 'cultural' ? (
          <CulturalEventsPage onNavigateToEvent={(evt) => navigateToEventDetails(evt, 'cultural')} />
        ) : activeNav === 'event-details' ? (
          <EventDetailsPage evt={selectedEvent} onBack={() => setActiveNav(previousNav)} user={user} />
        ) : activeNav === 'tickets' || activeNav === 'registrations' ? (
          <MyTicketsPage user={user} />
        ) : activeNav === 'notifications' ? (
          <NotificationsPage 
            announcements={announcements} 
            readIds={readNotifications} 
            onMarkAllAsRead={handleMarkAllAsRead} 
            onMarkSingleAsRead={handleMarkSingleAsRead} 
          />
        ) : activeNav === 'profile' ? (
          <ProfilePage user={user} onBack={() => setActiveNav('dashboard')} onUpdateUser={setUser} />
        ) : (
          <div className="page-content">
            {/* Centre Column */}
            <div className="content-area">
              <HeroBanner user={user} />

              {/* Event Categories */}
              <div>
                <div className="section-header">
                  <h2 className="section-title">Event Categories</h2>
                </div>
                <div className="category-grid">
                  {categories.map(cat => (
                    <CategoryCard
                      key={cat.id}
                      cat={cat}
                      onNavigate={setActiveNav}
                    />
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="upcoming-section">
                <div className="upcoming-header">
                  <h2 className="section-title">Upcoming Events</h2>
                  <span className="view-all-link">View All</span>
                </div>
                <div className="upcoming-scroll">
                  <div className="upcoming-list">
                    {upcomingEvents.map(evt => <UpcomingEventCard key={evt.id} evt={evt} />)}
                  </div>
                  <button className="upcoming-nav-btn" aria-label="Next events">›</button>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <aside className="right-panel">
              <ProfileCard user={user} onNavigate={setActiveNav} />
              <RegisteredEventsPanel onNavigate={setActiveNav} />
              <QuickLinksPanel />
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
