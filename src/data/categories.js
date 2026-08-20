export const CATEGORIES = [
  { name: 'Еда', emoji: '🍔', color: '#ff8a65' },
  { name: 'Транспорт', emoji: '🚌', color: '#4fc3f7' },
  { name: 'Жильё', emoji: '🏠', color: '#81c784' },
  { name: 'Здоровье', emoji: '💊', color: '#ef5350' },
  { name: 'Одежда', emoji: '👕', color: '#ba68c8' },
  { name: 'Развлечения', emoji: '🎬', color: '#ffb74d' },
  { name: 'Образование', emoji: '📚', color: '#7986cb' },
  { name: 'Спорт', emoji: '⚽', color: '#66bb6a' },
  { name: 'Путешествия', emoji: '✈️', color: '#26c6da' },
  { name: 'Накопления', emoji: '💰', color: '#ffd54f' },
  { name: 'Подарки', emoji: '🎁', color: '#f06292' },
  { name: 'Прочее', emoji: '📦', color: '#90a4ae' },
]

const CUSTOM_KEY = 'customCategories'
const LEGACY_KEY = 'categories'

const normalizeCategory = (category) => {
  const name = String(category?.name || category?.categoriesName || '').trim()
  if (!name) return null

  return {
    name,
    emoji: category.emoji || '🏷️',
    color: category.color || '#636e72',
  }
}

export const loadCustomCategories = () => {
  const parseList = (raw) => {
    try {
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      return parsed.map(normalizeCategory).filter(Boolean)
    } catch {
      return []
    }
  }

  const saved = localStorage.getItem(CUSTOM_KEY)
  if (saved) {
    return parseList(saved).filter(
      (category) => !CATEGORIES.some((item) => item.name.toLowerCase() === category.name.toLowerCase())
    )
  }

  const legacy = localStorage.getItem(LEGACY_KEY)
  if (!legacy) return []

  const migrated = parseList(legacy).filter(
    (category) => !CATEGORIES.some((item) => item.name.toLowerCase() === category.name.toLowerCase())
  )
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(migrated))
  return migrated
}

export const saveCustomCategories = (categories) => {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(categories))
}

export const getAllCategories = (customCategories = loadCustomCategories()) => [
  ...CATEGORIES,
  ...customCategories,
]

export const getCategoryMeta = (name, customCategories = loadCustomCategories()) =>
  getAllCategories(customCategories).find((category) => category.name === name) || {
    name,
    emoji: '🏷️',
    color: '#636e72',
  }
