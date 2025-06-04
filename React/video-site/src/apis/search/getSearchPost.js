import request from '@/utils/request'

async function getSearchPost(sort=1, page=1, element=16) {
    console.log('getUrl:',`/api/post/search?sort=${sort}&page=${page}&element=${element}`)
    const response = await request({
        url: `/api/post/search?sort=${sort}&page=${page}&element=${element}`,
        method: 'get',
    })
    return response
}

export default getSearchPost