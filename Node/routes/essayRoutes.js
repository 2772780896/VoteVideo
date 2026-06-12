// routes/essayRoutes.js - 文章相关路由

// 引入 Express Router
const express = require('express')
const router = express.Router()

// 引入文章控制器
const essayController = require('../controllers/essayController')

// --- 文章列表 ---
// GET /api/essay?sort=-date&page=1&element=16
router.get('/essay', essayController.getEssayList)

// --- 文章详情 ---
// GET /api/essay/:eid
// 注意：这个路由必须放在 /essay 之后，否则 /essay 会被匹配为 /essay/:eid
router.get('/essay/:eid', essayController.getEssayDetail)

// 导出路由
module.exports = router
