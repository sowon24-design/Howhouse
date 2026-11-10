import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './catalog/CatalogApp'
import './styles/global.css'

document.documentElement.dataset.catalogApp = 'true'
document.documentElement.dataset.appHorizontalLock = 'true'

const root = document.getElementById('root')
if (!root) throw new Error('앱을 표시할 root 요소가 없습니다.')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
