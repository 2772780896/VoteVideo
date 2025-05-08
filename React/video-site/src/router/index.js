import { createBrowserRouter } from 'react-router-dom'
import MainApp from '../pages/Main'
import VedioApp from '@/pages/Vedio'
import UserApp from '@/pages/User'

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
    }
])
export default router