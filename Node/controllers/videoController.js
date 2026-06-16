// controllers/videoController.js - 视频相关控制器
// 职责：处理HTTP请求、调用服务层、返回响应

const videoService = require('../services/videoService')
const { sendSuccess, sendList, sendError } = require('../utils/response')

// ==================== 控制器函数 ====================

/**
 * 获取轮播图
 * GET /api/picture/carousel?number=5
 */
const getCarousel = async (req, res) => {
  try {
    const number = parseInt(req.query.number) || 5
    
    // 调用服务层方法
    const carouselItems = await videoService.getCarouselData(number)
    
    // 返回 { items: [...] } 格式以匹配前端 useData 的 data.items 解包
    return sendSuccess(res, { items: carouselItems })
    
  } catch (error) {
    return sendError(res, error, '获取轮播图错误')
  }
}

/**
 * 获取视频列表（首页推荐）
 * GET /api/video/main?page=1&element=16&sort=-viewCount&q=搜索词
 */
const getVideoList = async (req, res) => {
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
    const result = await videoService.getVideoListData({
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
    return sendError(res, error, '获取视频列表错误')
  }
}

/**
 * 获取视频详情
 * GET /api/video/:vid
 */
const getVideoDetail = async (req, res) => {
  try {
    const vid = parseInt(req.params.vid)
    
    // 获取当前用户ID（如果已登录）
    const currentUid = req.user?.uid || null
    
    // 调用服务层方法
    const videoItem = await videoService.getVideoDetailData(vid, currentUid)
    
    return sendSuccess(res, videoItem)
    
  } catch (error) {
    return sendError(res, error, '获取视频详情错误')
  }
}

/**
 * 获取相关视频推荐
 * GET /api/video/related?vid=123&page=1&element=5
 * 兼容前端发送 videoId 参数名（RelatedSidebar 通用组件使用）
 */
const getRelatedVideos = async (req, res) => {
  try {
    const {
      sort,
      page = 1,
      element = 5
    } = req.query

    // 兼容前端发送 videoId 或 vid
    const vid = req.query.vid || req.query.videoId
    
    // 获取当前用户ID（如果已登录）
    const currentUid = req.user?.uid || null
    
    // 调用服务层方法（交互状态已由 getRelatedVideosData 自动合并）
    const result = await videoService.getRelatedVideosData({
      vid,
      sort,
      page,
      element,
      currentUid
    })

    return sendList(res, result)

  } catch (error) {
    return sendError(res, error, '获取相关视频错误')
  }
}

// 导出控制器函数
module.exports = {
  getCarousel,
  getVideoList,
  getVideoDetail,
  getRelatedVideos
}
