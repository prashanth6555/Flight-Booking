import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { AIRLINES, cityByCode, searchFlights } from '../data'

export default function FlightResults({ query, onBack, onSelect, onBook }) {
  const [loading, setLoading] = useState(true)
  const [price, setPrice] = useState(2000)
  const [airlines, setAirlines] = useState([])
  const [windowFilter, setWindowFilter] = useState('any')
  const [sort, setSort] = useState('price')

  const all = useMemo(() => searchFlights(query), [query])

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [query])

  const filtered = useMemo(() => {
    let list = all.filter((f) => f.price <= price)
    if (airlines.length) list = list.filter((f) => airlines.includes(f.airline.id))
    if (windowFilter !== 'any') {
      list = list.filter((f) => {
        const h = Number(f.dep.split(':')[0])
        if (windowFilter === 'morning') return h < 12
        if (windowFilter === 'afternoon') return h >= 12 && h < 18
        return h >= 18
      })
    }
    return [...list].sort((a, b) => {
      if (sort === 'price') return a.price - b.price
      if (sort === 'duration') return a.duration.localeCompare(b.duration)
      return a.dep.localeCompare(b.dep)
    })
  }, [all, price, airlines, windowFilter, sort])

  const from = cityByCode(query.from)
  const to = cityByCode(query.to)

  function toggleAirline(id) {
    setAirlines((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))
  }

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <button className="back" onClick={onBack}>
            ← Edit search
          </button>
          <h2>
            {from?.city} → {to?.city}
          </h2>
          <p className="muted">
            {query.date} · {query.passengers} traveller{query.passengers > 1 ? 's' : ''} · {query.cabin}
          </p>
        </div>
      </div>

      <div className="layout">
        <aside className="filters">
          <h3>Price up to ${price}</h3>
          <input
            className="range"
            type="range"
            min="200"
            max="2000"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <h3>Airline</h3>
          <div className="chip-row">
            {AIRLINES.map((a) => (
              <motion.button
                key={a.id}
                className={`chip ${airlines.includes(a.id) ? 'on' : ''}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleAirline(a.id)}
              >
                {a.name}
              </motion.button>
            ))}
          </div>
          <h3>Departure</h3>
          <div className="chip-row">
            {[
              ['any', 'Any time'],
              ['morning', 'Morning'],
              ['afternoon', 'Afternoon'],
              ['evening', 'Evening'],
            ].map(([id, label]) => (
              <motion.button
                key={id}
                className={`chip ${windowFilter === id ? 'on' : ''}`}
                layout
                onClick={() => setWindowFilter(id)}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </aside>

        <div>
          <div className="sort-row">
            {[
              ['price', 'Cheapest'],
              ['dep', 'Earliest'],
              ['duration', 'Duration'],
            ].map(([id, label]) => (
              <motion.button
                key={id}
                className={`chip ${sort === id ? 'on' : ''}`}
                onClick={() => setSort(id)}
                whileHover={{ y: -2 }}
              >
                {label}
              </motion.button>
            ))}
          </div>

          {loading ? (
            <div className="results">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton" />
              ))}
            </div>
          ) : (
            <LayoutGroup>
              <div className="results">
                <AnimatePresence>
                  {filtered.map((f) => (
                    <motion.article
                      layout
                      key={f.id}
                      className="flight-card"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                    >
                      <div className="airline">
                        <span className="dot" style={{ background: f.airline.color }} />
                        <div>
                          <strong>{f.airline.name}</strong>
                          <div className="muted">{f.aircraft}</div>
                        </div>
                      </div>
                      <div className="route">
                        <div>
                          <strong>{f.dep}</strong>
                          <div className="muted">{f.from}</div>
                        </div>
                        <div>
                          <div className="muted" style={{ textAlign: 'center' }}>
                            {f.duration} · {f.stops ? `${f.stops} stop` : 'Nonstop'}
                          </div>
                          <div className="route-line" />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <strong>{f.arr}</strong>
                          <div className="muted">{f.to}</div>
                        </div>
                      </div>
                      <div className="price">
                        <b>${f.price}</b>
                        <div className="muted">per traveller</div>
                        <div className="actions" style={{ marginTop: 10 }}>
                          <button className="ghost" onClick={() => onSelect(f)}>
                            Details
                          </button>
                          <button className="primary" onClick={() => onBook(f)}>
                            Select
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
                {!filtered.length && <p className="muted">No flights match those filters.</p>}
              </div>
            </LayoutGroup>
          )}
        </div>
      </div>
    </section>
  )
}
