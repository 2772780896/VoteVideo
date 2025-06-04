import Mock from 'mockjs'
import { createVideo } from '../createData/video'

export const mainVideo = Mock.mock(
    /^\/api\/video\/main(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const element = Number(url.searchParams.get('element'))
        const dataList = createVideo(element)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataList
        })
    }
)
