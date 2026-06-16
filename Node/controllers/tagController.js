// controllers/tagController.js - 标签相关控制器
// 职责：处理HTTP请求、调用服务层、返回响应

const tagService = require('../services/tagService')
const { sendSuccess, sendList, sendError } = require('../utils/response')

// ==================== 控制器函数 ====================

/**
 * 获取标签列表
 * GET /api/tag?sort=-likeCount&page=1&element=16
 */
const getTagList = async (req, res) => {
  try {
    const {
      page = 1,
      element = 16
    } = req.query
    
    // 调用服务层方法（defaultSortField 已配置为 viewCount）
    const result = await tagService.getTagListData({
      page,
      element,
      q: ''  // Tag的搜索字段是tagName，但这里不需要搜索
    })
    
    return sendList(res, result)
    
  } catch (error) {
    return sendError(res, error, '获取标签列表错误')
  }
}

/**
 * 获取标签详情
 * GET /api/tag/:tid
 */
const getTagDetail = async (req, res) => {
  try {
    const tid = parseInt(req.params.tid)

    // 获取当前用户ID（如果已登录）
    const currentUid = req.user?.uid || null

    // 调用服务层方法
    const tagItem = await tagService.getTagDetailData(tid, currentUid)

    return sendSuccess(res, tagItem)

  } catch (error) {
    return sendError(res, error, '获取标签详情错误')
  }
}

/**
 * 获取相关标签推荐
 * GET /api/tag/related?tid=xxx&sort=-likeCount&page=1&element=5
 */
const getRelatedTags = async (req, res) => {
  try {
    const { tid, sort = '-likeCount', page = 1, element = 5 } = req.query
    const currentUid = req.user?.uid || null

    const result = await tagService.getRelatedTagsData({
      tid, sort, page, element, currentUid
    })

    return sendList(res, result)
  } catch (error) {
    return sendError(res, error, '获取相关标签推荐错误')
  }
}

// 导出控制器函数
module.exports = {
  getTagList,
  getTagDetail,
  getRelatedTags
}
