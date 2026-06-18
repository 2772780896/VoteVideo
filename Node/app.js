// app.js - VoteVideo 后端入口文件

// 加载环境变量（从 .env 文件读取 DATABASE_URL, JWT_SECRET, PORT）
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')  // 新增：用于拼接 uploads 目录的绝对路径
const routes = require('./routes')  // 引入路由索引（批量注册）

// 创建 Express 应用实例
const app = express()

// --- 中间件配置 ---

// CORS 中间件：允许前端跨域请求
// 开发阶段允许所有来源，生产环境应配置具体域名
// app.use(cors())

// JSON 解析中间件：自动解析请求体中的 JSON 数据
// 等价于 body-parser.json()，但 Express 4.16+ 已内置
// 解析后的数据可通过 req.body 访问
app.use(express.json())

// URL-encoded 解析中间件：解析表单数据（可选）
app.use(express.urlencoded({ extended: true }))

// 新增：静态文件服务 —— 让 uploads/ 目录下的文件可通过 HTTP 直接访问
// multer 把上传的文件写入 uploads/video/、uploads/cover/、uploads/post/
// 这条中间件使得 http://localhost:3000/uploads/video/xxx.mp4 等 URL 可以直接访问到磁盘文件
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// --- 路由注册（批量注册） ---

// 从 routes/index.js 读取所有路由配置
// 循环注册每个路由模块（按数组顺序执行）
routes.forEach(({ path, router }) => {
  app.use(path, router)
})

// --- 健康检查接口 ---
app.get('/', (req, res) => {
  res.json({
    code: 200,
    message: 'VoteVideo API is running',
    data: null
  })
})

// --- 错误处理中间件 ---
// 放在所有路由之后，用于捕获未处理的错误
app.use((err, req, res, next) => {
  console.error('全局错误:', err.stack)
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    data: null
  })
})

// --- 启动服务器 ---
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ VoteVideo 后端服务已启动`)
  console.log(`   - 本地访问: http://localhost:${PORT}`)
  console.log(`   - 健康检查: http://localhost:${PORT}/`)
})
