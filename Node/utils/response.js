// utils/response.js - 统一响应工具
// 职责：所有 controller 的响应格式和错误处理

/**
 * 统一成功响应
 * @param {object} res - Express 响应对象
 * @param {any} data - 响应数据
 * @param {string} message - 成功消息
 * @param {number} statusCode - HTTP 状态码
 */
const sendSuccess = (res, data, message = '获取成功', statusCode = 200) => {
  return res.status(statusCode).json({
    code: statusCode,
    message,
    data
  })
}

/**
 * 统一列表响应（自动包装 items + total 格式）
 * @param {object} res - Express 响应对象
 * @param {object} result - service 层返回的 { data, total } 对象
 */
const sendList = (res, result) => {
  return res.status(200).json({
    code: 200,
    data: {
      items: result.data,
      total: result.total
    }
  })
}

/**
 * 统一错误处理
 * - 业务错误（error.statusCode）：返回对应状态码
 * - 未知错误：返回 500
 * @param {object} res - Express 响应对象
 * @param {Error} error - 错误对象
 * @param {string} customMessage - 自定义错误消息
 */
const sendError = (res, error, customMessage = '服务器内部错误') => {
  console.error(`${customMessage}:`, error)

  const statusCode = error.statusCode || 500
  return res.status(statusCode).json({
    code: statusCode,
    message: error.statusCode ? error.message : customMessage,
    data: null
  })
}

module.exports = { sendSuccess, sendList, sendError }
