// services/transformers/videoTransformer.js - 视频数据转换
// 职责：将数据库视频对象转换为前端所需格式

const { formatDate } = require('../baseService')

/**
 * 转换视频数据为前端格式
 * @param {object} video - 数据库视频对象（来自 Prisma，含 uploader/videoTags 关联数据）
 * @param {object} options - 转换选项
 * @param {boolean} options.includeVideoUrl - 是否包含视频URL（详情页需要）
 * @param {boolean} options.includeTags - 是否包含标签列表
 * @returns {object} 前端需要的视频对象格式
 */
const transformVideoData = (video, options = {}) => {
  const {
    includeVideoUrl = false,
    includeTags = true
  } = options

  const videoData = {
    vid: video.vid,
    coverUrl: video.coverUrl,
    title: video.title,
    viewCount: video.viewCount,
    commentCount: video.commentCount,
    likeCount: video.likeCount !== undefined ? video.likeCount : 0,
    favouriteCount: video.favouriteCount !== undefined ? video.favouriteCount : 0,
    reshareCount: video.reshareCount !== undefined ? video.reshareCount : 0,
    duration: video.duration,
    date: formatDate(video.date),
    // 交互状态默认为 false，由 interactionService.mergeInteractions 覆盖
    isLiked: false,
    isDisliked: false,
    isFavourited: false,
    isReshared: false
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
      profilePictureUrl: video.uploader.profilePictureUrl,
      isFollowing: false  // 由外部查询覆盖
    }
  }

  // 标签列表（从 videoTags 中间表拍平）
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
 * @returns {Array} 轮播图数组 [{ id, src }]
 */
const transformToCarouselItems = (videos) => {
  return videos.map(video => ({
    id: video.vid,
    src: video.coverUrl || 'https://via.placeholder.com/1920x1080'
  }))
}

module.exports = {
  transformVideoData,
  transformToCarouselItems
}
