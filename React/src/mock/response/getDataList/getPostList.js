import Mock from 'mockjs'
import { createPost } from '../../basicData/createPost'
import sortData from '../../utils/sortData'

const total = 16*3
const postList = createPost(total)

export const getPostList = Mock.mock(
    /^\/api\/post(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const sort = url.searchParams.get('sort')
        const page = Number(url.searchParams.get('page'))
        const element = Number(url.searchParams.get('element'))
        const q = url.searchParams.get('q')
        let list = [...postList]
        if (q) {
            const kw = q.toLowerCase()
            list = list.filter(item =>
                item.text?.toLowerCase().includes(kw) ||
                item.userName?.toLowerCase().includes(kw)
            )
        }
        const dataList = sortData(list, sort, page, element)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataList,
            total: list.length
        })
    }
)
