// routes/interactRoutes.js - 交互相关路由（点赞、收藏、关注等）

// 引入 Express Router
const express = require('express')
const router = express.Router()

// 引入交互控制器
const interactController = require('../controllers/interactController')

// --- 点赞/取消点赞 ---
// POST /api/:type/:id/like
// DELETE /api/:type/:id/like
// 注意：app.js 中的错误处理中间件会捕获 405 错误（方法不支持）
// 这里简单处理：用同一个路由处理 POST 和 DELETE
router.post('/:type/:id/like', interactController.like)
router.delete('/:type/:id/like', interactController.like)

// --- 收藏/取消收藏 ---
// POST /api/:type/:id/favourite
// DELETE /api/:type/:id/favourite
router.post('/:type/:id/favourite', interactController.favourite)
router.delete('/:type/:id/favourite', interactController.favourite)

// --- 关注/取消关注 ---
// POST /api/user/:id/follow
// DELETE /api/user/:id/follow
// 注意：关注是用户专用，路径是 /user/:id/follow
router.post('/user/:id/follow', interactController.follow)
router.delete('/user/:id/follow', interactController.follow)

// 导出路由
module.exports = router
