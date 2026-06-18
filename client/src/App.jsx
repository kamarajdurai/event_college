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
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { API_BASE_URL } from './config'

/* ─── SVG ICONS (FLAT OUTLINE ICONS) ────────────────────── */
const Icons = {
  homepage: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  upcoming: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  categories: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  registrations: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  notifications: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  help: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  chevronDown: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  tech: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  nontech: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  ),
  cultural: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      <rect x="5" y="16" width="14" height="4" rx="1" />
    </svg>
  )
}

/* ─── DATA ─────────────────────────────────────────────── */
const navItems = [
  { id: 'dashboard', label: 'Homepage', iconKey: 'homepage' },
  { id: 'upcoming', label: 'Upcoming Events', iconKey: 'upcoming' },
  {
    id: 'categories', label: 'Event Categories', iconKey: 'categories',
    expandable: true,
    children: [
      { id: 'tech', label: 'Tech Events', dotColor: '#8E78B2' },
      { id: 'nontech', label: 'Non-Tech Events', dotColor: '#EC8C73' },
      { id: 'cultural', label: 'Cultural Events', dotColor: '#C9B6FF' },
    ],
  },
  { id: 'registrations', label: 'My Registrations', iconKey: 'registrations' },
  { id: 'profile', label: 'My Profile', iconKey: 'profile' },
  { id: 'notifications', label: 'Notifications', iconKey: 'notifications', badge: 2 },
  { id: 'settings', label: 'Settings', iconKey: 'settings' },
  { id: 'help', label: 'Help', iconKey: 'help' },
]

const categories = [
  {
    id: 'tech',
    navId: 'tech',
    title: 'Tech Events',
    desc: 'Hackathons, coding, workshops & more',
    img: '/tech_event.png',
    iconKey: 'tech',
  },
  {
    id: 'nontech',
    navId: 'nontech',
    title: 'Non-Tech Events',
    desc: 'Talks, fun events, performances & more',
    img: '/nontech_event.png',
    iconKey: 'nontech',
  },
  {
    id: 'cultural',
    navId: 'cultural',
    title: 'Cultural Events',
    desc: 'Festivals, music, arts & more',
    img: '/cultural_event.png',
    iconKey: 'cultural',
  },
]

const upcomingEvents = [
  {
    id: 'codesprint',
    title: 'Annual Codeathon 2024',
    desc: 'Annual Codeathon 2024 is a national, hackathon. Showcase innova...',
    tag: 'Tech',
    img: '/tech_event.png',
    month: 'OCT',
    day: '28',
    dayName: 'SAT',
    location: 'Bangalore, India'
  },
  {
    id: 'foodfest',
    title: 'Global Food Fest',
    desc: 'The festive, food festival with cultural wefood from, and more...',
    tag: 'Cultural',
    img: '/cultural_event.png',
    month: 'OCT',
    day: '30',
    dayName: 'WED',
    location: 'Chennai, India'
  },
  {
    id: 'debate',
    title: 'Leadership Workshop',
    desc: 'Leadership Workshop is a leading the haryprotion ncowals to hei...',
    tag: 'Non-Tech',
    img: '/nontech_event.png',
    month: 'NOV',
    day: '1',
    dayName: 'FRI',
    location: 'Hyderabad, India'
  },
]

const registeredEvents = [
  { id: 'codesprint', name: 'Annual Codeathon 2024', date: '28 Oct 2024', img: '/tech_event.png' },
  { id: 'foodfest', name: 'Global Food Fest', date: '30 Oct 2024', img: '/cultural_event.png' },
  { id: 'debate', name: 'Leadership Workshop', date: '01 Nov 2024', img: '/nontech_event.png' },
]

/* ─── SIDEBAR COMPONENT ─────────────────────────────────── */
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
          <div className="sidebar-logo-icon-cei">CEI</div>
          <div className="sidebar-logo-text">
            <h1 className="sidebar-logo-title-top">COLLEGE</h1>
            <h1 className="sidebar-logo-title-bottom">EVENTS</h1>
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

/* ─── TOPBAR COMPONENT ──────────────────────────────────── */
function Topbar({ onMenuClick, activeNav, user, onProfileClick, unreadCount, onNotifClick, onBack, showBack }) {
  const defaultName = user?.email?.split('@')[0] || 'User'
  const displayName = user?.displayName || defaultName

  // Map activeNav to Header Title
  const getHeaderTitle = () => {
    if (activeNav === 'dashboard') return 'Homepage'
    if (activeNav === 'upcoming') return 'Upcoming Events'
    if (activeNav === 'browse') return 'Browse Events'
    if (activeNav === 'tech') return 'Tech Events'
    if (activeNav === 'nontech') return 'Non-Tech Events'
    if (activeNav === 'cultural') return 'Cultural Events'
    if (activeNav === 'registrations') return 'My Registrations'
    if (activeNav === 'tickets') return 'My Tickets'
    if (activeNav === 'notifications') return 'Notifications'
    if (activeNav === 'profile') return 'My Profile'
    if (activeNav === 'settings') return 'Settings'
    if (activeNav === 'help') return 'Help'
    return 'College Events'
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        {showBack ? (
          <button className="back-btn" onClick={onBack} aria-label="Go back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        ) : (
          <button className="hamburger-btn" onClick={onMenuClick} aria-label="Toggle menu">
            ☰
          </button>
        )}
        <h2 className="topbar-page-title desktop-only">{getHeaderTitle()}</h2>
      </div>

      <div className="topbar-center mobile-only">
        {activeNav === 'dashboard' ? (
          <div className="topbar-logo-mobile">
            <span className="logo-circle-mobile">CH</span>
            <div className="logo-text-mobile">
              <span className="logo-text-sub">COLLEGE</span>
              <span className="logo-text-main">EVENTS</span>
            </div>
          </div>
        ) : (
          <h2 className="topbar-page-title-mobile">{getHeaderTitle()}</h2>
        )}
      </div>

      <div className="topbar-right">
        <button className="notif-btn" aria-label="Notifications" onClick={onNotifClick}>
          🔔
          {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
        </button>
        <div className="user-profile desktop-only" onClick={onProfileClick} style={{ cursor: 'pointer' }}>
          <AvatarInitial
            name={displayName}
            photoURL={user?.photoURL}
            size={36}
            style={{ border: '2px solid #fff', boxShadow: '0 2px 8px rgba(142, 120, 178, 0.15)' }}
          />
        </div>
      </div>
    </header>
  )
}

/* ─── HERO BANNER COMPONENT ─────────────────────────────── */
function HeroBanner({ user }) {
  const defaultName = user?.email?.split('@')[0] || 'User'
  const displayName = user?.displayName || defaultName
  const firstName = displayName.split(' ')[0]

  const today = new Date()
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  const currentMonth = months[today.getMonth()]
  const currentDay = today.getDate()

  return (
    <div className="hero-banner-new">
      {/* Soft Sparkles Background Decorations */}
      <span className="hero-sparkle sparkles-one">✦</span>
      <span className="hero-sparkle sparkles-two">✦</span>
      <span className="hero-sparkle sparkles-three">✦</span>

      <div className="hero-text-new">
        <h2 className="hero-welcome">Welcome back, {firstName}!</h2>
        <div className="hero-sub-wrap">
          <p className="hero-sub-text">
            Discover and book your next <br />
            <span className="hero-sub-highlight">amazing events.</span>
          </p>
        </div>
      </div>

      {/* iOS styled liquid-glass illustration */}
      <div className="hero-illustration-container">
        <div className="glass-calendar-widget">
          <div className="calendar-hdr">{currentMonth}</div>
          <div className="calendar-bdy">{currentDay}</div>
        </div>
        <div className="glass-featured-widget">
          <div className="featured-dot-tag">
            <span className="featured-dot-icon">🟠</span>
            <span className="featured-tag-lbl">Featured Event</span>
          </div>
          <h4 className="featured-title">Renaissance Vibes Music Festival</h4>
          <p className="featured-time">06:00 PM onwards</p>
        </div>
      </div>
    </div>
  )
}

/* ─── CATEGORY CARD COMPONENT ───────────────────────────── */
function CategoryCard({ cat, onNavigate }) {
  return (
    <div
      className="category-card"
      onClick={() => onNavigate(cat.navId)}
      style={{ cursor: 'pointer', backgroundImage: `url(${cat.img})` }}
    >
      <div className="category-overlay"></div>
      <div className="category-header-badge">{Icons[cat.iconKey]}</div>
      <div className="category-body">
        <h3>{cat.title}</h3>
        <p>{cat.desc}</p>
        <button
          className="explore-btn"
          onClick={e => { e.stopPropagation(); onNavigate(cat.navId) }}
        >
          Explore
        </button>
      </div>
    </div>
  )
}

/* ─── UPCOMING EVENT CARD COMPONENT ─────────────────────── */
function UpcomingEventCard({ evt, onNavigate }) {
  return (
    <div className="upcoming-card">
      <div className="upcoming-img-container">
        <img src={evt.img} alt={evt.title} className="upcoming-card-img" />
        
        {/* Floating Date Badge */}
        <div className="upcoming-date-badge">
          <span className="badge-month">{evt.month}</span>
          <span className="badge-day">{evt.day}</span>
          <span className="badge-dayname">{evt.dayName}</span>
        </div>

        {/* Floating Category Tag */}
        <span className="upcoming-category-tag">{evt.tag}</span>
      </div>

      <div className="upcoming-card-content">
        <div className="upcoming-card-title">{evt.title}</div>
        <div className="upcoming-card-desc">{evt.desc}</div>
        <div className="upcoming-card-location">
          <span className="location-icon-pin">📍</span>
          <span className="location-text-lbl">{evt.location || 'College Campus'}</span>
        </div>
        <button className="register-btn" onClick={() => onNavigate('browse')}>
          Register Now
        </button>
      </div>
    </div>
  )
}

/* ─── PROFILE WIDGET COMPONENT ──────────────────────────── */
function ProfileCard({ user, onNavigate }) {
  const defaultName = user?.email?.split('@')[0] || 'User'
  const displayName = user?.displayName || defaultName

  return (
    <div className="profile-card">
      <AvatarInitial
        name={displayName}
        photoURL={user?.photoURL}
        size={68}
        style={{ margin: '0 auto 10px', border: '3px solid rgba(255, 255, 255, 0.8)', boxShadow: '0 8px 20px rgba(116, 82, 169, 0.1)' }}
      />
      <div className="profile-card-name">{displayName}</div>
      <div className="profile-card-info">B.Tech - Year 3</div>
      
      {/* Stats Section */}
      <div className="profile-stats-grid">
        <div className="stat-box">
          <span className="stat-label">Upcoming Events</span>
          <span className="stat-value">2</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Zeta</span>
          <span className="stat-value">4</span>
        </div>
      </div>

      <button className="view-profile-btn" onClick={() => onNavigate('profile')}>
        View Profile
      </button>
    </div>
  )
}

/* ─── REGISTERED EVENTS PANEL COMPONENT ─────────────────── */
function RegisteredEventsPanel({ onNavigate }) {
  return (
    <div className="panel-card">
      <div className="panel-header">
        <span className="panel-title">My Registered Events</span>
        <span className="panel-view-all" onClick={() => onNavigate('tickets')} style={{cursor: 'pointer'}}>View All</span>
      </div>

      <div className="reg-events-list">
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
      </div>

      <button className="view-tickets-btn" onClick={() => onNavigate('tickets')}>
        🎟️ View My Tickets
      </button>
    </div>
  )
}

/* ─── QUICK LINKS PANEL COMPONENT ───────────────────────── */
function QuickLinksPanel({ onNavigate }) {
  const links = [
    { icon: '🎫', label: 'View All Tickets', bgColor: 'rgba(236, 140, 115, 0.15)', iconColor: '#EC8C73', navId: 'tickets' },
    { icon: '💳', label: 'Payment History', bgColor: 'rgba(142, 120, 178, 0.15)', iconColor: '#8E78B2', navId: 'tickets' },
    { icon: '👥', label: 'Invite Friends', bgColor: 'rgba(79, 70, 229, 0.15)', iconColor: '#4f46e5' },
    { icon: '❓', label: 'Help Center', bgColor: 'rgba(16, 185, 129, 0.15)', iconColor: '#10b981', navId: 'help' },
  ]
  return (
    <div className="panel-card">
      <div className="panel-header">
        <span className="panel-title">Quick Links</span>
      </div>
      <div className="quick-links-list">
        {links.map(l => (
          <div 
            className="quick-link-item" 
            key={l.label}
            onClick={() => l.navId && onNavigate && onNavigate(l.navId)}
            style={{ cursor: l.navId ? 'pointer' : 'default' }}
          >
            <span 
              className="quick-link-icon" 
              style={{ backgroundColor: l.bgColor, color: l.iconColor }}
            >
              {l.icon}
            </span>
            <span className="quick-link-label">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── BOTTOM NAV COMPONENT ──────────────────────────────── */
function BottomNav({ activeNav, setActiveNav }) {
  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Home', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ) 
    },
    { 
      id: 'browse', 
      label: 'Events', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ) 
    },
    { 
      id: 'tickets', 
      label: 'Tickets', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-20deg)' }}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 12a2 2 0 0 1 2-2 2 2 0 0 1-2-2" />
          <path d="M22 12a2 2 0 0 0-2-2 2 2 0 0 0 2-2" />
          <line x1="7" y1="5" x2="7" y2="19" strokeDasharray="3 3" />
        </svg>
      ) 
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ) 
    }
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(t => {
        const isActive = activeNav === t.id || 
          (t.id === 'browse' && (activeNav === 'tech' || activeNav === 'nontech' || activeNav === 'cultural'));
        const isTicketsActive = t.id === 'tickets' && (activeNav === 'tickets' || activeNav === 'registrations');
        return (
          <button
            key={t.id}
            className={`bottom-nav-item ${isActive || isTicketsActive ? 'active' : ''}`}
            onClick={() => setActiveNav(t.id)}
          >
            <span className="bottom-nav-icon">{t.icon}</span>
            <span className="bottom-nav-label">{t.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

/* ─── MAIN APP CONTAINER ────────────────────────────────── */
export default function App() {
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const [activeNav, setActiveNav] = useState(() => {
    return localStorage.getItem('activeNav') || 'dashboard'
  })
  
  const [navHistory, setNavHistory] = useState(() => {
    const savedNav = localStorage.getItem('activeNav') || 'dashboard'
    return savedNav === 'dashboard' ? ['dashboard'] : ['dashboard', savedNav]
  })
  
  const [previousNav, setPreviousNav] = useState('tech')
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
      }
      setLoadingAuth(false)
    })
    return () => unsubscribe()
  }, [])

  const navigateTo = (pageId) => {
    if (pageId === activeNav) return
    localStorage.setItem('activeNav', pageId)
    setNavHistory(prev => [...prev, pageId])
    setActiveNav(pageId)
  }

  const navigateBack = () => {
    if (navHistory.length <= 1) {
      localStorage.setItem('activeNav', 'dashboard')
      setNavHistory(['dashboard'])
      setActiveNav('dashboard')
      return
    }
    const newHistory = [...navHistory]
    newHistory.pop()
    const prevPage = newHistory[newHistory.length - 1]
    localStorage.setItem('activeNav', prevPage)
    setNavHistory(newHistory)
    setActiveNav(prevPage)
  }

  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'dark'
    } catch (e) {
      return false
    }
  })

  useEffect(() => {
    try {
      if (isDark) {
        document.body.classList.add('dark-theme')
        localStorage.setItem('theme', 'dark')
      } else {
        document.body.classList.remove('dark-theme')
        localStorage.setItem('theme', 'light')
      }
    } catch (e) {
      console.error(e)
    }
  }, [isDark])

  // -- Announcements States --
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
      const res = await fetch(`${API_BASE_URL}/announcements?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        const fetched = data.announcements || [];
        setAnnouncements(fetched);

        const savedRead = JSON.parse(localStorage.getItem('readNotifications') || '[]');
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
    navigateTo('event-details');
  };

  if (loadingAuth) {
    return (
      <div className="auth-centered-page">
        <div className="auth-glow-blob blob-one"></div>
        <div className="auth-glow-blob blob-two"></div>
        <div className="auth-noise-overlay"></div>
        <div className="auth-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '16px', color: '#7E748B', fontWeight: 600 }}>Loading EventHub...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage onLogin={setUser} />
  }

  return (
    <div className="app">
      {/* Soft Floating Blurry Background Gradients */}
      <div className="auth-glow-blob blob-one"></div>
      <div className="auth-glow-blob blob-two"></div>
      <div className="auth-glow-blob blob-three"></div>
      <div className="auth-glow-blob blob-four"></div>
      <div className="auth-noise-overlay"></div>

      {/* Floating Translucent Glass Circles */}
      <div className="glass-shape shape-one"></div>
      <div className="glass-shape shape-two"></div>
      <div className="glass-shape shape-three"></div>

      {/* Real-time floating toast alert overlay */}
      {activeToast && (
        <div className={`live-toast-alert severity-${activeToast.alertLevel}`} onClick={() => {
          handleMarkSingleAsRead(activeToast.id);
          navigateTo('notifications');
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
        setActiveNav={navigateTo}
        onLogout={() => {
          auth.signOut()
          setUser(null)
          localStorage.removeItem('activeNav')
          navigateTo('dashboard')
        }}
        unreadCount={unreadCount}
      />

      <div className="main-content">
        <Topbar
          user={user}
          onMenuClick={() => setSidebarOpen(o => !o)}
          activeNav={activeNav}
          onProfileClick={() => navigateTo('profile')}
          unreadCount={unreadCount}
          onNotifClick={() => navigateTo('notifications')}
          onBack={navigateBack}
          showBack={activeNav !== 'dashboard'}
        />

        {activeNav === 'tech' ? (
          <TechEventsPage onNavigateToEvent={(evt) => navigateToEventDetails(evt, 'tech')} />
        ) : activeNav === 'nontech' ? (
          <NonTechEventsPage onNavigateToEvent={(evt) => navigateToEventDetails(evt, 'nontech')} />
        ) : activeNav === 'cultural' ? (
          <CulturalEventsPage onNavigateToEvent={(evt) => navigateToEventDetails(evt, 'cultural')} />
        ) : activeNav === 'event-details' ? (
          <EventDetailsPage evt={selectedEvent} onBack={navigateBack} user={user} />
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
          <ProfilePage user={user} onBack={navigateBack} onUpdateUser={setUser} />
        ) : activeNav === 'browse' ? (
          <div className="page-content">
            <div className="content-area" style={{ gap: '24px' }}>
              <div className="section-header">
                <h2 className="section-title">All Categories</h2>
              </div>
              <div className="category-grid">
                {categories.map(cat => (
                  <CategoryCard
                    key={cat.id}
                    cat={cat}
                    onNavigate={navigateTo}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Default Dashboard/Homepage View */
          <div className="page-content">
            {/* Centre Column */}
            <div className="content-area">
              <HeroBanner user={user} />

              {/* Event Categories */}
              <div>
                <div className="section-header">
                  <h2 className="section-title">Explore Event Categories</h2>
                </div>
                <div className="category-grid">
                  {categories.map(cat => (
                    <CategoryCard
                      key={cat.id}
                      cat={cat}
                      onNavigate={navigateTo}
                    />
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="upcoming-section">
                <div className="upcoming-header">
                  <h2 className="section-title">Upcoming Events</h2>
                  <span className="view-all-link" onClick={() => navigateTo('browse')} style={{ cursor: 'pointer' }}>
                    View All Events →
                  </span>
                </div>
                <div className="upcoming-scroll">
                  <div className="upcoming-list">
                    {upcomingEvents.map(evt => (
                      <UpcomingEventCard key={evt.id} evt={evt} onNavigate={navigateTo} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Newsletter Subscription Card */}
              <div className="newsletter-card">
                <div className="newsletter-icon-box">✉️</div>
                <div className="newsletter-content">
                  <h3>Never miss an Update!</h3>
                  <p>Subscribe to our newsletter to be the first to know about exciting upcoming events.</p>
                </div>
                <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
                  <input type="email" placeholder="Enter your email" required className="newsletter-input" />
                  <button type="submit" className="newsletter-btn">Subscribe</button>
                </form>
              </div>
            </div>

            {/* Right Panel */}
            <aside className="right-panel">
              <ProfileCard user={user} onNavigate={navigateTo} />
              <RegisteredEventsPanel onNavigate={navigateTo} />
              <QuickLinksPanel onNavigate={navigateTo} />
            </aside>
          </div>
        )}
      </div>
      <BottomNav activeNav={activeNav} setActiveNav={navigateTo} />
    </div>
  )
}
