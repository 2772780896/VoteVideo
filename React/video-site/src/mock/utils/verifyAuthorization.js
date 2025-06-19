import { getUserList } from '../publicState'

export const verifyAuthorization = (options) => {
    console.log('verifyAuthorization:', options)
    const headers = options?.xhr?.requestHeaders
    const authorization = headers?.['Authorization'] || headers?.['authorization']
    const userList = getUserList()
    for (const user of userList) {
        if (authorization !== undefined && user.token === authorization) {
            return [true, user.uid]
        }
    }
    return [false, null]
}