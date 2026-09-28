import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const STEPS = ['Contact', 'Traveller', 'Preferences']

export default function PassengerForm({ query, selected, passenger, setPassenger, onBack, onNext }) {
  const [index, setIndex] = useState(0)
  const [errors, setErrors] = useState({})

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }

  function next() {
    const e = {}
    if (index === 0) {
      if (!validEmail(passenger.email)) e.email = 'Enter a valid email'
      if (passenger.phone.replace(/\D/g, '').length < 8) e.phone = 'Enter a valid phone'
    }
    if (index === 1) {
      if (passenger.first.trim().length < 2) e.first = 'First name required'
      if (passenger.last.trim().length < 2) e.last = 'Last name required'
    }
    setErrors(e)
    if (Object.keys(e).length) return
    if (index < 2) setIndex((i) => i + 1)
    else onNext()
  }

  return (
    <section className="page">
      <button className="back" onClick={onBack}>
        ← Flights
      </button>
      <div className="page-head">
        <div>
          <h2>Passenger details</h2>
          <p className="muted">
            {selected?.airline.name} · {query.from} → {query.to} · ${selected?.price}
          </p>
        </div>
      </div>

      <div className="progress">
        {STEPS.map((s, i) => (
          <span key={s}>
            <motion.i
              initial={false}
              animate={{ width: i <= index ? '100%' : '0%' }}
              transition={{ duration: 0.4 }}
            />
          </span>
        ))}
      </div>
      <p className="muted" style={{ marginBottom: 16 }}>
        Step {index + 1} of 3 — {STEPS[index]}
      </p>

      <div className="panel">
        <AnimatePresence mode="wait">
          {index === 0 && (
            <motion.div
              key="c"
              className="form-grid"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
            >
              <Field
                className="full"
                label="Email"
                value={passenger.email}
                error={errors.email}
                ok={validEmail(passenger.email)}
                onChange={(v) => setPassenger((p) => ({ ...p, email: v }))}
              />
              <Field
                className="full"
                label="Phone"
                value={passenger.phone}
                error={errors.phone}
                ok={passenger.phone.replace(/\D/g, '').length >= 8}
                onChange={(v) => setPassenger((p) => ({ ...p, phone: v }))}
              />
            </motion.div>
          )}
          {index === 1 && (
            <motion.div
              key="t"
              className="form-grid"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
            >
              <Field
                label="First name"
                value={passenger.first}
                error={errors.first}
                ok={passenger.first.trim().length >= 2}
                onChange={(v) => setPassenger((p) => ({ ...p, first: v }))}
              />
              <Field
                label="Last name"
                value={passenger.last}
                error={errors.last}
                ok={passenger.last.trim().length >= 2}
                onChange={(v) => setPassenger((p) => ({ ...p, last: v }))}
              />
              <div className="field full">
                <label>Passenger type</label>
                <select
                  className="dropdown-trigger"
                  value={passenger.gender}
                  onChange={(e) => setPassenger((p) => ({ ...p, gender: e.target.value }))}
                >
                  <option>Adult</option>
                  <option>Child</option>
                  <option>Infant</option>
                </select>
              </div>
            </motion.div>
          )}
          {index === 2 && (
            <motion.div
              key="p"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
            >
              <p className="muted">We’ll match meal and assistance notes to your {query.cabin} cabin.</p>
              <div className="chip-row" style={{ marginTop: 14 }}>
                {['Standard meal', 'Vegetarian', 'Window seat preferred', 'Extra legroom'].map((x) => (
                  <span key={x} className="chip on">
                    {x}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="actions">
          {index > 0 && (
            <button className="ghost" onClick={() => setIndex((i) => i - 1)}>
              Back
            </button>
          )}
          <button className="primary" onClick={next}>
            {index === 2 ? 'Choose seats' : 'Continue'}
          </button>
        </div>
      </div>
    </section>
  )
}

function Field({ label, value, onChange, error, ok, className = '' }) {
  return (
    <div className={`field ${className} ${error ? 'error' : ''}`}>
      <label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
      <motion.span
        className="valid-dot"
        animate={{ background: ok ? 'var(--ok)' : error ? 'var(--err)' : 'transparent', scale: ok ? 1 : 0.4 }}
      />
      <AnimatePresence>
        {error && (
          <motion.div className="error-msg" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
