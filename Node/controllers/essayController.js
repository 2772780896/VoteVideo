// controllers/essayController.js - 文章相关控制器（优化版）
// 职责：处理HTTP请求、调用服务层、返回响应
// 数据库操作和业务逻辑已移到 services/essayService.js

const essayService = require('../services/essayService')

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
 * 获取文章列表
 * GET /api/essay?sort=-date&page=1&element=16
 */
const getEssayList = async (req, res) => {
  try {
    const {
      page = 1,
      element = 16,
      sort = '-date',
      q = ''
    } = req.query
    
    // 调用服务层方法
    const result = await essayService.getEssayListData({
      page,
      element,
      sort,
      q
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
    return handleControllerError(res, error, '获取文章列表错误')
  }
}

/**
 * 获取文章详情
 * GET /api/essay/:eid
 */
const getEssayDetail = async (req, res) => {
  try {
    const eid = parseInt(req.params.eid)
    
    // 调用服务层方法
    const essayItem = await essayService.getEssayDetailData(eid)
    
    return sendSuccessResponse(res, essayItem)
    
  } catch (error) {
    // 处理服务层抛出的业务错误（如文章不存在）
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        code: error.statusCode,
        message: error.message,
        data: null
      })
    }
    
    return handleControllerError(res, error, '获取文章详情错误')
  }
}

// 导出控制器函数
module.exports = {
  getEssayList,
  getEssayDetail
}
