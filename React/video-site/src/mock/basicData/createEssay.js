import Mock from 'mockjs'
import { addEssay } from '@/mock/publicState'
import { createUser } from './createUser'

const Random = Mock.Random
export const createEssay = (number=1, addData={}) => {
    const essayList = [...Array(number)].map( (i) => ({
        eid: Random.integer(1, 999),
        title: Random.cword(8,14),
        coverUrl: Random.image('1920x1080', Random.color(), Random.color(), 'jpg', Random.string(1,5)),
        text: Random.cword(500, 1000),
        viewCount: Random.integer(1000, 99999),
        commentCount: Random.integer(50, 1000),
        uploader: createUser()[0],
        date: Random.datetime('yyyy-MM-dd'),
        likeCount: Random.integer(200, 20000),
        favouriteCount: Random.integer(100, 10000)
    }))

    // 额外数据的添加
    for (let i of essayList) {
        i = {...i, ...addData}
    } 
    
    addEssay(essayList)
    return essayList
}