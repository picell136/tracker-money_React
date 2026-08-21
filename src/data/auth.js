const USERS_KEY = 'authUsers'
const SESSION_KEY = 'authSession'

const hashPassword = async (login, password) => {
  const data = new TextEncoder().encode(`${login.toLowerCase()}:${password}`)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

const readUsers = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const getSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY))
    return session?.login ? { login: session.login } : null
  } catch {
    return null
  }
}

export const setSession = (login) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ login }))
}

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY)
}

export const registerUser = async (login, password) => {
  const trimmedLogin = login.trim()
  if (!trimmedLogin || !password) {
    return { ok: false, error: 'Введите логин и пароль' }
  }
  if (trimmedLogin.length < 3) {
    return { ok: false, error: 'Логин должен быть не короче 3 символов' }
  }
  if (password.length < 4) {
    return { ok: false, error: 'Пароль должен быть не короче 4 символов' }
  }

  const users = readUsers()
  const exists = users.some((user) => user.login.toLowerCase() === trimmedLogin.toLowerCase())
  if (exists) {
    return { ok: false, error: 'Такой логин уже занят' }
  }

  const passwordHash = await hashPassword(trimmedLogin, password)
  writeUsers([...users, { login: trimmedLogin, passwordHash }])
  setSession(trimmedLogin)
  return { ok: true, user: { login: trimmedLogin } }
}

export const loginUser = async (login, password) => {
  const trimmedLogin = login.trim()
  if (!trimmedLogin || !password) {
    return { ok: false, error: 'Введите логин и пароль' }
  }

  const users = readUsers()
  const user = users.find((item) => item.login.toLowerCase() === trimmedLogin.toLowerCase())
  if (!user) {
    return { ok: false, error: 'Пользователь не найден. Зарегистрируйтесь' }
  }

  const passwordHash = await hashPassword(user.login, password)
  if (passwordHash !== user.passwordHash) {
    return { ok: false, error: 'Неверный логин или пароль' }
  }

  setSession(user.login)
  return { ok: true, user: { login: user.login } }
}
