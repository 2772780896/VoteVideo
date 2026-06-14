import axios from 'axios'
import Cookies from 'js-cookie'

const request = axios.create({
    baseURL: '',
    timeout: 5000
})

// 请求拦截器：统一添加认证 Token
// 策略：只要本地存在 Token，就自动附加到 Authorization Header
// 这样内容浏览请求（视频列表、详情等）也能让后端识别登录用户，
// 从而返回 isLiked / isFavourited 等交互状态
request.interceptors.request.use((config) => {
    const token = Cookies.get('token')
    if (token) {
        // 标准做法：Token 放在 Authorization Header（Bearer 方案）
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 响应拦截器：统一处理 HTTP 状态码
request.interceptors.response.use((response) => {
    // 标准做法：使用 HTTP 状态码判断请求成功/失败
    // 2xx 状态码表示成功，4xx/5xx 会进入错误分支
    if (response.status >= 200 && response.status < 300) {
        return response
    }
    console.log('请求失败:', response)
    return Promise.reject(response)
}, (error) => {
    // HTTP 4xx/5xx 状态码会进入此错误分支
    console.log('HTTP 错误:', error.response?.status, error.response?.data)
    return Promise.reject(error)
})

export default request

