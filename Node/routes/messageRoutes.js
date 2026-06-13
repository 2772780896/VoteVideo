// routes/messageRoutes.js - 消息相关路由（私信、通知、SSE）

// 引入 Express Router
const express = require('express')
const router = express.Router()

// 引入 Token 验证中间件
const { needToken } = require('../middleware/authMiddleware')

// 引入消息控制器
const messageController = require('../controllers/messageController')

// --- SSE 端点：获取消息流（需要认证）---
// GET /api/user/message/stream
router.get('/stream', needToken, messageController.getMessageStream)

// --- 发送私信（需要认证）---
// POST /api/user/message/send
router.post('/send', needToken, messageController.sendMessage)

// --- 获取对话列表（需要认证）---
// GET /api/user/message/dialogues
router.get('/dialogues', needToken, messageController.getDialogues)

// --- 获取通知列表（需要认证）---
// GET /api/user/message/notifications
router.get('/notifications', needToken, messageController.getNotifications)

// 导出路由
module.exports = router
