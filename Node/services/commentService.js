// services/commentService.js - 评论服务层（继承BaseService）
// 职责：封装数据库操作、业务逻辑、数据格式转换
// 特殊点：需要处理递归子评论

const { BaseService, MODULE_CONFIG, formatCount, formatDate } = require('./baseService')

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
    favouriteCount: formatCount(comment.favouriteCount),
    subCommentCount: formatCount(comment.subCommentCount),
    date: formatDate(comment.createdAt)
  }
  
  // 图片列表（type=picture时有）
  if (comment.pictureList) {
    commentData.pictureList = JSON.parse(comment.pictureList)
  }
  
  // 上传者信息
  if (comment.uploader) {
    commentData.uploader = {
      uid: comment.uploader.uid,
      userName: comment.uploader.username,
      profilePictureUrl: comment.uploader.profilePictureUrl
    }
  }
  
  // 回复目标（子评论才有）
  if (comment.parentComment && comment.parentComment.uploader) {
    commentData.replyTo = {
      uid: comment.parentComment.uploader.uid,
      userName: comment.parentComment.uploader.username,
      profilePictureUrl: comment.parentComment.uploader.profilePictureUrl
    }
  }
  
  // 递归处理子评论
  if (comment.replies && comment.replies.length > 0) {
    commentData.subCommentList = comment.replies.map(reply => 
      transformCommentData(reply)
    )
  } else {
    commentData.subCommentList = []
  }
  
  return commentData
}

// ==================== CommentService类 ====================

class CommentService extends BaseService {
  /**
   * 构造函数
   */
  constructor() {
    // 调用父类构造函数，传入模块配置
    super('comment', MODULE_CONFIG.comment)
    
    // Comment的转换函数需要递归处理，不使用简单的transformFunction
    this.transformFunction = null
  }
  
  /**
   * 获取评论列表数据（重写父类方法，需要处理递归子评论）
   * @param {object} options - 查询选项
   * @param {number} options.page - 页码
   * @param {number} options.element - 每页数量
   * @param {string} options.sort - 排序参数
   * @param {string} options.q - 搜索关键词
   * @param {number} options.vid - 视频ID（筛选条件）
   * @returns {Promise<object>} 包含评论列表和总数的对象
   */
  async getCommentListData(options = {}) {
    const {
      page = 1,
      element = 16,
      sort = '-createdAt',
      q = '',
      vid = null
    } = options
    
    const { skip, take } = require('./baseService').parsePagination(page, element)
    const orderBy = require('./baseService').parseSortParam(sort, this.defaultSortField)
    
    // 构建查询条件
    const where = {}
    
    // 按视频ID筛选
    if (vid) {
      where.vid = parseInt(vid)
    }
    
    // 搜索关键词
    if (q) {
      where.text = {
        contains: q,
        mode: 'insensitive'
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
      this.model.findMany({
        where,
        orderBy,
        skip,
        take,
        include
      }),
      this.model.count({ where })
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
  async getCommentDetailData(cid) {
    const comment = await this.getItemData(cid, { 
      throwIfNotFound: true,
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
    
    return transformCommentData(comment)
  }
  
  /**
   * 创建评论（重写父类方法，处理JSON字段和回复逻辑）
   * @param {object} data - 创建数据
   * @returns {Promise<object>} 创建后的评论对象
   */
  async createComment(data) {
    const commentData = { ...data }
    
    // 处理图片列表
    if (commentData.pictureList && Array.isArray(commentData.pictureList)) {
      commentData.pictureList = JSON.stringify(commentData.pictureList)
    }
    
    // 处理回复逻辑
    if (commentData.replyTo_cid) {
      // 回复评论，需要增加父评论的subCommentCount
      await this.model.update({
        where: { cid: parseInt(commentData.replyTo_cid) },
        data: { subCommentCount: { increment: 1 } }
      })
    }
    
    return await this.model.create({
      data: commentData,
      include: this.includeConfig
    })
  }
}

// 创建实例并导出
const commentService = new CommentService()

module.exports = {
  // 业务服务函数（实例方法）
  getCommentListData: commentService.getCommentListData.bind(commentService),
  getCommentDetailData: commentService.getCommentDetailData.bind(commentService),
  createComment: commentService.createComment.bind(commentService),
  
  // 数据格式转换函数
  transformCommentData,
  
  // 类（供其他模块使用）
  CommentService
}
