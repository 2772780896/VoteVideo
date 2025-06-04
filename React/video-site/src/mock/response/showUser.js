import Mock from 'mockjs'
import { getUserList } from '../publicState'

export const showUser = Mock.mock(
    /^\/api\/user\/show(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const uid = Number(url.searchParams.get('uid'))
        const searchUserList = getUserList()
        console.log('searchUserList', searchUserList)
        console.log('uid', uid)
        const dataUser = searchUserList.filter(i => (i.uid === uid))
        console.log('dataUser', dataUser)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataUser
        })
    }
)
