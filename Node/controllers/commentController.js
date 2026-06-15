// controllers/commentController.js - 评论相关控制器
// 职责：处理HTTP请求、调用服务层、返回响应

const commentService = require('../services/commentService')
const { sendSuccess, sendList, sendError } = require('../utils/response')

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
      vid = null,
      eid = null,
      pid = null,
      tid = null,
      following,
      uid
    } = req.query

    // 获取当前用户ID（如果已登录）
    const currentUid = req.user?.uid || null

    // 转换排序参数（兼容前端格式）
    let sortParam = '-date'  // 默认按日期降序
    if (sort === '1') {
      sortParam = '-likeCount'  // 按热度降序
    } else if (sort === '-1') {
      sortParam = 'likeCount'  // 按热度升序
    } else if (sort === 'date') {
      sortParam = 'date'
    } else if (sort === '-date') {
      sortParam = '-date'
    }

    // 调用服务层方法
    const result = await commentService.getCommentListData({
      page,
      element,
      sort: sortParam,
      vid,
      eid,
      pid,
      tid,
      following: following === 'true',
      uid,
      currentUid
    })

    return sendList(res, result)

  } catch (error) {
    return sendError(res, error, '获取评论列表错误')
  }
}

/**
 * 获取评论详情
 * GET /api/comment/:cid
 */
const getCommentDetail = async (req, res) => {
  try {
    const cid = parseInt(req.params.cid)

    // 获取当前用户ID（如果已登录）
    const currentUid = req.user?.uid || null

    // 调用服务层方法
    const commentItem = await commentService.getCommentDetailData(cid, currentUid)

    return sendSuccess(res, commentItem)

  } catch (error) {
    return sendError(res, error, '获取评论详情错误')
  }
}

// 导出控制器函数
module.exports = {
  getCommentList,
  getCommentDetail
}
