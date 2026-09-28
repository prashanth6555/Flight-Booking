import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FlightDetails({ flight, onClose, onBook }) {
  const [open, setOpen] = useState({ fare: true, bag: false, amen: false })

  return (
    <>
      <motion.div
        className="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        className="drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      >
        <button className="back" onClick={onClose}>
          Close
        </button>
        <h2 style={{ margin: '12px 0 6px' }}>{flight.airline.name}</h2>
        <p className="muted">
          {flight.from} → {flight.to} · {flight.date}
        </p>
        <div className="panel" style={{ marginTop: 18 }}>
          <strong>
            {flight.dep} → {flight.arr}
          </strong>
          <div className="muted">
            {flight.duration} · Terminal {flight.terminal} · {flight.aircraft}
          </div>
        </div>

        <Section
          title="Fare rules"
          open={open.fare}
          onToggle={() => setOpen((o) => ({ ...o, fare: !o.fare }))}
        >
          Flexible date change with a fee. Name corrections allowed within 24 hours of booking.
        </Section>
        <Section
          title="Baggage"
          open={open.bag}
          onToggle={() => setOpen((o) => ({ ...o, bag: !o.bag }))}
        >
          Included: {flight.baggage}. Extra bags can be added at checkout.
        </Section>
        <Section
          title="Onboard"
          open={open.amen}
          onToggle={() => setOpen((o) => ({ ...o, amen: !o.amen }))}
        >
          {flight.amenities.join(' · ')}
        </Section>

        <div className="actions">
          <button className="ghost" onClick={onClose}>
            Keep browsing
          </button>
          <button className="primary" onClick={onBook}>
            Continue · ${flight.price}
          </button>
        </div>
      </motion.aside>
    </>
  )
}

function Section({ title, open, onToggle, children }) {
  return (
    <div className="expand">
      <button onClick={onToggle} style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <strong>{title}</strong>
        <motion.span animate={{ rotate: open ? 180 : 0 }}>▾</motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        style={{ overflow: 'hidden' }}
      >
        <p className="muted" style={{ padding: '10px 0 4px' }}>
          {children}
        </p>
      </motion.div>
    </div>
  )
}
