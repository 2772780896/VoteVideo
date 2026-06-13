// services/essayService.js - 文章服务层（函数式实现）
// 职责：封装数据库操作、业务逻辑、数据格式转换

const { createService, MODULE_CONFIG, formatCount, formatDate } = require('./baseService')

// ==================== 数据格式转换函数 ====================

/**
 * 查询用户对文章列表的交互状态
 * @param {Array} essayIds - 文章ID数组
 * @param {number} currentUid - 当前用户ID
 * @returns {Promise<object>} 交互状态映射 { eid: { isLiked: boolean, isFavourited: boolean } }
 */
const checkEssayInteractions = async (essayIds, currentUid) => {
  if (!currentUid || !essayIds || essayIds.length === 0) {
    return {}
  }
  
  // 查询用户的点赞记录
  const likes = await prisma.userLike.findMany({
    where: {
      uid: currentUid,
      type: 'essay',
      item_id: { in: essayIds }
    },
    select: { item_id: true }
  })
  
  // 查询用户的收藏记录
  const favourites = await prisma.userFavourite.findMany({
    where: {
      uid: currentUid,
      type: 'essay',
      item_id: { in: essayIds }
    },
    select: { item_id: true }
  })
  
  // 构建交互状态映射
  const likeSet = new Set(likes.map(like => like.item_id))
  const favouritesSet = new Set(favourites.map(fav => fav.item_id))
  
  const interactionMap = {}
  essayIds.forEach(eid => {
    interactionMap[eid] = {
      isLiked: likeSet.has(eid),
      isFavourited: favouritesSet.has(eid)
    }
  })
  
  return interactionMap
}

/**
 * 转换文章数据为前端格式
 * @param {object} essay - 数据库文章对象
 * @param {object} options - 转换选项
 * @param {number} options.currentUid - 当前用户ID（用于检查是否已点赞/收藏）
 * @returns {object} 前端需要的文章对象格式
 */
const transformEssayData = (essay, options = {}) => {
  const { currentUid = null } = options
  
  const essayData = {
    eid: essay.eid,
    title: essay.title,
    text: essay.text,
    viewCount: formatCount(essay.viewCount),
    commentCount: formatCount(essay.commentCount),
    likeCount: essay.likeCount !== undefined ? essay.likeCount : 0,
    favouriteCount: essay.favouriteCount !== undefined ? essay.favouriteCount : 0,
    reshareCount: essay.reshareCount !== undefined ? essay.reshareCount : 0,
    date: formatDate(essay.date),
    // 检查当前用户是否已点赞/收藏
    isLiked: currentUid ? essay.likes?.some(like => like.uid === currentUid) || false : false,
    isFavourited: currentUid ? essay.favourites?.some(fav => fav.uid === currentUid) || false : false,
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

// ==================== 创建基础服务 ====================

// 调用工厂函数创建基础服务
const baseService = createService('essay', {
  ...MODULE_CONFIG.essay,
  transformFunction: transformEssayData
})

// ==================== 业务服务函数 ====================

/**
 * 获取文章详情数据
 * @param {number} eid - 文章ID
 * @param {number} currentUid - 当前用户ID（用于检查是否已点赞/收藏）
 * @returns {Promise<object>} 文章详情数据
 */
const getEssayDetailData = async (eid, currentUid = null) => {
  const essay = await baseService.getItemData(eid, { 
    throwIfNotFound: true
  })
  
  // 可以增加阅读量逻辑（如果需要）
  // await prisma.essay.update({
  //   where: { eid: parseInt(eid) },
  //   data: { viewCount: essay.viewCount + 1 }
  // })
  
  const essayItem = transformEssayData(essay)
  
  // 如果已登录，查询交互状态并添加到返回数据
  if (currentUid) {
    const interactionMap = await checkEssayInteractions([parseInt(eid)], currentUid)
    if (interactionMap[eid]) {
      essayItem.isLiked = interactionMap[eid].isLiked
      essayItem.isFavourited = interactionMap[eid].isFavourited
    }
  }
  
  return essayItem
}

// ==================== 导出 ====================

module.exports = {
  // 业务服务函数
  getEssayListData: baseService.getListData,
  getEssayDetailData,
  
  // 数据格式转换函数
  transformEssayData,
  
  // 交互状态查询函数
  checkEssayInteractions
}
