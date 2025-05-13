import { createBrowserRouter } from 'react-router-dom'
import MainApp from '../pages/Main'
import VedioApp from '@/pages/Vedio'
import UserApp from '@/pages/User'
import FocusApp from '@/pages/Focus'
import SearchApp from '@/pages/Search'
import EssayApp from '@/pages/Essay'

const router = createBrowserRouter([
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
        path: '/focus',
        element: <FocusApp />
    },
    {
        path: '/search',
        element: <SearchApp />
    },
    {
        path: '/essay',
        element: <EssayApp />
    }
])
export default router