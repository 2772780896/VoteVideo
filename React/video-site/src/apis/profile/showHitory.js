import request from '@/utils/request'

export async function getHistoryVideo(sort, page, element, uid, token) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'historyVideo',
            sort: sort,
            page: page,
            element: 16
        }
    })
    return response
}

export async function getHistoryPost(sort, page, element, uid, token) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'historyPost',
            sort: sort,
            page: page,
            element: 16
        }
    })
    return response
}

export async function getHistoryEssay(sort, page, element, uid, token) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'historyEssay',
            sort: sort,
            page: page,
            element: 16
        }
    })
    return response
}