import { Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import { GuestOnly, RequireAuth } from './components/auth/RequireAuth'
import Layout from './components/layout/Layout'
import Home from './components/home/Home'
import Categories from './components/categories/Categories'
import Stat from './components/stat/Stat'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import NotFound404 from './components/notFound404/NotFound404'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestOnly>
              <Login />
            </GuestOnly>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnly>
              <Register />
            </GuestOnly>
          }
        />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="stat" element={<Stat />} />
          <Route path="*" element={<NotFound404 />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
