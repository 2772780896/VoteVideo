import Mock from 'mockjs'
import { getTagList } from '../publicState'

export const showTag = Mock.mock(
    /^\/api\/tag\/show(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const tid = Number(url.searchParams.get('tid'))
        console.log('tid:', tid)
        const searchTagList = getTagList()
        const dataTag = searchTagList.filter(i => (i.tid === tid))
        console.log(dataTag)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataTag
        })
    }
)
