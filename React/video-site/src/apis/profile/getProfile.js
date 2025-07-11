import request from '@/utils/request'

async function getProfile() {
    try {
        const response = await request({
            url: `/api/user/profile/`,
            method: 'get',
            needToken: true
        })
        return response
    } catch (error) {
        throw error
    }
}

export default getProfile