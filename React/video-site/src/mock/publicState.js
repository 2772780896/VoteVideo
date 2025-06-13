// 用户所上传的内容
let userExtension = []
// 获取指定用户的指定上传内容
export const getUserExtension = (uid, uploadType) => { 
    for (let i of userExtension) {
        if (i.uid === uid) {
            return i[uploadType]
        }
    }
}
// 添加指定用户的指定上传内容
const addUserExtension = (uid, uploadType, data) => {
    for (let i of userExtension) {
        if (i.uid === uid) {
            i[uploadType].push(data)
        }
    }
}

let userList = []
export const getUserList = () => { return userList }
// 创建用户时同时添加到userList和userExtension中
export const addUser = (dataList) => { 
    userList.push(...dataList) 
    userExtension.push(...dataList.map(user => ({
        uid: user.uid,
        videoList: [],
        essayList: [],
        postList: [],
        hitory: [],
        favourite: [],
        message: [],
    })))
}

let videoList = []
export const getVideoList = () => { return videoList }
// 添加视频时同时添加到videoList和userExtension对应用户的videoList中
export const addVideo = (dataList) => { 
    videoList.push(...dataList) 
    for (let i of dataList) {
        const user = i.uploader
        addUserExtension(user.uid, 'videoList', i)
    }
}

let essayList = []
export const getEssayList = () => { return essayList }
// 添加文章时同时添加到essayList和userExtension对应用户的essayList中
export const addEssay = (dataList) => { 
    essayList.push(...dataList) 
    for (let i of dataList) {
        const user = i.uploader
        addUserExtension(user.uid, 'essayList', i)
    }
}

let postList = []
export const getPostList = () => { return postList }
// 添加动态时同时添加到postList和userExtension对应用户的postList中
export const addPost = (dataList) => { 
    postList.push(...dataList) 
    for (let i of dataList) {
        const user = i.uploader
        addUserExtension(user.uid, 'postList', i)
    }
}

let tagList = []
export const getTagList = () => { return tagList }
export const addTagList = (dataList) => { tagList.push(...dataList) }

let commentList = []
export const getCommentList = () => { return commentList }
export const addCommentList = (dataList) => { commentList.push(...dataList) }

let messageList = []
export const getMessageList = () => { return messageList }
export const addMessageList = (dataList) => { messageList.push(...dataList) }
