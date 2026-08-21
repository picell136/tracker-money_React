import { createContext, useContext, useMemo, useState } from 'react'
import { clearSession, getSession, loginUser, registerUser } from '../data/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getSession())

  const value = useMemo(() => ({
    user,
    login: async (login, password) => {
      const result = await loginUser(login, password)
      if (result.ok) setUser(result.user)
      return result
    },
    register: async (login, password) => {
      const result = await registerUser(login, password)
      if (result.ok) setUser(result.user)
      return result
    },
    logout: () => {
      clearSession()
      setUser(null)
    },
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
