// services/commentService.js - 评论服务层（函数式实现）
// 职责：封装数据库操作、业务逻辑、数据格式转换
// 特殊点：需要处理递归子评论

const { createService, MODULE_CONFIG, formatCount, formatDate, parsePagination, parseSortParam } = require('./baseService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ==================== 数据格式转换函数 ====================

/**
 * 递归转换评论数据（包括子评论）
 * @param {object} comment - 数据库评论对象
 * @returns {object} 前端需要的评论对象格式
 */
const transformCommentData = (comment) => {
  const commentData = {
    cid: comment.cid,
    vid: comment.vid,
    text: comment.text,
    type: comment.type,
    viewCount: formatCount(comment.viewCount),
    likeCount: formatCount(comment.likeCount),
    dislikeCount: comment.dislikeCount !== undefined ? formatCount(comment.dislikeCount) : '0',
    favouriteCount: formatCount(comment.favouriteCount),
    subCommentCount: formatCount(comment.subCommentCount),
    date: formatDate(comment.date),
    // 前端 InteractionBar/CommentCard 需要的互动状态
    isLiked: false,
    isDisliked: false
  }
  
  // 图片列表（type=picture时有）
  if (comment.pictureList) {
    commentData.pictureList = JSON.parse(comment.pictureList)
  }
  
  // 上传者信息（保留原字段名 uploader，同时提供 commenter 别名）
  if (comment.uploader) {
    const uploaderObj = {
      uid: comment.uploader.uid,
      userName: comment.uploader.username,
      profilePictureUrl: comment.uploader.profilePictureUrl
    }
    commentData.uploader = uploaderObj
    commentData.commenter = uploaderObj  // 前端 CommentCard 使用 commenter
  }
  
  // 回复目标（子评论才有）
  if (comment.parentComment && comment.parentComment.uploader) {
    commentData.replyTo = {
      uid: comment.parentComment.uploader.uid,
      userName: comment.parentComment.uploader.username,
      profilePictureUrl: comment.parentComment.uploader.profilePictureUrl
    }
  }
  
  // 递归处理子评论（同时提供 subCommentList 和 subComments 别名）
  if (comment.replies && comment.replies.length > 0) {
    const subList = comment.replies.map(reply => 
      transformCommentData(reply)
    )
    commentData.subCommentList = subList
    commentData.subComments = subList  // 前端使用 subComments
  } else {
    commentData.subCommentList = []
    commentData.subComments = []
  }
  
  return commentData
}

// ==================== 业务服务函数 ====================

/**
 * 获取评论列表数据（需要处理递归子评论）
 * @param {object} options - 查询选项
 * @param {number} options.page - 页码
 * @param {number} options.element - 每页数量
 * @param {string} options.sort - 排序参数
 * @param {string} options.q - 搜索关键词
 * @param {number} options.vid - 视频ID（筛选条件）
 * @returns {Promise<object>} 包含评论列表和总数的对象
 */
const getCommentListData = async (options = {}) => {
  const {
    page = 1,
    element = 16,
    sort = '-date',
    q = '',
    vid = null
  } = options
  
  const { skip, take } = parsePagination(page, element)
  const orderBy = parseSortParam(sort, 'date')
  
  // 构建查询条件
  const where = {}
  
  // 按视频ID筛选
  if (vid) {
    where.vid = parseInt(vid)
  }
  
  // 搜索关键词（SQLite 的 contains 默认大小写不敏感）
  if (q) {
    where.text = {
      contains: q
    }
  }
  
  // 只包含顶级评论（不包含子评论）
  where.replyTo_cid = null
  
  // 关联查询配置（包含子评论的递归查询）
  const include = {
    uploader: {
      select: {
        uid: true,
        username: true,
        profilePictureUrl: true
      }
    },
    replies: {
      include: {
        uploader: {
          select: {
            uid: true,
            username: true,
            profilePictureUrl: true
          }
        },
        parentComment: {
          include: {
            uploader: {
              select: {
                uid: true,
                username: true,
                profilePictureUrl: true
              }
            }
          }
        },
        replies: true  // 需要进一步递归
      }
    }
  }
  
  // 并行执行查询
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      orderBy,
      skip,
      take,
      include
    }),
    prisma.comment.count({ where })
  ])
  
  // 数据转换（递归处理子评论）
  const commentItems = comments.map(comment => 
    transformCommentData(comment)
  )
  
  return {
    data: commentItems,
    total: total
  }
}

/**
 * 获取评论详情数据
 * @param {number} cid - 评论ID
 * @returns {Promise<object>} 评论详情数据
 */
const getCommentDetailData = async (cid) => {
  const comment = await prisma.comment.findUnique({
    where: { cid: parseInt(cid) },
    include: {
      uploader: {
        select: {
          uid: true,
          username: true,
          profilePictureUrl: true
        }
      },
      parentComment: {
        include: {
          uploader: true
        }
      }
    }
  })
  
  if (!comment) {
    const error = new Error('评论不存在')
    error.statusCode = 404
    throw error
  }
  
  return transformCommentData(comment)
}

/**
 * 创建评论（处理JSON字段和回复逻辑）
 * @param {object} data - 创建数据
 * @returns {Promise<object>} 创建后的评论对象
 */
const createComment = async (data) => {
  const commentData = { ...data }
  
  // 处理图片列表
  if (commentData.pictureList && Array.isArray(commentData.pictureList)) {
    commentData.pictureList = JSON.stringify(commentData.pictureList)
  }
  
  // 处理回复逻辑
  if (commentData.replyTo_cid) {
    // 回复评论，需要增加父评论的subCommentCount
    await prisma.comment.update({
      where: { cid: parseInt(commentData.replyTo_cid) },
      data: { subCommentCount: { increment: 1 } }
    })
  }
  
  return await prisma.comment.create({
    data: commentData,
    include: MODULE_CONFIG.comment.includeConfig
  })
}

// ==================== 导出 ====================

module.exports = {
  // 业务服务函数
  getCommentListData,
  getCommentDetailData,
  createComment,
  
  // 数据格式转换函数
  transformCommentData
}
