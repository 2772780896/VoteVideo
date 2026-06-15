// services/transformers/commentTransformer.js - 评论数据转换
// 职责：将数据库评论对象转换为前端所需格式（含递归子评论）

const { formatDate, safeJsonParse } = require('../baseService')

/**
 * 递归转换评论数据（包括子评论）
 * @param {object} comment - 数据库评论对象（含 uploader/replies/parentComment 关联数据）
 * @returns {object} 前端需要的评论对象格式
 */
const transformCommentData = (comment) => {
  const commentData = {
    cid: comment.cid,
    text: comment.text,
    type: comment.type,
    viewCount: comment.viewCount,
    likeCount: comment.likeCount,
    dislikeCount: comment.dislikeCount !== undefined ? comment.dislikeCount : 0,
    favouriteCount: comment.favouriteCount,
    reshareCount: 0,  // 评论不支持转发，固定返回 0
    subCommentCount: comment.subCommentCount,
    date: formatDate(comment.date),
    // 交互状态默认为 false，由 interactionService.mergeInteractions 覆盖
    isLiked: false,
    isDisliked: false,
    isFavourited: false,
    isReshared: false  // 评论不支持转发，固定返回 false
  }

  // 推断 parentType 和 parentId（用于"查看原内容"链接）
  if (comment.vid) {
    commentData.parentType = 'video'
    commentData.parentId = comment.vid
  } else if (comment.eid) {
    commentData.parentType = 'essay'
    commentData.parentId = comment.eid
  } else if (comment.pid) {
    commentData.parentType = 'post'
    commentData.parentId = comment.pid
  } else if (comment.tid) {
    commentData.parentType = 'tag'
    commentData.parentId = comment.tid
  }

  // 图片列表（type=picture 时有）
  if (comment.pictureList) {
    commentData.pictureList = safeJsonParse(comment.pictureList)
  }

  // 上传者信息（保留原字段名 uploader，同时提供 commenter 别名）
  if (comment.uploader) {
    const uploaderObj = {
      uid: comment.uploader.uid,
      userName: comment.uploader.username,
      profilePictureUrl: comment.uploader.profilePictureUrl
    }
    commentData.uploader = uploaderObj
    commentData.commenter = uploaderObj  // 前端 CommentCard 使用 commenter
  }

  // 回复目标（子评论才有）
  if (comment.parentComment && comment.parentComment.uploader) {
    commentData.replyTo = {
      uid: comment.parentComment.uploader.uid,
      userName: comment.parentComment.uploader.username,
      profilePictureUrl: comment.parentComment.uploader.profilePictureUrl
    }
  }

  // 递归处理子评论（同时提供 subCommentList 和 subComments 别名）
  if (comment.replies && comment.replies.length > 0) {
    const subList = comment.replies.map(reply =>
      transformCommentData(reply)
    )
    commentData.subCommentList = subList
    commentData.subComments = subList  // 前端使用 subComments
  } else {
    commentData.subCommentList = []
    commentData.subComments = []
  }

  return commentData
}

module.exports = {
  transformCommentData
}
