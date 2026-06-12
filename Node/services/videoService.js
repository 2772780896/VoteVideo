// services/videoService.js - 视频服务层（继承BaseService）
// 职责：封装数据库操作、业务逻辑、数据格式转换
// 通用逻辑已移到baseService.js

const { BaseService, MODULE_CONFIG, formatCount, formatDate } = require('./baseService')

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

// ==================== VideoService类 ====================

class VideoService extends BaseService {
  /**
   * 构造函数
   */
  constructor() {
    // 调用父类构造函数，传入模块配置
    super('video', MODULE_CONFIG.video)
    
    // 设置数据转换函数
    this.transformFunction = (video) => transformVideoData(video, { includeTags: true })
  }
  
  /**
   * 获取轮播图数据
   * @param {number} number - 轮播图数量
   * @returns {Promise<Array>} 轮播图数据数组
   */
  async getCarouselData(number = 5) {
    const carouselVideos = await this.model.findMany({
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
   * 获取视频详情数据（重写父类方法，增加播放量逻辑）
   * @param {number} vid - 视频ID
   * @returns {Promise<object>} 视频详情数据
   */
  async getVideoDetailData(vid) {
    const video = await this.getItemData(vid, { throwIfNotFound: true })
    
    // 增加播放量
    await this.model.update({
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
  async getRelatedVideosData(options = {}) {
    const {
      vid,
      sort = '-createdAt',
      page = 1,
      element = 5
    } = options
    
    // 使用父类的方法获取分页和排序参数
    const { skip, take } = this._parsePagination(page, element)
    const orderBy = this._parseSortParam(sort)
    
    // 查询相关视频（排除当前视频）
    const where = {
      vid: { not: parseInt(vid) }
    }
    
    // 并行执行查询
    const [videos, total] = await Promise.all([
      this.model.findMany({
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
      this.count(where)
    ])
    
    const videoItems = videos.map(video => 
      transformVideoData(video, { includeTags: false })
    )
    
    return {
      data: videoItems,
      total: total
    }
  }
  
  // 辅助方法：解析分页参数（内部使用）
  _parsePagination(page, element) {
    const skip = (parseInt(page) - 1) * parseInt(element)
    const take = parseInt(element)
    return { skip, take }
  }
  
  // 辅助方法：解析排序参数（内部使用）
  _parseSortParam(sort, defaultField = 'createdAt') {
    let orderBy = {}
    if (!sort || sort === '') {
      orderBy[defaultField] = 'desc'
      return orderBy
    }
    
    if (sort.startsWith('-')) {
      const field = sort.substring(1)
      orderBy[field] = 'desc'
    } else {
      orderBy[sort] = 'asc'
    }
    
    return orderBy
  }
}

// 创建实例并导出
const videoService = new VideoService()

module.exports = {
  // 业务服务函数（实例方法）
  getCarouselData: videoService.getCarouselData.bind(videoService),
  getVideoListData: videoService.getListData.bind(videoService),
  getVideoDetailData: videoService.getVideoDetailData.bind(videoService),
  getRelatedVideosData: videoService.getRelatedVideosData.bind(videoService),
  
  // 数据格式转换函数
  transformVideoData,
  transformToCarouselItems,
  
  // 类（供其他模块使用）
  VideoService
}
