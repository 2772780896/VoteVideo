import request from '@/utils/request'

async function getEssayList(sort='+title', page=1, element=16) {
    const response = await request({
        url: `/api/essay?sort=${sort}&page=${page}&element=${element}`,
        method: 'get',
    })
    return response
}

export default getEssayList