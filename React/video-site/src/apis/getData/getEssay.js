import request from '@/utils/request'

async function getEssay(eid) {
    const response = await request({
        url: `/api/essay/${eid}`,
        method: 'get',
    })
    return response
}

export default getEssay