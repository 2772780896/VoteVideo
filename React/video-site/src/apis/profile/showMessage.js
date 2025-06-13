import request from '@/utils/request'

export async function getDialogue(uid, token) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'dialoge',
        }
    })
    return response
}

export async function getAtedMessage(uid, token) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'atedMessage',
        }
    })
    return response
}

export async function getPraisedMessage(uid, token) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'praisedMessage',
        }
    })
    return response
}

export async function getSystemMessage(uid, token) {
    const response = await request({
        url: `/api/profile/show`,
        method: 'post',
        data: {
            uid: uid,
            token: token,
            subData: 'systemMessage',
        }
    })
    return response
}