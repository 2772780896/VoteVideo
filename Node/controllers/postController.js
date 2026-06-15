// controllers/postController.js - 动态相关控制器
// 职责：处理HTTP请求、调用服务层、返回响应

const postService = require('../services/postService')
const { sendSuccess, sendList, sendError } = require('../utils/response')

// ==================== 控制器函数 ====================

/**
 * 获取动态列表
 * GET /api/post?sort=-date&page=1&element=16
 */
const getPostList = async (req, res) => {
  try {
    const {
      page = 1,
      element = 16,
      sort = '-date',
      q = '',
      uid,
      following
    } = req.query

    // 获取当前用户ID（如果已登录）
    const currentUid = req.user?.uid || null

    // 调用服务层方法
    const result = await postService.getPostListData({
      page,
      element,
      sort,
      q,
      uid,
      following: following === 'true',
      currentUid
    })
    
    return sendList(res, result)
    
  } catch (error) {
    return sendError(res, error, '获取动态列表错误')
  }
}

/**
 * 获取动态详情
 * GET /api/post/:pid
 */
const getPostDetail = async (req, res) => {
  try {
    const pid = parseInt(req.params.pid)
    
    // 获取当前用户ID（如果已登录）
    const currentUid = req.user?.uid || null
    
    // 调用服务层方法
    const postItem = await postService.getPostDetailData(pid, currentUid)
    
    return sendSuccess(res, postItem)
    
  } catch (error) {
    return sendError(res, error, '获取动态详情错误')
  }
}

/**
 * 获取相关动态推荐
 * GET /api/post/related?pid=xxx&sort=-date&page=1&element=5
 */
const getRelatedPosts = async (req, res) => {
  try {
    const { pid, sort = '-date', page = 1, element = 5 } = req.query
    const currentUid = req.user?.uid || null

    const result = await postService.getRelatedPostsData({
      pid, sort, page, element, currentUid
    })

    return sendList(res, result)
  } catch (error) {
    return sendError(res, error, '获取相关动态推荐错误')
  }
}

// 导出控制器函数
module.exports = {
  getPostList,
  getPostDetail,
  getRelatedPosts
}
