import {lazy} from 'react'
import type {RouteObject} from 'react-router-dom'

const Layout = lazy(() => import('../layout'))
const Index = lazy(() => import('../pages/Index'))
const GoodsDetail = lazy(() => import('../pages/Goods/Detail'))
const About = lazy(() => import('../pages/About'))
const Info = lazy(() => import('../pages/Info'))

const NotFound = lazy(() => import('../pages/Error/404.tsx'))

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout/>,
        children: [
            // 首页
            {
                index: true,
                element: <Index/>,
            },
            // 商品详情
            {
                path: '/goods/detail',
                element: <GoodsDetail/>,
            },
            {
                path: '/about',
                element: <About/>,
            },
            {
                path: '/info',
                element: <Info/>,
            },
        ]
    },
    {
        path: '*',
        element: <NotFound/>,
    },
]

export default routes
