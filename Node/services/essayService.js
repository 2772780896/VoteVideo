// services/essayService.js - 文章服务层（函数式实现）
// 职责：封装数据库操作、业务逻辑、数据格式转换

const { createService, MODULE_CONFIG, formatCount, formatDate } = require('./baseService')

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
    date: formatDate(essay.date)
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

// ==================== 创建基础服务 ====================

// 调用工厂函数创建基础服务
const baseService = createService('essay', {
  ...MODULE_CONFIG.essay,
  transformFunction: transformEssayData
})

// ==================== 业务服务函数 ====================

/**
 * 获取文章详情数据
 * @param {number} eid - 文章ID
 * @returns {Promise<object>} 文章详情数据
 */
const getEssayDetailData = async (eid) => {
  const essay = await baseService.getItemData(eid, { throwIfNotFound: true })
  
  // 可以增加阅读量逻辑（如果需要）
  // await prisma.essay.update({
  //   where: { eid: parseInt(eid) },
  //   data: { viewCount: essay.viewCount + 1 }
  // })
  
  return transformEssayData(essay)
}

// ==================== 导出 ====================

module.exports = {
  // 业务服务函数
  getEssayListData: baseService.getListData,
  getEssayDetailData,
  
  // 数据格式转换函数
  transformEssayData
}
