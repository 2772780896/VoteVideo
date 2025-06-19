import Mock from 'mockjs'
import { getTagList } from '../../publicState'

export const getTag = Mock.mock(
    /^\/api\/tag\/(\d+)$/,
    'get',
    function(options) {
        const match = options.url.match(/\/api\/tag\/(\d+)/)
        const tid = Number(match[1])
        console.log('tid:', tid)
        const tagList = getTagList()
        const tag = tagList.find(i => (i.tid === tid))
        console.log('mockTag', tag)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: tag
        })
    }
)
