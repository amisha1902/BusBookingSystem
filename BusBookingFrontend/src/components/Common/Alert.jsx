import { useEffect } from 'react'

export default function Alert({ type = 'danger', message, onClose }) {
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  if (!message) return null

  return <div className={`alert alert-${type}`}>{message}</div>
}
