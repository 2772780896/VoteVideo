import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/Main'
import VideoPage from '@/pages/Video'
import ProfilePage from '@/pages/Profile'
import DynamicPage from '@/pages/Dynamic'
import SearchPage from '@/pages/Search'
import EssayPage from '@/pages/Essay'
import TagPage from '@/pages/Tag'
import UploadPage from '@/pages/Upload'
import PostPage from '@/pages/Post'
import UserPage from '@/pages/User'
import CommentPage from '@/pages/Comment'
import RequireAuth from '@/components/common/RequireAuth'

/**
 * 路由配置
 * 
 * 受保护的路由（需要登录）：
 * - /upload：上传页面
 * - /user/profile：个人中心
 * - /dynamic：动态页面
 */

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/main',
        element: <HomePage />,
    },
    {
        path: '/video/:vid',
        element: <VideoPage />,
    },
    {
        path: '/dynamic',
        element: (
            <RequireAuth>
                <DynamicPage />
            </RequireAuth>
        ),
    },
    {
        path: '/search',
        element: <SearchPage />,
    },
    {
        path: '/essay/:eid',
        element: <EssayPage />,
    },
    {
        path: '/tag/:tid',
        element: <TagPage />,
    },
    {
        path: '/upload',
        element: (
            <RequireAuth>
                <UploadPage />
            </RequireAuth>
        ),
    },
    {
        path: '/post/:pid',
        element: <PostPage />,
    },
    {
        path: '/user/profile',
        element: (
            <RequireAuth>
                <ProfilePage />
            </RequireAuth>
        ),
    },
    {
        path: '/user/:uid',
        element: <UserPage />,
    },
    {
        path: '/comment/:cid',
        element: <CommentPage />,
    },
],{
    basename: "/"
})
export default router
