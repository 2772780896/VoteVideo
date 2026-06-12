// routes/messageRoutes.js - 消息相关路由（私信、通知）

// 引入 Express Router
const express = require('express')
const router = express.Router()

// 引入消息控制器
const messageController = require('../controllers/messageController')

// --- 发送私信 ---
// POST /api/user/message/send
router.post('/user/message/send', messageController.sendMessage)

// --- 获取对话列表 ---
// GET /api/user/message/dialogues
router.get('/user/message/dialogues', messageController.getDialogues)

// --- 获取通知列表 ---
// GET /api/user/notification
router.get('/user/notification', messageController.getNotifications)

// 导出路由
module.exports = router
