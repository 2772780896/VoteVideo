// services/commentService.js - 评论服务层
// 职责：评论业务逻辑编排（含递归子评论）

const { createService, MODULE_CONFIG } = require('./baseService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { mergeInteractions } = require('./interactionService')
const { transformCommentData } = require('./transformers/commentTransformer')

// ==================== 评论关联查询配置 ====================

const COMMENT_INCLUDE = {
  uploader: {
    select: { uid: true, username: true, profilePictureUrl: true }
  },
  replies: {
    include: {
      uploader: {
        select: { uid: true, username: true, profilePictureUrl: true }
      },
      parentComment: {
        include: {
          uploader: {
            select: { uid: true, username: true, profilePictureUrl: true }
          }
        }
      },
      replies: true  // 递归子评论
    }
  }
}

// ==================== 创建基础服务 ====================

const baseService = createService('comment', {
  ...MODULE_CONFIG.comment,
  mediaType: 'comment',
  transformFunction: transformCommentData
})

// ==================== 业务服务函数 ====================

/**
 * 获取评论列表数据（委托给 baseService.getListData）
 */
const getCommentListData = async (options = {}) => {
  const { vid, eid, pid, tid, ...rest } = options

  // 构建 where 条件
  const where = { replyTo_cid: null } // 只查顶级评论
  if (vid) where.vid = parseInt(vid)
  if (eid) where.eid = parseInt(eid)
  if (pid) where.pid = parseInt(pid)
  if (tid) where.tid = parseInt(tid)

  return baseService.getListData({
    ...rest,
    where,
    include: COMMENT_INCLUDE
  })
}

/**
 * 获取评论详情数据
 * @param {number} cid - 评论ID
 * @param {number} currentUid - 当前用户ID
 * @returns {Promise<object>} 评论详情数据
 */
const getCommentDetailData = async (cid, currentUid = null) => {
  const comment = await prisma.comment.findUnique({
    where: { cid: parseInt(cid) },
    include: {
      uploader: {
        select: { uid: true, username: true, profilePictureUrl: true }
      },
      parentComment: {
        include: { uploader: true }
      }
    }
  })

  if (!comment) {
    const error = new Error('评论不存在')
    error.statusCode = 404
    throw error
  }

  const commentItem = transformCommentData(comment)

  if (currentUid) {
    await mergeInteractions('comment', [commentItem], 'cid', currentUid)
  }

  return commentItem
}

// ==================== 导出 ====================

module.exports = {
  getCommentListData,
  getCommentDetailData,
  transformCommentData
}
