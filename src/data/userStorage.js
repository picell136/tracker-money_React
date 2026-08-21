import { getSession } from './auth'

const MIGRATION_KEY = 'userDataMigrated'

export const storageKey = (baseKey) => {
  const login = getSession()?.login
  return login ? `${baseKey}:${login}` : baseKey
}

export const getUserItem = (baseKey) => {
  const login = getSession()?.login
  if (!login) {
    return localStorage.getItem(baseKey)
  }

  const scopedKey = `${baseKey}:${login}`
  const scoped = localStorage.getItem(scopedKey)
  if (scoped !== null) return scoped

  const migratedTo = localStorage.getItem(MIGRATION_KEY)
  if (migratedTo && migratedTo !== login) {
    return null
  }

  const global = localStorage.getItem(baseKey)
  if (global !== null) {
    localStorage.setItem(scopedKey, global)
    localStorage.setItem(MIGRATION_KEY, login)
    return global
  }

  return null
}

export const setUserItem = (baseKey, value) => {
  localStorage.setItem(storageKey(baseKey), value)
}
