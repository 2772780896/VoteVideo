// controllers/userController.js - 用户相关控制器（除了登录注册）

// 引入 Prisma Client
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// --- 获取用户详情 ---
// GET /api/user/:uid
const getUserDetail = async (req, res) => {
  try {
    // 从路由参数获取用户 ID
    const uid = parseInt(req.params.uid)

    // Prisma Client 用法：
    //   prisma.user.findUnique({ where: { uid: uid }, select: {...} })
    //   - select: 指定返回的字段（不返回 password）
    const user = await prisma.user.findUnique({
      where: { uid: uid },
      select: {
        uid: true,
        username: true,
        profilePictureUrl: true,
        info: true,
        followerCount: true,
        followingCount: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      })
    }

    // 转换为 UserItem 格式
    const userItem = {
      uid: user.uid,
      userName: user.username,
      profilePictureUrl: user.profilePictureUrl,
      followerCount: user.followerCount,
      followingCount: user.followingCount
    }

    return res.status(200).json({
      code: 200,
      message: '获取成功',
      data: userItem
    })

  } catch (error) {
    console.error('获取用户详情错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// --- 搜索用户 ---
// GET /api/user?q=关键词&page=1&element=16
const searchUser = async (req, res) => {
  try {
    // 从查询参数获取搜索关键词和分页参数
    const {
      q = '',
      page = 1,
      element = 16
    } = req.query

    // 计算跳过的记录数
    const skip = (parseInt(page) - 1) * parseInt(element)

    // 构建查询条件
    const where = {}
    if (q) {
      // 按用户名搜索
      where.username = {
        contains: q,
        mode: 'insensitive'
      }
    }

    // Prisma Client 用法：
    //   prisma.user.findMany({ where, skip, take, select })
    const users = await prisma.user.findMany({
      where: where,
      skip: skip,
      take: parseInt(element),
      select: {
        uid: true,
        username: true,
        profilePictureUrl: true,
        followerCount: true,
        followingCount: true
      }
    })

    // 获取总记录数
    const total = await prisma.user.count({ where: where })

    // 转换为 UserItem 格式
    const userItems = users.map(user => ({
      uid: user.uid,
      userName: user.username,
      profilePictureUrl: user.profilePictureUrl,
      followerCount: user.followerCount,
      followingCount: user.followingCount
    }))

    return res.status(200).json({
      code: 200,
      message: '获取成功',
      data: userItems,
      total: total
    })

  } catch (error) {
    console.error('搜索用户错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// --- 获取当前用户 Profile ---
// GET /api/user/profile
// 需要认证（Token）
const getProfile = async (req, res) => {
  try {
    // 从 Authorization Header 读取 Token
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        code: 401,
        message: '请先登录',
        data: null
      })
    }

    // 去掉 "Bearer " 前缀
    const token = authHeader.split(' ')[1]

    // 验证 Token
    const jwt = require('jsonwebtoken')
    const JWT_SECRET = process.env.JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET)

    // 根据 Token 中的 uid 查询用户
    const user = await prisma.user.findUnique({
      where: { uid: decoded.uid },
      select: {
        uid: true,
        username: true,
        profilePictureUrl: true,
        info: true,
        followerCount: true,
        followingCount: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      })
    }

    return res.status(200).json({
      code: 200,
      message: '获取成功',
      data: user
    })

  } catch (error) {
    // Token 无效或过期
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 401,
        message: 'Token 无效或已过期',
        data: null
      })
    }

    console.error('获取用户信息错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// --- 获取 Profile 子数据 ---
// GET /api/user/profile/:profileType/:dataType?sort=..&page=..&element=..
// profileType: uploads（投稿）/ favourites（收藏）/ history（历史）
// dataType: videos / posts / essays
const getProfileSubdata = async (req, res) => {
  try {
    // 从路由参数获取 profileType 和 dataType
    const { profileType, dataType } = req.params

    // 从查询参数获取分页和排序参数
    const {
      page = 1,
      element = 16,
      sort = '-date'
    } = req.query

    // 验证 Token
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        code: 401,
        message: '请先登录',
        data: null
      })
    }

    const token = authHeader.split(' ')[1]
    const jwt = require('jsonwebtoken')
    const JWT_SECRET = process.env.JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET)

    // 根据 profileType 和 dataType 查询数据
    let data = []
    let total = 0

    if (profileType === 'uploads') {
      // 用户投稿
      if (dataType === 'videos') {
        const result = await prisma.video.findMany({
          where: { uploader_uid: decoded.uid },
          orderBy: { createdAt: 'desc' },
          skip: (parseInt(page) - 1) * parseInt(element),
          take: parseInt(element),
          include: {
            uploader: {
              select: {
                uid: true,
                username: true,
                profilePictureUrl: true
              }
            }
          }
        })
        total = await prisma.video.count({ where: { uploader_uid: decoded.uid } })
        data = result.map(video => ({
          vid: video.vid,
          coverUrl: video.coverUrl,
          title: video.title,
          viewCount: video.viewCount,
          messageCount: video.messageCount,
          duration: video.duration,
          date: formatDate(video.createdAt),
          uploader: {
            uid: video.uploader.uid,
            userName: video.uploader.username,
            profilePictureUrl: video.uploader.profilePictureUrl
          }
        }))
      } else if (dataType === 'posts') {
        const result = await prisma.post.findMany({
          where: { uploader_uid: decoded.uid },
          orderBy: { createdAt: 'desc' },
          skip: (parseInt(page) - 1) * parseInt(element),
          take: parseInt(element),
          include: {
            uploader: {
              select: {
                uid: true,
                username: true,
                profilePictureUrl: true
              }
            }
          }
        })
        total = await prisma.post.count({ where: { uploader_uid: decoded.uid } })
        data = result.map(post => ({
          pid: post.pid,
          text: post.text,
          pictureList: post.pictureList ? JSON.parse(post.pictureList) : null,
          videoList: post.videoList ? JSON.parse(post.videoList) : null,
          viewCount: post.viewCount,
          commentCount: post.commentCount,
          likeCount: post.likeCount,
          uploader: {
            uid: post.uploader.uid,
            userName: post.uploader.username,
            profilePictureUrl: post.uploader.profilePictureUrl
          },
          date: formatDate(post.createdAt)
        }))
      } else if (dataType === 'essays') {
        const result = await prisma.essay.findMany({
          where: { uploader_uid: decoded.uid },
          orderBy: { createdAt: 'desc' },
          skip: (parseInt(page) - 1) * parseInt(element),
          take: parseInt(element),
          include: {
            uploader: {
              select: {
                uid: true,
                username: true,
                profilePictureUrl: true
              }
            }
          }
        })
        total = await prisma.essay.count({ where: { uploader_uid: decoded.uid } })
        data = result.map(essay => ({
          eid: essay.eid,
          title: essay.title,
          text: essay.text.substring(0, 200) + '...',
          viewCount: essay.viewCount,
          commentCount: essay.commentCount,
          likeCount: essay.likeCount,
          favouriteCount: essay.favouriteCount,
          uploader: {
            uid: essay.uploader.uid,
            userName: essay.uploader.username,
            profilePictureUrl: essay.uploader.profilePictureUrl
          },
          date: formatDate(essay.createdAt)
        }))
      }
    } else if (profileType === 'favourites') {
      // 用户收藏
      const result = await prisma.userFavourite.findMany({
        where: { uid: decoded.uid, type: dataType },
        orderBy: { addDate: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(element),
        take: parseInt(element)
      })
      total = await prisma.userFavourite.count({
        where: { uid: decoded.uid, type: dataType }
      })
      // 根据 dataType 查询具体数据
      // 这里简化：只返回收藏记录，前端需要根据 item_id 再次查询
      data = result
    } else if (profileType === 'history') {
      // 用户历史
      const result = await prisma.userHistory.findMany({
        where: { uid: decoded.uid, type: dataType },
        orderBy: { addDate: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(element),
        take: parseInt(element)
      })
      total = await prisma.userHistory.count({
        where: { uid: decoded.uid, type: dataType }
      })
      // 根据 dataType 查询具体数据
      // 这里简化：只返回历史记录，前端需要根据 item_id 再次查询
      data = result
    }

    return res.status(200).json({
      code: 200,
      message: '获取成功',
      data: data,
      total: total
    })

  } catch (error) {
    console.error('获取 Profile 子数据错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// --- 工具函数 ---

// 格式化日期
const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 导出控制器函数
module.exports = {
  getUserDetail,
  searchUser,
  getProfile,
  getProfileSubdata
}
