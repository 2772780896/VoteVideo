import Mock from 'mockjs'
import { addUserList, addVideoList, addEssayList, addPostList } from "../publicState"
import { createVideo } from './video'
import { createEssay } from './essay'
import { createPost } from './post'

const Random = Mock.Random
export const createUser = (number) => {
    const userList = [...Array(number)].map( (i) => ({
        uid: Random.integer(1, 999),
        userName: Random.cword(2,6),
        info: Random.cword(10,30),
        profilePictureUrl: Random.image('1920x1080', Random.color(), Random.color(), 'jpg', Random.string(1,5)),
        fansCount: Random.integer(100, 9999),
        followCount: Random.integer(50, 1000),
        date: Random.datetime('yyyy-MM-dd'),
        videoList: createVideo(Random.integer(0,3)),
        essayList: createEssay(Random.integer(0,3)),
        postList: createPost(Random.integer(0,3))
    }))
    for (const i of userList) {
        let likeCount = 0
        let favouriteCount = 0
        for (const video of i.videoList) {
            likeCount = likeCount + video.likeCount
            favouriteCount = favouriteCount + video.favouriteCount
        }
        i.likeCount = likeCount
        i.favouriteCount = favouriteCount
    } 
    addUserList(userList)
    return userList
}
