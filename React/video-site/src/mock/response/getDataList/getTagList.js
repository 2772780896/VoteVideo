import Mock from 'mockjs'
import { createTag } from '../../basicData/createTag'
import sortData from '../../utils/sortData'

const total = 16*3
const tagList = createTag(total)

export const getTagList = Mock.mock(
    /^\/api\/tag(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const sort = url.searchParams.get('sort')
        const page = Number(url.searchParams.get('page'))
        const element = Number(url.searchParams.get('element'))
        const dataList = sortData(tagList, sort, page, element)
        console.log('mockdata:', dataList)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataList,
            total: total
        })
    }
)
