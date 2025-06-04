import request from '@/utils/request'

async function getShowEssay(eid) {
    const response = await request({
        url: `/api/essay/show?eid=${eid}`,
        method: 'get',
    })
    return response
}

export default getShowEssay