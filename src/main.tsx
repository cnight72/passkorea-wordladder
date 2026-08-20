import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* 쇼츠에서 실제로 유입이 오는지 보려면 필요하다. Vercel 대시보드의
        Analytics 를 켜는 것만으로는 Vite 앱에서 데이터가 잡히지 않는다. */}
    <Analytics />
  </StrictMode>,
)
