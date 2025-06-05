import Mock from 'mockjs'
import { addCommentList } from '../publicState'
import { createUser } from './user'

const Random = Mock.Random
let maxSubComment = 3
export const createComment = (number) => {
    const commentList = [...Array(number)].map( (i) => ({
        cid: Random.integer(1, 999),
        uploader: createUser(1)[0],
        text: Random.cword(5,20),
        type: Random.pick(['text', 'picture']),
        viewCount: Random.integer(1000, 99999),
        subCommentCount: Random.integer(0, maxSubComment),
        date: Random.datetime('yyyy-MM-dd'),
        likeCount: Random.integer(200, 20000),
        favouriteCount: Random.integer(100, 10000)
    }))
    if (maxSubComment > 1) {maxSubComment = maxSubComment - 1}

    // 根据type的不同而额外添加不同的数据
    for (const i of commentList) {
        if (i.type === 'picture') {
            i.pictureCount = Random.integer(1, 2)
            i.pictureList = [...Array(i.pictureCount)].map( (i) => (
                Random.image('1920x1080', Random.color(), Random.color(), 'jpg', Random.string(1,5))
            ))
        }
        if (i.subCommentCount !== 0) {
            i.subCommentList = createComment(i.subCommentCount)
        }
    }
    addCommentList(commentList)
    return commentList
}