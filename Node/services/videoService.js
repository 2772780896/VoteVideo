// services/videoService.js - 视频服务层（函数式实现）
// 职责：封装数据库操作、业务逻辑、数据格式转换
// 通用逻辑已移到baseService.js

const { createService, MODULE_CONFIG, formatCount, formatDate } = require('./baseService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ==================== 数据格式转换函数 ====================

/**
 * 查询用户对视频列表的交互状态
 * @param {Array} videoIds - 视频ID数组
 * @param {number} currentUid - 当前用户ID
 * @returns {Promise<object>} 交互状态映射 { vid: { isLiked: boolean, isFavourited: boolean } }
 */
const checkVideoInteractions = async (videoIds, currentUid) => {
  if (!currentUid || !videoIds || videoIds.length === 0) {
    return {}
  }
  
  // 查询用户的点赞记录
  const likes = await prisma.userLike.findMany({
    where: {
      uid: currentUid,
      type: 'video',
      item_id: { in: videoIds }
    },
    select: { item_id: true }
  })
  
  // 查询用户的收藏记录
  const favourites = await prisma.userFavourite.findMany({
    where: {
      uid: currentUid,
      type: 'video',
      item_id: { in: videoIds }
    },
    select: { item_id: true }
  })
  
  // 构建交互状态映射
  const likeSet = new Set(likes.map(like => like.item_id))
  const favouritesSet = new Set(favourites.map(fav => fav.item_id))
  
  const interactionMap = {}
  videoIds.forEach(vid => {
    interactionMap[vid] = {
      isLiked: likeSet.has(vid),
      isFavourited: favouritesSet.has(vid)
    }
  })
  
  return interactionMap
}

/**
 * 转换视频数据为前端格式
 * @param {object} video - 数据库视频对象
 * @param {object} options - 转换选项
 * @param {boolean} options.includeVideoUrl - 是否包含视频URL
 * @param {boolean} options.includeTags - 是否包含标签列表
 * @param {number} options.currentUid - 当前用户ID（用于检查是否已点赞/收藏）
 * @returns {object} 前端需要的视频对象格式
 */
const transformVideoData = (video, options = {}) => {
  const {
    includeVideoUrl = false,
    includeTags = true,
    currentUid = null
  } = options
  
  // 基础视频信息
  const videoData = {
    vid: video.vid,
    coverUrl: video.coverUrl,
    title: video.title,
    viewCount: formatCount(video.viewCount),
    commentCount: formatCount(video.commentCount),
    duration: video.duration,
    date: formatDate(video.date),
    // 检查当前用户是否已点赞/收藏
    isLiked: currentUid ? video.likes?.some(like => like.uid === currentUid) || false : false,
    isFavourited: currentUid ? video.favourites?.some(fav => fav.uid === currentUid) || false : false
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
 * @param {number} currentUid - 当前用户ID（用于检查是否已点赞/收藏）
 * @returns {Promise<object>} 视频详情数据
 */
const getVideoDetailData = async (vid, currentUid = null) => {
  // 增加播放量（使用 increment 原子操作，避免读取格式化后的 viewCount）
  await prisma.video.update({
    where: { vid: parseInt(vid) },
    data: { viewCount: { increment: 1 } }
  })
  
  // 重新读取更新后的视频数据
  const video = await baseService.getItemData(vid, { 
    throwIfNotFound: true
  })
  
  // 转换数据（详情页需要videoUrl）
  const videoItem = transformVideoData(video, { 
    includeVideoUrl: true, 
    includeTags: true
  })
  
  // 如果已登录，查询交互状态并添加到返回数据
  if (currentUid) {
    const interactionMap = await checkVideoInteractions([parseInt(vid)], currentUid)
    if (interactionMap[vid]) {
      videoItem.isLiked = interactionMap[vid].isLiked
      videoItem.isFavourited = interactionMap[vid].isFavourited
    }
  }
  
  return videoItem
}

/**
 * 获取相关视频推荐数据
 * @param {object} options - 查询选项
 * @param {number} options.vid - 当前视频ID
 * @param {string} options.sort - 排序参数
 * @param {number} options.page - 页码
 * @param {number} options.element - 每页数量
 * @param {number} options.currentUid - 当前用户ID（用于检查是否已点赞/收藏）
 * @returns {Promise<object>} 包含相关视频列表和总数的对象
 */
const getRelatedVideosData = async (options = {}) => {
  const {
    vid,
    sort = '-date',
    page = 1,
    element = 5,
    currentUid = null
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
        },
        likes: {
          select: {
            uid: true
          }
        },
        favourites: {
          select: {
            uid: true
          }
        }
      }
    }),
    prisma.video.count({ where })
  ])
  
  const videoItems = videos.map(video => 
    transformVideoData(video, { includeTags: false, currentUid })
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
  transformToCarouselItems,
  
  // 交互状态查询函数
  checkVideoInteractions
}
