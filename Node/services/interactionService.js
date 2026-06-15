// services/interactionService.js - 通用交互状态查询服务
// 职责：统一查询用户对各种媒体的交互状态（点赞/收藏/转发/踩）

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * 统一的媒体类型配置表
 * - likes/favourites/reshares/dislikes: 交互状态查询（interactionService 用）
 * - model/idField/name: 资源定位（interactService 用）
 * - hasHistory/hasReply: 功能开关（interactService 用）
 */
const INTERACTION_CONFIG = {
  video: {
    model: 'video', idField: 'vid', name: '视频',
    likes: true, favourites: true, reshares: true,  dislikes: false,
    hasHistory: true, hasReply: true
  },
  essay: {
    model: 'essay', idField: 'eid', name: '文章',
    likes: true, favourites: true, reshares: true,  dislikes: false,
    hasHistory: true, hasReply: true
  },
  post: {
    model: 'post',  idField: 'pid', name: '动态',
    likes: true, favourites: true, reshares: true,  dislikes: false,
    hasHistory: true, hasReply: true
  },
  comment: {
    model: 'comment', idField: 'cid', name: '评论',
    likes: true, favourites: true, reshares: false, dislikes: true,
    hasHistory: false, hasReply: true
  },
  tag: {
    model: 'tag',   idField: 'tid', name: '标签',
    likes: true, favourites: true, reshares: false, dislikes: true,
    hasHistory: false, hasReply: true
  },
}

/**
 * 通用交互状态查询
 * @param {string} type - 媒体类型 ('video' | 'essay' | 'post' | 'comment' | 'tag')
 * @param {Array<number>} ids - 资源 ID 数组
 * @param {number} currentUid - 当前用户 ID
 * @returns {Promise<object>} 交互状态映射
 *   示例: { 123: { isLiked: true, isFavourited: false, isReshared: false } }
 */
const checkInteractions = async (type, ids, currentUid) => {
  if (!currentUid || !ids || ids.length === 0) {
    return {}
  }

  const config = INTERACTION_CONFIG[type]
  if (!config) {
    console.warn(`[interactionService] 未知的媒体类型: ${type}`)
    return {}
  }

  // 根据配置并行查询各交互表
  const queries = []

  if (config.likes) {
    queries.push(
      prisma.userLike.findMany({
        where: { uid: currentUid, type, item_id: { in: ids } },
        select: { item_id: true }
      }).then(rows => rows.map(r => r.item_id))
    )
  } else {
    queries.push(Promise.resolve([]))
  }

  if (config.favourites) {
    queries.push(
      prisma.userFavourite.findMany({
        where: { uid: currentUid, type, item_id: { in: ids } },
        select: { item_id: true }
      }).then(rows => rows.map(r => r.item_id))
    )
  } else {
    queries.push(Promise.resolve([]))
  }

  if (config.reshares) {
    queries.push(
      prisma.userReshare.findMany({
        where: { uid: currentUid, type, item_id: { in: ids } },
        select: { item_id: true }
      }).then(rows => rows.map(r => r.item_id))
    )
  } else {
    queries.push(Promise.resolve([]))
  }

  if (config.dislikes) {
    queries.push(
      prisma.userDislike.findMany({
        where: { uid: currentUid, type, item_id: { in: ids } },
        select: { item_id: true }
      }).then(rows => rows.map(r => r.item_id))
    )
  } else {
    queries.push(Promise.resolve([]))
  }

  const [likeIds, favouriteIds, reshareIds, dislikeIds] = await Promise.all(queries)

  // 构建 Set 用于 O(1) 查找
  const likeSet = new Set(likeIds)
  const favouriteSet = new Set(favouriteIds)
  const reshareSet = new Set(reshareIds)
  const dislikeSet = new Set(dislikeIds)

  // 构建映射表
  const interactionMap = {}
  ids.forEach(id => {
    interactionMap[id] = {
      isLiked: likeSet.has(id),
      isFavourited: favouriteSet.has(id),
      isReshared: config.reshares ? reshareSet.has(id) : false,
      isDisliked: config.dislikes ? dislikeSet.has(id) : false
    }
  })

  return interactionMap
}

/**
 * 批量合并交互状态到数据列表
 * @param {string} type - 媒体类型
 * @param {Array} items - 数据列表
 * @param {string} idField - ID 字段名（如 'vid', 'eid', 'pid'）
 * @param {number} currentUid - 当前用户 ID
 * @returns {Promise<Array>} 合并了交互状态的数据列表（原地修改）
 */
const mergeInteractions = async (type, items, idField, currentUid) => {
  if (!currentUid || !items || items.length === 0) {
    return items
  }

  const ids = items.map(item => item[idField])
  const interactionMap = await checkInteractions(type, ids, currentUid)

  items.forEach(item => {
    const id = item[idField]
    if (interactionMap[id]) {
      Object.assign(item, interactionMap[id])
    }
  })

  return items
}

// ==================== 导出 ====================

module.exports = {
  checkInteractions,
  mergeInteractions,
  INTERACTION_CONFIG
}
