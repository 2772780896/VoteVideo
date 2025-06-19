import Mock from 'mockjs'
import { createComment } from '../../basicData/ceateComment'
import sortData from '../../utils/sortData'

const commentList = createComment(16*3)

export const comment = Mock.mock(
    /^\/api\/comment(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const sort = url.searchParams.get('sort')
        const page = Number(url.searchParams.get('page'))
        const element = Number(url.searchParams.get('element'))
        const dataList = sortData(commentList, sort, page, element)
        console.log('mockComment:', dataList)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataList,
            total: 16*3
        })
    }
)
