// controllers/essayController.js - 文章相关控制器
// 职责：处理HTTP请求、调用服务层、返回响应

const essayService = require('../services/essayService')
const { sendSuccess, sendList, sendError } = require('../utils/response')

// ==================== 控制器函数 ====================

/**
 * 获取文章列表
 * GET /api/essay?page=1&element=16&sort=-viewCount
 */
const getEssayList = async (req, res) => {
  try {
    const {
      page = 1,
      element = 16,
      sort,
      q = '',
      uid,
      following
    } = req.query

    // 获取当前用户ID（如果已登录）
    const currentUid = req.user?.uid || null

    // 调用服务层方法（交互状态已由 baseService.getListData 自动合并）
    const result = await essayService.getEssayListData({
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
    return sendError(res, error, '获取文章列表错误')
  }
}

/**
 * 获取文章详情
 * GET /api/essay/:eid
 */
const getEssayDetail = async (req, res) => {
  try {
    const eid = parseInt(req.params.eid)
    
    // 获取当前用户ID（如果已登录）
    const currentUid = req.user?.uid || null
    
    // 调用服务层方法
    const essayItem = await essayService.getEssayDetailData(eid, currentUid)
    
    return sendSuccess(res, essayItem)
    
  } catch (error) {
    return sendError(res, error, '获取文章详情错误')
  }
}

/**
 * 获取相关文章推荐
 * GET /api/essay/related?eid=xxx&page=1&element=5
 */
const getRelatedEssays = async (req, res) => {
  try {
    const { eid, sort, page = 1, element = 5 } = req.query
    const currentUid = req.user?.uid || null

    const result = await essayService.getRelatedEssaysData({
      eid, sort, page, element, currentUid
    })

    return sendList(res, result)
  } catch (error) {
    return sendError(res, error, '获取相关文章推荐错误')
  }
}

// 导出控制器函数
module.exports = {
  getEssayList,
  getEssayDetail,
  getRelatedEssays
}
