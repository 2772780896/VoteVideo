// services/tagService.js - 标签服务层
// 职责：标签业务逻辑编排

const { createService, MODULE_CONFIG } = require('./baseService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { mergeInteractions } = require('./interactionService')
const { transformTagData } = require('./transformers/tagTransformer')

// ==================== 创建基础服务 ====================

const baseService = createService('tag', {
  ...MODULE_CONFIG.tag,
  mediaType: 'tag',
  transformFunction: transformTagData
})

// ==================== 业务服务函数 ====================

/**
 * 获取标签详情数据
 * @param {number} tid - 标签ID
 * @param {number} currentUid - 当前用户ID
 * @returns {Promise<object>} 标签详情数据
 */
const getTagDetailData = async (tid, currentUid = null) => {
  // 1. 查数据库
  const tag = await baseService.getItemData(tid, { throwIfNotFound: true })

  // 2. 转换格式
  const tagItem = transformTagData(tag)

  // 3. 查交互状态
  if (currentUid) {
    await mergeInteractions('tag', [tagItem], 'tid', currentUid)
  }

  return tagItem
}

/**
 * 根据标签名称获取标签
 * @param {string} tagName - 标签名称
 * @returns {Promise<object|null>} 标签对象或null
 */
const getTagByName = async (tagName) => {
  const tag = await prisma.tag.findFirst({ where: { tagName } })
  return tag ? transformTagData(tag) : null
}

/**
 * 获取相关标签推荐数据（委托给 baseService.getRelatedData）
 */
const getRelatedTagsData = (options = {}) => {
  return baseService.getRelatedData({
    sort: '-likeCount',  // 标签默认按热度排序
    ...options,
    currentId: options.tid
  })
}

// ==================== 导出 ====================

module.exports = {
  getTagListData: baseService.getListData,
  getTagDetailData,
  getTagByName,
  getRelatedTagsData,
  transformTagData
}
