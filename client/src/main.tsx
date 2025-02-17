import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './main.css'
import { router } from './router'
import { AuthProvider } from './context/auth/AuthContext'
import { TokenProvider } from './context/auth/TokenContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TokenProvider>
        <RouterProvider router={router} />
      </TokenProvider>
    </AuthProvider>
  </StrictMode>,
)