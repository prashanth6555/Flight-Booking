import { motion } from 'framer-motion'
import { useState } from 'react'

const METHODS = ['Card', 'Wallet', 'Pay later']

export default function Payment({ total, onBack, onPay }) {
  const [method, setMethod] = useState('Card')
  const [flipped, setFlipped] = useState(false)
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' })
  const [error, setError] = useState('')

  const pay = () => {
    if (method === 'Card') {
      if (card.number.replace(/\s/g, '').length < 16) {
        setError('Enter a 16-digit card number')
        return
      }
      if (!card.name.trim() || !card.expiry || card.cvv.length < 3) {
        setError('Complete card details')
        return
      }
    }
    setError('')
    onPay({ method, card })
  }

  return (
    <div className="page">
      <button className="back" type="button" onClick={onBack}>
        ← Seats
      </button>
      <div className="page-head">
        <h2>Payment</h2>
        <b>${total}</b>
      </div>

      <div className="pay-methods">
        {METHODS.map((m) => (
          <motion.button
            key={m}
            type="button"
            className={`method ${method === m ? 'on' : ''}`}
            onClick={() => setMethod(m)}
            layout
            whileTap={{ scale: 0.96 }}
            animate={{ y: method === m ? -6 : 0, scale: method === m ? 1.04 : 1 }}
          >
            {m}
          </motion.button>
        ))}
      </div>

      {method === 'Card' && (
        <>
          <div className="card-scene" onMouseLeave={() => setFlipped(false)}>
            <motion.div className="card-flip" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.6 }}>
              <div className="card-face">
                <div className="muted">Aether Air Card</div>
                <div style={{ marginTop: 48, letterSpacing: 3, fontSize: 22 }}>
                  {card.number || '•••• •••• •••• ••••'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
                  <span>{card.name || 'CARDHOLDER'}</span>
                  <span>{card.expiry || 'MM/YY'}</span>
                </div>
              </div>
              <div className="card-face back">
                <div className="mag" />
                <div className="cvv-box">{card.cvv || 'CVV'}</div>
              </div>
            </motion.div>
          </div>
          <div className="panel form-grid">
            <div className="field full">
              <label>Name on card</label>
              <input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })} />
            </div>
            <div className="field full">
              <label>Card number</label>
              <input
                value={card.number}
                maxLength={19}
                onChange={(e) =>
                  setCard({
                    ...card,
                    number: e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 16)
                      .replace(/(.{4})/g, '$1 ')
                      .trim(),
                  })
                }
              />
            </div>
            <div className="field">
              <label>Expiry</label>
              <input placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
            </div>
            <div className="field">
              <label>CVV</label>
              <input
                value={card.cvv}
                maxLength={4}
                onFocus={() => setFlipped(true)}
                onBlur={() => setFlipped(false)}
                onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
              />
            </div>
          </div>
        </>
      )}

      {method !== 'Card' && (
        <div className="panel">
          <p className="muted">
            {method === 'Wallet' ? 'You will confirm in your wallet app after placing this booking.' : 'Pay within 24 hours to hold the fare.'}
          </p>
        </div>
      )}

      {error && <p className="error-msg">{error}</p>}
      <div className="actions">
        <motion.button type="button" className="primary" onClick={pay} whileTap={{ scale: 0.97 }}>
          Pay ${total}
        </motion.button>
      </div>
    </div>
  )
}
