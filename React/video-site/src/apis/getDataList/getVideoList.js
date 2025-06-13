import request from '@/utils/request'

async function getVideoList(sort='+title', page=1, element=16) {
    console.log('params:', sort, page, element)
    const response = await request({
        url: `/api/video?sort=${sort}&page=${page}&element=${element}`,
        method: 'get',
    })
    return response
}

export default getVideoList