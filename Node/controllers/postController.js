// controllers/postController.js - 动态相关控制器（优化版）
// 职责：处理HTTP请求、调用服务层、返回响应
// 数据库操作和业务逻辑已移到 services/postService.js

const postService = require('../services/postService')

// ==================== 统一错误处理 ====================

/**
 * 统一错误处理函数
 * @param {object} res - Express响应对象
 * @param {Error} error - 错误对象
 * @param {string} customMessage - 自定义错误消息
 * @param {number} statusCode - HTTP状态码（默认500）
 */
const handleControllerError = (res, error, customMessage = '服务器内部错误', statusCode = 500) => {
  console.error(`${customMessage}:`, error)
  return res.status(statusCode).json({
    code: statusCode,
    message: customMessage,
    data: null
  })
}

/**
 * 统一成功响应函数
 * @param {object} res - Express响应对象
 * @param {any} data - 响应数据
 * @param {string} message - 成功消息（默认'获取成功'）
 * @param {number} statusCode - HTTP状态码（默认200）
 */
const sendSuccessResponse = (res, data, message = '获取成功', statusCode = 200) => {
  return res.status(statusCode).json({
    code: statusCode,
    message,
    data
  })
}

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
      q = ''
    } = req.query
    
    // 获取当前用户ID（如果已登录）
    const currentUid = req.user?.uid || null
    
    // 调用服务层方法
    const result = await postService.getPostListData({
      page,
      element,
      sort,
      q
    })
    
    // 如果已登录，查询交互状态并添加到返回数据
    if (currentUid && result.data && result.data.length > 0) {
      const postIds = result.data.map(post => post.pid)
      const interactionMap = await postService.checkPostInteractions(postIds, currentUid)
      
      // 将交互状态添加到动态数据
      result.data = result.data.map(post => ({
        ...post,
        isLiked: interactionMap[post.pid]?.isLiked || false
      }))
    }
    
    // 修改：返回前端期望的数据格式
    return res.status(200).json({
      code: 200,
      data: {
        items: result.data,
        total: result.total
      }
    })
    
  } catch (error) {
    return handleControllerError(res, error, '获取动态列表错误')
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
    
    return sendSuccessResponse(res, postItem)
    
  } catch (error) {
    // 处理服务层抛出的业务错误（如动态不存在）
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        code: error.statusCode,
        message: error.message,
        data: null
      })
    }
    
    return handleControllerError(res, error, '获取动态详情错误')
  }
}

/**
 * 创建动态
 * POST /api/post
 * 需要 needToken: true
 */
const createPost = async (req, res) => {
  try {
    const { text, pictureList, videoList } = req.body
    
    // 调用服务层方法
    const post = await postService.createPost({
      text,
      pictureList: pictureList || null,
      videoList: videoList || null,
      uploader_uid: req.user.uid  // 从JWT中获取
    })
    
    return sendSuccessResponse(res, post, '创建成功', 201)
    
  } catch (error) {
    return handleControllerError(res, error, '创建动态错误')
  }
}

// 导出控制器函数
module.exports = {
  getPostList,
  getPostDetail,
  createPost
}
