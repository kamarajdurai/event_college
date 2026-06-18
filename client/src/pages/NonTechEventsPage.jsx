import { useState, useMemo, useEffect } from 'react'
import './EventPage.css'
import { API_BASE_URL } from '../config'

/* ─── DATA ─────────────────────────────────────────────── */
const nonTechEvents = [
  {
    id: 'startup-pitch',
    title: 'Shark Tank Startup Pitch',
    desc: 'Pitch your most innovative business ideas to investors.',
    category: 'Competition',
    day: '26', month: 'MAY',
    venue: 'Seminar Hall',
    time: '10:00 AM – 01:00 PM',
    img: '/quiz_card.png',
  },
  {
    id: 'mun-2025',
    title: 'Model United Nations (MUN)',
    desc: 'Simulate UN committees and debate on global issues.',
    category: 'Debate',
    day: '28', month: 'MAY',
    venue: 'Auditorium',
    time: '09:00 AM – 05:00 PM',
    img: '/debate_card.png',
  },
  {
    id: 'escape-room',
    title: 'Escape Room Challenge',
    desc: 'Solve puzzles and riddles to escape the mystery room in time.',
    category: 'Competition',
    day: '02', month: 'JUN',
    venue: 'Block C Basement',
    time: '10:00 AM – 04:00 PM',
    img: null,
    gradient: 'linear-gradient(135deg,#3b0764 0%,#6d28d9 50%,#4c1d95 100%)',
    emoji: '🔐',
  },
  {
    id: 'mock-trading',
    title: 'Stock Market Mock Trading',
    desc: 'Learn trading strategies and compete in a virtual stock market.',
    category: 'Workshop',
    day: '07', month: 'JUN',
    venue: 'Commerce Lab',
    time: '10:00 AM – 02:00 PM',
    img: null,
    gradient: 'linear-gradient(135deg,#1e1b4b 0%,#4338ca 50%,#312e81 100%)',
    emoji: '📈',
  },
  {
    id: 'standup-comedy',
    title: 'Stand-up Comedy Open Mic',
    desc: 'Showcase your humor and make the crowd roar with laughter.',
    category: 'Speaking',
    day: '12', month: 'JUN',
    venue: 'Open Air Theatre',
    time: '06:00 PM – 09:00 PM',
    img: null,
    gradient: 'linear-gradient(135deg,#4a044e 0%,#86198f 50%,#701a75 100%)',
    emoji: '🎤',
  },
  {
    id: 'short-film',
    title: 'Short Film Making',
    desc: 'Screen your short films and win awards for best direction.',
    category: 'Contest',
    day: '15', month: 'JUN',
    venue: 'Main Auditorium',
    time: '02:00 PM – 06:00 PM',
    img: null,
    gradient: 'linear-gradient(135deg,#2e1065 0%,#7c3aed 50%,#4c1d95 100%)',
    emoji: '🎬',
  },
  {
    id: 'esports',
    title: 'E-Sports Tournament',
    desc: 'Compete in Valorant, BGMI, and FIFA tournaments.',
    category: 'Competition',
    day: '20', month: 'JUN',
    venue: 'Gaming Arena',
    time: '09:00 AM – 08:00 PM',
    img: '/nontech_event.png',
  },
  {
    id: 'treasure-hunt',
    title: 'Campus Treasure Hunt',
    desc: 'Follow the clues around the campus to find the hidden treasure.',
    category: 'Contest',
    day: '25', month: 'JUN',
    venue: 'Main Ground',
    time: '09:00 AM – 01:00 PM',
    img: null,
    gradient: 'linear-gradient(135deg,#3b0764 0%,#9333ea 50%,#6b21a8 100%)',
    emoji: '🗺️',
  },
]

const DATE_OPTIONS = ['All Dates', 'May 2025', 'June 2025']
const SORT_OPTIONS = ['Default', 'Date (Asc)', 'Date (Desc)', 'Name (A–Z)']
const CAT_OPTIONS  = ['All', 'Quiz', 'Debate', 'Competition', 'Contest', 'Speaking', 'Workshop', 'Discussion']

/* ─── ICONS ─────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const SortIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>
  </svg>
)
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
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

/* ─── EVENT CARD ─────────────────────────────────────────── */
function EventCard({ evt, accent, onView }) {
  return (
    <div className="ep-card">
      <div className="ep-card-img-wrap">
        {evt.img ? (
          <img src={evt.img} alt={evt.title} className="ep-card-img" />
        ) : (
          <div className="ep-card-gradient" style={{ background: evt.gradient }}>
            <span className="ep-card-emoji">{evt.emoji}</span>
          </div>
        )}
        <div className="ep-card-date">
          <span className="ep-date-day">{evt.day}</span>
          <span className="ep-date-month">{evt.month}</span>
        </div>
      </div>
      <div className="ep-card-body">
        <span className="ep-cat-tag" style={{ color: accent.text, background: accent.bg }}>
          {evt.category}
        </span>
        <h3 className="ep-card-title">{evt.title}</h3>
        <p className="ep-card-desc">{evt.desc}</p>
        <div className="ep-card-meta">
          <div className="ep-meta-row"><PinIcon /><span>{evt.venue}</span></div>
          <div className="ep-meta-row"><ClockIcon /><span>{evt.time}</span></div>
        </div>
        <button className="ep-view-btn" style={{ borderColor: accent.text, color: accent.text }}
          onMouseEnter={e => { e.currentTarget.style.background = accent.text; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = accent.text }}
          onClick={onView}
        >
          View Details
        </button>
      </div>
    </div>
  )
}

/* ─── DROPDOWN ───────────────────────────────────────────── */
function Dropdown({ icon, label, options, value, onChange, open, onToggle }) {
  return (
    <div className="ep-dropdown-wrap">
      <button className="ep-dropdown-btn" onClick={onToggle}>
        {icon}{value || label}<ChevronIcon />
      </button>
      {open && (
        <div className="ep-dropdown-menu">
          {options.map(opt => (
            <button
              key={opt}
              className={`ep-dropdown-item ${value === opt ? 'active' : ''}`}
              onClick={() => onChange(opt)}
            >{opt}</button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── MAIN PAGE ──────────────────────────────────────────── */
const ACCENT = { text: '#a855f7', bg: '#f3e8ff', border: '#d8b4fe' }

export default function NonTechEventsPage({ onNavigateToEvent }) {
  const [search,   setSearch]   = useState('')
  const [dateFilter, setDate]   = useState('All Dates')
  const [catFilter,  setCat]    = useState('All')
  const [sortBy,   setSort]     = useState('Default')
  const [openDrop, setOpenDrop] = useState(null)
  const [events, setEvents]     = useState(nonTechEvents)

  useEffect(() => {
    fetch(`${API_BASE_URL}/events?category=nontech`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.events && data.events.length > 0) {
          setEvents(data.events)
        }
      })
      .catch(err => console.error("Error fetching non-tech events:", err))
  }, [])

  const toggle = key => setOpenDrop(o => o === key ? null : key)

  const filtered = useMemo(() => {
    let list = events.filter(e =>
      (e.title + e.desc + e.category).toLowerCase().includes(search.toLowerCase())
    )
    if (dateFilter === 'May 2025')  list = list.filter(e => e.month === 'MAY')
    if (dateFilter === 'June 2025') list = list.filter(e => e.month === 'JUN')
    if (catFilter !== 'All')        list = list.filter(e => e.category === catFilter)
    if (sortBy === 'Name (A–Z)')    list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    if (sortBy === 'Date (Asc)')    list = [...list].sort((a, b) => Number(a.day) - Number(b.day))
    if (sortBy === 'Date (Desc)')   list = [...list].sort((a, b) => Number(b.day) - Number(a.day))
    return list
  }, [events, search, dateFilter, catFilter, sortBy])

  return (
    <div className="ep-page" onClick={() => setOpenDrop(null)}>
      {/* Hero */}
      <div className="ep-hero">
        <img src="/nontech_hero.png" alt="Non-Tech Events" className="ep-hero-bg" />
        <div className="ep-hero-overlay" style={{ background: 'linear-gradient(90deg,rgba(30,0,60,0.88) 0%,rgba(80,0,120,0.55) 55%,rgba(80,0,120,0.1) 100%)' }} />
        <div className="ep-hero-content">
          <h1 className="ep-hero-title">Non-Tech Events</h1>
          <p className="ep-hero-subtitle">
            Compete in quizzes, debates, creative writing,<br />
            and more to showcase your intellect and talent.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="ep-filter-bar" onClick={e => e.stopPropagation()}>
        <div className="ep-showing">
          Showing <strong style={{ color: ACCENT.text }}>{filtered.length}</strong> events
        </div>
        <div className="ep-filter-right">
          <div className="ep-search-wrap">
            <SearchIcon />
            <input className="ep-search" placeholder="Search non-tech events..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Dropdown icon={<FilterIcon />} label="Category" options={CAT_OPTIONS} value={catFilter} onChange={v => { setCat(v); setOpenDrop(null) }} open={openDrop === 'cat'} onToggle={e => { e.stopPropagation(); toggle('cat') }} />
          <Dropdown icon={<CalendarIcon />} label="All Dates" options={DATE_OPTIONS} value={dateFilter} onChange={v => { setDate(v); setOpenDrop(null) }} open={openDrop === 'date'} onToggle={e => { e.stopPropagation(); toggle('date') }} />
          <Dropdown icon={<SortIcon />} label="Sort By" options={SORT_OPTIONS} value={sortBy} onChange={v => { setSort(v); setOpenDrop(null) }} open={openDrop === 'sort'} onToggle={e => { e.stopPropagation(); toggle('sort') }} />
        </div>
      </div>

      {/* Grid */}
      <div className="ep-grid">
        {filtered.length > 0
          ? filtered.map(evt => <EventCard key={evt.id} evt={evt} accent={ACCENT} onView={() => onNavigateToEvent && onNavigateToEvent(evt)} />)
          : <div className="ep-empty">No events found matching your search.</div>
        }
      </div>
    </div>
  )
}
