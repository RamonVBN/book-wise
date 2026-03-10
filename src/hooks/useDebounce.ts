import { useEffect, useState } from "react"

export function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value.trim().replace(' ', '+'))
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}