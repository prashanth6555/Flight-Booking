import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CITIES, CLASSES } from './data'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function SearchSection({ onSearch }) {
  const [from, setFrom] = useState('DEL')
  const [to, setTo] = useState('DXB')
  const [date, setDate] = useState(todayISO())
  const [passengers, setPassengers] = useState(1)
  const [cabin, setCabin] = useState('Economy')
  const [errors, setErrors] = useState({})
  const [open, setOpen] = useState(null)
  const [swapSpin, setSwapSpin] = useState(0)
  const [fromQuery, setFromQuery] = useState('')
  const [toQuery, setToQuery] = useState('')
  const [calView, setCalView] = useState(() => new Date())

  const filterCities = (q) => {
    const s = q.trim().toLowerCase()
    if (!s) return CITIES
    return CITIES.filter(
      (c) =>
        c.city.toLowerCase().includes(s) ||
        c.code.toLowerCase().includes(s) ||
        c.country.toLowerCase().includes(s),
    )
  }

  const fromLabel = CITIES.find((c) => c.code === from)
  const toLabel = CITIES.find((c) => c.code === to)

  const swap = () => {
    setSwapSpin((n) => n + 180)
    setFrom(to)
    setTo(from)
    setFromQuery('')
    setToQuery('')
  }

  const validate = () => {
    const next = {}
    if (!from) next.from = 'Choose a departure city'
    if (!to) next.to = 'Choose a destination'
    if (from && to && from === to) next.to = 'Destination must be different'
    if (!date) next.date = 'Pick a travel date'
    if (date && date < todayISO()) next.date = 'Date cannot be in the past'
    if (passengers < 1) next.passengers = 'Add at least one passenger'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = () => {
    if (!validate()) return
    onSearch({ from, to, date, passengers, cabin })
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <motion.div
            className="hero-kicker"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✦ Premium global network
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Fly farther, land <span className="gold">softer</span>.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            Search global routes, pick your cabin, and complete booking in a few fluid steps.
          </motion.p>
        </div>
        <motion.svg
          className="plane-path"
          viewBox="0 0 520 220"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 0.75 }}
          transition={{ duration: 0.8 }}
        >
          <motion.path
            d="M20 160 C 140 40, 280 40, 500 90"
            fill="none"
            stroke="rgba(76,195,255,0.45)"
            strokeWidth="2"
            strokeDasharray="6 8"
            animate={{ strokeDashoffset: [0, -80] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          />
          <motion.g
            animate={{ offsetDistance: ['0%', '100%'] }}
            style={{ offsetPath: 'path("M20 160 C 140 40, 280 40, 500 90")' }}
          />
          <motion.text
            fontSize="28"
            animate={{ x: [40, 460], y: [150, 80] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          >
            ✈
          </motion.text>
        </motion.svg>
        <div className="stats">
          {[
            ['220+', 'destinations'],
            ['4.8', 'traveler rating'],
            ['35m', 'seats booked'],
          ].map(([n, l], i) => (
            <motion.div
              key={l}
              className="stat"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <strong>{n}</strong>
              <div className="muted">{l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="search-wrap">
        <motion.div className="search-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="search-grid">
            <Field
              label="From"
              error={errors.from}
              open={open === 'from'}
            >
              <input
                value={fromQuery || (fromLabel ? `${fromLabel.city} (${fromLabel.code})` : '')}
                onFocus={() => {
                  setOpen('from')
                  setFromQuery('')
                }}
                onChange={(e) => {
                  setFromQuery(e.target.value)
                  setOpen('from')
                }}
                placeholder="City or airport"
              />
              <CityMenu
                show={open === 'from'}
                cities={filterCities(fromQuery)}
                onPick={(c) => {
                  setFrom(c.code)
                  setFromQuery('')
                  setOpen(null)
                }}
              />
            </Field>

            <motion.button
              type="button"
              className="swap-btn"
              onClick={swap}
              animate={{ rotate: swapSpin }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              aria-label="Swap cities"
            >
              ⇄
            </motion.button>

            <Field label="To" error={errors.to} open={open === 'to'}>
              <input
                value={toQuery || (toLabel ? `${toLabel.city} (${toLabel.code})` : '')}
                onFocus={() => {
                  setOpen('to')
                  setToQuery('')
                }}
                onChange={(e) => {
                  setToQuery(e.target.value)
                  setOpen('to')
                }}
                placeholder="Where to?"
              />
              <CityMenu
                show={open === 'to'}
                cities={filterCities(toQuery)}
                onPick={(c) => {
                  setTo(c.code)
                  setToQuery('')
                  setOpen(null)
                }}
              />
            </Field>

            <Field label="Date" error={errors.date} className="span-full">
              <input
                readOnly
                value={date}
                onClick={() => setOpen(open === 'date' ? null : 'date')}
              />
              <AnimatePresence>
                {open === 'date' && (
                  <Calendar
                    view={calView}
                    selected={date}
                    onView={setCalView}
                    onSelect={(d) => {
                      setDate(d)
                      setOpen(null)
                    }}
                  />
                )}
              </AnimatePresence>
            </Field>

            <Field label="Travelers & class" error={errors.passengers} className="span-full">
              <button
                type="button"
                className={`dropdown-trigger ${open === 'pax' ? 'open' : ''}`}
                onClick={() => setOpen(open === 'pax' ? null : 'pax')}
              >
                {passengers} {passengers === 1 ? 'adult' : 'adults'} · {cabin}
              </button>
              <AnimatePresence>
                {open === 'pax' && (
                  <motion.div
                    className="dropdown"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div style={{ padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span>Passengers</span>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <button type="button" className="ghost" onClick={() => setPassengers((n) => Math.max(1, n - 1))}>
                            −
                          </button>
                          <b>{passengers}</b>
                          <button type="button" className="ghost" onClick={() => setPassengers((n) => Math.min(9, n + 1))}>
                            +
                          </button>
                        </div>
                      </div>
                      {CLASSES.map((c) => (
                        <button key={c} type="button" onClick={() => setCabin(c)}>
                          {c} {c === cabin ? '✓' : ''}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Field>

            <motion.button
              type="button"
              className="search-btn span-full"
              onClick={submit}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
            >
              Search flights
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  )
}

function Field({ label, error, children, className = '' }) {
  return (
    <div className={`field ${error ? 'error' : ''} ${className}`}>
      <label>{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-msg"
            initial={{ height: 0, opacity: 0, y: -6 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CityMenu({ show, cities, onPick }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="dropdown"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          {cities.map((c, i) => (
            <motion.button
              key={c.code}
              type="button"
              className="city-row"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onPick(c)}
            >
              <span>
                {c.city}, {c.country}
              </span>
              <b>{c.code}</b>
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Calendar({ view, selected, onView, onSelect }) {
  const year = view.getFullYear()
  const month = view.getMonth()
  const days = useMemo(() => {
    const first = new Date(year, month, 1)
    const start = first.getDay()
    const total = new Date(year, month + 1, 0).getDate()
    const prevTotal = new Date(year, month, 0).getDate()
    const cells = []
    for (let i = 0; i < 42; i++) {
      if (i < start) {
        const d = prevTotal - start + i + 1
        cells.push({ d, muted: true, iso: iso(year, month - 1, d) })
      } else if (i >= start + total) {
        const d = i - start - total + 1
        cells.push({ d, muted: true, iso: iso(year, month + 1, d) })
      } else {
        const d = i - start + 1
        cells.push({ d, muted: false, iso: iso(year, month, d) })
      }
    }
    return cells
  }, [year, month])

  return (
    <motion.div
      className="calendar"
      initial={{ opacity: 0, rotateX: -12, y: -8 }}
      animate={{ opacity: 1, rotateX: 0, y: 0 }}
      exit={{ opacity: 0, rotateX: 8 }}
    >
      <div className="cal-head">
        <button type="button" onClick={() => onView(new Date(year, month - 1, 1))}>
          ‹
        </button>
        <AnimatePresence mode="wait">
          <motion.b key={`${year}-${month}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
            {view.toLocaleString('en', { month: 'long', year: 'numeric' })}
          </motion.b>
        </AnimatePresence>
        <button type="button" onClick={() => onView(new Date(year, month + 1, 1))}>
          ›
        </button>
      </div>
      <div className="cal-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
        {days.map((cell, i) => (
          <button
            key={i}
            type="button"
            className={`day ${cell.muted ? 'muted' : ''} ${cell.iso === selected ? 'selected' : ''}`}
            onClick={() => onSelect(cell.iso)}
          >
            {cell.d}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function iso(year, month, day) {
  const d = new Date(year, month, day)
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const dayN = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dayN}`
}
