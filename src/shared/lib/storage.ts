export const loadFromStorage = <T>(key: string): T | null => {
  try {
    const value = localStorage.getItem(key)

    return value ? (JSON.parse(value) as T) : null
  } catch {
    return null
  }
}

export const saveToStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage is unavailable (private mode or quota exceeded)
  }
}

export const removeFromStorage = (key: string) => {
  try {
    localStorage.removeItem(key)
  } catch {
    // Storage is unavailable (private mode or quota exceeded)
  }
}
