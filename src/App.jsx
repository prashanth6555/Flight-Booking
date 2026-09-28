import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SearchSection from './SearchSection.jsx'
import FlightResults from './FlightResults.jsx'
import FlightDetails from './FlightDetails.jsx'
import PassengerForm from './PassengerForm.jsx'
import SeatSelection from './SeatSelection.jsx'
import Payment from './Payment.jsx'
import Confirmation from './Confirmation.jsx'
import { searchFlights } from './data.js'
import './App.css'

const STEPS = ['Search', 'Flights', 'Passengers', 'Seats', 'Pay', 'Done']

export default function App() {
  const [view, setView] = useState('search')
  const [query, setQuery] = useState(null)
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ maxPrice: 2500, airlines: [], slot: 'any' })
  const [sort, setSort] = useState('price')
  const [details, setDetails] = useState(null)
  const [flight, setFlight] = useState(null)
  const [passengers, setPassengers] = useState(null)
  const [seats, setSeats] = useState([])
  const [booking, setBooking] = useState(null)

  const stepIndex = { search: 0, results: 1, passengers: 2, seats: 3, payment: 4, done: 5 }[view]

  const runSearch = (q) => {
    setQuery(q)
    setFilters({ maxPrice: 2500, airlines: [], slot: 'any' })
    setSort('price')
    setView('results')
    setLoading(true)
    setFlights([])
    window.setTimeout(() => {
      setFlights(searchFlights(q))
      setLoading(false)
    }, 900)
  }

  const chooseFlight = (f) => {
    setFlight(f)
    setSeats([])
    setView('passengers')
    setDetails(null)
  }

  const finishPay = (payment) => {
    setBooking({
      flight,
      query,
      passengers,
      seats,
      payment,
      pnr: `AE${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    })
    setView('done')
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">✈</span>
          Aether Air
        </div>
        <nav className="stepper">
          {STEPS.map((s, i) => (
            <span key={s} className={`step-chip ${i === stepIndex ? 'active' : ''} ${i < stepIndex ? 'done' : ''}`}>
              {s}
            </span>
          ))}
        </nav>
        <div className="top-meta">Demo booking · no payment charged</div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={view}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
        >
          {view === 'search' && <SearchSection onSearch={runSearch} />}
          {view === 'results' && (
            <FlightResults
              query={query}
              flights={flights}
              loading={loading}
              filters={filters}
              setFilters={setFilters}
              sort={sort}
              setSort={setSort}
              onBack={() => setView('search')}
              onSelect={chooseFlight}
              onDetails={setDetails}
            />
          )}
          {view === 'passengers' && (
            <PassengerForm
              count={query.passengers}
              onBack={() => setView('results')}
              onNext={(p) => {
                setPassengers(p)
                setView('seats')
              }}
            />
          )}
          {view === 'seats' && (
            <SeatSelection
              count={query.passengers}
              selected={seats}
              setSelected={setSeats}
              onBack={() => setView('passengers')}
              onNext={() => setView('payment')}
            />
          )}
          {view === 'payment' && (
            <Payment
              total={flight.price * query.passengers}
              onBack={() => setView('seats')}
              onPay={finishPay}
            />
          )}
          {view === 'done' && (
            <Confirmation
              booking={booking}
              onHome={() => {
                setView('search')
                setBooking(null)
                setFlight(null)
              }}
            />
          )}
        </motion.main>
      </AnimatePresence>

      {details && (
        <FlightDetails flight={details} onClose={() => setDetails(null)} onBook={chooseFlight} />
      )}
    </div>
  )
}
