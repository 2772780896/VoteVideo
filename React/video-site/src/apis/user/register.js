import request from '@/utils/request'

async function register(username, password) {
    const response = await request({
        url: `/api/register`,
        method: 'post',
        data: {
            'username': username,
            'password': password
        }
    })
    return response
}

export default register