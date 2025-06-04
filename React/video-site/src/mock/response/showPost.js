import Mock from 'mockjs'
import { getPostList } from '../publicState'

export const showPost = Mock.mock(
    /^\/api\/post\/show(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const pid = Number(url.searchParams.get('pid'))
        const searchPostList = getPostList()
        console.log('searchPostList', searchPostList)
        console.log('pid', pid)
        const dataPost = searchPostList.filter(i => (i.pid === pid))
        console.log('dataPost', dataPost)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataPost
        })
    }
)
