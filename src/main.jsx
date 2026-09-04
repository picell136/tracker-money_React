import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
// import store from './app/store.js'
// import { Provider } from 'react-redux'

import './index.css'
import App from './App.jsx'

const GITHUB_PAGES_BASE = '/tracker-money_React'
const basename = window.location.pathname.startsWith(GITHUB_PAGES_BASE)
  ? GITHUB_PAGES_BASE
  : '/'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
				<App />
    </BrowserRouter>
  </StrictMode>,
)
