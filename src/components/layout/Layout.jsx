import React from 'react'

import Home from '../home/Home'
import { NavLink, Outlet } from 'react-router-dom'

import styles from '../../styles/Layout.module.css'

const HomePage = () => {

    return <>
            <div className={styles['main-container']}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles['header-icon']}>💰</div>
                        <h1>Журнал расхода денег</h1>
                    </div>
                    <Outlet />
                </div>
            </div>
        </>
}

export default HomePage