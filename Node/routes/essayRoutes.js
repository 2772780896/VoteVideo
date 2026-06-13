// routes/essayRoutes.js - 文章相关路由

const express = require('express')
const router = express.Router()

const essayController = require('../controllers/essayController')

// --- 文章列表 ---
// GET /api/essay?sort=-date&page=1&element=16
router.get('/', essayController.getEssayList)

// --- 文章详情 ---
// GET /api/essay/:eid
// 注意：这个路由必须放在 / 之后，否则 / 会被匹配为 /:eid
router.get('/:eid', essayController.getEssayDetail)

// 导出路由
module.exports = router
