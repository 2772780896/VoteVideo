// routes/index.js - 统一导出所有路由模块

// 引入所有路由模块
const authRoutes = require('./authRoutes')
const videoRoutes = require('./videoRoutes')  // 视频相关路由
const commentRoutes = require('./commentRoutes') // 评论相关路由
const essayRoutes = require('./essayRoutes')   // 文章相关路由
const postRoutes = require('./postRoutes')     // 动态相关路由
const tagRoutes = require('./tagRoutes')       // 标签相关路由
const userRoutes = require('./userRoutes')     // 用户相关路由（除了登录注册）
const uploadRoutes = require('./uploadRoutes')  // 上传相关路由
const interactRoutes = require('./interactRoutes') // 交互相关路由
const messageRoutes = require('./messageRoutes') // 消息相关路由

// 导出路由配置数组（按注册顺序）
// 注意：中间件的执行顺序与数组顺序一致
module.exports = [
  // 认证相关路由（登录/注册/获取用户信息）
  { path: '/api/auth', router: authRoutes },

  // 视频相关路由
  { path: '/api', router: videoRoutes },

  // 评论相关路由
  { path: '/api', router: commentRoutes },

  // 文章相关路由
  { path: '/api', router: essayRoutes },

  // 动态相关路由
  { path: '/api', router: postRoutes },

  // 标签相关路由
  { path: '/api', router: tagRoutes },

  // 用户相关路由（除了登录注册）
  { path: '/api', router: userRoutes },

  // 上传相关路由
  { path: '/api', router: uploadRoutes },

  // 交互相关路由（点赞、收藏、关注等）
  { path: '/api', router: interactRoutes },

  // 消息相关路由（私信、通知）
  { path: '/api', router: messageRoutes },
]
