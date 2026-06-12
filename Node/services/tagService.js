// services/tagService.js - 标签服务层（继承BaseService）
// 职责：封装数据库操作、业务逻辑、数据格式转换
// 特殊点：Tag没有上传者信息，数据结构较简单

const { BaseService, MODULE_CONFIG, formatCount } = require('./baseService')

// ==================== 数据格式转换函数 ====================

/**
 * 转换标签数据为前端格式
 * @param {object} tag - 数据库标签对象
 * @returns {object} 前端需要的标签对象格式
 */
const transformTagData = (tag) => {
  const tagData = {
    tid: tag.tid,
    tagName: tag.tagName,
    likeCount: formatCount(tag.likeCount),
    favouriteCount: formatCount(tag.favouriteCount),
    commentCount: formatCount(tag.commentCount)
  }
  
  return tagData
}

// ==================== TagService类 ====================

class TagService extends BaseService {
  /**
   * 构造函数
   */
  constructor() {
    // 调用父类构造函数，传入模块配置
    super('tag', MODULE_CONFIG.tag)
    
    // 设置数据转换函数
    this.transformFunction = transformTagData
  }
  
  /**
   * 获取标签详情数据
   * @param {number} tid - 标签ID
   * @returns {Promise<object>} 标签详情数据
   */
  async getTagDetailData(tid) {
    const tag = await this.getItemData(tid, { throwIfNotFound: true })
    
    return transformTagData(tag)
  }
  
  /**
   * 根据标签名称获取标签（自定义方法）
   * @param {string} tagName - 标签名称
   * @returns {Promise<object|null>} 标签对象或null
   */
  async getTagByName(tagName) {
    const tag = await this.model.findFirst({
      where: { tagName }
    })
    
    if (tag && this.transformFunction) {
      return this.transformFunction(tag)
    }
    
    return tag
  }
  
  /**
   * 获取热门标签（自定义方法）
   * @param {number} limit - 数量限制
   * @returns {Promise<Array>} 热门标签数组
   */
  async getHotTags(limit = 10) {
    const tags = await this.model.findMany({
      orderBy: { likeCount: 'desc' },
      take: limit
    })
    
    if (this.transformFunction) {
      return tags.map(tag => this.transformFunction(tag))
    }
    
    return tags
  }
}

// 创建实例并导出
const tagService = new TagService()

module.exports = {
  // 业务服务函数（实例方法）
  getTagListData: tagService.getListData.bind(tagService),
  getTagDetailData: tagService.getTagDetailData.bind(tagService),
  getTagByName: tagService.getTagByName.bind(tagService),
  getHotTags: tagService.getHotTags.bind(tagService),
  
  // 数据格式转换函数
  transformTagData,
  
  // 类（供其他模块使用）
  TagService
}
