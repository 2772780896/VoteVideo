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
    date: Random.datetime('yyyy-MM-dd'),
    likeCount: Random.integer(200, 20000),
    favouriteCount: Random.integer(100, 10000)
}))
addVideoList(searchVideoList)

export const searchVideo = Mock.mock(
    /^\/api\/video\/search(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const sort = Number(url.searchParams.get('sort'))
        const page = Number(url.searchParams.get('page'))
        const element = Number(url.searchParams.get('element'))
        let dataList = []
        if (sort === 1) {
            // 实现观看数从高到低排序
            const viewSortList = [...searchVideoList].sort((a,b) => {
                return b.viewCount - a.viewCount
            })
            dataList = viewSortList.slice((page-1)*element,page*element)
        }
        if (sort === 2){
            // 实现时间从新到旧排序
            const dateOrderList = [...searchVideoList].sort((a,b) => {
                if (b.date > a.date) return 1
                if (a.date > b.date) return -1
                return 0
            })
            dataList = dateOrderList.slice((page-1)*element,page*element)
        }
        if (sort === 3){
            // 实现时间从旧到新排序
            const dateReverseList = [...searchVideoList].sort((a,b) => {
                if (a.date > b.date) return 1
                if (b.date > a.date) return -1
                return 0
            })
            dataList = dateReverseList.slice((page-1)*element,page*element)
        }
        if (sort === 4){
            // 实现点赞数从高到低排序
            const likeSortList = [...searchVideoList].sort((a,b) => {
                return b.likeCount - a.likeCount
            })
            dataList = likeSortList.slice((page-1)*element,page*element)
            addVideoList(dataList)
        }
        if (sort === 5){
            // 实现收藏数从高到低排序
            const favouriteSortList = [...searchVideoList].sort((a,b) => {
                return b.favouriteCount - a.favouriteCount
            })
            dataList = favouriteSortList.slice((page-1)*element,page*element)
        }
        console.log('mockdata:', dataList)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataList,
            total: 16*2
        })
    }
)
