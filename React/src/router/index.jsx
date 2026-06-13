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
        element: <VideoPage />
    },
    {
        path: '/dynamic',
        element: <DynamicPage />
    },
    {
        path: '/search',
        element: <SearchPage />
    },
    {
        path: '/essay/:eid',
        element: <EssayPage />
    },
    {
        path: '/tag/:tid',
        element: <TagPage />
    },
    {
        path: '/upload',
        element: <UploadPage />
    },
    {
        path: '/post/:pid',
        element: <PostPage />
    },
    {
        path: '/user/profile',
        element: <ProfilePage />
    },
    {
        path: '/user/:uid',
        element: <UserPage />
    }
],{
    basename: "/"
})
export default router