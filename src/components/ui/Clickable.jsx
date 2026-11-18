import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionLink = motion.create(Link)

/** Interno: <Link> animado si hay `to`; si no, <button> animado. */
export function Clickable({ to, onClick, children, ...rest }) {
  if (to) {
    return (
      <MotionLink to={to} onClick={onClick} {...rest}>
        {children}
      </MotionLink>
    )
  }
  return (
    <motion.button type="button" onClick={onClick} {...rest}>
      {children}
    </motion.button>
  )
}
