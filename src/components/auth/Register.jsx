import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from '../../styles/Auth.module.css'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Регистрация'
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault()
    if (password !== passwordRepeat) {
      setError('Пароли не совпадают')
      return
    }

    setIsSubmitting(true)
    setError('')

    const result = await register(loginValue, password)
    setIsSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.appTitle}>
          <div className={styles.icon}>💰</div>
          <h1>Журнал расходов</h1>
        </div>

        <div className={styles.card}>
          <h2 className={styles.formTitle}>Регистрация</h2>
          <p className={styles.subtitle}>Создайте аккаунт, чтобы вести учёт расходов</p>

        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.label}>
            Логин
            <input
              className={styles.input}
              type="text"
              autoComplete="username"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              placeholder="Придумайте логин"
            />
          </label>
          <label className={styles.label}>
            Пароль
            <input
              className={styles.input}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Придумайте пароль"
            />
          </label>
          <label className={styles.label}>
            Повторите пароль
            <input
              className={styles.input}
              type="password"
              autoComplete="new-password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              placeholder="Повторите пароль"
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Создаём...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className={styles.footer}>
          Уже есть аккаунт?{' '}
          <Link to="/login">Войти</Link>
        </p>
        </div>
      </div>
    </div>
  )
}

export default Register
