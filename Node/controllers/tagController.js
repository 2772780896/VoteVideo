// controllers/tagController.js - 标签相关控制器（优化版）
// 职责：处理HTTP请求、调用服务层、返回响应
// 数据库操作和业务逻辑已移到 services/tagService.js

const tagService = require('../services/tagService')

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
 * 获取标签列表
 * GET /api/tag?sort=-likeCount&page=1&element=16
 */
const getTagList = async (req, res) => {
  try {
    const {
      page = 1,
      element = 16,
      sort = '-likeCount'
    } = req.query
    
    // 调用服务层方法
    const result = await tagService.getTagListData({
      page,
      element,
      sort,
      q: ''  // Tag的搜索字段是tagName，但这里不需要搜索
    })
    
    // 修改：返回前端期望的数据格式
    return res.status(200).json({
      code: 200,
      data: {
        items: result.data,
        total: result.total
      }
    })
    
  } catch (error) {
    return handleControllerError(res, error, '获取标签列表错误')
  }
}

/**
 * 获取标签详情
 * GET /api/tag/:tid
 */
const getTagDetail = async (req, res) => {
  try {
    const tid = parseInt(req.params.tid)
    
    // 调用服务层方法
    const tagItem = await tagService.getTagDetailData(tid)
    
    return sendSuccessResponse(res, tagItem)
    
  } catch (error) {
    // 处理服务层抛出的业务错误（如标签不存在）
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        code: error.statusCode,
        message: error.message,
        data: null
      })
    }
    
    return handleControllerError(res, error, '获取标签详情错误')
  }
}

/**
 * 获取热门标签
 * GET /api/tag/hot?limit=10
 */
const getHotTags = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    
    // 调用服务层方法
    const hotTags = await tagService.getHotTags(limit)
    
    return sendSuccessResponse(res, hotTags)
    
  } catch (error) {
    return handleControllerError(res, error, '获取热门标签错误')
  }
}

// 导出控制器函数
module.exports = {
  getTagList,
  getTagDetail,
  getHotTags
}
