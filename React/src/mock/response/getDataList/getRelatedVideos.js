import Mock from 'mockjs'
import { createVideo } from '../../basicData/createVideo'
import { addVideo, getVideoList } from '../../publicState'

// 确保 publicState 里始终有视频数据（即使 getVideoList 没被调用过）
let initialized = false
const ensureVideos = () => {
    if (!initialized) {
        if (getVideoList().length === 0) {
            const videos = createVideo(48)
            addVideo(videos)
        }
        initialized = true
    }
}

export const getRelatedVideos = Mock.mock(
    /^\/api\/video\/related(\?.*)?$/,
    'get',
    function(options) {
        ensureVideos()

        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const vid = Number(url.searchParams.get('vid'))
        const page = Number(url.searchParams.get('page')) || 1
        const element = Number(url.searchParams.get('element')) || 10

        const allVideos = getVideoList()
        const related = allVideos
            .filter(v => v.vid !== vid)
            .sort(() => Math.random() - 0.5)

        const start = (page - 1) * element
        const paged = related.slice(start, start + element)

        return Mock.mock({
            code: 200,
            message: 'ok',
            data: paged,
            total: related.length
        })
    }
)