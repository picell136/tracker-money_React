import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

import styles from '../../styles/Layout.module.css'

const PAGE_TITLES = {
    '/': 'Журнал расходов',
    '/categories': 'Категории',
    '/stat': 'Статистика',
}

const Layout = () => {
    const { pathname } = useLocation()
    const { logout, user } = useAuth()
    const title = PAGE_TITLES[pathname] || 'Журнал расходов'

    useEffect(() => {
        document.title = title
    }, [title])

    return (
        <div className={styles['main-container']}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerMain}>
                        <div className={styles['header-icon']}>💰</div>
                        <h1>Журнал расходов</h1>
                    </div>
                    <button type="button" className={styles.logoutBtn} onClick={logout} title="Выйти">
                        <LogOut size={18} />
                        <span>{user?.login}</span>
                    </button>
                </div>
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
