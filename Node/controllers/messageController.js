// controllers/messageController.js - 消息相关控制器（私信、通知、SSE）

// 引入消息服务
const messageService = require('../services/messageService')

// --- SSE 端点：获取消息流（需要认证）---
// GET /api/message/stream
// 用途：建立 SSE 连接，实时接收消息
const getMessageStream = async (req, res) => {
  try {
    // 从 req.user 获取用户信息（由 needToken 中间件设置）
    const { uid } = req.user

    // 1. 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')

    // 2. 添加用户到在线列表
    messageService.addOnlineUser(uid, res)

    // 3. 发送初始消息（确认连接成功）
    res.write(`data: ${JSON.stringify({ type: 'connected', uid: uid })}\n\n`)

    // 4. 心跳（保持连接）
    const heartbeat = setInterval(() => {
      res.write(`data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`)
    }, 30000)  // 每30秒发送一次心跳

    // 5. 连接关闭时清理
    req.on('close', () => {
      clearInterval(heartbeat)  // 清除心跳
      messageService.removeOnlineUser(uid)  // 从在线列表移除
      res.end()  // 结束响应
    })

  } catch (error) {
    console.error('SSE连接错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// --- 发送私信（需要认证）---
// POST /api/message/send
// 请求体：{ receiverUid, text }
const sendMessage = async (req, res) => {
  try {
    // 从 req.user 获取用户信息（由 needToken 中间件设置）
    const { uid } = req.user
    const { dialogueMid, receiverUid, text } = req.body

    // 调用服务层发送消息
    // 支持两种模式：
    //   1. 通过 dialogueMid 直接发送到已有对话
    //   2. 通过 receiverUid 查找或创建对话后发送
    const result = await messageService.sendMessage(uid, receiverUid, text, dialogueMid)

    // 返回成功响应
    return res.status(201).json({
      code: 201,
      message: '发送成功',
      data: {
        messageId: result.messageId,
        dialogueId: result.dialogueId,
        pushed: result.pushed  // 是否成功推送（用于调试）
      }
    })

  } catch (error) {
    // 参数错误
    if (error.message === '消息内容不能为空' || error.message === '必须指定对话ID或接收者ID') {
      return res.status(400).json({
        code: 400,
        message: error.message,
        data: null
      })
    }

    console.error('发送私信错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// --- 获取对话列表（需要认证）---
// GET /api/message/dialogues
const getDialogues = async (req, res) => {
  try {
    // 从 req.user 获取用户信息（由 needToken 中间件设置）
    const { uid } = req.user

    // 调用服务层获取对话列表
    // messageService.getDialogues(uid) 用法：
    //   - uid: 用户ID
    //   - 返回：DialogueItem[]
    const dialogueItems = await messageService.getDialogues(uid)

    // 返回成功响应
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

// --- 获取通知列表（需要认证）---
// GET /api/message/notifications
const getNotifications = async (req, res) => {
  try {
    // 从 req.user 获取用户信息（由 needToken 中间件设置）
    const { uid } = req.user

    // 调用服务层获取通知列表
    // messageService.getNotifications(uid) 用法：
    //   - uid: 用户ID
    //   - 返回：NotificationItem[]
    const notificationItems = await messageService.getNotifications(uid)

    // 返回成功响应
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

// 导出控制器函数
module.exports = {
  getMessageStream,
  sendMessage,
  getDialogues,
  getNotifications
}
