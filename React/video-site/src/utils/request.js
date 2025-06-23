import axios from 'axios'
import Cookies from 'js-cookie'

const request = axios.create({
    baseURL: '',
    timeout: 5000
})

request.interceptors.request.use((config) => {
    console.log('originalRequest', config)
    if (config.needToken) {
        const token = Cookies.get('token')

        // 修改请求头不适用于mock
        // config.headers.Authorization = token

        // 通过post请求体传递token
        config.method = 'post'
        config.data = {
            authorization: token
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

