// services/baseService.js - 通用服务基类
// 职责：封装通用的分页、排序、搜索、CRUD逻辑
// 各模块服务层可以继承或调用此类

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ==================== 工具函数 ====================

/**
 * 解析排序参数
 * 将前端排序参数（如 '-date'）转换为Prisma排序对象
 * @param {string} sort - 排序参数（如 '-date', 'viewCount'）
 * @param {string} defaultField - 默认排序字段（默认'createdAt'）
 * @returns {object} Prisma排序对象
 */
const parseSortParam = (sort = '-createdAt', defaultField = 'createdAt') => {
  let orderBy = {}
  
  if (!sort || sort === '') {
    // 使用默认排序
    orderBy[defaultField] = 'desc'
    return orderBy
  }
  
  if (sort.startsWith('-')) {
    const field = sort.substring(1)
    orderBy[field] = 'desc'
  } else {
    orderBy[sort] = 'asc'
  }
  
  return orderBy
}

/**
 * 解析分页参数
 * 将前端分页参数转换为Prisma查询参数
 * @param {string} page - 页码
 * @param {string} element - 每页数量
 * @returns {object} 包含skip和take的对象
 */
const parsePagination = (page = 1, element = 16) => {
  const skip = (parseInt(page) - 1) * parseInt(element)
  const take = parseInt(element)
  return { skip, take }
}

/**
 * 格式化数字（播放量、评论数等）
 * 将大数字转换为易读格式（如：1000 → "1k", 1000000 → "1m"）
 */
const formatCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'm'
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

/**
 * 格式化日期
 * 将 Date 对象转换为字符串（如：2026-06-12）
 */
const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// ==================== 通用服务类 ====================

class BaseService {
  /**
   * 构造函数
   * @param {string} modelName - Prisma模型名称（如 'video', 'essay', 'post'）
   * @param {object} config - 配置对象
   * @param {string} config.idField - 主键字段名（如 'vid', 'eid'）
   * @param {string} config.searchField - 搜索字段名（如 'title'）
   * @param {string} config.defaultSortField - 默认排序字段（默认'createdAt'）
   * @param {object} config.includeConfig - 关联查询配置
   * @param {function} config.transformFunction - 数据转换函数
   */
  constructor(modelName, config = {}) {
    this.modelName = modelName
    this.idField = config.idField || 'id'
    this.searchField = config.searchField || 'title'
    this.defaultSortField = config.defaultSortField || 'createdAt'
    this.includeConfig = config.includeConfig || {}
    this.transformFunction = config.transformFunction || null
    
    // 获取Prisma模型（动态访问prisma[modelName]）
    this.model = prisma[modelName]
    
    if (!this.model) {
      throw new Error(`Prisma模型 "${modelName}" 不存在`)
    }
  }
  
  /**
   * 获取列表数据（支持分页、排序、搜索）
   * @param {object} options - 查询选项
   * @param {number} options.page - 页码
   * @param {number} options.element - 每页数量
   * @param {string} options.sort - 排序参数
   * @param {string} options.q - 搜索关键词
   * @param {object} options.where - 额外查询条件
   * @param {object} options.include - 关联查询配置（覆盖默认配置）
   * @returns {Promise<object>} 包含数据和总数的对象
   */
  async getListData(options = {}) {
    const {
      page = 1,
      element = 16,
      sort = `-${this.defaultSortField}`,
      q = '',
      where: extraWhere = {},
      include: overrideInclude = null
    } = options
    
    const { skip, take } = parsePagination(page, element)
    const orderBy = parseSortParam(sort, this.defaultSortField)
    
    // 构建查询条件
    const where = { ...extraWhere }
    if (q && this.searchField) {
      where[this.searchField] = {
        contains: q,
        mode: 'insensitive'
      }
    }
    
    // 确定关联查询配置
    const include = overrideInclude || this.includeConfig
    
    // 并行执行查询，提高性能
    const [items, total] = await Promise.all([
      this.model.findMany({
        where,
        orderBy,
        skip,
        take,
        include: include || undefined
      }),
      this.model.count({ where })
    ])
    
    // 数据转换
    let transformedItems = items
    if (this.transformFunction) {
      transformedItems = items.map(item => this.transformFunction(item))
    }
    
    return {
      data: transformedItems,
      total: total
    }
  }
  
  /**
   * 根据ID获取详情数据
   * @param {number} id - 主键ID
   * @param {object} options - 查询选项
   * @param {object} options.include - 关联查询配置（覆盖默认配置）
   * @param {boolean} options.throwIfNotFound - 不存在时是否抛出异常
   * @returns {Promise<object|null>} 数据对象或null
   */
  async getItemData(id, options = {}) {
    const {
      include: overrideInclude = null,
      throwIfNotFound = false
    } = options
    
    // 确定关联查询配置
    const include = overrideInclude || this.includeConfig
    
    const item = await this.model.findUnique({
      where: { [this.idField]: parseInt(id) },
      include: include || undefined
    })
    
    if (!item && throwIfNotFound) {
      const error = new Error(`${this.modelName}不存在`)
      error.statusCode = 404
      throw error
    }
    
    // 数据转换
    if (item && this.transformFunction) {
      return this.transformFunction(item)
    }
    
    return item
  }
  
  /**
   * 获取数据总数
   * @param {object} where - 查询条件
   * @returns {Promise<number>} 数据总数
   */
  async count(where = {}) {
    return await this.model.count({ where })
  }
  
  /**
   * 创建数据
   * @param {object} data - 创建数据
   * @returns {Promise<object>} 创建后的数据对象
   */
  async create(data) {
    return await this.model.create({
      data,
      include: this.includeConfig || undefined
    })
  }
  
  /**
   * 更新数据
   * @param {number} id - 主键ID
   * @param {object} data - 更新数据
   * @returns {Promise<object>} 更新后的数据对象
   */
  async update(id, data) {
    return await this.model.update({
      where: { [this.idField]: parseInt(id) },
      data,
      include: this.includeConfig || undefined
    })
  }
  
  /**
   * 删除数据
   * @param {number} id - 主键ID
   * @returns {Promise<object>} 删除的数据对象
   */
  async delete(id) {
    return await this.model.delete({
      where: { [this.idField]: parseInt(id) }
    })
  }
}

// ==================== 字段映射表配置 ====================

/**
 * 模块配置映射表
 * 定义各模块的字段映射和配置
 */
const MODULE_CONFIG = {
  video: {
    modelName: 'video',
    idField: 'vid',
    searchField: 'title',
    defaultSortField: 'createdAt',
    includeConfig: {
      uploader: {
        select: {
          uid: true,
          username: true,
          profilePictureUrl: true
        }
      },
      videoTags: {
        include: {
          tag: true
        }
      }
    },
    // 数据转换函数（在videoService中定义）
    transformFunction: null
  },
  
  essay: {
    modelName: 'essay',
    idField: 'eid',
    searchField: 'title',
    defaultSortField: 'createdAt',
    includeConfig: {
      uploader: {
        select: {
          uid: true,
          username: true,
          profilePictureUrl: true
        }
      }
    },
    // 数据转换函数（在essayService中定义）
    transformFunction: null
  },
  
  post: {
    modelName: 'post',
    idField: 'pid',
    searchField: 'text',  // Post的搜索字段是text
    defaultSortField: 'createdAt',
    includeConfig: {
      uploader: {
        select: {
          uid: true,
          username: true,
          profilePictureUrl: true
        }
      }
    },
    // 数据转换函数（在postService中定义）
    transformFunction: null
  },
  
  comment: {
    modelName: 'comment',
    idField: 'cid',
    searchField: 'text',
    defaultSortField: 'createdAt',
    includeConfig: {
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
    },
    // 数据转换函数（在commentService中定义）
    transformFunction: null
  },
  
  tag: {
    modelName: 'tag',
    idField: 'tid',
    searchField: 'tagName',
    defaultSortField: 'tid',
    includeConfig: {},  // Tag没有关联查询
    // 数据转换函数（在tagService中定义）
    transformFunction: null
  }
}

// ==================== 导出 ====================

module.exports = {
  BaseService,
  MODULE_CONFIG,
  parseSortParam,
  parsePagination,
  formatCount,
  formatDate
}
