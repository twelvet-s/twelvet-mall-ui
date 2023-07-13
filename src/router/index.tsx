import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { useRoutes } from 'react-router-dom'

const Home = lazy(() => import('../pages/Index'))
const About = lazy(() => import('../pages/About'))
const Info = lazy(() => import('../pages/Info'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/About',
    element: <About />,
  },
  {
    path: '/Info',
    element: <Info />,
  },
  {
    path: '*',
    element: <div>Not Found</div>,
  },
]

export default function Router() {
  return useRoutes(routes)
}
