import Mock from 'mockjs'
import { getUserList, getUserExtension } from '../../publicState'

export const getUser = Mock.mock(
    /^\/api\/user\/(\d+)$/,
    function(options) {
        const match = options.url.match(/\/api\/user\/(\d+)/)
        const uid = Number(match[1])
        const userList = getUserList()
        const user = userList.find(i => (i.uid === uid))
        const userExtension = getUserExtension(uid, 'upload', 'videoList')
        console.log('mockUser', user)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: user
        })
    }
)
