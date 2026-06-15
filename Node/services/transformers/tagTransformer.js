// services/transformers/tagTransformer.js - 标签数据转换
// 职责：将数据库标签对象转换为前端所需格式

/**
 * 转换标签数据为前端格式
 * @param {object} tag - 数据库标签对象
 * @returns {object} 前端需要的标签对象格式
 */
const transformTagData = (tag) => {
  return {
    tid: tag.tid,
    tagName: tag.tagName,
    viewCount: tag.viewCount !== undefined ? tag.viewCount : 0,
    likeCount: tag.likeCount,
    favouriteCount: tag.favouriteCount,
    commentCount: tag.commentCount,
    reshareCount: 0,  // 标签不支持转发，固定返回 0
    // 交互状态默认为 false，由 interactionService.mergeInteractions 覆盖
    isLiked: false,
    isDisliked: false,
    isFavourited: false,
    isReshared: false  // 标签不支持转发，固定返回 false
  }
}

module.exports = {
  transformTagData
}
