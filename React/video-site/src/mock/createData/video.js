import Mock from 'mockjs'
import { addVideoList } from "../publicState"
import { createTag } from './tag'

const Random = Mock.Random
export const createVideo = (number) => {
    const videoList = [...Array(number)].map( (i) => ({
        vid: Random.integer(1, 999),
        title: Random.cword(8,14),
        coverUrl: Random.image('1920x1080', Random.color(), Random.color(), 'jpg', Random.string(1,5)),
        videoUrl: 'https://cdn.pixabay.com/video/2025/04/29/275633_large.mp4',
        viewCount: Random.integer(1000, 99999),
        messageCount: Random.integer(50, 1000),
        uploader: Random.cword(2,6),
        duration: Random.time('mm:ss'),
        date: Random.datetime('yyyy-MM-dd'),
        likeCount: Random.integer(200, 20000),
        favouriteCount: Random.integer(100, 10000),
        tagList: createTag(Random.integer(5,15))
    }))
    addVideoList(videoList)
    return videoList
}
