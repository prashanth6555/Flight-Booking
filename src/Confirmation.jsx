import { motion } from 'framer-motion'
import { cityByCode } from './data'

const COLORS = ['#4cc3ff', '#f0c14b', '#34d399', '#a78bfa', '#fb7185', '#fff']

export default function Confirmation({ booking, onHome }) {
  const { flight, query, passengers, seats, payment, pnr } = booking
  const from = cityByCode(flight.from)
  const to = cityByCode(flight.to)

  return (
    <div className="page" style={{ position: 'relative', overflow: 'hidden' }}>
      {COLORS.map((c, i) => (
        <motion.span
          key={c}
          className="confetti"
          style={{ left: `${18 + i * 12}%`, top: 40, background: c }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ y: [0, 160, 220], opacity: [1, 1, 0], rotate: 220 }}
          transition={{ duration: 1.4, delay: i * 0.08, ease: 'easeOut' }}
        />
      ))}
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
        initial={{ opacity: 0, y: 36, rotateX: -12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.25, duration: 0.55, type: 'spring' }}
        whileHover={{ y: -4 }}
      >
        <div className="route">
          <div>
            <strong>{from?.city}</strong>
            <div className="muted">{flight.from} · {flight.dep}</div>
          </div>
          <div className="route-line">
            <span className="route-plane">✈</span>
          </div>
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
        <motion.button type="button" className="primary" onClick={onHome} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          Book another flight
        </motion.button>
      </div>
    </div>
  )
}
