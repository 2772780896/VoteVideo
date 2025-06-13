import request from '@/utils/request'

async function getVideo(vid) {
    const response = await request({
        url: `/api/video/${vid}`,
        method: 'get',
    })
    return response
}

export default getVideo