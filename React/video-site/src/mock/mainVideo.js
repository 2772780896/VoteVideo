import Mock from 'mockjs'
import { addVideoList } from './publicState'

const Random = Mock.Random
export const mainVideo = Mock.mock(
    /^\/api\/video\/main(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const element = Number(url.searchParams.get('element'))
        const dataList = [...Array(element)].map( () => ({
            vid: Random.integer(1, 999),
            title: Random.cword(8,14),
            coverUrl: Random.image('1920x1080', Random.color(), Random.color(), 'jpg', Random.string(1,5)),
            videoUrl: 'https://cdn.pixabay.com/video/2025/04/29/275633_large.mp4',
            viewCount: Random.integer(1000, 99999),
            messageCount: Random.integer(50, 1000),
            uploader: Random.cword(2,6),
            duration: Random.time('mm:ss'),
            date: Random.datetime('yyyy-MM-dd')
        }))
        addVideoList(dataList)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataList
        })
    }
)
