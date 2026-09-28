import { motion } from 'framer-motion'

const ORBS = [
  { className: 'orb orb-a' },
  { className: 'orb orb-b' },
  { className: 'orb orb-c' },
]

const STARS = Array.from({ length: 42 }, (_, i) => ({
  id: i,
  left: `${(i * 17) % 100}%`,
  top: `${(i * 29) % 70}%`,
  delay: (i % 8) * 0.35,
  size: 1 + (i % 3),
}))

export default function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden>
      {ORBS.map((o) => (
        <div key={o.className} className={o.className} />
      ))}
      {STARS.map((s) => (
        <motion.span
          key={s.id}
          className="star"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
          animate={{ opacity: [0.15, 0.9, 0.15], scale: [1, 1.6, 1] }}
          transition={{ duration: 2.8 + (s.id % 4), delay: s.delay, repeat: Infinity }}
        />
      ))}
      <div className="aurora" />
    </div>
  )
}
