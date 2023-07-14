import {lazy} from 'react'
import type {RouteObject} from 'react-router-dom'

const Layout = lazy(() => import('../layout'))
const Index = lazy(() => import('../pages/Index'))
const About = lazy(() => import('../pages/About'))
const Info = lazy(() => import('../pages/Info'))

const NotFound = lazy(() => import('../pages/Error/404.tsx'))

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <Index/>,
            },
            {
                path: '/about',
                element: <About/>,
            },
            {
                path: '/info',
                element: <Info/>,
            },
            {
                path: '*',
                element: <NotFound/>,
            },
        ]
    },
    {
        path: '*',
        element: <NotFound/>,
    },
]

export default routes