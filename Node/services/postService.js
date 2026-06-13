// services/postService.js - 动态服务层（函数式实现）
// 职责：封装数据库操作、业务逻辑、数据格式转换

const { createService, MODULE_CONFIG, formatCount, formatDate } = require('./baseService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ==================== 数据格式转换函数 ====================

/**
 * 查询用户对动态列表的交互状态
 * @param {Array} postIds - 动态ID数组
 * @param {number} currentUid - 当前用户ID
 * @returns {Promise<object>} 交互状态映射 { pid: { isLiked: boolean } }
 */
const checkPostInteractions = async (postIds, currentUid) => {
  if (!currentUid || !postIds || postIds.length === 0) {
    return {}
  }
  
  // 查询用户的点赞记录（动态只有点赞，没有收藏）
  const likes = await prisma.userLike.findMany({
    where: {
      uid: currentUid,
      type: 'post',
      item_id: { in: postIds }
    },
    select: { item_id: true }
  })
  
  // 构建交互状态映射
  const likeSet = new Set(likes.map(like => like.item_id))
  
  const interactionMap = {}
  postIds.forEach(pid => {
    interactionMap[pid] = {
      isLiked: likeSet.has(pid)
    }
  })
  
  return interactionMap
}

/**
 * 转换动态数据为前端格式
 * @param {object} post - 数据库动态对象
 * @param {object} options - 转换选项
 * @param {number} options.currentUid - 当前用户ID（用于检查是否已点赞/收藏）
 * @returns {object} 前端需要的动态对象格式
 */
const transformPostData = (post, options = {}) => {
  const { currentUid = null } = options
  
  const postData = {
    pid: post.pid,
    text: post.text,
    pictureList: post.pictureList ? JSON.parse(post.pictureList) : null,
    videoList: post.videoList ? JSON.parse(post.videoList) : null,
    viewCount: formatCount(post.viewCount),
    commentCount: formatCount(post.commentCount),
    likeCount: formatCount(post.likeCount),
    date: formatDate(post.date),
    // 检查当前用户是否已点赞
    isLiked: currentUid ? post.likes?.some(like => like.uid === currentUid) || false : false
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

// ==================== 创建基础服务 ====================

// 调用工厂函数创建基础服务
const baseService = createService('post', {
  ...MODULE_CONFIG.post,
  transformFunction: transformPostData
})

// ==================== 业务服务函数 ====================

/**
 * 获取动态详情数据
 * @param {number} pid - 动态ID
 * @param {number} currentUid - 当前用户ID（用于检查是否已点赞）
 * @returns {Promise<object>} 动态详情数据
 */
const getPostDetailData = async (pid, currentUid = null) => {
  const post = await baseService.getItemData(pid, { 
    throwIfNotFound: true
  })
  
  const postItem = transformPostData(post)
  
  // 如果已登录，查询交互状态并添加到返回数据
  if (currentUid) {
    const interactionMap = await checkPostInteractions([parseInt(pid)], currentUid)
    if (interactionMap[pid]) {
      postItem.isLiked = interactionMap[pid].isLiked
    }
  }
  
  return postItem
}

/**
 * 创建动态（处理JSON字段）
 * @param {object} data - 创建数据
 * @returns {Promise<object>} 创建后的动态对象
 */
const createPost = async (data) => {
  // 处理JSON字段
  const postData = { ...data }
  
  if (postData.pictureList && Array.isArray(postData.pictureList)) {
    postData.pictureList = JSON.stringify(postData.pictureList)
  }
  
  if (postData.videoList && Array.isArray(postData.videoList)) {
    postData.videoList = JSON.stringify(postData.videoList)
  }
  
  return await prisma.post.create({
    data: postData,
    include: MODULE_CONFIG.post.includeConfig
  })
}

// ==================== 导出 ====================

module.exports = {
  // 业务服务函数
  getPostListData: baseService.getListData,
  getPostDetailData,
  createPost,
  
  // 数据格式转换函数
  transformPostData,
  
  // 交互状态查询函数
  checkPostInteractions
}
