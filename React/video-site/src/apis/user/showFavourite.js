import request from '@/utils/request'

export async function getFavouriteVideo(sort, page, element, uid, token) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'favouriteVideo',
            sort: sort,
            page: page,
            element: element
        }
    })
    return response
}

export async function getFavouritePost(sort, page, element, uid, token) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'favouritePost',
            sort: sort,
            page: page,
            element: 16
        }
    })
    return response
}

export async function getFavouriteEssay(sort, page, element, uid, token) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'favouriteEssay',
            sort: sort,
            page: page,
            element: 16
        }
    })
    return response
}