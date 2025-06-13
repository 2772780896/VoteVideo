import Mock from 'mockjs'
import { verifyAuthorization } from '../utils/verifyAuthorization'
import { getVideoList } from '../publicState'
import { getUserExtension } from '../publicState'
import { format } from 'date-fns'

export const getVideo = Mock.mock(
    /^\/api\/video\/(\d+)$/,  // 精准匹配/api/video/
    'get',
    function(options) {
        const match = options.url.match(/\/api\/videos\/(\d+)/)
        const vid = match[1]
        // 登录验证，如果登录获取uid
        const [isLogin, uid] = verifyAuthorization(options)
        const videoList = getVideoList()
        videoList.find(video => {
            if (video.vid === vid) {
                if (isLogin) {
                    // 如果登录，在video中添加时间，将video添加到userExtension的对应uid的history中
                    const date = format(new Date(), 'yyyy-MM-dd')
                    const historyVideo = {...video, history: date}
                    const userExtension = getUserExtension()
                    userExtension.find(item => item.uid === uid).history.push(historyVideo)
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
        })
    }
)