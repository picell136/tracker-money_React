import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import {
  CATEGORIES,
  loadCustomCategories,
  saveCustomCategories,
} from '../../data/categories'
import styles from "../../styles/Categories.module.css"

const Categories = () => {
    const [name, setName] = useState('')
    const [customCategories, setCustomCategories] = useState(() => loadCustomCategories())
    const [error, setError] = useState('')

    const onSaveCategoryClick = () => {
        const nextName = name.trim()
        if (!nextName) {
            setError('Введите название категории')
            return
        }

        const exists = [...CATEGORIES, ...customCategories].some(
            (category) => category.name.toLowerCase() === nextName.toLowerCase()
        )
        if (exists) {
            setError('Такая категория уже есть')
            return
        }

        const updatedList = [
            ...customCategories,
            { name: nextName, emoji: '🏷️', color: '#636e72' },
        ]
        setCustomCategories(updatedList)
        saveCustomCategories(updatedList)
        setName('')
        setError('')
    }

    const deleteCategory = (categoryName) => {
        const updatedList = customCategories.filter((category) => category.name !== categoryName)
        setCustomCategories(updatedList)
        saveCustomCategories(updatedList)
    }

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <NavLink to="/" className={styles.backButton}>
                    <ArrowLeft size={24} />
                </NavLink>
                <div className={styles.headerContent}>
                    <div className={styles.headerIcon}>📚</div>
                    <h2>Категории</h2>
                </div>
            </div>

            <div className={styles.title}>Добавить категорию</div>
            <div className={styles.inputButton}>
                <div className={styles.inputButton2}>
                    <input
                        id="categoryName"
                        name="categoryName"
                        placeholder="Название категории..."
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                            setError('')
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onSaveCategoryClick()
                        }}
                    />
                    <button type="button" onClick={onSaveCategoryClick}>
                        Сохранить
                    </button>
                </div>
            </div>
            {error && <div className={styles.error}>{error}</div>}

            <ul className={styles.categoryList}>
                {CATEGORIES.map((category) => (
                    <li key={category.name} className={styles.categoryItem}>
                        <span
                            className={styles.categoryIcon}
                            style={{ background: category.color }}
                        >
                            {category.emoji}
                        </span>
                        <span className={styles.categoryName}>{category.name}</span>
                    </li>
                ))}
                {customCategories.map((category) => (
                    <li key={category.name} className={styles.categoryItem}>
                        <span
                            className={styles.categoryIcon}
                            style={{ background: category.color }}
                        >
                            {category.emoji}
                        </span>
                        <span className={styles.categoryName}>{category.name}</span>
                        <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => deleteCategory(category.name)}
                            title="Удалить"
                        >
                            <Trash2 size={16} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Categories
