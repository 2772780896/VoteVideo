import { getUserList } from '../publicState'

export const verifyAuthorization = (options) => {
    const headers = options.xhr.requestHeaders
    const authorization = headers['Authorization'] || headers['authorization']
    const userList = getUserList()
    for (const user of userList) {
        if (user.token === authorization) {
            return [true, user.uid]
        }
    }
    return [false, null]
}