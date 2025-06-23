import request from '@/utils/request'

export async function getUserVideo(sort, page, element, uid) {
    const response = await request({
        url: `/api/user/${uid}/video?sort=${sort}&page=${page}&element=${element}`,
        method: 'get',
        needToken: true
    })
    return response
}

export async function getUserPost(sort, page, element, uid) {
    const response = await request({
        url: `/api/user/${uid}/post?sort=${sort}&page=${page}&element=${element}`,
        method: 'get',
        needToken: true
    })
    return response
}

export async function getUserEssay(sort, page, element, uid) {
    const response = await request({
        url: `/api/user/${uid}/essay?sort=${sort}&page=${page}&element=${element}`,
        method: 'get',
        needToken: true
    })
    return response
}