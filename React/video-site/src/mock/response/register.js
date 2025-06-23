import Mock from 'mockjs'
import { createUser } from '../basicData/createUser'

export const profileRegister = Mock.mock(
    /^\/api\/register(\?.*)?$/,
    'post',
    function(options) {
        console.log('dataType:', typeof options.body)
        const data = JSON.parse(options.body)
        console.log('registerData:', data.username, data.password, typeof data.username, typeof data.password)
        const user = createUser(1, {userName: data.username, password: data.password})
        console.log('registerUser:', user)
        return Mock.mock({
            code: 200,
            message: '用户创建成功',
        })
    }
)
