import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './pages/App.tsx'

// import './views/index.css'
import '@unocss/reset/tailwind.css'
import 'uno.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/">
    <Suspense>
      <App />
    </Suspense>
  </BrowserRouter>,
)
