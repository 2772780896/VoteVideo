// services/transformers/postTransformer.js - 动态数据转换
// 职责：将数据库动态对象转换为前端所需格式

const { formatDate, safeJsonParse } = require('../baseService')

/**
 * 转换动态数据为前端格式
 * @param {object} post - 数据库动态对象（含 uploader 关联数据）
 * @returns {object} 前端需要的动态对象格式
 */
const transformPostData = (post) => {
  const postData = {
    pid: post.pid,
    title: post.title || null,
    text: post.text,
    pictureList: safeJsonParse(post.pictureList),
    videoList: safeJsonParse(post.videoList),
    viewCount: post.viewCount,
    commentCount: post.commentCount,
    likeCount: post.likeCount !== undefined ? post.likeCount : 0,
    favouriteCount: post.favouriteCount !== undefined ? post.favouriteCount : 0,
    reshareCount: post.reshareCount !== undefined ? post.reshareCount : 0,
    date: formatDate(post.date),
    // 交互状态默认为 false，由 interactionService.mergeInteractions 覆盖
    isLiked: false,
    isDisliked: false,
    isFavourited: false,
    isReshared: false
  }

  // 上传者信息
  if (post.uploader) {
    postData.uploader = {
      uid: post.uploader.uid,
      userName: post.uploader.username,
      profilePictureUrl: post.uploader.profilePictureUrl
    }
  }

  return postData
}

module.exports = {
  transformPostData
}
