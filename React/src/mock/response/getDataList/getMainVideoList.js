import Mock from 'mockjs'
import { getVideoList } from '../../publicState'

export const getMainVideo = Mock.mock(
    /^\/api\/video\/main(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const page = Number(url.searchParams.get('page')) || 1
        const element = Number(url.searchParams.get('element')) || 16
        // 【底层原理】：getVideoList() 返回的是之前在 publicState 中通过 createVideo 预先创建的 48 条视频数据池
        // 所有 /api/video 相关的列表接口共享同一份数据引用，确保首页和视频列表页数据一致
        const allVideos = getVideoList()
        const start = (page - 1) * element
        const end = start + element
        const dataList = allVideos.slice(start, end)

        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataList
        })
    }
)