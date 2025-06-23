import { getUserList } from '../publicState'

export const verifyAuthorization = (options) => {
    console.log('verifyAuthorization:', options)

    // mockjs无法获取请求头
    // const headers = options?.xhr?.requestHeaders
    // const authorization = headers?.['Authorization'] || headers?.['authorization']
    
    // 通过post请求体获取token
    const data = JSON.parse(options?.body)
    const authorization = data?.authorization
    console.log('authorization:', authorization)

    const userList = getUserList()
    console.log('VerifyUserList:', userList)
    for (const user of userList) {
        if (user.token){console.log('trueToken:', user.token, typeof user.token)
            console.log('acceptToken:', authorization, typeof authorization)}
        if (authorization !== undefined && user.token === authorization) {
            return [true, user.uid]
        }
    }
    return [false, null]
}