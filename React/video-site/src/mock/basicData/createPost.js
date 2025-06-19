import Mock from 'mockjs'
import { addPost } from '@/mock/publicState'
import { createVideo } from './createVideo'
import { createUser } from './createUser'


const Random = Mock.Random
export const createPost = (number=1, addData={}) => {
    const postList = [...Array(number)].map( (i) => ({
        pid: Random.integer(1, 999),
        title: Random.cword(8,14),
        type: Random.pick(['video', 'text', 'picture']),
        viewCount: Random.integer(1000, 99999),
        commentCount: Random.integer(50, 1000),
        uploader: createUser()[0],
        duration: Random.time('mm:ss'),
        date: Random.datetime('yyyy-MM-dd'),
        likeCount: Random.integer(200, 20000),
        favouriteCount: Random.integer(100, 10000)
    }))

    // 根据type的不同而额外添加不同的数据
    for (let i of postList) {
        if (i.type === 'video') {
            i.videoList = createVideo(i.uploader, 1)
        }else if (i.type === 'text') {
            i.text = Random.cword(100, 300)
        }else if (i.type === 'picture') {
            i.text = Random.cword(100, 300)
            i.pictureCount = Random.integer(1, 9)
            i.pictureList = [...Array(i.pictureCount)].map( (i) => (
                Random.image('1920x1080', Random.color(), Random.color(), 'jpg', Random.string(1,5))
            ))
        }

        // 额外数据的添加
        i = {...i, ...addData}
    }
    addPost(postList)
    return postList
}