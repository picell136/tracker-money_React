import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from '../../styles/Auth.module.css'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    document.title = 'Вход'
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    const result = await login(loginValue, password)
    setIsSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    navigate(from, { replace: true })
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.appTitle}>
          <div className={styles.icon}>💰</div>
          <h1>Журнал расходов</h1>
        </div>

        <div className={styles.card}>
          <h2 className={styles.formTitle}>Вход</h2>
          <p className={styles.subtitle}>Войдите, чтобы открыть журнал расходов</p>

        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.label}>
            Логин
            <input
              className={styles.input}
              type="text"
              autoComplete="username"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              placeholder="Ваш логин"
            />
          </label>
          <label className={styles.label}>
            Пароль
            <input
              className={styles.input}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ваш пароль"
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <p className={styles.footer}>
          Не зарегистрированы?{' '}
          <Link to="/register">Создать аккаунт</Link>
        </p>
        </div>
      </div>
    </div>
  )
}

export default Login
