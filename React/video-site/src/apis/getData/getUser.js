import request from '@/utils/request'

async function getUser(uid) {
    const response = await request({
        url: `/api/user/profile/`,
        method: 'get',
        needToken: true
    })
    return response
}

export default getUser