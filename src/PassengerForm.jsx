import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const STEPS = ['Contact', 'Travelers', 'Preferences']

export default function PassengerForm({ count, onBack, onNext }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    email: '',
    phone: '',
    travelers: Array.from({ length: count }, () => ({ first: '', last: '', dob: '' })),
    meal: 'Standard',
    notes: '',
  })
  const [errors, setErrors] = useState({})

  const set = (patch) => setData((d) => ({ ...d, ...patch }))

  const validate = () => {
    const e = {}
    if (step === 0) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email'
      if (data.phone.replace(/\D/g, '').length < 8) e.phone = 'Enter a valid phone'
    }
    if (step === 1) {
      data.travelers.forEach((t, i) => {
        if (!t.first.trim()) e[`first${i}`] = 'Required'
        if (!t.last.trim()) e[`last${i}`] = 'Required'
        if (!t.dob) e[`dob${i}`] = 'Required'
      })
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate()) return
    if (step < 2) setStep(step + 1)
    else onNext(data)
  }

  return (
    <div className="page">
      <button className="back" type="button" onClick={onBack}>
        ← Back to flights
      </button>
      <div className="page-head">
        <h2>Passenger details</h2>
      </div>
      <div className="progress">
        {STEPS.map((label, i) => (
          <span key={label} title={label}>
            <motion.i
              animate={{ width: i <= step ? '100%' : '0%' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
        ))}
      </div>
      <p className="muted" style={{ marginBottom: 16 }}>
        Step {step + 1} of 3 — {STEPS[step]}
      </p>

      <div className="panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
          >
            {step === 0 && (
              <div className="form-grid">
                <Input
                  className="full"
                  label="Email"
                  value={data.email}
                  error={errors.email}
                  valid={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)}
                  onChange={(v) => set({ email: v })}
                />
                <Input
                  className="full"
                  label="Phone"
                  value={data.phone}
                  error={errors.phone}
                  valid={data.phone.replace(/\D/g, '').length >= 8}
                  onChange={(v) => set({ phone: v })}
                />
              </div>
            )}
            {step === 1 && (
              <div style={{ display: 'grid', gap: 18 }}>
                {data.travelers.map((t, i) => (
                  <div key={i} className="form-grid">
                    <h3 className="full">Traveler {i + 1}</h3>
                    <Input
                      label="First name"
                      value={t.first}
                      error={errors[`first${i}`]}
                      valid={!!t.first.trim()}
                      onChange={(v) => {
                        const travelers = [...data.travelers]
                        travelers[i] = { ...t, first: v }
                        set({ travelers })
                      }}
                    />
                    <Input
                      label="Last name"
                      value={t.last}
                      error={errors[`last${i}`]}
                      valid={!!t.last.trim()}
                      onChange={(v) => {
                        const travelers = [...data.travelers]
                        travelers[i] = { ...t, last: v }
                        set({ travelers })
                      }}
                    />
                    <Input
                      label="Date of birth"
                      type="date"
                      value={t.dob}
                      error={errors[`dob${i}`]}
                      valid={!!t.dob}
                      onChange={(v) => {
                        const travelers = [...data.travelers]
                        travelers[i] = { ...t, dob: v }
                        set({ travelers })
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            {step === 2 && (
              <div className="form-grid">
                <div className="field full">
                  <label>Meal</label>
                  <select
                    className="dropdown-trigger"
                    value={data.meal}
                    onChange={(e) => set({ meal: e.target.value })}
                  >
                    {['Standard', 'Vegetarian', 'Vegan', 'Halal', 'Kosher'].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="field full">
                  <label>Notes</label>
                  <input value={data.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Optional" />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="actions">
          {step > 0 && (
            <button type="button" className="ghost" onClick={() => setStep(step - 1)}>
              Previous
            </button>
          )}
          <button type="button" className="primary" onClick={next}>
            {step === 2 ? 'Choose seats' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Input({ label, value, onChange, error, valid, type = 'text', className = '' }) {
  return (
    <div className={`field ${error ? 'error' : ''} ${className}`}>
      <label>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      <motion.span
        className="valid-dot"
        animate={{ background: valid ? '#34d399' : error ? '#fb7185' : 'transparent', scale: valid || error ? 1 : 0 }}
      />
      <AnimatePresence>
        {error && (
          <motion.div className="error-msg" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0 }}>
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
