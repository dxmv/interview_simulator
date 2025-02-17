import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './main.css'
import { router } from './router'
import { AuthProvider } from './context/auth/AuthContext'
import { TokenProvider } from './context/auth/TokenContext'
import { CVProvider } from './context/cv/CVContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TokenProvider>
        <CVProvider>
          <RouterProvider router={router} />
        </CVProvider>
      </TokenProvider>
    </AuthProvider>
  </StrictMode>,
)