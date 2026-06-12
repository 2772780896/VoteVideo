import axios from 'axios'
import Cookies from 'js-cookie'

const request = axios.create({
    baseURL: '',
    timeout: 5000
})

// 请求拦截器：统一添加认证 Token
request.interceptors.request.use((config) => {
    if (config.needToken) {
        const token = Cookies.get('token')
        if (token) {
            // 标准做法：Token 放在 Authorization Header（Bearer 方案）
            // 替代旧方案：将 token 放在请求体 body.authorization 中
            config.headers.Authorization = `Bearer ${token}`
        }
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

