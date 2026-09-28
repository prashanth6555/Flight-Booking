import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CITIES } from '../data'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function SearchSection({ query, setQuery, cities, classes, onSearch }) {
  const [errors, setErrors] = useState({})
  const [fromOpen, setFromOpen] = useState(false)
  const [toOpen, setToOpen] = useState(false)
  const [calOpen, setCalOpen] = useState(false)
  const [paxOpen, setPaxOpen] = useState(false)
  const [swapSpin, setSwapSpin] = useState(0)
  const [calMonth, setCalMonth] = useState(() => {
    const d = query.date ? new Date(`${query.date}T00:00:00`) : new Date()
    return { y: d.getFullYear(), m: d.getMonth() }
  })
  const [fromFilter, setFromFilter] = useState('')
  const [toFilter, setToFilter] = useState('')

  const days = useMemo(() => {
    const first = new Date(calMonth.y, calMonth.m, 1)
    const start = first.getDay()
    const last = new Date(calMonth.y, calMonth.m + 1, 0).getDate()
    const prevLast = new Date(calMonth.y, calMonth.m, 0).getDate()
    const cells = []
    for (let i = 0; i < start; i++) {
      cells.push({ d: prevLast - start + 1 + i, muted: true, iso: '' })
    }
    for (let d = 1; d <= last; d++) {
      const iso = `${calMonth.y}-${pad(calMonth.m + 1)}-${pad(d)}`
      cells.push({ d, muted: false, iso })
    }
    while (cells.length % 7) cells.push({ d: cells.length, muted: true, iso: '' })
    return cells
  }, [calMonth])

  const fromCity = CITIES.find((c) => c.code === query.from)
  const toCity = CITIES.find((c) => c.code === query.to)

  function swap() {
    setSwapSpin((s) => s + 180)
    setQuery((q) => ({ ...q, from: q.to, to: q.from }))
  }

  function submit() {
    const next = {}
    if (!query.from) next.from = 'Choose a departure city'
    if (!query.to) next.to = 'Choose a destination'
    if (query.from && query.to && query.from === query.to) next.to = 'Destination must be different'
    if (!query.date) next.date = 'Pick a travel date'
    if (!query.passengers || query.passengers < 1) next.pax = 'Add at least one passenger'
    setErrors(next)
    if (Object.keys(next).length) return
    onSearch()
  }

  const monthLabel = new Date(calMonth.y, calMonth.m, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Fly farther, land softer.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Search fares, pick your seat, and confirm in a few fluid steps — built for a full-width,
            immersive booking experience.
          </motion.p>
        </div>
        <motion.svg
          className="plane-path"
          viewBox="0 0 560 220"
          fill="none"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 0.8, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.path
            d="M20 160 C 140 40, 280 40, 540 90"
            stroke="rgba(76,195,255,0.45)"
            strokeWidth="2"
            strokeDasharray="8 10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          />
          <motion.g
            initial={{ offsetDistance: '0%' }}
            animate={{ x: [0, 420], y: [50, -40] }}
            transition={{ duration: 3.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          >
            <text x="20" y="160" fontSize="28">
              ✈
            </text>
          </motion.g>
        </motion.svg>
        <div className="stats">
          {[
            ['120+', 'cities'],
            ['4.9', 'guest rating'],
            ['24/7', 'care'],
          ].map(([n, l]) => (
            <motion.div key={l} className="stat" whileHover={{ y: -4 }}>
              <strong>{n}</strong>
              <div className="muted">{l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="search-wrap">
        <motion.div
          className="search-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="search-grid">
            <div className={`field ${errors.from ? 'error' : ''}`}>
              <label>From</label>
              <button
                className={`dropdown-trigger ${fromOpen ? 'open' : ''}`}
                onClick={() => {
                  setFromOpen((v) => !v)
                  setToOpen(false)
                  setCalOpen(false)
                  setPaxOpen(false)
                }}
              >
                {fromCity ? `${fromCity.city} (${fromCity.code})` : 'Select city'}
              </button>
              <AnimatePresence>
                {fromOpen && (
                  <CityMenu
                    cities={cities}
                    filter={fromFilter}
                    setFilter={setFromFilter}
                    onPick={(code) => {
                      setQuery((q) => ({ ...q, from: code }))
                      setFromOpen(false)
                      setErrors((e) => ({ ...e, from: '' }))
                    }}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {errors.from && (
                  <motion.div className="error-msg" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
                    {errors.from}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              className="swap-btn"
              onClick={swap}
              animate={{ rotate: swapSpin }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              aria-label="Swap cities"
            >
              ⇄
            </motion.button>

            <div className={`field ${errors.to ? 'error' : ''}`}>
              <label>To</label>
              <button
                className={`dropdown-trigger ${toOpen ? 'open' : ''}`}
                onClick={() => {
                  setToOpen((v) => !v)
                  setFromOpen(false)
                  setCalOpen(false)
                  setPaxOpen(false)
                }}
              >
                {toCity ? `${toCity.city} (${toCity.code})` : 'Select city'}
              </button>
              <AnimatePresence>
                {toOpen && (
                  <CityMenu
                    cities={cities}
                    filter={toFilter}
                    setFilter={setToFilter}
                    onPick={(code) => {
                      setQuery((q) => ({ ...q, to: code }))
                      setToOpen(false)
                      setErrors((e) => ({ ...e, to: '' }))
                    }}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {errors.to && (
                  <motion.div className="error-msg" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
                    {errors.to}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={`field span-full ${errors.date ? 'error' : ''}`}>
              <label>Date</label>
              <button
                className={`dropdown-trigger ${calOpen ? 'open' : ''}`}
                onClick={() => {
                  setCalOpen((v) => !v)
                  setFromOpen(false)
                  setToOpen(false)
                  setPaxOpen(false)
                }}
              >
                {query.date ? formatDate(query.date) : 'Select date'}
              </button>
              <AnimatePresence>
                {calOpen && (
                  <motion.div
                    className="calendar"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8 }}
                  >
                    <div className="cal-head">
                      <button
                        onClick={() =>
                          setCalMonth((c) => {
                            const m = c.m - 1
                            return m < 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m }
                          })
                        }
                      >
                        ‹
                      </button>
                      <AnimatePresence mode="wait">
                        <motion.strong
                          key={monthLabel}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12 }}
                        >
                          {monthLabel}
                        </motion.strong>
                      </AnimatePresence>
                      <button
                        onClick={() =>
                          setCalMonth((c) => {
                            const m = c.m + 1
                            return m > 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m }
                          })
                        }
                      >
                        ›
                      </button>
                    </div>
                    <div className="cal-grid">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                      {days.map((cell, i) => (
                        <button
                          key={i}
                          className={`day ${cell.muted ? 'muted' : ''} ${cell.iso === query.date ? 'selected' : ''}`}
                          disabled={cell.muted || !cell.iso}
                          onClick={() => {
                            setQuery((q) => ({ ...q, date: cell.iso }))
                            setCalOpen(false)
                            setErrors((e) => ({ ...e, date: '' }))
                          }}
                        >
                          {cell.d}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {errors.date && (
                  <motion.div className="error-msg" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
                    {errors.date}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={`field span-full ${errors.pax ? 'error' : ''}`}>
              <label>Passengers & class</label>
              <button
                className={`dropdown-trigger ${paxOpen ? 'open' : ''}`}
                onClick={() => {
                  setPaxOpen((v) => !v)
                  setFromOpen(false)
                  setToOpen(false)
                  setCalOpen(false)
                }}
              >
                {query.passengers} traveller{query.passengers > 1 ? 's' : ''} · {query.cabin}
              </button>
              <AnimatePresence>
                {paxOpen && (
                  <motion.div
                    className="dropdown"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        Travellers
                        <div>
                          <button onClick={() => setQuery((q) => ({ ...q, passengers: Math.max(1, q.passengers - 1) }))}>−</button>
                          <strong style={{ margin: '0 10px' }}>{query.passengers}</strong>
                          <button onClick={() => setQuery((q) => ({ ...q, passengers: Math.min(9, q.passengers + 1) }))}>+</button>
                        </div>
                      </div>
                      {classes.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setQuery((q) => ({ ...q, cabin: c }))
                            setPaxOpen(false)
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {errors.pax && (
                  <motion.div className="error-msg" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
                    {errors.pax}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button className="search-btn span-full" whileTap={{ scale: 0.97 }} whileHover={{ y: -2 }} onClick={submit}>
              Search flights
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  )
}

function CityMenu({ cities, filter, setFilter, onPick }) {
  const list = cities.filter(
    (c) =>
      c.city.toLowerCase().includes(filter.toLowerCase()) ||
      c.code.toLowerCase().includes(filter.toLowerCase()),
  )
  return (
    <motion.div
      className="dropdown"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
    >
      <div style={{ padding: 8 }}>
        <input
          autoFocus
          placeholder="Search city or code"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: '100%', height: 40, borderRadius: 10, border: '1px solid var(--line)', background: '#071325', color: '#fff', padding: '0 10px' }}
        />
      </div>
      {list.map((c) => (
        <button key={c.code} className="city-row" onClick={() => onPick(c.code)}>
          <span>
            {c.city}
            <span className="muted"> · {c.country}</span>
          </span>
          <strong>{c.code}</strong>
        </button>
      ))}
    </motion.div>
  )
}
