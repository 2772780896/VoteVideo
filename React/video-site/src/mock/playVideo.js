import Mock from 'mockjs'
import { getMainVideoList } from './publicState'

export const playVideo = Mock.mock(
    /^\/api\/video\/play(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const vid = Number(url.searchParams.get('vid'))
        const mainVideoList = getMainVideoList()
        const dataVideo = mainVideoList.filter(i => (i.vid === vid))
        console.log(dataVideo)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataVideo
        })
    }
)
