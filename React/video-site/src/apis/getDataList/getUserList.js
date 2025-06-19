import request from '@/utils/request'

async function getUserList(sort, page=1, element=16) {
    console.log('getUrl:',`/api/user?sort=${sort}&page=${page}&element=${element}`)
    const response = await request({
        url: `/api/user?sort=${sort}&page=${page}&element=${element}`,
        method: 'get',
    })
    return response
}

export default getUserList