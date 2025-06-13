import request from '@/utils/request'

export async function getUploadVideo(sort, page, element, uid, token) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'uploadVideo',
            sort: sort,
            page: page,
            element: 16
        }
    })
    return response
}

export async function getUploadPost(sort, page, element, uid, token) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'uploadPost',
            sort: sort,
            page: page,
            element: 16
        }
    })
    return response
}

export async function getUploadEssay(sort, page, element, uid, token) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'uploadEssay',
            sort: sort,
            page: page,
            element: 16
        }
    })
    return response
}