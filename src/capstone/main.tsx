import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import App from './complete/CapstoneApp'
import '../styles/global.css'
import '../analysis/release-shell.css'

// Reuse the existing Figma app and its original components/styles verbatim.
document.documentElement.dataset.releaseBuild = 'true'
document.documentElement.dataset.appHorizontalLock = 'true'
// Apply main's existing 412px/mobile-width shell to onboarding and catalog views.
document.documentElement.dataset.catalogApp = 'true'
const root = document.getElementById('root')
if (!root) throw Error('앱을 표시할 root 요소가 없습니다.')
createRoot(root).render(<StrictMode><MotionConfig reducedMotion="user"><App /></MotionConfig></StrictMode>)
