// App.tsx

import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../layout'
import RouterPath from '../router'

function Sider() {
  return (
    <nav className="p-4 text-black">
      <ul>
        <li>
          <Link to="/">首页</Link>
        </li>
        <li>
          <Link to="/info">Info</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  )
}
const App: React.FC = () => {
  return <Layout sider={<Sider />} children={<RouterPath />} />
}
export default App
