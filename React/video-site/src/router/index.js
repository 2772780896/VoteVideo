import { createBrowserRouter } from 'react-router-dom'
import MainApp from '../pages/Main'
import VideoApp from '@/pages/Video'
import UserApp from '@/pages/User'
import FollowApp from '@/pages/Follow'
import SearchApp from '@/pages/Search'
import EssayApp from '@/pages/Essay'
import TagApp from '@/pages/Tag'
import Upload from '@/pages/Upload'

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
        path: '/video',
        element: <VideoApp />
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
    },
    {
        path: '/upload',
        element: <Upload />
    }
],{
    basename: "/VoteVideo"
})
export default router