// controllers/messageController.js - 消息相关控制器（私信、通知）

// 引入 Prisma Client
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// --- 发送私信 ---
// POST /api/user/message/send
// 请求体：{ dialogueMid, text }，dialogueMid=null 表示新建对话
const sendMessage = async (req, res) => {
  try {
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

    // 从请求体获取数据
    const { dialogueMid, text } = req.body

    // 参数校验
    if (!text) {
      return res.status(400).json({
        code: 400,
        message: '消息内容不能为空',
        data: null
      })
    }

    let mid = dialogueMid  // 对话 ID

    if (!mid) {
      // 新建对话
      // Prisma Client 用法：
      //   prisma.dialogue.create({ data: {...} })
      //   - create: 插入新记录
      //   - 返回插入的对象（包含自增 ID）
      const newDialogue = await prisma.dialogue.create({
        data: {
          participant1_uid: decoded.uid,
          participant2_uid: decoded.uid,  // 简化：暂时设为自己（实际应该是接收者 ID）
          lastMessage: text,
          lastDate: new Date()
        }
      })
      mid = newDialogue.mid
    }

    // 插入消息记录
    // Prisma Client 用法：
    //   prisma.message.create({ data: {...} })
    const newMessage = await prisma.message.create({
      data: {
        mid: mid,
        sender_uid: decoded.uid,
        text: text
      }
    })

    // 更新对话的最后消息和时间
    await prisma.dialogue.update({
      where: { mid: mid },
      data: {
        lastMessage: text,
        lastDate: new Date()
      }
    })

    return res.status(201).json({
      code: 201,
      message: '发送成功',
      data: {
        messageId: newMessage.id,
        dialogueMid: mid
      }
    })

  } catch (error) {
    console.error('发送私信错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// --- 获取对话列表 ---
// GET /api/user/message/dialogues
const getDialogues = async (req, res) => {
  try {
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

    // Prisma Client 用法：
    //   prisma.dialogue.findMany({ where: { ... }, include: { ... } })
    //   - findMany: 查询多条记录
    //   - where: 查询条件（OR 表示或）
    const dialogues = await prisma.dialogue.findMany({
      where: {
        OR: [
          { participant1_uid: decoded.uid },
          { participant2_uid: decoded.uid }
        ]
      },
      include: {
        // 关联查询：获取参与者1信息
        participant1: {
          select: {
            uid: true,
            username: true,
            profilePictureUrl: true
          }
        },
        // 关联查询：获取参与者2信息
        participant2: {
          select: {
            uid: true,
            username: true,
            profilePictureUrl: true
          }
        },
        // 关联查询：获取消息列表
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                uid: true,
                username: true,
                profilePictureUrl: true
              }
            }
          }
        }
      }
    })

    // 转换为 DialogueItem 格式
    const dialogueItems = dialogues.map(dialogue => {
      // 确定对手（不是当前用户的参与者）
      const opponent = dialogue.participant1_uid === decoded.uid
        ? dialogue.participant2
        : dialogue.participant1

      return {
        mid: dialogue.mid,
        opponent: {
          uid: opponent.uid,
          userName: opponent.username,
          profilePictureUrl: opponent.profilePictureUrl
        },
        sentences: dialogue.messages.map(msg => ({
          text: msg.text,
          sender: msg.sender_uid === decoded.uid ? null : {
            uid: msg.sender.uid,
            userName: msg.sender.username,
            profilePictureUrl: msg.sender.profilePictureUrl
          },
          date: formatDate(msg.createdAt)
        })),
        lastMessage: dialogue.lastMessage,
        lastDate: formatDate(dialogue.lastDate)
      }
    })

    return res.status(200).json({
      code: 200,
      message: '获取成功',
      data: dialogueItems
    })

  } catch (error) {
    console.error('获取对话列表错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// --- 获取通知列表 ---
// GET /api/user/notification
const getNotifications = async (req, res) => {
  try {
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

    // Prisma Client 用法：
    //   prisma.notification.findMany({ where: { from_uid: decoded.uid }, orderBy: { ... } })
    const notifications = await prisma.notification.findMany({
      where: { from_uid: decoded.uid },
      orderBy: { createdAt: 'desc' }
    })

    // 转换为 NotificationItem 格式
    const notificationItems = notifications.map(notification => ({
      nid: notification.nid,
      type: notification.type,
      text: notification.text,
      from: {
        uid: notification.from_uid,
        userName: '',  // 需要关联查询用户信息（简化）
        profilePictureUrl: ''
      },
      targetType: notification.targetType,
      targetId: notification.targetId,
      parentType: notification.parentType,
      parentId: notification.parentId,
      date: formatDate(notification.createdAt)
    }))

    return res.status(200).json({
      code: 200,
      message: '获取成功',
      data: notificationItems
    })

  } catch (error) {
    console.error('获取通知列表错误:', error)
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
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// 导出控制器函数
module.exports = {
  sendMessage,
  getDialogues,
  getNotifications
}
