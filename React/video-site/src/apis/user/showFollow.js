import request from '@/utils/request'

export async function getFollowUser(uid, token) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'followUser',
        }
    })
    return response
}

export async function getFollowPost(sort, page, element, uid, token, uploader) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'followPost',
            sort: sort,
            page: page,
            element: 16,
            uploader: uploader
        }
    })
    return response
}