// routes/authRoutes.js - 认证相关路由

const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { needToken } = require('../middleware/authMiddleware')

// --- 路由定义 ---

// 注册接口
// POST /api/register
// 请求体：{ username, password }
// 响应：{ code: 201, data: { token, uid } } 或 { code: 400, message: '用户名已存在' }
router.post('/register', authController.register)

// 登录接口
// POST /api/login
// 请求体：{ username, password }
// 响应：{ code: 200, data: { token, uid } } 或 { code: 401, message: '用户名或密码错误' }
router.post('/login', authController.login)

// 获取当前用户信息（需要认证）
// GET /api/user/profile
// Header: Authorization: Bearer <token>
// 响应：{ code: 200, data: UserItem } 或 { code: 401, message: 'Token 无效' }
router.get('/user/profile', needToken, authController.getProfile)

module.exports = router
