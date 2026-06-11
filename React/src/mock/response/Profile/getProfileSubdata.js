import { getUserExtension, getUserList, getVideoList, getPostList, getEssayList, getCommentList } from '../../publicState'
import Mock from 'mockjs'   
import { verifyAuthorization } from '../../utils/verifyAuthorization'
import sortData from '../../utils/sortData'

const Random = Mock.Random

// 随机拿一个元素 ID
const pickId = (list) => list.length > 0 ? list[Math.floor(Math.random() * list.length)]?.vid || list[Math.floor(Math.random() * list.length)]?.pid || list[Math.floor(Math.random() * list.length)]?.eid || list[Math.floor(Math.random() * list.length)]?.cid : null

// 根据通知类型生成跳转目标
const notificationTemplates = [
    { text: '点赞了你的视频',     targetType: 'video',   targetFn: () => pickId(getVideoList()) },
    { text: '评论了你的视频',     targetType: 'video',   targetFn: () => pickId(getVideoList()) },
    { text: '收藏了你的文章',     targetType: 'essay',   targetFn: () => pickId(getEssayList()) },
    { text: '评论了你的动态',     targetType: 'post',    targetFn: () => pickId(getPostList()) },
    { text: '关注了你',           targetType: 'user',    targetFn: (sender) => sender?.uid },
    { text: '点赞了你的评论',     targetType: 'comment', targetFn: () => {
        const list = getCommentList()
        if (list.length === 0) return null
        const c = list[Math.floor(Math.random() * list.length)]
        return { targetId: c.cid, parentType: 'video', parentId: c.vid }
    }},
]

// 造一条随机通知
const createNotification = (sender) => {
    const tpl = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)]
    const target = typeof tpl.targetFn === 'function' ? tpl.targetFn(sender) : null
    // 评论类通知返回对象 { targetId, parentType, parentId }，其他返回字符串 ID
    const targetId   = typeof target === 'object' ? target?.targetId   : target
    const parentType = typeof target === 'object' ? target?.parentType : null
    const parentId   = typeof target === 'object' ? target?.parentId   : null
    return {
        mid: Random.guid(),
        sender,
        text: tpl.text,
        date: Random.datetime('yyyy-MM-dd HH:mm'),
        targetType: tpl.targetType,
        targetId,
        parentType,
        parentId,
    }
}

// 造一个随机对话（含几条历史消息）
const createDialogue = (opponent) => {
    const count = Random.integer(1, 4)
    return {
        mid: Random.guid(),
        opponent,
        sentences: [...Array(count)].map(() => ({
            id: Random.guid(),
            sender: Math.random() > 0.4 ? opponent : null, // 60%对面发，40%我发
            text: Random.cword(5, 30),
            date: Random.datetime('yyyy-MM-dd HH:mm'),
        })),
    }
}

export const getProfileSubdata = Mock.mock(
    /^\/api\/user\/profile\/(.*?)\/(.*?)(\?.*)?$/,
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const match = options.url.match(/\/api\/user\/profile\/(.*?)\/(.*?)(\?|$)/)
        const profileType = match[1]
        const dataType = match[2]

        const [isLogin, uid] = verifyAuthorization(options)
        const dataList = getUserExtension(uid, profileType, dataType)

        // 首次访问空列表 → 随机填数据
        if (dataList.length === 0) {
            const allUsers = getUserList()
            const others = allUsers.filter(u => u.uid !== uid)

            if (profileType === 'follow' && dataType === 'followingList') {
                // 关注列表：随机 8 个用户
                const shuffled = others.sort(() => 0.5 - Math.random()).slice(0, 8)
                dataList.push(...shuffled)
            } else if (profileType === 'message' && dataType === 'dialogueList') {
                // 对话列表：随机 3 个对话
                const shuffled = others.sort(() => 0.5 - Math.random()).slice(0, 3)
                dataList.push(...shuffled.map(u => createDialogue(u)))
            } else if (profileType === 'message' && dataType === 'notificationList') {
                // 通知列表：随机 6 条
                const shuffled = others.sort(() => 0.5 - Math.random()).slice(0, 6)
                dataList.push(...shuffled.map(u => createNotification(u)))
            }
        }

        const sort = url.searchParams.get('sort')
        const page = Number(url.searchParams.get('page'))
        const element = Number(url.searchParams.get('element'))
        const sortList = sortData(dataList, sort, page, element)

        return Mock.mock({
            code: 200,
            message: 'ok',
            data: sortList
        })
    }
)
