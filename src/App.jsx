import React from 'react';
import { Routes, Route } from 'react-router-dom'

import { createBrowserRouter } from 'react-router-dom'

import Layout from './components/layout/Layout';
// import NotFound404 from './components/notFound404/NotFound404';
// import PurchasesList from './components/PurchasesList';
import Home from './components/home/Home'
import Categories from './components/categories/Categories'
import Stat from './components/stat/Stat'
import NotFound404 from './components/notFound404/NotFound404'

const router = createBrowserRouter([
	{ path: '/', 
	  element: <Layout />, 
	  // errorElement: <NotFound404 />,
	  children: [
			{
				// path: '/show',
				element: <Home />,
			},
		], 
	},
])

//

export default function App() {

  return (
		<Routes router={router}>
			<Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
				<Route path='/categories' element={<Categories />} />
				<Route path='/stat' element={<Stat />} />
				<Route path="*" element={<NotFound404 />} />
            </Route>
		</Routes>
  )
}