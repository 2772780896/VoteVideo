import axios from 'axios'
import Cookies from 'js-cookie'

const request = axios.create({
    baseURL: '',
    timeout: 5000
})

request.interceptors.request.use((config) => {
    if (config.needToken) {
        const token = Cookies.get('token')
        if (token) {
            // 合并 token 到已有 data 中，而不是替换
            // DELETE 保持 method 不变
            if (config.method !== 'delete') {
                config.method = 'post'
            }
            config.data = { ...(config.data || {}), authorization: token }
        }
    }
    return config
})

request.interceptors.response.use((response) => {
    console.log('originalResponse', response)
    if (response.data.code !== 200) {
        console.log('originalError', response)
        return Promise.reject(response)
    }
    return response
})

export default request

