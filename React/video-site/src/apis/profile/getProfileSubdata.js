import request from '@/utils/request'

async function getProfileSubdata(sort, page=1, element=16, profileType, dataType) {
    try {
        const response = await request({
            url: `/api/user/profile/${profileType}/${dataType}/?sort=${sort}&page=${page}&element=${element}`,
            method: 'get',
            needToken: true
        })
        return response
    } catch (error) {
        throw error
    }
}

export default getProfileSubdata