import Mock from 'mockjs'
import { createVideo } from '../basicData/createVideo'
import sortData from '../utils/sortData'

const total = 16*3
const videoList = createVideo(total)

export const getVideoList = Mock.mock(
    /^\/api\/video(\?.*)?$/, // 精确匹配/api/video
    'get',
    function(options) {
        console.log('options:', options)
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const sort = url.searchParams.get('sort')
        const page = Number(url.searchParams.get('page'))
        const element = Number(url.searchParams.get('element'))
        console.log('sort:', sort, page, element)
        const dataList = sortData(videoList, sort, page, element)
        console.log('mockdata:', dataList)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataList,
            total: total
        })
    }
)
