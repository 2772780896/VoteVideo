import request from '@/utils/request'

async function getMainVideo(page=1, element=16) {
    const response = await request({
        url: `/api/video/main?page=${page}&element=${element}`,
        method: 'get',
    })
    return response
}

export default getMainVideo