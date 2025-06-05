import Mock from 'mockjs'
import { addTagList } from '../publicState'

const Random = Mock.Random
export const createTag = (number) => {
    const tagList = [...Array(number)].map( (i) => ({
        tid: Random.integer(1, 999),
        tagName: Random.cword(3, 7),
        viewCount: Random.integer(1000, 99999),
        commentCount: Random.integer(50, 1000),
        date: Random.datetime('yyyy-MM-dd'),
        likeCount: Random.integer(200, 20000),
        favouriteCount: Random.integer(100, 10000)
    }))
    addTagList(tagList)
    return tagList
}