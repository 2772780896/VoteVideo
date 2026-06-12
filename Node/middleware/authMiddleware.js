// middleware/authMiddleware.js - Token 验证中间件

// 加载环境变量
require('dotenv').config()

// 引入 jsonwebtoken
const jwt = require('jsonwebtoken')

// 从环境变量读取 JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET

// Token 验证中间件
// 用法：在路由中使用 app.post('/api/upload/video', needToken, uploadController.uploadVideo)
// 验证成功后，将用户信息放到 req.user 中，供控制器使用
const needToken = (req, res, next) => {
  // 从 Authorization Header 读取 Token
  // 前端传递格式：Authorization: Bearer <token>
  const authHeader = req.headers.authorization

  // 检查是否存在 Authorization Header
  if (!authHeader) {
    return res.status(401).json({
      code: 401,
      message: '请先登录',
      data: null
    })
  }

  // 去掉 "Bearer " 前缀，获取纯 Token
  const token = authHeader.split(' ')[1]

  try {
    // 验证 Token
    // jwt.verify(Token, 密钥) 用法：
    //   - Token：前端传递的 Token
    //   - 密钥：JWT_SECRET（在 .env 中配置）
    //   - 返回载荷（{ uid, username, iat, exp }）
    //   - 如果 Token 无效或过期，会抛出错误
    const decoded = jwt.verify(token, JWT_SECRET)

    // 将用户信息放到 req.user 中，供后续中间件/控制器使用
    // decoded 包含：{ uid, username, iat, exp }
    req.user = decoded

    // 调用 next() 继续执行下一个中间件/控制器
    next()

  } catch (error) {
    // Token 无效或过期
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: 401,
        message: 'Token 无效',
        data: null
      })
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 401,
        message: 'Token 已过期',
        data: null
      })
    }

    // 其他错误
    console.error('Token 验证错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

module.exports = {
  needToken
}
