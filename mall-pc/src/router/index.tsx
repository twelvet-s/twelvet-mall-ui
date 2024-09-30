import { lazy, ReactNode, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Spin } from "antd";

const Layout = lazy(() => import('../layout'))
const Index = lazy(() => import('../pages/Index'))

// 商品
const GoodsList = lazy(() => import('../pages/Goods/List'))
const GoodsDetail = lazy(() => import('../pages/Goods/Detail'))

// 用户直播间
const UserLive = lazy(() => import('../pages/User/Live'))

// 直播间
const Live = lazy(() => import('../pages/Live'))
// 聊天室
const Chat = lazy(() => import('../pages/Chat'))

// 断点续传
const ResumeFromBreakpoint = lazy(() => import('../pages/Upload/ResumeFromBreakpoint'))

const Test = lazy(() => import('../pages/Test.tsx'))

const NotFound = lazy(() => import('../pages/Error/404.tsx'))

const lazyLoad = (children: ReactNode) => {
    return <Suspense fallback={
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <Spin size="large" />
        </div>
    }>
        {children}
    </Suspense>
}

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,
        children: [
            // 用户发起直播
            {
                path: '/user/live',
                element: lazyLoad(<UserLive />),
            },
            // 首页
            {
                index: true,
                element: lazyLoad(<Index />),
            },
            // 商品列表
            {
                path: '/goods/list',
                element: lazyLoad(<GoodsList />),
            },
            // 商品详情
            {
                path: '/goods/detail/:goodsId',
                element: lazyLoad(<GoodsDetail />),
            },
            // 文件上传
            {
                path: '/upload/resume-from-breakpoint',
                element: lazyLoad(<ResumeFromBreakpoint />),
            },
            {
                path: '*',
                element: lazyLoad(<NotFound />),
            },
            {
                path: '/live',
                element: lazyLoad(<Live />),
            },
            {
                path: '/chat',
                element: lazyLoad(<Chat />),
            },
        ]
    },
    {
        path: '/test',
        element: lazyLoad(<Test />),
    },
    {
        path: '*',
        element: lazyLoad(<NotFound />),
    },
]

export default routes
