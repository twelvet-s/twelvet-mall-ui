// App.tsx

import React from 'react'
import {useRoutes} from 'react-router-dom'
import router from './router'

const App: React.FC = () => {
    return useRoutes(router)
}
export default App
