import React from 'react'

import Home from '../home/Home'
import { NavLink, Outlet } from 'react-router-dom'

import styles from '../../styles/Layout.module.css'

const HomePage = () => {

    return <>
            <div className={styles['main-container']}>
                <div className={styles.container}>
                    <h1>Журнал расхода денег</h1>
                    <Outlet />
                </div>
            </div>
        </>
}

export default HomePage