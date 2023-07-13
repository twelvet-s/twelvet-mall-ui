import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HashRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <Suspense fallback={<>loading</>}>
      <App />
    </Suspense>
  </HashRouter>,
)
