// services/postService.js - 动态服务层
// 职责：动态业务逻辑编排

const { createService, MODULE_CONFIG } = require('./baseService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { checkInteractions, mergeInteractions } = require('./interactionService')
const { transformPostData } = require('./transformers/postTransformer')

// ==================== 创建基础服务 ====================

const baseService = createService('post', {
  ...MODULE_CONFIG.post,
  mediaType: 'post',
  transformFunction: transformPostData
})

// ==================== 业务服务函数 ====================

/**
 * 获取动态详情数据
 * @param {number} pid - 动态ID
 * @param {number} currentUid - 当前用户ID
 * @returns {Promise<object>} 动态详情数据
 */
const getPostDetailData = async (pid, currentUid = null) => {
  // 1. 查数据库
  const post = await baseService.getItemData(pid, { throwIfNotFound: true })

  // 2. 转换格式
  const postItem = transformPostData(post)

  // 3. 查交互状态
  if (currentUid) {
    await mergeInteractions('post', [postItem], 'pid', currentUid)
  }

  return postItem
}

/**
 * 获取相关动态推荐数据（委托给 baseService.getRelatedData）
 */
const getRelatedPostsData = (options = {}) => {
  return baseService.getRelatedData({
    ...options,
    currentId: options.pid
  })
}

/**
 * 创建动态（处理JSON字段）
 * @param {object} data - 创建数据
 * @returns {Promise<object>} 创建后的动态对象
 */
const createPost = async (data) => {
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
  getPostListData: baseService.getListData,
  getPostDetailData,
  getRelatedPostsData,
  createPost,
  transformPostData,
  checkInteractions: (ids, uid) => checkInteractions('post', ids, uid)
}
