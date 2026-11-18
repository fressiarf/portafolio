import { Link } from 'react-router-dom'

/** Interno: <Link> para rutas internas, <a target=_blank> para URLs externas, <div> si no hay destino. */
export function SmartLink({ to, children, ...rest }) {
  if (!to) return <div {...rest}>{children}</div>
  if (/^(https?:|mailto:|tel:)/.test(to)) {
    const external = /^https?:/.test(to)
    return (
      <a href={to} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} {...rest}>
      {children}
    </Link>
  )
}
