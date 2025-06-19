import request from '@/utils/request'

async function getPostList(sort, page=1, element=16) {
    const response = await request({
        url: `/api/post?sort=${sort}&page=${page}&element=${element}`,
        method: 'get',
    })
    return response
}

export default getPostList