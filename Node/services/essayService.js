// services/essayService.js - 文章服务层（继承BaseService）
// 职责：封装数据库操作、业务逻辑、数据格式转换

const { BaseService, MODULE_CONFIG, formatCount, formatDate } = require('./baseService')

// ==================== 数据格式转换函数 ====================

/**
 * 转换文章数据为前端格式
 * @param {object} essay - 数据库文章对象
 * @returns {object} 前端需要的文章对象格式
 */
const transformEssayData = (essay) => {
  const essayData = {
    eid: essay.eid,
    title: essay.title,
    text: essay.text,
    viewCount: formatCount(essay.viewCount),
    commentCount: formatCount(essay.commentCount),
    likeCount: formatCount(essay.likeCount),
    favouriteCount: formatCount(essay.favouriteCount),
    date: formatDate(essay.createdAt)
  }
  
  // 上传者信息
  if (essay.uploader) {
    essayData.uploader = {
      uid: essay.uploader.uid,
      userName: essay.uploader.username,
      profilePictureUrl: essay.uploader.profilePictureUrl
    }
  }
  
  return essayData
}

// ==================== EssayService类 ====================

class EssayService extends BaseService {
  /**
   * 构造函数
   */
  constructor() {
    // 调用父类构造函数，传入模块配置
    super('essay', MODULE_CONFIG.essay)
    
    // 设置数据转换函数
    this.transformFunction = transformEssayData
  }
  
  /**
   * 获取文章详情数据（重写父类方法，可增加阅读量等逻辑）
   * @param {number} eid - 文章ID
   * @returns {Promise<object>} 文章详情数据
   */
  async getEssayDetailData(eid) {
    const essay = await this.getItemData(eid, { throwIfNotFound: true })
    
    // 可以增加阅读量逻辑（如果需要）
    // await this.model.update({
    //   where: { eid: parseInt(eid) },
    //   data: { viewCount: essay.viewCount + 1 }
    // })
    
    return transformEssayData(essay)
  }
}

// 创建实例并导出
const essayService = new EssayService()

module.exports = {
  // 业务服务函数（实例方法）
  getEssayListData: essayService.getListData.bind(essayService),
  getEssayDetailData: essayService.getEssayDetailData.bind(essayService),
  
  // 数据格式转换函数
  transformEssayData,
  
  // 类（供其他模块使用）
  EssayService
}
