import { createBrowserRouter } from 'react-router-dom'
import MainApp from '../pages/Main'
import VideoApp from '@/pages/Video'
import Profile from '@/pages/Profile'
import FollowApp from '@/pages/Follow'
import SearchApp from '@/pages/Search'
import EssayApp from '@/pages/Essay'
import TagApp from '@/pages/Tag'
import Upload from '@/pages/Upload'
import Post from '@/pages/Post'
import User from '@/pages/User'

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
        path: '/video/:vid',
        element: <VideoApp />
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
        path: '/essay/:eid',
        element: <EssayApp />
    },
    {
        path: '/tag/:tid',
        element: <TagApp />
    },
    {
        path: '/upload',
        element: <Upload />
    },
    {
        path: '/post/:pid',
        element: <Post />
    },
    {
        path: '/user/profile',
        element: <Profile />
    },
    {
        path: '/user/:uid',
        element: <User />
    }
],{
    basename: "/VoteVideo"
})
export default router