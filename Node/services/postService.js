// services/postService.js - 动态服务层（函数式实现）
// 职责：封装数据库操作、业务逻辑、数据格式转换

const { createService, MODULE_CONFIG, formatCount, formatDate } = require('./baseService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ==================== 数据格式转换函数 ====================

/**
 * 转换动态数据为前端格式
 * @param {object} post - 数据库动态对象
 * @returns {object} 前端需要的动态对象格式
 */
const transformPostData = (post) => {
  const postData = {
    pid: post.pid,
    text: post.text,
    pictureList: post.pictureList ? JSON.parse(post.pictureList) : null,
    videoList: post.videoList ? JSON.parse(post.videoList) : null,
    viewCount: formatCount(post.viewCount),
    commentCount: formatCount(post.commentCount),
    likeCount: formatCount(post.likeCount),
    date: formatDate(post.createdAt)
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
 * @returns {Promise<object>} 动态详情数据
 */
const getPostDetailData = async (pid) => {
  const post = await baseService.getItemData(pid, { throwIfNotFound: true })
  
  return transformPostData(post)
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
  transformPostData
}
