// services/transformers/essayTransformer.js - 文章数据转换
// 职责：将数据库文章对象转换为前端所需格式

const { formatDate } = require('../baseService')

/**
 * 转换文章数据为前端格式
 * @param {object} essay - 数据库文章对象（含 uploader 关联数据）
 * @returns {object} 前端需要的文章对象格式
 */
const transformEssayData = (essay) => {
  const essayData = {
    eid: essay.eid,
    title: essay.title,
    text: essay.text,
    viewCount: essay.viewCount,
    commentCount: essay.commentCount,
    likeCount: essay.likeCount !== undefined ? essay.likeCount : 0,
    favouriteCount: essay.favouriteCount !== undefined ? essay.favouriteCount : 0,
    reshareCount: essay.reshareCount !== undefined ? essay.reshareCount : 0,
    date: formatDate(essay.date),
    // 交互状态默认为 false，由 interactionService.mergeInteractions 覆盖
    isLiked: false,
    isDisliked: false,
    isFavourited: false,
    isReshared: false
  }

  // 上传者信息
  if (essay.uploader) {
    essayData.uploader = {
      uid: essay.uploader.uid,
      userName: essay.uploader.username,
      profilePictureUrl: essay.uploader.profilePictureUrl
    }
  }

  return essayData
}

module.exports = {
  transformEssayData
}
