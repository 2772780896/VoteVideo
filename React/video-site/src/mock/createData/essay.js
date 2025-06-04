import Mock from 'mockjs'
import { addEssayList } from '../publicState'

const Random = Mock.Random
export const createEssay = (number) => {
    const essayList = [...Array(number)].map( (i) => ({
        eid: Random.integer(1, 999),
        title: Random.cword(8,14),
        coverUrl: Random.image('1920x1080', Random.color(), Random.color(), 'jpg', Random.string(1,5)),
        text: Random.cword(500, 1000),
        viewCount: Random.integer(1000, 99999),
        commentCount: Random.integer(50, 1000),
        uploader: Random.cword(2,6),
        date: Random.datetime('yyyy-MM-dd'),
        likeCount: Random.integer(200, 20000),
        favouriteCount: Random.integer(100, 10000)
    }))
    addEssayList(essayList)
    return essayList
}