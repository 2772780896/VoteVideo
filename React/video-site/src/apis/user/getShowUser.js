import request from '@/utils/request'

async function getShowUser(uid) {
    const response = await request({
        url: `/api/user/show?uid=${uid}`,
        method: 'get',
    })
    return response
}

export default getShowUser