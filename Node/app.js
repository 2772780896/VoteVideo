const http = require('http');

const server = http.createServer((req, res) => {
  // 设置响应头，防止中文乱码
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (req.url === '/index') {
    res.end('首页');
  }
});

server.listen(3000, () => console.log('启动在 3000'));