import request from '@/utils/request'
export async function ask(data) {
    const response = await request({
        url: 'picture/carousel',
        method: 'get',
        data: data
    })
    console.log('sssssssssssssss',2222222222222,response)
    return response
}