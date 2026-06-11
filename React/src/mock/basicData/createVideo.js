import Mock from 'mockjs'
import { addVideo } from '@/mock/publicState'
import { createTag } from './createTag'
import { createUser } from './createUser'

const Random = Mock.Random
export const createVideo = (number=1, addData={}) => {
    const videoList = [...Array(number)].map( (i) => ({
        vid: Random.integer(1, 999),
        title: Random.cword(8,14),
        coverUrl: Random.image('1920x1080', Random.color(), Random.color(), 'jpg', Random.string(1,5)),
        videoUrl: 'http://vjs.zencdn.net/v/oceans.mp4',
        viewCount: Random.integer(1000, 99999),
        messageCount: Random.integer(50, 1000),
        uploader: createUser()[0],
        duration: Random.time('mm:ss'),
        date: Random.datetime('yyyy-MM-dd'),
        likeCount: Random.integer(200, 20000),
        favouriteCount: Random.integer(100, 10000),
        tagList: createTag(Random.integer(5,15))
    })).map( (i) => ({...i, ...addData})) // 使用map方法直接添加额外数据
    
    addVideo(videoList)
    return videoList
}
