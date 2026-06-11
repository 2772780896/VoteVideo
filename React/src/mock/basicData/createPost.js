import Mock from 'mockjs'
import { addPost } from '@/mock/publicState'
import { createVideo } from './createVideo'
import { createUser } from './createUser'


const Random = Mock.Random
export const createPost = (number=1, addData={}) => {
    const postList = [...Array(number)].map( (i) => ({
        pid: Random.integer(1, 999),
        title: Random.cword(8,14),
        viewCount: Random.integer(1000, 99999),
        commentCount: Random.integer(50, 1000),
        uploader: createUser()[0],
        duration: Random.time('mm:ss'),
        date: Random.datetime('yyyy-MM-dd'),
        likeCount: Random.integer(200, 20000),
        favouriteCount: Random.integer(100, 10000),
        // 三种内容 slots 独立决定有无，支持复合类型
        text:        Random.boolean() ? Random.cword(50, 200) : null,
        videoList:   Random.boolean() ? createVideo(1) : null,
        pictureList: Random.boolean() ? [...Array(Random.integer(1, 6))].map(() =>
            Random.image('1920x1080', Random.color(), Random.color(), 'jpg', Random.string(1, 5))
        ) : null,
    })).map( (i) => ({...i, ...addData}))
    addPost(postList)
    return postList
}