// controllers/videoController.js - 视频相关控制器（优化版）
// 职责：处理HTTP请求、调用服务层、返回响应
// 数据库操作和业务逻辑已移到 services/videoService.js

const videoService = require('../services/videoService')

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
 * 获取轮播图
 * GET /api/picture/carousel?number=5
 */
const getCarousel = async (req, res) => {
  try {
    const number = parseInt(req.query.number) || 5
    
    // 调用服务层方法
    const carouselItems = await videoService.getCarouselData(number)
    
    // 返回 { items: [...] } 格式以匹配前端 useData 的 data.items 解包
    return sendSuccessResponse(res, { items: carouselItems })
    
  } catch (error) {
    return handleControllerError(res, error, '获取轮播图错误')
  }
}

/**
 * 获取视频列表（首页推荐）
 * GET /api/video/main?page=1&element=16&sort=-date&q=搜索词
 */
const getVideoList = async (req, res) => {
  try {
    const {
      page = 1,
      element = 16,
      sort = '-date',
      q = '',
      uid
    } = req.query
    
    // 获取当前用户ID（如果已登录）
    const currentUid = req.user?.uid || null
    
    // 调用服务层方法
    const result = await videoService.getVideoListData({
      page,
      element,
      sort,
      q,
      uid,
      currentUid
    })
    
    // 如果已登录，查询交互状态并添加到返回数据
    if (currentUid && result.data && result.data.length > 0) {
      const videoIds = result.data.map(video => video.vid)
      const interactionMap = await videoService.checkVideoInteractions(videoIds, currentUid)
      
      // 将交互状态添加到视频数据
      result.data = result.data.map(video => ({
        ...video,
        isLiked: interactionMap[video.vid]?.isLiked || false,
        isFavourited: interactionMap[video.vid]?.isFavourited || false
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
    return handleControllerError(res, error, '获取视频列表错误')
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
    
    return sendSuccessResponse(res, videoItem)
    
  } catch (error) {
    // 处理服务层抛出的业务错误（如视频不存在）
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        code: error.statusCode,
        message: error.message,
        data: null
      })
    }
    
    return handleControllerError(res, error, '获取视频详情错误')
  }
}

/**
 * 获取相关视频推荐
 * GET /api/video/related?vid=123&sort=-date&page=1&element=5
 */
const getRelatedVideos = async (req, res) => {
  try {
    const {
      vid,
      sort = '-date',
      page = 1,
      element = 5
    } = req.query
    
    // 获取当前用户ID（如果已登录）
    const currentUid = req.user?.uid || null
    
    // 调用服务层方法
    const result = await videoService.getRelatedVideosData({
      vid,
      sort,
      page,
      element,
      currentUid
    })
    
    // 如果已登录，查询交互状态并添加到返回数据
    if (currentUid && result.data && result.data.length > 0) {
      const videoIds = result.data.map(video => video.vid)
      const interactionMap = await videoService.checkVideoInteractions(videoIds, currentUid)
      
      // 将交互状态添加到视频数据
      result.data = result.data.map(video => ({
        ...video,
        isLiked: interactionMap[video.vid]?.isLiked || false,
        isFavourited: interactionMap[video.vid]?.isFavourited || false
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
    return handleControllerError(res, error, '获取相关视频错误')
  }
}

// 导出控制器函数
module.exports = {
  getCarousel,
  getVideoList,
  getVideoDetail,
  getRelatedVideos
}
