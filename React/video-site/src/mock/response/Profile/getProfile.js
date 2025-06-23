import { getUserList } from '../../publicState'
import Mock from 'mockjs'   
import { verifyAuthorization } from '../../utils/verifyAuthorization'

export const getProfile = Mock.mock(
    /^\/api\/user\/profile\/$/,
    function(options) {
        const [isLogin, uid] = verifyAuthorization(options)
        console.log('isLoginProfile:', isLogin, uid)
        if (!isLogin) {
            return Mock.mock({
                code: 401,
                message: '未登录',
            })
        }
        const userList = getUserList()
        const user = userList.find(i => (i.uid === uid))
        console.log('mockUser', user)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: user
        })
    }
)


