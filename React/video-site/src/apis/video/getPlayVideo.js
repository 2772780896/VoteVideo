import request from '@/utils/request'

async function getPlayVideo(vid) {
    const response = await request({
        url: `/api/video/play?vid=${vid}`,
        method: 'get',
    })
    return response
}

export default getPlayVideo