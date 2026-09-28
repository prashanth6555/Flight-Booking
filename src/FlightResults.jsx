import { AnimatePresence, motion } from 'framer-motion'
import { AIRLINES, cityByCode } from './data'

export default function FlightResults({
  query,
  flights,
  loading,
  filters,
  setFilters,
  sort,
  setSort,
  onBack,
  onSelect,
  onDetails,
}) {
  const from = cityByCode(query.from)
  const to = cityByCode(query.to)

  const filtered = flights
    .filter((f) => f.price <= filters.maxPrice)
    .filter((f) => (filters.airlines.length ? filters.airlines.includes(f.airline.id) : true))
    .filter((f) => slotMatch(f.dep, filters.slot))
    .sort((a, b) => {
      if (sort === 'price') return a.price - b.price
      if (sort === 'duration') return parseInt(a.duration) - parseInt(b.duration)
      return a.dep.localeCompare(b.dep)
    })

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <button className="back" type="button" onClick={onBack}>
            ← Edit search
          </button>
          <h2>
            {from?.city} → {to?.city}
          </h2>
          <p className="muted">
            {query.date} · {query.passengers} traveler{query.passengers > 1 ? 's' : ''} · {query.cabin}
          </p>
        </div>
      </div>

      <div className="layout">
        <aside className="filters">
          <h3>Price up to ${filters.maxPrice}</h3>
          <input
            className="range"
            type="range"
            min="200"
            max="2500"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          />

          <h3>Airline</h3>
          <div className="chip-row">
            {AIRLINES.map((a) => {
              const on = filters.airlines.includes(a.id)
              return (
                <motion.button
                  key={a.id}
                  type="button"
                  className={`chip ${on ? 'on' : ''}`}
                  whileTap={{ scale: 0.94 }}
                  animate={{ scale: on ? 1.04 : 1 }}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      airlines: on ? filters.airlines.filter((id) => id !== a.id) : [...filters.airlines, a.id],
                    })
                  }
                >
                  {a.name}
                </motion.button>
              )
            })}
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
                type="button"
                className={`chip ${filters.slot === id ? 'on' : ''}`}
                whileTap={{ scale: 0.94 }}
                onClick={() => setFilters({ ...filters, slot: id })}
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
              ['depart', 'Earliest'],
              ['duration', 'Fastest'],
            ].map(([id, label]) => (
              <motion.button
                key={id}
                type="button"
                className={`chip ${sort === id ? 'on' : ''}`}
                layout
                onClick={() => setSort(id)}
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
            <motion.div className="results" layout>
              <AnimatePresence>
                {filtered.map((f) => (
                  <motion.article
                    layout
                    key={f.id}
                    className="flight-card"
                    initial={{ opacity: 0, y: 22, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  >
                    <div className="airline">
                      <span className="dot" style={{ background: f.airline.color }} />
                      <div>
                        <b>{f.airline.name}</b>
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
                        <div className="route-line">
                          <span className="route-plane">✈</span>
                        </div>
                      </div>
                      <div>
                        <strong>{f.arr}</strong>
                        <div className="muted">{f.to}</div>
                      </div>
                    </div>
                    <div className="price">
                      <b>${f.price}</b>
                      <div className="muted">per traveler</div>
                      <div className="actions" style={{ marginTop: 10 }}>
                        <button type="button" className="ghost" onClick={() => onDetails(f)}>
                          Details
                        </button>
                        <button type="button" className="primary" onClick={() => onSelect(f)}>
                          Select
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
              {!filtered.length && <p className="muted">No flights match those filters.</p>}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

function slotMatch(dep, slot) {
  if (slot === 'any') return true
  const h = Number(dep.split(':')[0])
  if (slot === 'morning') return h < 12
  if (slot === 'afternoon') return h >= 12 && h < 18
  return h >= 18
}
