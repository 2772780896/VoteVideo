// controllers/commentController.js - 评论相关控制器（优化版）
// 职责：处理HTTP请求、调用服务层、返回响应
// 数据库操作和业务逻辑已移到 services/commentService.js

const commentService = require('../services/commentService')

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
 * 获取评论列表
 * GET /api/comment?sort=1&page=1&element=16&vid=123
 */
const getCommentList = async (req, res) => {
  try {
    const {
      page = 1,
      element = 16,
      sort = '1',  // 默认按热度排序
      vid = null
    } = req.query
    
    // 转换排序参数（兼容前端格式）
    let sortParam = '-createdAt'  // 默认按日期降序
    if (sort === '1') {
      sortParam = '-likeCount'  // 按热度降序
    } else if (sort === '-1') {
      sortParam = 'likeCount'  // 按热度升序
    } else if (sort === 'date') {
      sortParam = 'createdAt'
    } else if (sort === '-date') {
      sortParam = '-createdAt'
    }
    
    // 调用服务层方法
    const result = await commentService.getCommentListData({
      page,
      element,
      sort: sortParam,
      vid
    })
    
    return res.status(200).json({
      code: 200,
      message: '获取成功',
      data: result.data,
      total: result.total
    })
    
  } catch (error) {
    return handleControllerError(res, error, '获取评论列表错误')
  }
}

/**
 * 获取评论详情
 * GET /api/comment/:cid
 */
const getCommentDetail = async (req, res) => {
  try {
    const cid = parseInt(req.params.cid)
    
    // 调用服务层方法
    const commentItem = await commentService.getCommentDetailData(cid)
    
    return sendSuccessResponse(res, commentItem)
    
  } catch (error) {
    // 处理服务层抛出的业务错误（如评论不存在）
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        code: error.statusCode,
        message: error.message,
        data: null
      })
    }
    
    return handleControllerError(res, error, '获取评论详情错误')
  }
}

/**
 * 创建评论
 * POST /api/comment
 * 需要 needToken: true
 */
const createComment = async (req, res) => {
  try {
    const { vid, text, type, pictureList, replyTo_cid } = req.body
    
    // 调用服务层方法
    const comment = await commentService.createComment({
      vid: vid ? parseInt(vid) : null,
      text,
      type: type || 'text',
      pictureList: pictureList || null,
      replyTo_cid: replyTo_cid ? parseInt(replyTo_cid) : null,
      uploader_uid: req.user.uid  // 从JWT中获取
    })
    
    return sendSuccessResponse(res, comment, '创建成功', 201)
    
  } catch (error) {
    return handleControllerError(res, error, '创建评论错误')
  }
}

// 导出控制器函数
module.exports = {
  getCommentList,
  getCommentDetail,
  createComment
}
