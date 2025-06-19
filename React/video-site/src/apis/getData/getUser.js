import request from '@/utils/request'

async function getUser(uid) {
    const response = await request({
        url: `/api/user/${uid}`,
        method: 'get',
    })
    return response
}

export default getUser