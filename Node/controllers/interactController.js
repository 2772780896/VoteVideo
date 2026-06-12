// controllers/interactController.js - 交互相关控制器（点赞、收藏、关注等）

// 引入 Prisma Client
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// --- 点赞/取消点赞 ---
// POST /api/:type/:id/like
// DELETE /api/:type/:id/like
const like = async (req, res) => {
  try {
    // 从路由参数获取资源类型和 ID
    // req.params 包含路由参数（:type 和 :id）
    const { type, id } = req.params

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

    // 根据资源类型更新对应表的 likeCount
    // Prisma Client 用法：
    //   prisma.模型名.update({ where: { id字段: parseInt(id) }, data: { likeCount: { increment: 1 } } })
    //   - data: { 字段名: { increment: 1 } } 表示自增 1
    //   - data: { 字段名: { decrement: 1 } } 表示自减 1
    let result = null
    if (type === 'video') {
      const video = await prisma.video.findUnique({ where: { vid: parseInt(id) } })
      if (!video) {
        return res.status(404).json({ code: 404, message: '视频不存在', data: null })
      }
      // 判断是点赞还是取消点赞（根据 HTTP 方法）
      const increment = req.method === 'POST' ? 1 : -1
      result = await prisma.video.update({
        where: { vid: parseInt(id) },
        data: { likeCount: { increment: increment } }
      })
    } else if (type === 'essay') {
      const essay = await prisma.essay.findUnique({ where: { eid: parseInt(id) } })
      if (!essay) {
        return res.status(404).json({ code: 404, message: '文章不存在', data: null })
      }
      const increment = req.method === 'POST' ? 1 : -1
      result = await prisma.essay.update({
        where: { eid: parseInt(id) },
        data: { likeCount: { increment: increment } }
      })
    } else if (type === 'post') {
      const post = await prisma.post.findUnique({ where: { pid: parseInt(id) } })
      if (!post) {
        return res.status(404).json({ code: 404, message: '动态不存在', data: null })
      }
      const increment = req.method === 'POST' ? 1 : -1
      result = await prisma.post.update({
        where: { pid: parseInt(id) },
        data: { likeCount: { increment: increment } }
      })
    } else if (type === 'comment') {
      const comment = await prisma.comment.findUnique({ where: { cid: parseInt(id) } })
      if (!comment) {
        return res.status(404).json({ code: 404, message: '评论不存在', data: null })
      }
      const increment = req.method === 'POST' ? 1 : -1
      result = await prisma.comment.update({
        where: { cid: parseInt(id) },
        data: { likeCount: { increment: increment } }
      })
    } else if (type === 'tag') {
      const tag = await prisma.tag.findUnique({ where: { tid: parseInt(id) } })
      if (!tag) {
        return res.status(404).json({ code: 404, message: '标签不存在', data: null })
      }
      const increment = req.method === 'POST' ? 1 : -1
      result = await prisma.tag.update({
        where: { tid: parseInt(id) },
        data: { likeCount: { increment: increment } }
      })
    } else {
      return res.status(400).json({ code: 400, message: '不支持的资源类型', data: null })
    }

    return res.status(200).json({
      code: 200,
      message: req.method === 'POST' ? '点赞成功' : '取消点赞成功',
      data: { likeCount: result.likeCount }
    })

  } catch (error) {
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
const favourite = async (req, res) => {
  try {
    // 从路由参数获取资源类型和 ID
    const { type, id } = req.params

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

    if (req.method === 'POST') {
      // 收藏：插入记录到 UserFavourite 表，并更新对应表的 favouriteCount
      // Prisma Client 用法：
      //   prisma.userFavourite.create({ data: { uid, type, item_id } })
      //   - create: 插入新记录
      //   - 如果记录已存在，会抛出错误（唯一约束）
      await prisma.userFavourite.create({
        data: {
          uid: decoded.uid,
          type: type,
          item_id: parseInt(id)
        }
      })

      // 更新对应表的 favouriteCount
      if (type === 'video') {
        await prisma.video.update({
          where: { vid: parseInt(id) },
          data: { favouriteCount: { increment: 1 } }
        })
      } else if (type === 'essay') {
        await prisma.essay.update({
          where: { eid: parseInt(id) },
          data: { favouriteCount: { increment: 1 } }
        })
      } else if (type === 'post') {
        await prisma.post.update({
          where: { pid: parseInt(id) },
          data: { favouriteCount: { increment: 1 } }
        })
      }

      return res.status(200).json({
        code: 200,
        message: '收藏成功',
        data: null
      })
    } else {
      // 取消收藏：删除记录从 UserFavourite 表，并更新对应表的 favouriteCount
      // Prisma Client 用法：
      //   prisma.userFavourite.delete({ where: { uid, type, item_id } })
      //   - delete: 删除记录
      //   - where: 必须使用完整的主键（复合主键）
      await prisma.userFavourite.delete({
        where: {
          uid_type_item_id: {
            uid: decoded.uid,
            type: type,
            item_id: parseInt(id)
          }
        }
      })

      // 更新对应表的 favouriteCount
      if (type === 'video') {
        await prisma.video.update({
          where: { vid: parseInt(id) },
          data: { favouriteCount: { decrement: 1 } }
        })
      } else if (type === 'essay') {
        await prisma.essay.update({
          where: { eid: parseInt(id) },
          data: { favouriteCount: { decrement: 1 } }
        })
      } else if (type === 'post') {
        await prisma.post.update({
          where: { pid: parseInt(id) },
          data: { favouriteCount: { decrement: 1 } }
        })
      }

      return res.status(200).json({
        code: 200,
        message: '取消收藏成功',
        data: null
      })
    }

  } catch (error) {
    // Prisma 错误：记录已存在（收藏时）或记录不存在（取消收藏时）
    if (error.code === 'P2002') {
      return res.status(400).json({ code: 400, message: '已经收藏过了', data: null })
    }
    if (error.code === 'P2025') {
      return res.status(400).json({ code: 400, message: '还没有收藏', data: null })
    }

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
const follow = async (req, res) => {
  try {
    // 从路由参数获取用户 ID
    const { id } = req.params

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

    // 不能关注自己
    if (decoded.uid === parseInt(id)) {
      return res.status(400).json({
        code: 400,
        message: '不能关注自己',
        data: null
      })
    }

    if (req.method === 'POST') {
      // 关注：插入记录到 UserFollowing 表，并更新 followerCount 和 followingCount
      await prisma.userFollowing.create({
        data: {
          uid: decoded.uid,
          following_uid: parseInt(id)
        }
      })

      // 更新粉丝数（被关注的人）
      await prisma.user.update({
        where: { uid: parseInt(id) },
        data: { followerCount: { increment: 1 } }
      })

      // 更新关注数（当前用户）
      await prisma.user.update({
        where: { uid: decoded.uid },
        data: { followingCount: { increment: 1 } }
      })

      return res.status(200).json({
        code: 200,
        message: '关注成功',
        data: null
      })
    } else {
      // 取消关注：删除记录从 UserFollowing 表，并更新 followerCount 和 followingCount
      await prisma.userFollowing.delete({
        where: {
          uid_following_uid: {
            uid: decoded.uid,
            following_uid: parseInt(id)
          }
        }
      })

      // 更新粉丝数（被关注的人）
      await prisma.user.update({
        where: { uid: parseInt(id) },
        data: { followerCount: { decrement: 1 } }
      })

      // 更新关注数（当前用户）
      await prisma.user.update({
        where: { uid: decoded.uid },
        data: { followingCount: { decrement: 1 } }
      })

      return res.status(200).json({
        code: 200,
        message: '取消关注成功',
        data: null
      })
    }

  } catch (error) {
    // Prisma 错误：记录已存在（关注时）或记录不存在（取消关注时）
    if (error.code === 'P2002') {
      return res.status(400).json({ code: 400, message: '已经关注了', data: null })
    }
    if (error.code === 'P2025') {
      return res.status(400).json({ code: 400, message: '还没有关注', data: null })
    }

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
