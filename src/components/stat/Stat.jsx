import React, { useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { ArrowLeft, TrendingUp, PieChart, Download } from 'lucide-react'
import { getCategoryMeta } from '../../data/categories'
import styles from "../../styles/Stat.module.css"

const Stat = () => {
  const today = new Date()
  
  const [selectedPeriod, setSelectedPeriod] = useState('custom')
  
  const [startDay, setStartDay] = useState(today.getDate())
  const [startMonth, setStartMonth] = useState(today.getMonth())
  const [startYear, setStartYear] = useState(today.getFullYear())
  
  const [endDay, setEndDay] = useState(today.getDate())
  const [endMonth, setEndMonth] = useState(today.getMonth())
  const [endYear, setEndYear] = useState(today.getFullYear())

  const [listPurchases] = useState(() => {
    const saved = localStorage.getItem('purchases')
    return saved ? JSON.parse(saved) : []
  })

  const monthOptions = [
    { value: '0', text: 'января' }, { value: '1', text: 'февраля' },
    { value: '2', text: 'марта' }, { value: '3', text: 'апреля' },
    { value: '4', text: 'мая' }, { value: '5', text: 'июня' },
    { value: '6', text: 'июля' }, { value: '7', text: 'августа' },
    { value: '8', text: 'сентября' }, { value: '9', text: 'октября' },
    { value: '10', text: 'ноября' }, { value: '11', text: 'декабря' }
  ]

  const yearOptions = Array.from({ length: 11 }, (_, i) => 2020 + i).map(y => ({
    value: String(y), text: String(y)
  }))

  // Динамическое получение дней в месяце (исправленный баг!)
  const getDaysInMonth = (year, month) => {
    return new Date(year, Number(month) + 1, 0).getDate()
  }

  const getDaysArray = (year, month) => {
    const daysCount = getDaysInMonth(year, month)
    return Array.from({ length: daysCount }, (_, i) => i + 1)
  }

  // Обработка быстрого выбора периода
  const handlePeriodChange = (e) => {
    const period = e.target.value
    setSelectedPeriod(period)
    
    const end = new Date()
    const start = new Date()

    if (period === 'День') {
      // Оставляем текущую дату
    } else if (period === 'Неделя') {
      start.setDate(start.getDate() - 7)
    } else if (period === 'Месяц') {
      start.setMonth(start.getMonth() - 1)
    } else if (period === 'Год') {
      start.setFullYear(start.getFullYear() - 1)
    }

    if (period !== 'custom') {
      setStartDay(start.getDate())
      setStartMonth(start.getMonth())
      setStartYear(start.getFullYear())
      setEndDay(end.getDate())
      setEndMonth(end.getMonth())
      setEndYear(end.getFullYear())
    }
  }

  const getDatesInRange = (startDate, endDate) => {
    const dates = []
    const curr = new Date(startDate)
    while (curr <= endDate) {
      dates.push(`${curr.getDate()}-${curr.getMonth()}-${curr.getFullYear()}`)
      curr.setDate(curr.getDate() + 1)
    }
    return dates
  }

  const stats = useMemo(() => {
    const d1 = new Date(startYear, startMonth, startDay)
    const d2 = new Date(endYear, endMonth, endDay, 23, 59, 59)
    
    if (d1 > d2) return { total: 0, byCategory: [], count: 0, purchases: [] }

    const targetDates = getDatesInRange(d1, d2)
    
    let total = 0
    const byCategory = {}
    let count = 0
    const purchases = []

    listPurchases.forEach(purchase => {
      if (targetDates.includes(purchase.date)) {
        const cost = Number(purchase.costValue)
        total += cost
        count += 1
        purchases.push(purchase)
        
        if (!byCategory[purchase.categoriesName]) {
          byCategory[purchase.categoriesName] = 0
        }
        byCategory[purchase.categoriesName] += cost
      }
    })

    // Сортируем категории по убыванию суммы
    const sortedCategories = Object.entries(byCategory)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)

    return { total, byCategory: sortedCategories, count, purchases }
  }, [listPurchases, startDay, startMonth, startYear, endDay, endMonth, endYear])

  const formatPurchaseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-')
    return `${String(day).padStart(2, '0')}.${String(Number(month) + 1).padStart(2, '0')}.${year}`
  }

  const csvCell = (value) => {
    const text = String(value ?? '')
    if (/[;"\n\r]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`
    }
    return text
  }

  const periodLabel = `${String(startDay).padStart(2, '0')}.${String(Number(startMonth) + 1).padStart(2, '0')}.${startYear}-${String(endDay).padStart(2, '0')}.${String(Number(endMonth) + 1).padStart(2, '0')}.${endYear}`

  const exportToCsv = () => {
    if (stats.count === 0) return

    const rows = [
      ['Дата', 'Название', 'Категория', 'Сумма'].map(csvCell).join(';'),
      ...stats.purchases.map((purchase) =>
        [
          formatPurchaseDate(purchase.date),
          purchase.purchaseName,
          purchase.categoriesName,
          purchase.costValue
        ].map(csvCell).join(';')
      ),
      '',
      ['Итого по категориям'].map(csvCell).join(';'),
      ['Категория', 'Сумма', 'Доля, %'].map(csvCell).join(';'),
      ...stats.byCategory.map((cat) =>
        [
          cat.name,
          cat.amount,
          Math.round((cat.amount / stats.total) * 100)
        ].map(csvCell).join(';')
      ),
      '',
      ['Всего покупок', stats.count].map(csvCell).join(';'),
      ['Итого, ₽', stats.total].map(csvCell).join(';')
    ]

    const blob = new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `statistika_${periodLabel}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        {/* Шапка */}
        <div className={styles.header}>
          <NavLink to="/" className={styles.backButton}>
            <ArrowLeft size={24} />
          </NavLink>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>📊</div>
            <h2>Статистика</h2>
          </div>
        </div>

        {/* Выбор периода */}
        <div className={styles.periodSection}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Быстрый выбор:</label>
            <select 
              className={styles.select}
              value={selectedPeriod} 
              onChange={handlePeriodChange}
            >
              <option value="custom">Свой период</option>
              <option value="День">Сегодня</option>
              <option value="Неделя">Последняя неделя</option>
              <option value="Месяц">Последний месяц</option>
              <option value="Год">Последний год</option>
            </select>
          </div>

          <div className={styles.dateRange}>
            <div className={styles.dateRow}>
              <span className={styles.dateLabel}>От:</span>
              <select className={styles.dateSelect} value={startDay} onChange={e => setStartDay(Number(e.target.value))}>
                {getDaysArray(startYear, startMonth).map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <select className={styles.dateSelect} value={startMonth} onChange={e => setStartMonth(Number(e.target.value))}>
                {monthOptions.map(m => <option key={m.value} value={m.value}>{m.text}</option>)}
              </select>
              <select className={styles.dateSelect} value={startYear} onChange={e => setStartYear(Number(e.target.value))}>
                {yearOptions.map(y => <option key={y.value} value={y.value}>{y.text}</option>)}
              </select>
            </div>

            <div className={styles.dateRow}>
              <span className={styles.dateLabel}>До:</span>
              <select className={styles.dateSelect} value={endDay} onChange={e => setEndDay(Number(e.target.value))}>
                {getDaysArray(endYear, endMonth).map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <select className={styles.dateSelect} value={endMonth} onChange={e => setEndMonth(Number(e.target.value))}>
                {monthOptions.map(m => <option key={m.value} value={m.value}>{m.text}</option>)}
              </select>
              <select className={styles.dateSelect} value={endYear} onChange={e => setEndYear(Number(e.target.value))}>
                {yearOptions.map(y => <option key={y.value} value={y.value}>{y.text}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button
          type="button"
          className={styles.exportBtn}
          onClick={exportToCsv}
          disabled={stats.count === 0}
        >
          <Download size={18} />
          Выгрузить в CSV
        </button>

        {/* Результаты */}
        <div className={styles.resultsSection}>
          <div className={styles.totalCard}>
            <div className={styles.totalIcon}><TrendingUp size={32} /></div>
            <div className={styles.totalInfo}>
              <span className={styles.totalLabel}>Расходы за период:</span>
              <span className={styles.totalAmount}>{stats.total.toLocaleString()} ₽</span>
              <span className={styles.totalSublabel}>{stats.count} покупок</span>
            </div>
          </div>

          {stats.byCategory.length > 0 ? (
            <div className={styles.categoriesSection}>
              <h3 className={styles.sectionTitle}>
                <PieChart size={20} /> По категориям
              </h3>
              <div className={styles.categoriesList}>
                {stats.byCategory.map((cat, index) => {
                  const percentage = Math.round((cat.amount / stats.total) * 100)
                  const meta = getCategoryMeta(cat.name)
                  return (
                    <div key={index} className={styles.categoryItem}>
                      <div className={styles.categoryHeader}>
                        <span className={styles.categoryName}>
                          <span className={styles.categoryIcon} style={{ background: meta.color }}>{meta.emoji}</span>
                          {cat.name}
                        </span>
                        <span className={styles.categoryPercent}>{percentage}%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ 
                            width: `${percentage}%`,
                            background: meta.color
                          }}
                        />
                      </div>
                      <div className={styles.categoryAmount}>{cat.amount.toLocaleString()} ₽</div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyEmoji}>📭</div>
              <div>Нет данных за выбранный период</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Stat