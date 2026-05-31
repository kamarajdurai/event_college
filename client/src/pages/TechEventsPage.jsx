import { useState, useMemo, useEffect } from 'react'
import './TechEvents.css'

/* ─── DATA ─────────────────────────────────────────────── */
const techEvents = [
  {
    id: 'web3-hackathon',
    title: 'Web3 & DApps Hackathon',
    desc: 'Build decentralized applications in a 48-hour coding marathon.',
    category: 'Hackathon',
    day: '10', month: 'MAY',
    venue: 'Block D, Tech Lab',
    time: '09:00 AM – 09:00 AM (48 Hrs)',
    img: '/tech_event.png', // Fallback to existing image
    color: '#6366f1',
  },
  {
    id: 'ar-vr-workshop',
    title: 'AR/VR Development Workshop',
    desc: 'Hands-on training in Augmented and Virtual Reality using Unity.',
    category: 'Workshop',
    day: '15', month: 'MAY',
    venue: 'Lab 5, VR Center',
    time: '10:00 AM – 02:00 PM',
    img: '/ai_ml_card.png',
    color: '#6366f1',
  },
  {
    id: 'quantum-computing',
    title: 'Quantum Computing Future',
    desc: 'Deep dive into the future of computing with quantum mechanics.',
    category: 'Seminar',
    day: '22', month: 'MAY',
    venue: 'Main Auditorium',
    time: '11:00 AM – 01:00 PM',
    img: '/cybersec_card.png',
    color: '#6366f1',
  },
  {
    id: 'fintech-summit',
    title: 'Fintech Innovation Summit',
    desc: 'Discover how technology is disrupting the financial sector.',
    category: 'Seminar',
    day: '02', month: 'JUN',
    venue: 'Conference Room 1',
    time: '02:00 PM – 04:30 PM',
    img: '/cloud_card.png',
    color: '#6366f1',
  },
  {
    id: 'devops-mastery',
    title: 'DevOps & CI/CD Mastery',
    desc: 'Learn Docker, Kubernetes, and automated deployment pipelines.',
    category: 'Workshop',
    day: '08', month: 'JUN',
    venue: 'Lab 2, Block B',
    time: '10:00 AM – 01:00 PM',
    img: '/mobile_card.png',
    color: '#6366f1',
  },
  {
    id: 'iot-automation',
    title: 'IoT Home Automation',
    desc: 'Build smart home devices using Arduino and Raspberry Pi.',
    category: 'Workshop',
    day: '12', month: 'JUN',
    venue: 'Hardware Lab',
    time: '09:30 AM – 01:30 PM',
    img: '/datascience_card.png',
    color: '#6366f1',
  },
  {
    id: 'open-source-drive',
    title: 'Open Source Contribution Drive',
    desc: 'Contribute to popular open source projects and earn swags.',
    category: 'Hackathon',
    day: '20', month: 'JUN',
    venue: 'Seminar Hall',
    time: '10:00 AM – 06:00 PM',
    img: '/blockchain_card.png',
    color: '#6366f1',
  },
  {
    id: 'game-dev-unity',
    title: 'Game Development with Unity',
    desc: 'Create your first 3D game from scratch in this interactive workshop.',
    category: 'Workshop',
    day: '28', month: 'JUN',
    venue: 'Lab 1, Block A',
    time: '10:00 AM – 03:00 PM',
    img: '/robotics_card.png',
    color: '#6366f1',
  },
]

const DATE_OPTIONS = ['All Dates', 'May 2025', 'June 2025']
const SORT_OPTIONS = ['Default', 'Date (Asc)', 'Date (Desc)', 'Name (A–Z)']

/* ─── ICONS ─────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const SortIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>
  </svg>
)
const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

/* ─── CATEGORY COLOR MAP ────────────────────────────────── */
const catColor = {
  Hackathon: { color: '#6366f1', bg: '#eef2ff' },
  Workshop:  { color: '#6366f1', bg: '#eef2ff' },
  Seminar:   { color: '#6366f1', bg: '#eef2ff' },
}

/* ─── EVENT CARD ─────────────────────────────────────────── */
function EventCard({ evt, onView }) {
  const cc = catColor[evt.category] || { color: '#6366f1', bg: '#eef2ff' }
  return (
    <div className="te-card">
      <div className="te-card-img-wrap">
        <img src={evt.img} alt={evt.title} className="te-card-img" />
        <div className="te-card-date">
          <span className="te-date-day">{evt.day}</span>
          <span className="te-date-month">{evt.month}</span>
        </div>
      </div>
      <div className="te-card-body">
        <span className="te-cat-tag" style={{ color: cc.color, background: cc.bg }}>
          {evt.category}
        </span>
        <h3 className="te-card-title">{evt.title}</h3>
        <p className="te-card-desc">{evt.desc}</p>
        <div className="te-card-meta">
          <div className="te-meta-row">
            <PinIcon />
            <span>{evt.venue}</span>
          </div>
          <div className="te-meta-row">
            <ClockIcon />
            <span>{evt.time}</span>
          </div>
        </div>
        <button className="te-view-btn" onClick={onView}>View Details</button>
      </div>
    </div>
  )
}

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function TechEventsPage({ onNavigateToEvent }) {
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('All Dates')
  const [sortBy, setSortBy] = useState('Default')
  const [dateOpen, setDateOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [events, setEvents] = useState(techEvents)

  useEffect(() => {
    fetch('http://localhost:5000/api/events?category=tech')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.events && data.events.length > 0) {
          setEvents(data.events)
        }
      })
      .catch(err => console.error("Error fetching tech events:", err))
  }, [])

  const filtered = useMemo(() => {
    let list = events.filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.desc.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
    )
    if (dateFilter === 'May 2025') list = list.filter(e => e.month === 'MAY')
    if (dateFilter === 'June 2025') list = list.filter(e => e.month === 'JUN')
    if (sortBy === 'Name (A–Z)') list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [events, search, dateFilter, sortBy])

  return (
    <div className="te-page">
      {/* Hero Banner */}
      <div className="te-hero">
        <img src="/tech_hero.png" alt="Tech Events" className="te-hero-bg" />
        <div className="te-hero-overlay" />
        <div className="te-hero-content">
          <h1 className="te-hero-title">Tech Events</h1>
          <p className="te-hero-subtitle">
            Explore innovative tech events, hackathons, workshops,<br />
            and seminars to boost your skills.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="te-filter-bar">
        <div className="te-showing">
          Showing <strong>{filtered.length}</strong> events
        </div>
        <div className="te-filter-right">
          {/* Search */}
          <div className="te-search-wrap">
            <SearchIcon />
            <input
              className="te-search"
              type="text"
              placeholder="Search tech events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Date Filter */}
          <div className="te-dropdown-wrap">
            <button
              className="te-dropdown-btn"
              onClick={() => { setDateOpen(o => !o); setSortOpen(false) }}
            >
              <CalendarIcon />
              {dateFilter}
              <ChevronIcon />
            </button>
            {dateOpen && (
              <div className="te-dropdown-menu">
                {DATE_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    className={`te-dropdown-item ${dateFilter === opt ? 'active' : ''}`}
                    onClick={() => { setDateFilter(opt); setDateOpen(false) }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="te-dropdown-wrap">
            <button
              className="te-dropdown-btn"
              onClick={() => { setSortOpen(o => !o); setDateOpen(false) }}
            >
              <SortIcon />
              Sort By
              <ChevronIcon />
            </button>
            {sortOpen && (
              <div className="te-dropdown-menu">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    className={`te-dropdown-item ${sortBy === opt ? 'active' : ''}`}
                    onClick={() => { setSortBy(opt); setSortOpen(false) }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="te-grid">
        {filtered.length > 0
          ? filtered.map(evt => <EventCard key={evt.id} evt={evt} onView={() => onNavigateToEvent && onNavigateToEvent(evt)} />)
          : (
            <div className="te-empty">
              <span>No events found</span>
            </div>
          )
        }
      </div>
    </div>
  )
}
