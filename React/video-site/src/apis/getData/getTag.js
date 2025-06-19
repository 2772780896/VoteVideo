import request from '@/utils/request'

async function getTag(tid) {
    const response = await request({
        url: `/api/tag/${tid}`,
        method: 'get',
    })
    return response
}

export default getTag