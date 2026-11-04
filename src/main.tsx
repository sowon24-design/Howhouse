import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

// Capture-only presentation flag; omit it to restore development controls.
if (import.meta.env.VITE_CAPTURE_MODE === 'true') document.documentElement.dataset.captureMode = 'true'

const root = document.getElementById('root')
if (!root) throw new Error('앱을 표시할 root 요소가 없습니다.')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
