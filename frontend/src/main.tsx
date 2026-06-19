import { createRoot } from 'react-dom/client'
import './index.css'
import appConfig from './App'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { Toaster } from 'sonner'
import { ModelProvider } from './context/ModelProvider'


createRoot(document.getElementById('root')!).render(
  <AuthProvider >
    <ModelProvider>
      <RouterProvider router={appConfig} />
      <Toaster />
    </ModelProvider>
  </AuthProvider>
)
