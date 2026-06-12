// services/postService.js - 动态服务层（继承BaseService）
// 职责：封装数据库操作、业务逻辑、数据格式转换

const { BaseService, MODULE_CONFIG, formatCount, formatDate } = require('./baseService')

// ==================== 数据格式转换函数 ====================

/**
 * 转换动态数据为前端格式
 * @param {object} post - 数据库动态对象
 * @returns {object} 前端需要的动态对象格式
 */
const transformPostData = (post) => {
  const postData = {
    pid: post.pid,
    text: post.text,
    pictureList: post.pictureList ? JSON.parse(post.pictureList) : null,
    videoList: post.videoList ? JSON.parse(post.videoList) : null,
    viewCount: formatCount(post.viewCount),
    commentCount: formatCount(post.commentCount),
    likeCount: formatCount(post.likeCount),
    date: formatDate(post.createdAt)
  }
  
  // 上传者信息
  if (post.uploader) {
    postData.uploader = {
      uid: post.uploader.uid,
      userName: post.uploader.username,
      profilePictureUrl: post.uploader.profilePictureUrl
    }
  }
  
  return postData
}

// ==================== PostService类 ====================

class PostService extends BaseService {
  /**
   * 构造函数
   */
  constructor() {
    // 调用父类构造函数，传入模块配置
    super('post', MODULE_CONFIG.post)
    
    // 设置数据转换函数
    this.transformFunction = transformPostData
  }
  
  /**
   * 获取动态详情数据
   * @param {number} pid - 动态ID
   * @returns {Promise<object>} 动态详情数据
   */
  async getPostDetailData(pid) {
    const post = await this.getItemData(pid, { throwIfNotFound: true })
    
    return transformPostData(post)
  }
  
  /**
   * 创建动态（重写父类方法，处理JSON字段）
   * @param {object} data - 创建数据
   * @returns {Promise<object>} 创建后的动态对象
   */
  async createPost(data) {
    // 处理JSON字段
    const postData = { ...data }
    
    if (postData.pictureList && Array.isArray(postData.pictureList)) {
      postData.pictureList = JSON.stringify(postData.pictureList)
    }
    
    if (postData.videoList && Array.isArray(postData.videoList)) {
      postData.videoList = JSON.stringify(postData.videoList)
    }
    
    return await this.model.create({
      data: postData,
      include: this.includeConfig
    })
  }
}

// 创建实例并导出
const postService = new PostService()

module.exports = {
  // 业务服务函数（实例方法）
  getPostListData: postService.getListData.bind(postService),
  getPostDetailData: postService.getPostDetailData.bind(postService),
  createPost: postService.createPost.bind(postService),
  
  // 数据格式转换函数
  transformPostData,
  
  // 类（供其他模块使用）
  PostService
}
