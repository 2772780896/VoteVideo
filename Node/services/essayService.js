// services/essayService.js - 文章服务层
// 职责：文章业务逻辑编排

const { createService, MODULE_CONFIG } = require('./baseService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { checkInteractions, mergeInteractions } = require('./interactionService')
const { transformEssayData } = require('./transformers/essayTransformer')

// ==================== 创建基础服务 ====================

const baseService = createService('essay', {
  ...MODULE_CONFIG.essay,
  mediaType: 'essay',
  transformFunction: transformEssayData
})

// ==================== 业务服务函数 ====================

/**
 * 获取文章详情数据
 * @param {number} eid - 文章ID
 * @param {number} currentUid - 当前用户ID
 * @returns {Promise<object>} 文章详情数据
 */
const getEssayDetailData = async (eid, currentUid = null) => {
  // 1. 查数据库
  const essay = await baseService.getItemData(eid, { throwIfNotFound: true })

  // 2. 转换格式
  const essayItem = transformEssayData(essay)

  // 3. 查交互状态
  if (currentUid) {
    await mergeInteractions('essay', [essayItem], 'eid', currentUid)
  }

  return essayItem
}

/**
 * 获取相关文章推荐数据（委托给 baseService.getRelatedData）
 */
const getRelatedEssaysData = (options = {}) => {
  return baseService.getRelatedData({
    ...options,
    currentId: options.eid
  })
}

// ==================== 导出 ====================

module.exports = {
  getEssayListData: baseService.getListData,
  getEssayDetailData,
  getRelatedEssaysData,
  transformEssayData,
  checkInteractions: (ids, uid) => checkInteractions('essay', ids, uid)
}
