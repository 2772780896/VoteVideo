import Mock from 'mockjs'
import { createComment } from '../../basicData/ceateComment'
import sortData from '../../utils/sortData'
import { getVideoList } from '../../publicState'

// 读取 publicState 中真实存在的视频 ID，按需生成对应评论
const videoIds = getVideoList().map(v => v.vid)
const commentList = []
for (const vid of videoIds) {
  commentList.push(...createComment(1, null, vid))
}

export const comment = Mock.mock(
    /^\/api\/comment(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const sort = url.searchParams.get('sort')
        const page = Number(url.searchParams.get('page'))
        const element = Number(url.searchParams.get('element'))
        const vid = url.searchParams.get('vid')
        // 按 vid 过滤（vid 为 null/undefined 时返回全部）
        const filtered = vid ? commentList.filter(c => c.vid == vid) : commentList
        const dataList = sortData(filtered, sort, page, element)
        console.log('mockComment vid=', vid, 'filtered=', filtered.length, 'total=', filtered.length)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataList,
            total: filtered.length
        })
    }
)
