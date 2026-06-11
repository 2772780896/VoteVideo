import Mock from 'mockjs'
import { createVideo } from './createVideo'
import { createEssay } from './createEssay'
import { createPost } from './createPost'
import { createMessage } from './createMessage'
import { createUser } from './createUser'

const Random = Mock.Random
export const createProfile = (number, userName, userPassword, addData={}) => {
    const profileList = [...Array(number)].map( (i) => ({
        uid: Random.integer(1, 999),
        userName: userName,
        userPassword: userPassword,
        info: Random.cword(10,30),
        profilePictureUrl: Random.image('1920x1080', Random.color(), Random.color(), 'jpg', Random.string(1,5)),
        fansCount: Random.integer(100, 9999),
        followCount: Random.integer(50, 1000),
        date: Random.datetime('yyyy-MM-dd'),
        upload: {
            uploadVideoList: createVideo(Random.integer(0,3)),
            uploadEssayList: createEssay(Random.integer(0,3)),
            uploadPostList: createPost(Random.integer(0,3)),
        },
        favourite: {
            'favouriteVideoList': createVideo(Random.integer(0,3), {addDate: Random.datetime('yyyy-MM-dd')}),
            'favouriteEssayList': createEssay(Random.integer(0,3), {addDate: Random.datetime('yyyy-MM-dd')}),
            'favouritePostList': createPost(Random.integer(0,3), {addDate: Random.datetime('yyyy-MM-dd')}),
        },
        history: {
            'historyVideoList': createVideo(Random.integer(0,3), {addDate: Random.datetime('yyyy-MM-dd')}),
            'historyEssayList': createEssay(Random.integer(0,3), {addDate: Random.datetime('yyyy-MM-dd')}),
            'historyPostList': createPost(Random.integer(0,3), {addDate: Random.datetime('yyyy-MM-dd')}),
        },
    }))
    console.log('mockProfileList:', profileList)
    for (let i of profileList) {
        let likeCount = 0
        let favouriteCount = 0
        for (const upload of Object.values(i.upload)) {
            for (const work of upload) {
                likeCount = likeCount + work.likeCount
                favouriteCount = favouriteCount + work.favouriteCount
            }
        }
        i.likeCount = likeCount
        i.favouriteCount = favouriteCount

        const profileUser = {
            uid: i.uid,
            userName: i.userName,
            info: i.info,
            profilePictureUrl: i.profilePictureUrl,
        }
        // i.message = {
        //     dialogueList: createUser(Random.integer(2, 4)).map(user => {
        //         const randomSender = (profileUser, user) => {
        //             const list = [profileUser, user]
        //             const sender = Random.pick(list)
        //             const receiver = list.find(item => item !== sender)
        //             return [sender, receiver]
        //         }
        //         let sentences = [...Array(Random.integer(2, 4))].map(i => {
        //             const [sender, receiver] = randomSender(profileUser, user)
        //             return createMessage(sender, receiver, 1)[0]
        //         })
        //         return {
        //             opponent: user,
        //             sentences: sentences
        //         }
        //     }),
        //     atedMessageList: [...Array(Random.integer(2, 4))].map(i => (
        //         createMessage(createUser(1)[0], profileUser, 1)[0]
        //     )),
        //     praisedMessageList: [...Array(Random.integer(2, 4))].map(i => (
        //         createMessage(createUser(1)[0], profileUser, 1)[0]
        //     )),
        //     systemMessageList: [...Array(Random.integer(2, 4))].map(i => (
        //         createMessage(createUser(1)[0], profileUser, 1)[0]
        //     )),
        // }

        // const followUser = createUser(Random.integer(3, 6))
        // i.followPost = followUser.map(user => (
        //     {uploader: user, post: createPost(Random.integer(5, 10), user.userName)}
        // ))

        // 额外数据的添加
        i = {...i, ...addData}
    } 

    return profileList
}
