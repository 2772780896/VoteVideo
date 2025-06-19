import Mock from 'mockjs'
import { verifyAuthorization } from '../../utils/verifyAuthorization'
import { getEssayList } from '../../publicState'
import { getUserExtension } from '../../publicState'
import { format } from 'date-fns'

export const getEssay = Mock.mock(
    /^\/api\/essay\/\d+/,
    'get',
    function(options) {
        const match = options.url.match(/\/api\/essay\/(\d+)/)
        const eid = Number(match[1])
        // 登录验证，如果登录获取uid
        const [isLogin, uid] = verifyAuthorization(options)
        const essayList = getEssayList()
        const essay = essayList.find(essay => (essay.eid === eid))
        if (essay) {
            if (isLogin) {
                // 如果登录，在essay中添加时间，将essay添加到userExtension的对应uid的history中
                const date = format(new Date(), 'yyyy-MM-dd')
                const historyEssay = {...essay, history: date}
                const userExtension = getUserExtension()
                userExtension.find(item => item.uid === uid).history.push(historyEssay)
            }
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: essay
            })
        }
        return Mock.mock({
            code: 404,
            message: '文章不存在',
        })
    }
)