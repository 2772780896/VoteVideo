import request from '@/utils/request'

async function getComment(sort=1, page=1, element=16) {
    console.log('getUrl:',`/api/comment?sort=${sort}&page=${page}&element=${element}`)
    const response = await request({
        url: `/api/comment?sort=${sort}&page=${page}&element=${element}`,
        method: 'get',
    })
    return response
}

export default getComment