import request from '@/utils/request'

async function getShowPost(pid) {
    const response = await request({
        url: `/api/post/show?pid=${pid}`,
        method: 'get',
    })
    return response
}

export default getShowPost