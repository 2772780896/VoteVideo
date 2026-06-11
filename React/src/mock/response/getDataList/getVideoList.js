import Mock from 'mockjs'
import { createVideo } from '../../basicData/createVideo'
import sortData from '../../utils/sortData'

const total = 16*3
const videoList = createVideo(total)

export const getVideoList = Mock.mock(
    /^\/api\/video(\?.*)?$/, // 精确匹配/api/video
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const sort = url.searchParams.get('sort')
        const page = Number(url.searchParams.get('page'))
        const element = Number(url.searchParams.get('element'))
        const q = url.searchParams.get('q')
        // 关键词过滤：在排序和分页之前，确保跨页搜索完整
        let list = [...videoList]
        if (q) {
            const kw = q.toLowerCase()
            list = list.filter(item =>
                item.title?.toLowerCase().includes(kw) ||
                item.info?.toLowerCase().includes(kw) ||
                item.uploader?.userName?.toLowerCase().includes(kw)
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
