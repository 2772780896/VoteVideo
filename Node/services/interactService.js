// services/interactService.js - 交互相关服务（点赞、收藏、关注等）

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { INTERACTION_CONFIG } = require('./interactionService')

// --- 通用的资源查询函数 ---
// 参数：type (资源类型), id (资源ID)
// 返回：资源对象
// 用途：查询资源是否存在，不存在则抛出错误
async function findResource(type, id) {
  // 1. 获取配置
  const config = INTERACTION_CONFIG[type]
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
  const config = INTERACTION_CONFIG[type]
  if (!config.likes) {
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
  const config = INTERACTION_CONFIG[type]
  if (!config.favourites) {
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
  const config = INTERACTION_CONFIG[type]
  if (!config.reshares) {
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
  const config = INTERACTION_CONFIG[type]
  if (!config.dislikes) {
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

// --- 通用的历史记录函数 ---
// 参数：uid (用户ID), type (资源类型), id (资源ID)
// 返回：{ success: true, message: '记录成功' }
// 用途：当用户浏览视频/文章/图文时记录浏览历史
// 如果已有记录则更新 addDate（移到最前面），没有则创建新记录
async function recordHistory(uid, type, id) {
  const resource = await findResource(type, id)
  const config = INTERACTION_CONFIG[type]
  if (!config.hasHistory) {
    // 不支持历史记录的类型，静默成功
    return { success: true, message: '不需要记录历史' }
  }

  const itemId = parseInt(id)

  // 检查是否已有历史记录
  const existing = await prisma.userHistory.findUnique({
    where: {
      uid_type_item_id: {
        uid: uid,
        type: type,
        item_id: itemId
      }
    }
  })

  if (existing) {
    // 已有记录，更新时间（删除后重新插入以更新 addDate）
    await prisma.userHistory.delete({
      where: {
        uid_type_item_id: {
          uid: uid,
          type: type,
          item_id: itemId
        }
      }
    })
  }

  // 创建新的历史记录
  await prisma.userHistory.create({
    data: {
      uid: uid,
      type: type,
      item_id: itemId
    }
  })

  return { success: true, message: '记录成功' }
}

// --- 通用的回复函数 ---
// 参数：uid (用户ID), mediaType (资源类型), mediaId (资源ID), text (回复内容)
// 返回：{ success: true, message: '回复成功', cid: 评论ID }
// 用途：在视频/文章/图文/标签/评论下创建一条评论
async function createReply(uid, mediaType, mediaId, text) {
  // 参数校验
  if (!text) {
    throw new Error('回复内容不能为空')
  }

  // 检查资源是否存在
  const resource = await findResource(mediaType, mediaId)
  const config = INTERACTION_CONFIG[mediaType]
  if (!config.hasReply) {
    throw new Error(`${config.name}不支持回复`)
  }

  const itemId = parseInt(mediaId)

  // 根据 mediaType 构建评论数据
  const commentData = {
    text: text,
    type: 'text',
    uploader_uid: uid
  }

  // 设置父级资源关联字段
  if (mediaType === 'video') {
    commentData.vid = itemId
  } else if (mediaType === 'essay') {
    commentData.eid = itemId
  } else if (mediaType === 'post') {
    commentData.pid = itemId
  } else if (mediaType === 'tag') {
    commentData.tid = itemId
  } else if (mediaType === 'comment') {
    // 回复评论：设置 replyTo_cid，并继承父级资源的关联字段
    commentData.replyTo_cid = itemId

    // 查询被回复的评论，获取其父级资源关联
    const parentComment = await prisma.comment.findUnique({
      where: { cid: itemId },
      select: { vid: true, eid: true, pid: true, tid: true }
    })
    if (parentComment) {
      if (parentComment.vid) commentData.vid = parentComment.vid
      if (parentComment.eid) commentData.eid = parentComment.eid
      if (parentComment.pid) commentData.pid = parentComment.pid
      if (parentComment.tid) commentData.tid = parentComment.tid
    }

    // 增加父评论的 subCommentCount
    await prisma.comment.update({
      where: { cid: itemId },
      data: { subCommentCount: { increment: 1 } }
    })
  }

  // 创建评论
  const newComment = await prisma.comment.create({
    data: commentData
  })

  // 增加父级资源的 commentCount（评论回复不增加，因为已经增加了 subCommentCount）
  if (mediaType !== 'comment') {
    const model = prisma[config.model]
    await model.update({
      where: { [config.idField]: itemId },
      data: { commentCount: { increment: 1 } }
    })
  }

  return { success: true, message: '回复成功', cid: newComment.cid }
}

// 导出服务函数
module.exports = {
  findResource,
  toggleLike,
  toggleFavourite,
  toggleFollow,
  toggleReshare,
  toggleDislike,
  recordHistory,
  createReply
}
