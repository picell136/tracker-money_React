import { useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Trash2, Edit2, Check, X } from 'lucide-react'
import styles from "../../styles/Home.module.css"

const Home = () => {
    const today = new Date()
    const [displayDay, setDisplayDay] = useState(today.getDate())
    const [displayMonth, setDisplayMonth] = useState(today.getMonth())
    const [displayYear, setDisplayYear] = useState(today.getFullYear())

    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [cost, setCost] = useState('')

    const [listPurchases, setListPurchases] = useState(() => {
        const saved = localStorage.getItem('purchases')
        return saved ? JSON.parse(saved) : []
    })

    const [listCategories] = useState(() => {
        const saved = localStorage.getItem('categories')
        return saved ? JSON.parse(saved) : []
    })

    // --- Логика дат ---
    const getLastDayofMonth = (year, month) => new Date(year, month + 1, 0).getDate()

    const prevDay = () => {
        if (displayDay === 1) {
            if (displayMonth === 0) {
                setDisplayYear(displayYear - 1)
                setDisplayMonth(11)
                setDisplayDay(getLastDayofMonth(displayYear - 1, 11))
            } else {
                setDisplayMonth(displayMonth - 1)
                setDisplayDay(getLastDayofMonth(displayYear, displayMonth - 1))
            }
        } else {
            setDisplayDay(displayDay - 1)
        }
    }

    const nextDay = () => {
        const lastDay = getLastDayofMonth(displayYear, displayMonth)
        if (displayDay === lastDay) {
            setDisplayDay(1)
            if (displayMonth === 11) {
                setDisplayMonth(0)
                setDisplayYear(displayYear + 1)
            } else {
                setDisplayMonth(displayMonth + 1)
            }
        } else {
            setDisplayDay(displayDay + 1)
        }
    }

    const convertMonths = (m) => {
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
        return months[m]
    }

    // --- Логика покупок ---
    const onSavePurchaseClick = () => {
        if (!name || !category || !cost) return

        const noteDate = `${displayDay}-${displayMonth}-${displayYear}`
        const newPurchase = {
            purchaseName: name,
            categoriesName: category,
            costValue: Number(cost),
            date: noteDate,
            creationTime: Date.now(),
            isEdit: false
        }

        const updatedList = [...listPurchases, newPurchase]
        setListPurchases(updatedList)
        localStorage.setItem('purchases', JSON.stringify(updatedList))
        
        setName('')
        setCategory('')
        setCost('')
    }

    const toggleIsEdit = (creationTime) => {
        const updatedList = listPurchases.map(p => 
            p.creationTime === creationTime ? { ...p, isEdit: !p.isEdit } : p
        )
        setListPurchases(updatedList)
        localStorage.setItem('purchases', JSON.stringify(updatedList))
    }

    const handleEditChange = (creationTime, field, newValue) => {
        const updatedList = listPurchases.map(p => 
            p.creationTime === creationTime ? { ...p, [field]: newValue } : p
        )
        setListPurchases(updatedList)
        localStorage.setItem('purchases', JSON.stringify(updatedList))
    }

    const deletePurchase = (creationTime) => {
        const updatedList = listPurchases.filter(p => p.creationTime !== creationTime)
        setListPurchases(updatedList)
        localStorage.setItem('purchases', JSON.stringify(updatedList))
    }

    const filtered = listPurchases.filter(p => p.date === `${displayDay}-${displayMonth}-${displayYear}`)
    
    const totalCost = useMemo(() => {
        return filtered.reduce((sum, item) => sum + Number(item.costValue), 0)
    }, [filtered])

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.card}>

                {/* Навигация по датам */}
                <div className={styles.dateNav}>
                    <button className={`${styles.navBtn} ${styles.prev}`} onClick={prevDay}>
                        <ChevronLeft size={24} />
                    </button>
                    <span className={styles.dateLabel}>
                        {displayDay} {convertMonths(displayMonth)} {displayYear}
                    </span>
                    <button className={`${styles.navBtn} ${styles.next}`} onClick={nextDay}>
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Вкладки */}
                <div className={styles.tabs}>
                    <NavLink to="/categories" className={({ isActive }) => `${styles.tabBtn} ${styles.tabCategories} ${isActive ? styles.active : ''}`}>
                        Категории
                    </NavLink>
                    <NavLink to="/stat" className={({ isActive }) => `${styles.tabBtn} ${styles.tabStats} ${isActive ? styles.active : ''}`}>
                        Статистика
                    </NavLink>
                </div>

                {/* Форма добавления */}
                <div className={styles.addForm}>
                    <div className={styles.formRow}>
                        <input
                            className={styles.formInput}
                            placeholder="Название покупки..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <select 
                            className={styles.formSelect} 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Выберите категорию</option>
                            {listCategories.map((cat, i) => (
                                <option key={i} value={cat.categoriesName}>{cat.categoriesName}</option>
                            ))}
                        </select>
                        <input
                            className={styles.formInput}
                            type="number"
                            placeholder="Сумма (₽)"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            style={{ maxWidth: '140px' }}
                        />
                    </div>
                    <button className={styles.btnAdd} onClick={onSavePurchaseClick}>
                        Добавить
                    </button>
                </div>

                {/* Список записей */}
                <div className={styles.expensesList}>
                    {filtered.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyEmoji}>📝</div>
                            <div>Пока нет записей. Добавьте первую!</div>
                        </div>
                    ) : (
                        filtered.map((elem) => {
                            return (
                                <div key={elem.creationTime} className={styles.expenseItem}>
                                    
                                   <div className={styles.expenseInfo}>
                                        {elem.isEdit ? (
                                            <input
                                                className={styles.editInput}
                                                value={elem.purchaseName}
                                                onChange={(e) => handleEditChange(elem.creationTime, 'purchaseName', e.target.value)}
                                                style={{ flex: 1, minWidth: 0 }}
                                            />
                                        ) : (
                                            <span className={styles.expenseName}>{elem.purchaseName}</span>
                                        )}
                                        
                                        {elem.isEdit ? (
                                            <select
                                                className={styles.editSelect}
                                                value={elem.categoriesName}
                                                onChange={(e) => handleEditChange(elem.creationTime, 'categoriesName', e.target.value)}
                                                style={{ flexShrink: 0 }}
                                            >
                                                {listCategories.map((cat, i) => (
                                                    <option key={i} value={cat.categoriesName}>{cat.categoriesName}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className={`${styles.expenseBadge}`}>
                                                {elem.categoriesName}
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.expenseRight}>
                                        {elem.isEdit ? (
                                            <input
                                                className={styles.editInputCost}
                                                type="number"
                                                value={elem.costValue}
                                                onChange={(e) => handleEditChange(elem.creationTime, 'costValue', e.target.value)}
                                            />
                                        ) : (
                                            <span className={styles.expenseAmount}>{Number(elem.costValue).toLocaleString()} ₽</span>
                                        )}
                                        
                                        <div className={styles.actionBtns}>
                                            <button 
                                                className={styles.actionBtn} 
                                                onClick={() => elem.isEdit ? toggleIsEdit(elem.creationTime) : toggleIsEdit(elem.creationTime)}
                                                title={elem.isEdit ? "Сохранить" : "Редактировать"}
                                            >
                                                {elem.isEdit ? <Check size={18} color="#2d3436" /> : <Edit2 size={16} />}
                                            </button>
                                            <button 
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                                                onClick={() => deletePurchase(elem.creationTime)}
                                                title="Удалить"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Итого */}
                {filtered.length > 0 && (
                    <div className={styles.totalBar}>
                        <span className={styles.totalLabel}>Итого за день:</span>
                        <span className={styles.totalAmount}>{totalCost.toLocaleString()} ₽</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home