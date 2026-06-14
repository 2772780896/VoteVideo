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
        date: true
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
      info: user.info,
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
      // 按用户名搜索（SQLite 的 contains 默认大小写不敏感）
      where.username = {
        contains: q
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

    // 修改：返回前端期望的数据格式
    return res.status(200).json({
      code: 200,
      data: {
        items: userItems,
        total: total
      }
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
// 需要认证（Token）— 由 optionalAuth 中间件设置 req.user
const getProfile = async (req, res) => {
  try {
    // optionalAuth 已解析 Token 并设置 req.user
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        message: '请先登录',
        data: null
      })
    }

    // 根据 Token 中的 uid 查询用户
    const user = await prisma.user.findUnique({
      where: { uid: req.user.uid },
      select: {
        uid: true,
        username: true,
        profilePictureUrl: true,
        info: true,
        followerCount: true,
        followingCount: true,
        date: true
      }
    })

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      })
    }

    // 返回前端期望的格式（注意：username → userName）
    return res.status(200).json({
      code: 200,
      message: '获取成功',
      data: {
        uid: user.uid,
        userName: user.username,
        profilePictureUrl: user.profilePictureUrl,
        info: user.info,
        followerCount: user.followerCount,
        followingCount: user.followingCount,
        date: user.date
      }
    })

  } catch (error) {
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
// profileType: uploads（投稿）/ favourites（收藏）/ history（历史）/ follow / message
// dataType: videos / posts / essays / followingList / dialogueList / notificationList
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

    // needToken 中间件已验证 Token 并设置 req.user
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        message: '请先登录',
        data: null
      })
    }
    const currentUid = req.user.uid

    // 前端传 dataType 为复数形式（videos/posts/essays），
    // 但数据库中 type 字段存储的是单数形式（video/post/essay）
    const typeMap = { videos: 'video', posts: 'post', essays: 'essay' }
    const dbType = typeMap[dataType] || dataType

    // 根据 profileType 和 dataType 查询数据
    let data = []
    let total = 0

    if (profileType === 'uploads') {
      // 用户投稿
      if (dataType === 'videos') {
        const result = await prisma.video.findMany({
          where: { uploader_uid: currentUid },
          orderBy: { date: 'desc' },
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
        total = await prisma.video.count({ where: { uploader_uid: currentUid } })
        data = result.map(video => ({
          vid: video.vid,
          coverUrl: video.coverUrl,
          title: video.title,
          viewCount: video.viewCount,
          commentCount: video.commentCount, // 修改：messageCount -> commentCount
          duration: video.duration,
          date: formatDate(video.date),
          uploader: {
            uid: video.uploader.uid,
            userName: video.uploader.username,
            profilePictureUrl: video.uploader.profilePictureUrl
          }
        }))
      } else if (dataType === 'posts') {
        const result = await prisma.post.findMany({
          where: { uploader_uid: currentUid },
          orderBy: { date: 'desc' },
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
        total = await prisma.post.count({ where: { uploader_uid: currentUid } })
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
          date: formatDate(post.date)
        }))
      } else if (dataType === 'essays') {
        const result = await prisma.essay.findMany({
          where: { uploader_uid: currentUid },
          orderBy: { date: 'desc' },
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
        total = await prisma.essay.count({ where: { uploader_uid: currentUid } })
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
          date: formatDate(essay.date)
        }))
      }
    } else if (profileType === 'favourites') {
      // 用户收藏 - 关联查询实际内容数据
      // 注意：dbType 是单数形式（video/post/essay），匹配数据库存储格式
      const favourites = await prisma.userFavourite.findMany({
        where: { uid: currentUid, type: dbType },
        orderBy: { addDate: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(element),
        take: parseInt(element)
      })
      total = await prisma.userFavourite.count({
        where: { uid: currentUid, type: dbType }
      })
      const itemIds = favourites.map(f => f.item_id)
      if (itemIds.length > 0) {
        if (dataType === 'videos') {
          const items = await prisma.video.findMany({
            where: { vid: { in: itemIds } },
            include: { uploader: { select: { uid: true, username: true, profilePictureUrl: true } } }
          })
          data = items.map(v => ({
            vid: v.vid, coverUrl: v.coverUrl, title: v.title,
            viewCount: v.viewCount, commentCount: v.commentCount,
            duration: v.duration, date: formatDate(v.date),
            uploader: { uid: v.uploader.uid, userName: v.uploader.username, profilePictureUrl: v.uploader.profilePictureUrl }
          }))
        } else if (dataType === 'posts') {
          const items = await prisma.post.findMany({
            where: { pid: { in: itemIds } },
            include: { uploader: { select: { uid: true, username: true, profilePictureUrl: true } } }
          })
          data = items.map(p => ({
            pid: p.pid, text: p.text,
            pictureList: p.pictureList ? JSON.parse(p.pictureList) : null,
            videoList: p.videoList ? JSON.parse(p.videoList) : null,
            viewCount: p.viewCount, commentCount: p.commentCount, likeCount: p.likeCount,
            date: formatDate(p.date),
            uploader: { uid: p.uploader.uid, userName: p.uploader.username, profilePictureUrl: p.uploader.profilePictureUrl }
          }))
        } else if (dataType === 'essays') {
          const items = await prisma.essay.findMany({
            where: { eid: { in: itemIds } },
            include: { uploader: { select: { uid: true, username: true, profilePictureUrl: true } } }
          })
          data = items.map(e => ({
            eid: e.eid, title: e.title,
            text: e.text.length > 200 ? e.text.substring(0, 200) + '...' : e.text,
            viewCount: e.viewCount, commentCount: e.commentCount,
            likeCount: e.likeCount, favouriteCount: e.favouriteCount,
            date: formatDate(e.date),
            uploader: { uid: e.uploader.uid, userName: e.uploader.username, profilePictureUrl: e.uploader.profilePictureUrl }
          }))
        }
      }
    } else if (profileType === 'history') {
      // 用户历史 - 关联查询实际内容数据
      // 注意：dbType 是单数形式（video/post/essay），匹配数据库存储格式
      const histories = await prisma.userHistory.findMany({
        where: { uid: currentUid, type: dbType },
        orderBy: { addDate: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(element),
        take: parseInt(element)
      })
      total = await prisma.userHistory.count({
        where: { uid: currentUid, type: dbType }
      })
      const itemIds = histories.map(h => h.item_id)
      if (itemIds.length > 0) {
        if (dataType === 'videos') {
          const items = await prisma.video.findMany({
            where: { vid: { in: itemIds } },
            include: { uploader: { select: { uid: true, username: true, profilePictureUrl: true } } }
          })
          data = items.map(v => ({
            vid: v.vid, coverUrl: v.coverUrl, title: v.title,
            viewCount: v.viewCount, commentCount: v.commentCount,
            duration: v.duration, date: formatDate(v.date),
            uploader: { uid: v.uploader.uid, userName: v.uploader.username, profilePictureUrl: v.uploader.profilePictureUrl }
          }))
        } else if (dataType === 'posts') {
          const items = await prisma.post.findMany({
            where: { pid: { in: itemIds } },
            include: { uploader: { select: { uid: true, username: true, profilePictureUrl: true } } }
          })
          data = items.map(p => ({
            pid: p.pid, text: p.text,
            pictureList: p.pictureList ? JSON.parse(p.pictureList) : null,
            videoList: p.videoList ? JSON.parse(p.videoList) : null,
            viewCount: p.viewCount, commentCount: p.commentCount, likeCount: p.likeCount,
            date: formatDate(p.date),
            uploader: { uid: p.uploader.uid, userName: p.uploader.username, profilePictureUrl: p.uploader.profilePictureUrl }
          }))
        } else if (dataType === 'essays') {
          const items = await prisma.essay.findMany({
            where: { eid: { in: itemIds } },
            include: { uploader: { select: { uid: true, username: true, profilePictureUrl: true } } }
          })
          data = items.map(e => ({
            eid: e.eid, title: e.title,
            text: e.text.length > 200 ? e.text.substring(0, 200) + '...' : e.text,
            viewCount: e.viewCount, commentCount: e.commentCount,
            likeCount: e.likeCount, favouriteCount: e.favouriteCount,
            date: formatDate(e.date),
            uploader: { uid: e.uploader.uid, userName: e.uploader.username, profilePictureUrl: e.uploader.profilePictureUrl }
          }))
        }
      }
    } else if (profileType === 'follow') {
      // 关注列表
      if (dataType === 'followingList') {
        const followings = await prisma.userFollowing.findMany({
          where: { uid: currentUid },
          skip: (parseInt(page) - 1) * parseInt(element),
          take: parseInt(element),
          include: {
            following: {
              select: {
                uid: true,
                username: true,
                profilePictureUrl: true,
                followerCount: true
              }
            }
          }
        })
        total = await prisma.userFollowing.count({
          where: { uid: currentUid }
        })
        data = followings.map(f => ({
          uid: f.following.uid,
          userName: f.following.username,
          profilePictureUrl: f.following.profilePictureUrl,
          followerCount: f.following.followerCount
        }))
      }
    } else if (profileType === 'message') {
      // 消息相关 - 委托给 messageService
      const messageService = require('../services/messageService')
      if (dataType === 'dialogueList') {
        data = await messageService.getDialogues(currentUid)
        total = data.length
      } else if (dataType === 'notificationList') {
        data = await messageService.getNotifications(currentUid)
        total = data.length
      }
    }

    return res.status(200).json({
      code: 200,
      data: {
        items: data,
        total: total
      }
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
