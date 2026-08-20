import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import styles from '../../styles/Layout.module.css'

const PAGE_TITLES = {
    '/': 'Журнал расходов',
    '/categories': 'Категории',
    '/stat': 'Статистика',
}

const Layout = () => {
    const { pathname } = useLocation()
    const title = PAGE_TITLES[pathname] || 'Журнал расходов'

    useEffect(() => {
        document.title = title
    }, [title])

    return (
        <div className={styles['main-container']}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles['header-icon']}>💰</div>
                    <h1>{title}</h1>
                </div>
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
