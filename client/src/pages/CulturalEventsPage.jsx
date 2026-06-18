import { useState, useMemo, useEffect } from 'react'
import './EventPage.css'
import { API_BASE_URL } from '../config'

/* ─── DATA ─────────────────────────────────────────────── */
const culturalEvents = [
  {
    id: 'neon-dj-night',
    title: 'Neon Glow DJ Night',
    desc: 'Dance to the beats of top DJs under neon lights and lasers.',
    category: 'Music',
    day: '27', month: 'MAY',
    venue: 'Open Air Arena',
    time: '07:00 PM – 11:00 PM',
    img: '/cultural_event.png',
  },
  {
    id: 'street-dance',
    title: 'Street Dance Battle',
    desc: 'Witness epic b-boying and hip-hop dance crew battles.',
    category: 'Dance',
    day: '30', month: 'MAY',
    venue: 'Main Ground',
    time: '04:00 PM – 08:00 PM',
    img: '/cultural_hero.png',
  },
  {
    id: 'cosplay-con',
    title: 'Cosplay & Anime Convention',
    desc: 'Dress up as your favorite anime or comic character and win prizes.',
    category: 'Fest',
    day: '04', month: 'JUN',
    venue: 'Indoor Stadium',
    time: '10:00 AM – 06:00 PM',
    img: null,
    gradient: 'linear-gradient(135deg,#431407 0%,#c2410c 50%,#9a3412 100%)',
    emoji: '🦸‍♂️',
  },
  {
    id: 'beatboxing',
    title: 'Beatboxing Championship',
    desc: 'Show off your vocal percussion skills in this ultimate showdown.',
    category: 'Music',
    day: '08', month: 'JUN',
    venue: 'Mini Auditorium',
    time: '02:00 PM – 05:00 PM',
    img: null,
    gradient: 'linear-gradient(135deg,#422006 0%,#b45309 50%,#92400e 100%)',
    emoji: '🎤',
  },
  {
    id: 'heritage-walk',
    title: 'Cultural Heritage Walk',
    desc: 'Experience the rich history and traditions of different cultures.',
    category: 'Fest',
    day: '13', month: 'JUN',
    venue: 'College Campus',
    time: '08:00 AM – 12:00 PM',
    img: null,
    gradient: 'linear-gradient(135deg,#3d1a00 0%,#d97706 50%,#b45309 100%)',
    emoji: '🏛️',
  },
  {
    id: 'folk-arts',
    title: 'Traditional Folk Arts',
    desc: 'Exhibition of rare traditional crafts and handloom artifacts.',
    category: 'Art',
    day: '17', month: 'JUN',
    venue: 'Gallery Hall',
    time: '10:00 AM – 05:00 PM',
    img: null,
    gradient: 'linear-gradient(135deg,#4a1942 0%,#e11d48 50%,#be185d 100%)',
    emoji: '🏺',
  },
  {
    id: 'avant-garde-fashion',
    title: 'Avant-Garde Fashion Show',
    desc: 'Witness futuristic and experimental fashion designs on the ramp.',
    category: 'Fashion',
    day: '21', month: 'JUN',
    venue: 'Main Stage',
    time: '06:00 PM – 09:00 PM',
    img: null,
    gradient: 'linear-gradient(135deg,#500724 0%,#db2777 50%,#9d174d 100%)',
    emoji: '👗',
  },
  {
    id: 'improv-comedy',
    title: 'Improv Comedy Night',
    desc: 'Spontaneous acts and hilarious skits by the theatre club.',
    category: 'Theatre',
    day: '26', month: 'JUN',
    venue: 'Auditorium',
    time: '05:00 PM – 08:00 PM',
    img: null,
    gradient: 'linear-gradient(135deg,#411d00 0%,#ea580c 50%,#c2410c 100%)',
    emoji: '🤣',
  },
]

const DATE_OPTIONS = ['All Dates', 'May 2025', 'June 2025']
const SORT_OPTIONS  = ['Default', 'Date (Asc)', 'Date (Desc)', 'Name (A–Z)']
const CAT_OPTIONS   = ['All', 'Dance', 'Fest', 'Music', 'Theatre', 'Art', 'Fashion']

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
const ACCENT = { text: '#f97316', bg: '#ffedd5', border: '#fdba74' }

export default function CulturalEventsPage({ onNavigateToEvent }) {
  const [search,   setSearch]   = useState('')
  const [dateFilter, setDate]   = useState('All Dates')
  const [catFilter,  setCat]    = useState('All')
  const [sortBy,   setSort]     = useState('Default')
  const [openDrop, setOpenDrop] = useState(null)
  const [events, setEvents]     = useState(culturalEvents)

  useEffect(() => {
    fetch(`${API_BASE_URL}/events?category=cultural`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.events && data.events.length > 0) {
          setEvents(data.events)
        }
      })
      .catch(err => console.error("Error fetching cultural events:", err))
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
        <img src="/cultural_hero.png" alt="Cultural Events" className="ep-hero-bg" />
        <div className="ep-hero-overlay" style={{ background: 'linear-gradient(90deg,rgba(60,10,0,0.88) 0%,rgba(120,40,0,0.55) 55%,rgba(120,40,0,0.1) 100%)' }} />
        <div className="ep-hero-content">
          <h1 className="ep-hero-title">Cultural Events</h1>
          <p className="ep-hero-subtitle">
            Celebrate art, music, dance and drama through<br />
            vibrant cultural performances and competitions.
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
            <input className="ep-search" placeholder="Search cultural events..." value={search} onChange={e => setSearch(e.target.value)} />
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
