import request from '@/utils/request'

async function getProfile(uid, token) {
    try {
        const response = await request({
            url: `/api/profile/show`,
            method: 'post',
            data: {
                uid: uid,
                token: token,
                subData: 'basic'
            }
        })
        return response
    } catch (error) {
        throw error
    }
}

export default getProfile