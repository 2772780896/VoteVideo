import { createBrowserRouter } from 'react-router-dom'
import MainApp from '../pages/Main'
import VedioApp from '@/pages/Vedio'
import UserApp from '@/pages/User'
import FollowApp from '@/pages/Follow'
import SearchApp from '@/pages/Search'
import EssayApp from '@/pages/Essay'
import TagApp from '@/pages/Tag'

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainApp />,
    },
    {
        path: '/main',
        element: <MainApp />,
    },
    {
        path: '/vedio',
        element: <VedioApp />
    },
    {
        path: '/user',
        element: <UserApp />
    },
    {
        path: '/follow',
        element: <FollowApp />
    },
    {
        path: '/search',
        element: <SearchApp />
    },
    {
        path: '/essay',
        element: <EssayApp />
    },
    {
        path: '/tag',
        element: <TagApp />
    }
])
export default router