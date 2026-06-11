import Mock from 'mockjs'
import { addCommentList } from '@/mock/publicState'
import { createUser } from './createUser'

const Random = Mock.Random
let maxSubComment = 3

/**
 * 递归创建评论列表
 * @param {number} number - 创建数量
 * @param {Object|null} parentUploader - 父评论的 uploader 信息（顶级评论为 null）
 * @param {number} vid - 所属视频 ID（默认 1）
 */
export const createComment = (number, parentUploader = null, vid = 1) => {
    const commentList = [...Array(number)].map(() => {
        const uploader = createUser(1)[0]
        return {
            cid: Random.integer(1, 999),
            vid,                          // 所属视频 ID
            uploader,
            // 子评论带上父评论 uploader 作为回复目标
            replyTo: parentUploader,
            text: Random.cword(5, 20),
            type: Random.pick(['text', 'picture']),
            viewCount: Random.integer(1000, 99999),
            subCommentCount: Random.integer(0, maxSubComment),
            date: Random.datetime('yyyy-MM-dd'),
            likeCount: Random.integer(200, 20000),
            favouriteCount: Random.integer(100, 10000)
        }
    })
    if (maxSubComment > 1) { maxSubComment = maxSubComment - 1 }

    for (const comment of commentList) {
        if (comment.type === 'picture') {
            comment.pictureCount = Random.integer(1, 2)
            comment.pictureList = [...Array(comment.pictureCount)].map(() => (
                Random.image('1920x1080', Random.color(), Random.color(), 'jpg', Random.string(1, 5))
            ))
        }
        if (comment.subCommentCount !== 0) {
            // 递归时把自己的 uploader 传进去，作为子评论的 replyTo
            comment.subCommentList = createComment(comment.subCommentCount, comment.uploader, vid)
        }
    }
    addCommentList(commentList)
    return commentList
}
