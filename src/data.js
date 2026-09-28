export const CITIES = [
  { code: 'NYC', city: 'New York', country: 'USA' },
  { code: 'LON', city: 'London', country: 'UK' },
  { code: 'PAR', city: 'Paris', country: 'France' },
  { code: 'DXB', city: 'Dubai', country: 'UAE' },
  { code: 'DEL', city: 'Delhi', country: 'India' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore' },
  { code: 'TYO', city: 'Tokyo', country: 'Japan' },
  { code: 'SYD', city: 'Sydney', country: 'Australia' },
  { code: 'LAX', city: 'Los Angeles', country: 'USA' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand' },
  { code: 'IST', city: 'Istanbul', country: 'Turkey' },
]

export const AIRLINES = [
  { id: 'AA', name: 'Aether Air', color: '#3d8bfd' },
  { id: 'SK', name: 'Skyline', color: '#22c55e' },
  { id: 'NZ', name: 'Nimbus', color: '#a78bfa' },
  { id: 'OR', name: 'Horizon', color: '#f59e0b' },
]

export const CLASSES = ['Economy', 'Premium Economy', 'Business', 'First']

const TIMES = [
  ['06:15', '14:40'],
  ['08:30', '16:55'],
  ['11:05', '19:20'],
  ['14:45', '23:10'],
  ['18:20', '02:50'],
  ['21:40', '06:05'],
]

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function searchFlights({ from, to, date, cabin }) {
  if (!from || !to || from === to) return []
  const seed = hash(`${from}${to}${date}${cabin}`)
  const count = 5 + (seed % 3)
  const flights = []
  for (let i = 0; i < count; i++) {
    const airline = AIRLINES[(seed + i) % AIRLINES.length]
    const [dep, arr] = TIMES[(seed + i * 2) % TIMES.length]
    const durationH = 7 + ((seed + i) % 6)
    const durationM = ((seed + i * 3) % 50)
    const stops = (seed + i) % 3 === 0 ? 1 : 0
    const base = 280 + ((seed + i * 17) % 720)
    const cabinMult = { Economy: 1, 'Premium Economy': 1.45, Business: 2.4, First: 3.6 }[cabin] || 1
    flights.push({
      id: `${airline.id}-${from}${to}-${i}-${date}`,
      airline,
      from,
      to,
      date,
      dep,
      arr,
      duration: `${durationH}h ${durationM}m`,
      stops,
      cabin,
      price: Math.round(base * cabinMult),
      aircraft: ['A350-900', 'B787-9', 'A321neo', 'B777-300ER'][(seed + i) % 4],
      terminal: 1 + ((seed + i) % 3),
      baggage: cabin === 'Economy' ? '1 × 23kg' : '2 × 32kg',
      amenities: ['Wi-Fi', 'Meals', 'USB-C', cabin !== 'Economy' ? 'Lie-flat' : 'Entertainment'].filter(Boolean),
    })
  }
  return flights
}

export function cityByCode(code) {
  return CITIES.find((c) => c.code === code)
}
