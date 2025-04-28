import { createBrowserRouter } from 'react-router-dom'
import Main from '../pages/Main'
import App from '@/pages/Vedio'

const router = createBrowserRouter([
    {
        path: '/main',
        element: <Main />
    },
    {
        path: '/vedio',
        element: <App />
    }
])
export default router