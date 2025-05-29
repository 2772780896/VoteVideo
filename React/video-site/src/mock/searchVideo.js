import Mock from 'mockjs'
import { addVideoList } from './publicState'

const Random = Mock.Random
const searchVideoList = [...Array(16*2)].map( (i) => ({
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

export const searchVideo = Mock.mock(
    /^\/api\/video\/search(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const sort = Number(url.searchParams.get('sort'))
        const page = Number(url.searchParams.get('page'))
        const element = Number(url.searchParams.get('element'))
        if (sort === 1) {
            // 实现倒序排序
            const viewSortList = [...searchVideoList].sort((a,b) => {
                return b.viewCount - a.viewCount
            })
            const dataList = viewSortList.slice((page-1)*element,page*element)
            addVideoList(dataList)
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList,
                total: 16*2
            })
        }
    }
)
