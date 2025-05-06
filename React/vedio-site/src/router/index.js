import { createBrowserRouter } from 'react-router-dom'
import MainApp from '../pages/Main'
import VedioApp from '@/pages/Vedio'

const router = createBrowserRouter([
    {
        path: '/main',
        element: <MainApp />
    },
    {
        path: '/vedio',
        element: <VedioApp />
    }
])
export default router