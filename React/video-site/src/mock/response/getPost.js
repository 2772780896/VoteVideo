import Mock from 'mockjs'
import { verifyAuthorization } from '../utils/verifyAuthorization'
import { getPostList } from '../publicState'
import { getUserExtension } from '../publicState'
import { format } from 'date-fns'

export const getPost = Mock.mock(
    /^\/api\/post\/\d+/,
    'get',
    function(options) {
        const match = options.url.match(/\/api\/post\/(\d+)/)
        const eid = match[1]
        // 登录验证，如果登录获取uid
        const [isLogin, uid] = verifyAuthorization(options)
        const postList = getPostList()
        postList.find(post => {
            if (postList.eid === eid) {
                if (isLogin) {
                    // 如果登录，在post中添加时间，将post添加到userExtension的对应uid的history中
                    const date = format(new Date(), 'yyyy-MM-dd')
                    const historyPost = {...post, history: date}
                    const userExtension = getUserExtension()
                    userExtension.find(item => item.uid === uid).history.push(historyPost)
                }
                return Mock.mock({
                    code: 200,
                    message: 'ok',
                    data: post
                })
            }
            return Mock.mock({
                code: 404,
                message: '文章不存在',
            })
        })
    }
)