import request from '@/utils/request'

async function getPost(pid) {
    const response = await request({
        url: `/api/post/${pid}`,
        method: 'get',
    })
    return response
}

export default getPost