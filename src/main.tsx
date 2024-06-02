import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './App'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import AuthProvider from './contexts/AuthContext'
import GamesPlayedProvider from './contexts/GamesPlayedContext'

import { register } from 'swiper/element'
register()
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <GamesPlayedProvider>
        <RouterProvider router={router} />
      </GamesPlayedProvider>
    </AuthProvider>
  </React.StrictMode>,
)
