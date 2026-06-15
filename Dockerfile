# 1. 基础镜像：使用轻量 Node.js 环境
FROM node:20-alpine

# 2. 设置容器内的工作目录
WORKDIR /app

# 3. 复制依赖描述文件（利用 Docker 缓存）
COPY Node/package*.json ./

# 4. 复制 Prisma schema（在 npm install 之前，因为 prisma 是 devDependency）
COPY Node/prisma ./prisma

# 5. 在容器内安装后端依赖
RUN npm install

# 6. 生成 Prisma Client
RUN npx prisma generate

# 7. 复制后端所有的源代码到容器中
COPY Node/ .

# 8. 暴露后端监听的端口
EXPOSE 3000

# 9. 启动后端的命令
CMD ["node", "app.js"]
