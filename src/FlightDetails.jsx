import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

export default function FlightDetails({ flight, onClose, onBook }) {
  const [open, setOpen] = useState('itinerary')
  if (!flight) return null

  const sections = [
    ['itinerary', 'Itinerary', `${flight.dep} → ${flight.arr} · ${flight.duration}`],
    ['cabin', 'Cabin & bag', `${flight.cabin} · ${flight.baggage}`],
    ['amenities', 'Amenities', flight.amenities.join(' · ')],
    ['ops', 'Operations', `Terminal ${flight.terminal} · ${flight.aircraft}`],
  ]

  return (
    <AnimatePresence>
      <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.aside
        className="drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2>Flight details</h2>
          <button type="button" className="ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="muted">
          {flight.airline.name} · {flight.from} to {flight.to}
        </p>
        {sections.map(([id, title, summary]) => (
          <div key={id} className="expand">
            <button
              type="button"
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
              onClick={() => setOpen(open === id ? '' : id)}
            >
              <b>{title}</b>
              <motion.span animate={{ rotate: open === id ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
                ▾
              </motion.span>
            </button>
            <AnimatePresence>
              {open === id && (
                <motion.p
                  className="muted"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden', marginTop: 8 }}
                >
                  {summary}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
        <div className="actions">
          <button type="button" className="primary" onClick={() => onBook(flight)}>
            Continue · ${flight.price}
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
