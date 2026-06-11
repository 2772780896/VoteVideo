import { getUserExtension } from '../../publicState'
import Mock from 'mockjs'
import { verifyAuthorization } from '../../utils/verifyAuthorization'

export const sendMessage = Mock.mock(
    /^\/api\/user\/message\/send(\?.*)?$/,
    function(options) {
        const [isLogin, uid] = verifyAuthorization(options)
        if (!isLogin) {
            return Mock.mock({ code: 401, message: '未登录' })
        }

        const body = JSON.parse(options.body)
        const { dialogueMid, text } = body

        // 从该用户的 dialogueList 里找对应对话
        const dialogueList = getUserExtension(uid, 'message', 'dialogueList')
        const dialogue = dialogueList.find(d => d.mid === dialogueMid)

        const now = new Date()
        const msg = {
            id: Mock.Random.guid(),
            sender: null,  // null = 发送者
            text,
            date: `${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`,
        }
        dialogue.sentences.push(msg)

        return Mock.mock({
            code: 200,
            message: 'ok',
            data: msg,
        })
    }
)
