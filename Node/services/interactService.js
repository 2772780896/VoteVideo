// services/interactService.js - 交互相关服务（点赞、收藏、关注等）

// 引入 Prisma Client
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// --- 资源类型配置映射表 ---
// 用途：消除 if-else 链条，用配置驱动代码
const RESOURCE_CONFIG = {
  video: {
    model: 'video',
    idField: 'vid',
    name: '视频',
    hasLike: true,
    hasFavourite: true,
    hasReshare: true,
    hasDislike: false
  },
  essay: {
    model: 'essay',
    idField: 'eid',
    name: '文章',
    hasLike: true,
    hasFavourite: true,
    hasReshare: true,
    hasDislike: false
  },
  post: {
    model: 'post',
    idField: 'pid',
    name: '动态',
    hasLike: true,
    hasFavourite: true,
    hasReshare: true,
    hasDislike: false
  },
  comment: {
    model: 'comment',
    idField: 'cid',
    name: '评论',
    hasLike: true,
    hasFavourite: false,
    hasReshare: false,
    hasDislike: true
  },
  tag: {
    model: 'tag',
    idField: 'tid',
    name: '标签',
    hasLike: true,
    hasFavourite: false,
    hasReshare: false,
    hasDislike: false
  }
}

// --- 通用的资源查询函数 ---
// 参数：type (资源类型), id (资源ID)
// 返回：资源对象
// 用途：查询资源是否存在，不存在则抛出错误
async function findResource(type, id) {
  // 1. 获取配置
  const config = RESOURCE_CONFIG[type]
  if (!config) {
    throw new Error(`不支持的资源类型: ${type}`)
  }

  // 2. 查询资源
  const model = prisma[config.model]
  const resource = await model.findUnique({
    where: { [config.idField]: parseInt(id) }
  })

  // 3. 检查是否存在
  if (!resource) {
    throw new Error(`${config.name}不存在`)
  }

  return resource
}

// --- 通用的点赞/取消点赞函数 ---
// 参数：uid (用户ID), type (资源类型), id (资源ID), method (HTTP方法: 'POST' 或 'DELETE')
// 返回：更新后的资源对象
// 用途：更新资源的 likeCount 字段，并记录用户点赞记录到 UserLike 表
async function toggleLike(uid, type, id, method) {
  // 1. 查询资源是否存在
  const resource = await findResource(type, id)

  // 2. 检查该资源类型是否支持点赞
  const config = RESOURCE_CONFIG[type]
  if (!config.hasLike) {
    throw new Error(`${config.name}不支持点赞`)
  }

  // 3. 根据 HTTP 方法执行点赞或取消点赞
  if (method === 'POST') {
    // 点赞：插入记录到 UserLike 表
    await prisma.userLike.create({
      data: {
        uid: uid,
        type: type,
        item_id: parseInt(id)
      }
    })

    // 更新资源的 likeCount
    const model = prisma[config.model]
    const updated = await model.update({
      where: { [config.idField]: parseInt(id) },
      data: { likeCount: { increment: 1 } }
    })

    return updated
  } else {
    // 取消点赞：删除记录从 UserLike 表
    await prisma.userLike.delete({
      where: {
        uid_type_item_id: {
          uid: uid,
          type: type,
          item_id: parseInt(id)
        }
      }
    })

    // 更新资源的 likeCount
    const model = prisma[config.model]
    const updated = await model.update({
      where: { [config.idField]: parseInt(id) },
      data: { likeCount: { decrement: 1 } }
    })

    return updated
  }
}

// --- 通用的收藏/取消收藏函数 ---
// 参数：uid (用户ID), type (资源类型), id (资源ID), method (HTTP方法)
// 返回：{ success: true, message: '收藏成功' }
// 用途：更新 UserFavourite 表和资源的 favouriteCount 字段
async function toggleFavourite(uid, type, id, method) {
  // 1. 查询资源是否存在
  const resource = await findResource(type, id)

  // 2. 检查该资源类型是否支持收藏
  const config = RESOURCE_CONFIG[type]
  if (!config.hasFavourite) {
    throw new Error(`${config.name}不支持收藏`)
  }

  // 3. 根据 HTTP 方法执行收藏或取消收藏
  if (method === 'POST') {
    // 收藏：插入记录到 UserFavourite 表
    await prisma.userFavourite.create({
      data: {
        uid: uid,
        type: type,
        item_id: parseInt(id)
      }
    })

    // 更新资源的 favouriteCount
    const model = prisma[config.model]
    await model.update({
      where: { [config.idField]: parseInt(id) },
      data: { favouriteCount: { increment: 1 } }
    })

    return { success: true, message: '收藏成功' }
  } else {
    // 取消收藏：删除记录从 UserFavourite 表
    await prisma.userFavourite.delete({
      where: {
        uid_type_item_id: {
          uid: uid,
          type: type,
          item_id: parseInt(id)
        }
      }
    })

    // 更新资源的 favouriteCount
    const model = prisma[config.model]
    await model.update({
      where: { [config.idField]: parseInt(id) },
      data: { favouriteCount: { decrement: 1 } }
    })

    return { success: true, message: '取消收藏成功' }
  }
}

// --- 通用的关注/取消关注函数 ---
// 参数：uid (当前用户ID), targetUid (目标用户ID)
// 返回：{ success: true, message: '关注成功' 或 '取消关注成功' }
// 用途：更新 UserFollowing 表和用户的 followerCount、followingCount 字段
async function toggleFollow(uid, targetUid, method) {
  // 1. 不能关注自己
  if (uid === targetUid) {
    throw new Error('不能关注自己')
  }

  // 2. 检查目标用户是否存在
  const targetUser = await prisma.user.findUnique({
    where: { uid: targetUid }
  })

  if (!targetUser) {
    throw new Error('用户不存在')
  }

  // 3. 根据 HTTP 方法执行关注或取消关注
  if (method === 'POST') {
    // 关注：插入记录到 UserFollowing 表
    await prisma.userFollowing.create({
      data: {
        uid: uid,
        following_uid: targetUid
      }
    })

    // 更新粉丝数（被关注的人）
    await prisma.user.update({
      where: { uid: targetUid },
      data: { followerCount: { increment: 1 } }
    })

    // 更新关注数（当前用户）
    await prisma.user.update({
      where: { uid: uid },
      data: { followingCount: { increment: 1 } }
    })

    return { success: true, message: '关注成功' }
  } else {
    // 取消关注：删除记录从 UserFollowing 表
    await prisma.userFollowing.delete({
      where: {
        uid_following_uid: {
          uid: uid,
          following_uid: targetUid
        }
      }
    })

    // 更新粉丝数（被关注的人）
    await prisma.user.update({
      where: { uid: targetUid },
      data: { followerCount: { decrement: 1 } }
    })

    // 更新关注数（当前用户）
    await prisma.user.update({
      where: { uid: uid },
      data: { followingCount: { decrement: 1 } }
    })

    return { success: true, message: '取消关注成功' }
  }
}


// --- 通用的转发/取消转发函数 ---
async function toggleReshare(uid, type, id, method) {
  const resource = await findResource(type, id)
  const config = RESOURCE_CONFIG[type]
  if (!config.hasReshare) {
    throw new Error(`${config.name}不支持转发`)
  }

  if (method === 'POST') {
    await prisma.userReshare.create({
      data: { uid, type, item_id: parseInt(id) }
    })
    const model = prisma[config.model]
    await model.update({
      where: { [config.idField]: parseInt(id) },
      data: { reshareCount: { increment: 1 } }
    })
    return { success: true, message: '转发成功' }
  } else {
    await prisma.userReshare.delete({
      where: { uid_type_item_id: { uid, type, item_id: parseInt(id) } }
    })
    const model = prisma[config.model]
    await model.update({
      where: { [config.idField]: parseInt(id) },
      data: { reshareCount: { decrement: 1 } }
    })
    return { success: true, message: '取消转发成功' }
  }
}

// --- 通用的踩/取消踩函数 ---
async function toggleDislike(uid, type, id, method) {
  const resource = await findResource(type, id)
  const config = RESOURCE_CONFIG[type]
  if (!config.hasDislike) {
    throw new Error(`${config.name}不支持踩`)
  }

  if (method === 'POST') {
    await prisma.userDislike.create({
      data: { uid, type, item_id: parseInt(id) }
    })
    const model = prisma[config.model]
    const updated = await model.update({
      where: { [config.idField]: parseInt(id) },
      data: { dislikeCount: { increment: 1 } }
    })
    return updated
  } else {
    await prisma.userDislike.delete({
      where: { uid_type_item_id: { uid, type, item_id: parseInt(id) } }
    })
    const model = prisma[config.model]
    const updated = await model.update({
      where: { [config.idField]: parseInt(id) },
      data: { dislikeCount: { decrement: 1 } }
    })
    return updated
  }
}

// 导出服务函数
module.exports = {
  findResource,
  toggleLike,
  toggleFavourite,
  toggleFollow,
  toggleReshare,
  toggleDislike,
  RESOURCE_CONFIG
}
