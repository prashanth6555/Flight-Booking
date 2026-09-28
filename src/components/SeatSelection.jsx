import { motion } from 'framer-motion'

const COLS = ['A', 'B', 'C', 'D', 'E', 'F']
const ROWS = Array.from({ length: 12 }, (_, i) => i + 8)

function takenSeats(flightId) {
  const set = new Set()
  const src = flightId || 'seed'
  for (let i = 0; i < 18; i++) {
    const r = ROWS[(src.charCodeAt(i % src.length) + i * 3) % ROWS.length]
    const c = COLS[(src.charCodeAt((i * 5) % src.length) + i) % COLS.length]
    set.add(`${r}${c}`)
  }
  return set
}

export default function SeatSelection({ query, selected, seats, setSeats, onBack, onNext }) {
  const taken = takenSeats(selected?.id)
  const needed = query.passengers

  function toggle(id) {
    if (taken.has(id)) return
    setSeats((cur) => {
      if (cur.includes(id)) return cur.filter((s) => s !== id)
      if (cur.length >= needed) return [...cur.slice(1), id]
      return [...cur, id]
    })
  }

  return (
    <section className="page">
      <button className="back" onClick={onBack}>
        ← Passengers
      </button>
      <div className="page-head">
        <div>
          <h2>Pick your seats</h2>
          <p className="muted">
            Select {needed} seat{needed > 1 ? 's' : ''} · {seats.length} chosen
          </p>
        </div>
      </div>

      <div className="cabin-map">
        <div className="seat-legend">
          <span>Available</span>
          <span style={{ color: 'var(--accent)' }}>Selected</span>
          <span style={{ color: 'var(--err)' }}>Taken</span>
        </div>
        {ROWS.map((row) => (
          <div className="seat-row" key={row}>
            <span className="muted">{row}</span>
            {COLS.slice(0, 3).map((c) => (
              <Seat key={c} id={`${row}${c}`} taken={taken.has(`${row}${c}`)} selected={seats.includes(`${row}${c}`)} onClick={toggle} />
            ))}
            <span />
            {COLS.slice(3).map((c) => (
              <Seat key={c} id={`${row}${c}`} taken={taken.has(`${row}${c}`)} selected={seats.includes(`${row}${c}`)} onClick={toggle} />
            ))}
          </div>
        ))}
      </div>

      <div className="actions">
        <button className="primary" disabled={seats.length !== needed} onClick={onNext}>
          Continue to payment
        </button>
      </div>
    </section>
  )
}

function Seat({ id, taken, selected, onClick }) {
  return (
    <motion.button
      className={`seat ${taken ? 'taken' : ''} ${selected ? 'selected' : ''}`}
      disabled={taken}
      onClick={() => onClick(id)}
      whileHover={taken ? {} : { scale: 1.12 }}
      animate={{ scale: selected ? 1.16 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 16 }}
    >
      {id.replace(/^\d+/, '')}
    </motion.button>
  )
}
