import { useState } from 'react'

export const useAxios = () => {
  const [loading, setLoading] = useState(false)

  const execute = async (fn) => {
    setLoading(true)
    try {
      return await fn()
    } finally {
      setLoading(false)
    }
  }

  return { execute, loading }
}