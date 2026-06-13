// routes/interactRoutes.js - 交互相关路由（点赞、收藏、关注等）

// 引入 Express Router
const express = require('express')
const router = express.Router()

// 引入交互控制器
const interactController = require('../controllers/interactController')

// 引入 Token 验证中间件
const { needToken } = require('../middleware/authMiddleware')

// --- 路由定义 ---

// 点赞/取消点赞
// POST /api/:type/:id/like
// DELETE /api/:type/:id/like
// Header: Authorization: Bearer <token>
// 响应：{ code: 200, data: { likeCount } } 或 { code: 401, message: 'Token 无效' }
router.post('/:type/:id/like', needToken, interactController.like)
router.delete('/:type/:id/like', needToken, interactController.like)

// 收藏/取消收藏
// POST /api/:type/:id/favourite
// DELETE /api/:type/:id/favourite
// Header: Authorization: Bearer <token>
// 响应：{ code: 200, message: '收藏成功' } 或 { code: 401, message: 'Token 无效' }
router.post('/:type/:id/favourite', needToken, interactController.favourite)
router.delete('/:type/:id/favourite', needToken, interactController.favourite)

// 关注/取消关注
// POST /api/user/:id/follow
// DELETE /api/user/:id/follow
// Header: Authorization: Bearer <token>
// 响应：{ code: 200, message: '关注成功' } 或 { code: 401, message: 'Token 无效' }
router.post('/user/:id/follow', needToken, interactController.follow)
router.delete('/user/:id/follow', needToken, interactController.follow)

module.exports = router
