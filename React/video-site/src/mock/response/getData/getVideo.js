import Mock from 'mockjs'
import { verifyAuthorization } from '../../utils/verifyAuthorization'
import { getVideoList } from '../../publicState'
import { addUserExtension } from '../../publicState'
import { format } from 'date-fns'

export const getVideo = Mock.mock(
    /^\/api\/video\/(\d+)$/,  // 精准匹配/api/video/
    function(options) {
        const match = options.url.match(/\/api\/video\/(\d+)/)
        const vid = Number(match[1])
        console.log('mockVid:', vid)
        // 登录验证，如果登录获取uid
        const [isLogin, uid] = verifyAuthorization(options)
        console.log('mockIsLogin:', isLogin)
        const videoList = getVideoList()
        const video = videoList.find(video => (video.vid === vid))
        console.log('mockVideo:', video)
        if (video) {
            if (isLogin) {
                // 如果登录，在video中添加时间，将video添加到userExtension的对应uid的history中
                const date = format(new Date(), 'yyyy-MM-dd')
                const historyVideo = {...video, history: date}
                addUserExtension(uid, 'history', 'videoList', historyVideo)
            }
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: video
            })
        }
        return Mock.mock({
            code: 404,
            message: '视频不存在',
        })
    }
)