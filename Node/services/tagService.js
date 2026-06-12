// services/tagService.js - 标签服务层（函数式实现）
// 职责：封装数据库操作、业务逻辑、数据格式转换
// 特殊点：Tag没有上传者信息，数据结构较简单

const { createService, MODULE_CONFIG, formatCount } = require('./baseService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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

// ==================== 创建基础服务 ====================

// 调用工厂函数创建基础服务
const baseService = createService('tag', {
  ...MODULE_CONFIG.tag,
  transformFunction: transformTagData
})

// ==================== 业务服务函数 ====================

/**
 * 获取标签详情数据
 * @param {number} tid - 标签ID
 * @returns {Promise<object>} 标签详情数据
 */
const getTagDetailData = async (tid) => {
  const tag = await baseService.getItemData(tid, { throwIfNotFound: true })
  
  return transformTagData(tag)
}

/**
 * 根据标签名称获取标签
 * @param {string} tagName - 标签名称
 * @returns {Promise<object|null>} 标签对象或null
 */
const getTagByName = async (tagName) => {
  const tag = await prisma.tag.findFirst({
    where: { tagName }
  })
  
  if (tag) {
    return transformTagData(tag)
  }
  
  return null
}

/**
 * 获取热门标签
 * @param {number} limit - 数量限制
 * @returns {Promise<Array>} 热门标签数组
 */
const getHotTags = async (limit = 10) => {
  const tags = await prisma.tag.findMany({
    orderBy: { likeCount: 'desc' },
    take: limit
  })
  
  return tags.map(tag => transformTagData(tag))
}

// ==================== 导出 ====================

module.exports = {
  // 业务服务函数
  getTagListData: baseService.getListData,
  getTagDetailData,
  getTagByName,
  getHotTags,
  
  // 数据格式转换函数
  transformTagData
}
