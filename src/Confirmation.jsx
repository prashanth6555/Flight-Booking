import { motion } from 'framer-motion'
import { cityByCode } from './data'

export default function Confirmation({ booking, onHome }) {
  const { flight, query, passengers, seats, payment, pnr } = booking
  const from = cityByCode(flight.from)
  const to = cityByCode(flight.to)

  return (
    <div className="page">
      <div className="success">
        <motion.div
          className="success-ring"
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 12 }}
        >
          ✓
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          Booking confirmed
        </motion.h2>
        <p className="muted">PNR {pnr} · confirmation sent to {passengers.email}</p>
      </div>

      <motion.article
        className="ticket"
        initial={{ opacity: 0, y: 28, rotateX: -8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <div className="route">
          <div>
            <strong>{from?.city}</strong>
            <div className="muted">{flight.from} · {flight.dep}</div>
          </div>
          <div className="route-line" />
          <div>
            <strong>{to?.city}</strong>
            <div className="muted">{flight.to} · {flight.arr}</div>
          </div>
        </div>
        <div className="expand">
          <p>
            {flight.airline.name} · {query.date} · {flight.cabin}
          </p>
          <p className="muted">
            Seats {seats.join(', ')} · {payment.method} · ${flight.price * query.passengers}
          </p>
        </div>
      </motion.article>

      <div className="actions" style={{ justifyContent: 'center' }}>
        <button type="button" className="primary" onClick={onHome}>
          Book another flight
        </button>
      </div>
    </div>
  )
}
