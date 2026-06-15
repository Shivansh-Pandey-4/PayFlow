import { createRoot } from 'react-dom/client'
import './index.css'
import appConfig from './App'
import { RouterProvider } from 'react-router-dom'


createRoot(document.getElementById('root')!).render(<RouterProvider router={appConfig} />)
