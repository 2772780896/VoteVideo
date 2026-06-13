// controllers/interactController.js - 交互相关控制器（点赞、收藏、关注等）

// 引入交互服务
const interactService = require('../services/interactService')

// --- 点赞/取消点赞 ---
// POST /api/:type/:id/like
// DELETE /api/:type/:id/like
// Header: Authorization: Bearer <token> (由 needToken 中间件验证)
// 响应：{ code: 200, data: { likeCount } } 或错误响应
const like = async (req, res) => {
  try {
    // 从路由参数获取资源类型和 ID
    const { type, id } = req.params

    // 从 req.user 获取用户信息（由 needToken 中间件设置）
    const { uid } = req.user

    // 调用服务层（传递 uid）
    const result = await interactService.toggleLike(uid, type, id, req.method)

    // 返回成功响应
    return res.status(200).json({
      code: 200,
      message: req.method === 'POST' ? '点赞成功' : '取消点赞成功',
      data: { likeCount: result.likeCount }
    })

  } catch (error) {
    // Prisma 错误：记录已存在（点赞时）
    if (error.code === 'P2002') {
      return res.status(400).json({
        code: 400,
        message: '已经点赞过了',
        data: null
      })
    }

    // Prisma 错误：记录不存在（取消点赞时）
    if (error.code === 'P2025') {
      return res.status(400).json({
        code: 400,
        message: '还没有点赞',
        data: null
      })
    }

    // 资源不存在
    if (error.message.includes('不存在')) {
      return res.status(404).json({
        code: 404,
        message: error.message,
        data: null
      })
    }

    // 不支持的资源类型
    if (error.message.includes('不支持')) {
      return res.status(400).json({
        code: 400,
        message: error.message,
        data: null
      })
    }

    // 其他错误
    console.error('点赞操作错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// --- 收藏/取消收藏 ---
// POST /api/:type/:id/favourite
// DELETE /api/:type/:id/favourite
// Header: Authorization: Bearer <token> (由 needToken 中间件验证)
// 响应：{ code: 200, message: '收藏成功' } 或错误响应
const favourite = async (req, res) => {
  try {
    // 从路由参数获取资源类型和 ID
    const { type, id } = req.params

    // 从 req.user 获取用户信息（由 needToken 中间件设置）
    const { uid } = req.user

    // 调用服务层
    const result = await interactService.toggleFavourite(uid, type, id, req.method)

    // 返回成功响应
    return res.status(200).json({
      code: 200,
      message: result.message,
      data: null
    })

  } catch (error) {
    // Prisma 错误：记录已存在（收藏时）
    if (error.code === 'P2002') {
      return res.status(400).json({
        code: 400,
        message: '已经收藏过了',
        data: null
      })
    }

    // Prisma 错误：记录不存在（取消收藏时）
    if (error.code === 'P2025') {
      return res.status(400).json({
        code: 400,
        message: '还没有收藏',
        data: null
      })
    }

    // 资源不存在
    if (error.message.includes('不存在')) {
      return res.status(404).json({
        code: 404,
        message: error.message,
        data: null
      })
    }

    // 不支持的资源类型
    if (error.message.includes('不支持')) {
      return res.status(400).json({
        code: 400,
        message: error.message,
        data: null
      })
    }

    // 其他错误
    console.error('收藏操作错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// --- 关注/取消关注 ---
// POST /api/user/:id/follow
// DELETE /api/user/:id/follow
// Header: Authorization: Bearer <token> (由 needToken 中间件验证)
// 响应：{ code: 200, message: '关注成功' } 或错误响应
const follow = async (req, res) => {
  try {
    // 从路由参数获取用户 ID
    const { id } = req.params

    // 从 req.user 获取用户信息（由 needToken 中间件设置）
    const { uid } = req.user

    // 调用服务层
    const result = await interactService.toggleFollow(uid, parseInt(id), req.method)

    // 返回成功响应
    return res.status(200).json({
      code: 200,
      message: result.message,
      data: null
    })

  } catch (error) {
    // Prisma 错误：记录已存在（关注时）
    if (error.code === 'P2002') {
      return res.status(400).json({
        code: 400,
        message: '已经关注了',
        data: null
      })
    }

    // Prisma 错误：记录不存在（取消关注时）
    if (error.code === 'P2025') {
      return res.status(400).json({
        code: 400,
        message: '还没有关注',
        data: null
      })
    }

    // 不能关注自己
    if (error.message === '不能关注自己') {
      return res.status(400).json({
        code: 400,
        message: error.message,
        data: null
      })
    }

    // 用户不存在
    if (error.message === '用户不存在') {
      return res.status(404).json({
        code: 404,
        message: error.message,
        data: null
      })
    }

    // 其他错误
    console.error('关注操作错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// 导出控制器函数
module.exports = {
  like,
  favourite,
  follow
}
