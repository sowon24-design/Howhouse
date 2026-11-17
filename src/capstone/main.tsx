import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../App'
import '../styles/global.css'
import '../analysis/release-shell.css'

// Reuse the existing Figma app and its original components/styles verbatim.
document.documentElement.dataset.releaseBuild = 'true'
document.documentElement.dataset.appHorizontalLock = 'true'
const root = document.getElementById('root')
if (!root) throw Error('앱을 표시할 root 요소가 없습니다.')
createRoot(root).render(<StrictMode><App /></StrictMode>)
