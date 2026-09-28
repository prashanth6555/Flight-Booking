import { motion } from 'framer-motion'

const ROWS = 12
const LEFT = ['A', 'B', 'C']
const RIGHT = ['D', 'E', 'F']
const TAKEN = new Set(['1A', '1F', '3C', '4D', '6B', '7E', '9A', '10C', '11F', '2D'])

export default function SeatSelection({ count, selected, setSelected, onBack, onNext }) {
  const toggle = (id) => {
    if (TAKEN.has(id)) return
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id))
      return
    }
    if (selected.length >= count) {
      setSelected([...selected.slice(1), id])
      return
    }
    setSelected([...selected, id])
  }

  return (
    <div className="page">
      <button className="back" type="button" onClick={onBack}>
        ← Passenger details
      </button>
      <div className="page-head">
        <div>
          <h2>Select seats</h2>
          <p className="muted">
            Choose {count} seat{count > 1 ? 's' : ''}. Selected: {selected.join(', ') || 'none'}
          </p>
        </div>
      </div>
      <div className="seat-legend">
        <span>Available</span>
        <span style={{ color: '#4cc3ff' }}>Selected</span>
        <span style={{ color: '#fb7185' }}>Taken</span>
      </div>
      <motion.div
        className="cabin-map"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
      >
        {Array.from({ length: ROWS }, (_, r) => {
          const row = r + 1
          return (
            <div className="seat-row" key={row}>
              <span className="muted">{row}</span>
              {LEFT.map((col) => (
                <Seat key={col} id={`${row}${col}`} selected={selected} taken={TAKEN.has(`${row}${col}`)} onToggle={toggle} />
              ))}
              <span />
              {RIGHT.map((col) => (
                <Seat key={col} id={`${row}${col}`} selected={selected} taken={TAKEN.has(`${row}${col}`)} onToggle={toggle} />
              ))}
            </div>
          )
        })}
      </motion.div>
      <div className="actions">
        <button type="button" className="primary" disabled={selected.length !== count} onClick={onNext}>
          Continue to payment
        </button>
      </div>
    </div>
  )
}

function Seat({ id, selected, taken, onToggle }) {
  const isSel = selected.includes(id)
  return (
    <motion.button
      type="button"
      className={`seat ${isSel ? 'selected' : ''} ${taken ? 'taken' : ''}`}
      disabled={taken}
      onClick={() => onToggle(id)}
      whileHover={taken ? {} : { scale: 1.16, y: -3 }}
      animate={isSel ? { scale: 1.16 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
    >
      {id.replace(/^\d+/, '')}
    </motion.button>
  )
}
