// services/videoService.js - 视频服务层（函数式实现）
// 职责：封装数据库操作、业务逻辑、数据格式转换
// 通用逻辑已移到baseService.js

const { createService, MODULE_CONFIG, formatCount, formatDate } = require('./baseService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ==================== 数据格式转换函数 ====================

/**
 * 转换视频数据为前端格式
 * @param {object} video - 数据库视频对象
 * @param {object} options - 转换选项
 * @param {boolean} options.includeVideoUrl - 是否包含视频URL
 * @param {boolean} options.includeTags - 是否包含标签列表
 * @returns {object} 前端需要的视频对象格式
 */
const transformVideoData = (video, options = {}) => {
  const {
    includeVideoUrl = false,
    includeTags = true
  } = options
  
  // 基础视频信息
  const videoData = {
    vid: video.vid,
    coverUrl: video.coverUrl,
    title: video.title,
    viewCount: formatCount(video.viewCount),
    messageCount: formatCount(video.messageCount),
    duration: video.duration,
    date: formatDate(video.createdAt)
  }
  
  // 详情页需要视频URL
  if (includeVideoUrl) {
    videoData.videoUrl = video.videoUrl
  }
  
  // 上传者信息
  if (video.uploader) {
    videoData.uploader = {
      uid: video.uploader.uid,
      userName: video.uploader.username,
      profilePictureUrl: video.uploader.profilePictureUrl
    }
  }
  
  // 标签列表
  if (includeTags && video.videoTags) {
    videoData.tagList = video.videoTags.map(vt => ({
      tid: vt.tag.tid,
      tagName: vt.tag.tagName,
      likeCount: vt.tag.likeCount,
      favouriteCount: vt.tag.favouriteCount,
      commentCount: vt.tag.commentCount
    }))
  }
  
  return videoData
}

/**
 * 转换视频数据为轮播图格式
 * @param {Array} videos - 视频数组
 * @returns {Array} 轮播图数组
 */
const transformToCarouselItems = (videos) => {
  return videos.map(video => ({
    id: video.vid,
    src: video.coverUrl || 'https://via.placeholder.com/1920x1080'
  }))
}

// ==================== 创建基础服务 ====================

// 调用工厂函数创建基础服务
const baseService = createService('video', {
  ...MODULE_CONFIG.video,
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
    select: {
      vid: true,
      coverUrl: true,
      title: true
    }
  })
  
  return transformToCarouselItems(carouselVideos)
}

/**
 * 获取视频详情数据（增加播放量逻辑）
 * @param {number} vid - 视频ID
 * @returns {Promise<object>} 视频详情数据
 */
const getVideoDetailData = async (vid) => {
  const video = await baseService.getItemData(vid, { throwIfNotFound: true })
  
  // 增加播放量
  await prisma.video.update({
    where: { vid: parseInt(vid) },
    data: { viewCount: video.viewCount + 1 }
  })
  
  // 转换数据（详情页需要videoUrl）
  const videoItem = transformVideoData(video, { 
    includeVideoUrl: true, 
    includeTags: true 
  })
  
  // 注意：播放量已经+1，需要重新格式化
  videoItem.viewCount = formatCount(video.viewCount + 1)
  
  return videoItem
}

/**
 * 获取相关视频推荐数据
 * @param {object} options - 查询选项
 * @param {number} options.vid - 当前视频ID
 * @param {string} options.sort - 排序参数
 * @param {number} options.page - 页码
 * @param {number} options.element - 每页数量
 * @returns {Promise<object>} 包含相关视频列表和总数的对象
 */
const getRelatedVideosData = async (options = {}) => {
  const {
    vid,
    sort = '-createdAt',
    page = 1,
    element = 5
  } = options
  
  const { skip, take } = parsePagination(page, element)
  const orderBy = parseSortParam(sort)
  
  // 查询相关视频（排除当前视频）
  const where = {
    vid: { not: parseInt(vid) }
  }
  
  // 并行执行查询
  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        uploader: {
          select: {
            uid: true,
            username: true,
            profilePictureUrl: true
          }
        }
      }
    }),
    prisma.video.count({ where })
  ])
  
  const videoItems = videos.map(video => 
    transformVideoData(video, { includeTags: false })
  )
  
  return {
    data: videoItems,
    total: total
  }
}

// 导入工具函数（用于上面的函数）
const { parsePagination, parseSortParam } = require('./baseService')

// ==================== 导出 ====================

module.exports = {
  // 业务服务函数
  getCarouselData,
  getVideoListData: baseService.getListData,
  getVideoDetailData,
  getRelatedVideosData,
  
  // 数据格式转换函数
  transformVideoData,
  transformToCarouselItems
}
