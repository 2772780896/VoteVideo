// services/videoService.js - 视频服务层
// 职责：视频业务逻辑编排（查数据库 → 调 transformer → 调 interactionService）

const { createService, MODULE_CONFIG } = require('./baseService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { checkInteractions, mergeInteractions } = require('./interactionService')
const { transformVideoData, transformToCarouselItems } = require('./transformers/videoTransformer')

// ==================== 创建基础服务 ====================

const baseService = createService('video', {
  ...MODULE_CONFIG.video,
  mediaType: 'video',
  transformFunction: (video) => transformVideoData(video, { includeTags: true })
})

// ==================== 业务服务函数 ====================

/**
 * 获取轮播图数据
 * @param {number} number - 轮播图数量
 * @returns {Promise<Array>} 轮播图数据数组
 */
const getCarouselData = async (number = 5) => {
  const carouselVideos = await prisma.video.findMany({
    take: number,
    orderBy: { viewCount: 'desc' },
    select: { vid: true, coverUrl: true, title: true }
  })
  return transformToCarouselItems(carouselVideos)
}

/**
 * 获取视频详情数据（增加播放量 + 交互状态）
 * @param {number} vid - 视频ID
 * @param {number} currentUid - 当前用户ID
 * @returns {Promise<object>} 视频详情数据
 */
const getVideoDetailData = async (vid, currentUid = null) => {
  // 1. 增加播放量（原子操作）
  await prisma.video.update({
    where: { vid: parseInt(vid) },
    data: { viewCount: { increment: 1 } }
  })

  // 2. 查数据库拿视频数据
  const video = await baseService.getItemData(vid, { throwIfNotFound: true })

  // 3. 转换格式（详情页需要 videoUrl 和标签）
  const videoItem = transformVideoData(video, {
    includeVideoUrl: true,
    includeTags: true
  })

  // 4. 查交互状态
  if (currentUid) {
    await mergeInteractions('video', [videoItem], 'vid', currentUid)
  }

  return videoItem
}

/**
 * 获取相关视频推荐数据（委托给 baseService.getRelatedData，支持 tag 匹配）
 */
const getRelatedVideosData = (options = {}) => {
  return baseService.getRelatedData({
    ...options,
    currentId: options.vid,
    transformFunction: (video) => transformVideoData(video, { includeTags: false })
  })
}

// ==================== 导出 ====================

module.exports = {
  // 业务服务函数
  getCarouselData,
  getVideoListData: baseService.getListData,
  getVideoDetailData,
  getRelatedVideosData,

  // 数据格式转换函数（外部可能直接使用）
  transformVideoData,
  transformToCarouselItems,

  // 交互状态查询（外部可能直接使用）
  checkInteractions: (ids, uid) => checkInteractions('video', ids, uid),
  mergeInteractions: (items, uid) => mergeInteractions('video', items, 'vid', uid)
}
