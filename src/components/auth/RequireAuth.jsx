import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export const RequireAuth = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export const GuestOnly = ({ children }) => {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}
