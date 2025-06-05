import request from '@/utils/request'

async function getShowTag(tid) {
    const response = await request({
        url: `/api/tag/show?tid=${tid}`,
        method: 'get',
    })
    return response
}

export default getShowTag