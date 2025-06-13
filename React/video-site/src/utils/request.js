import axios from 'axios'
const request = axios.create({
    baseURL: '',
    timeout: 5000
})

request.interceptors.response.use((response) => {
    console.log('originalResponse', response)
    if (response.data.code === 401) {
        console.log('originalError', response)
        return Promise.reject(response)
    }
    return response
})

export default request

