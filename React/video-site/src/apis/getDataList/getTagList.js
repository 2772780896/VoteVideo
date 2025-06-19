import request from '@/utils/request'

async function getTagList(sort, page=1, element=16) {
    const response = await request({
        url: `/api/tag?sort=${sort}&page=${page}&element=${element}`,
        method: 'get',
    })
    return response
}

export default getTagList