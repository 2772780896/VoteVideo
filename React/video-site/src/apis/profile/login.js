import request from '@/utils/request'

async function login(username, password) {
    const response = await request({
        url: `/api/login`,
        method: 'post',
        data: {
            'username': username,
            'password': password
        }
    })
    return response
}

export default login