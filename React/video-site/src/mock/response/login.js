import Mock from 'mockjs'
import { getUserList } from '../publicState' 

export const profileLogin = Mock.mock(
    /^\/api\/login(\?.*)?$/,
    'post',
    function(options) {
        console.log('dataType:', typeof options.body)
        const data = JSON.parse(options.body)
        console.log('loginMock:', data)
        const userList = getUserList()
        console.log('LoginProfileList:', userList)
        for (const i of userList) {
            console.log('inputUsername', data.username, typeof data.username)
            console.log('trueUsername', i.userName, typeof i.userName)
            if (i.userName === data.username) {
                console.log('inputpassword', data.password, typeof data.password)
                console.log('truepassword', i.userPassword, typeof i.userPassword)
                if (i.password === data.password) {
                    const token = Mock.Random.guid()
                    console.log('mockToken:', token)
                    i.token = token // 将token添加到userList中
                    console.log('TrueProfile', i)
                    return Mock.mock({
                        code: 200,
                        message: 'ok',
                        data: {'token': token, 'uid': i.uid},
                        
                    })
                }
            }
            return Mock.mock({
                        code: 200,
                        message: '登录失败',
            })
        }
    }
)
