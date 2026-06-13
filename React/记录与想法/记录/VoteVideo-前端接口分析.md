# VoteVideo React 前端 — 后端接口需求分析

## 概述

本文档基于 VoteVideo 项目 React 前端源码的完整分析，列出所有需要后端实现的 API 接口，以及每个接口的请求方式、路径、发送数据和预期返回数据。

**认证方式：** 基于 Cookie 存储的 Bearer Token。前端通过 `js-cookie` 管理 `token` 和 `uid` 两个 Cookie，需要认证的请求在 `Authorization` 请求头中携带 `Bearer <token>`。

**通用响应格式（从前端消费方式推断）：**

```json
{
  "code": 200,
  "message": "描述信息",
  "data": { ... }
}
```

列表类接口的 `data` 结构推断为：

```json
{
  "items": [ ... ],
  "total": 100
}
```

---

## 一、账户与认证模块

### 1. 用户登录

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/login` |
| **认证** | 不需要 |
| **调用位置** | `LoginModal.jsx` |

**请求体：**

```json
{
  "username": "字符串",
  "password": "字符串"
}
```

**预期响应（code=200 表示成功）：**

```json
{
  "code": 200,
  "message": "...",
  "data": {
    "token": "JWT 令牌字符串",
    "uid": "用户 ID（数字或字符串）"
  }
}
```

前端成功逻辑：`res.data.code === 200` 时将 `token` 和 `uid` 写入 Cookie，跳转到 `/user/profile`。失败时显示 `res.data.message`。

---

### 2. 用户注册

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/register` |
| **认证** | 不需要 |
| **调用位置** | `LoginModal.jsx` |

**请求体：**

```json
{
  "username": "字符串",
  "password": "字符串"
}
```

**预期响应（code=201 表示成功）：**

```json
{
  "code": 201,
  "message": "...",
  "data": {
    "token": "JWT 令牌字符串",
    "uid": "用户 ID"
  }
}
```

前端成功逻辑：`res.data.code === 201` 时同登录流程。

---

### 3. 获取当前用户个人资料

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/user/profile/` |
| **认证** | 需要（Bearer Token） |
| **调用位置** | `Profile.jsx`、`UserMenu.jsx` |

**请求参数：** 无

**预期响应 data：**

```json
{
  "profilePictureUrl": "头像图片 URL",
  "userName": "用户名",
  "date": "注册日期或资料日期",
  "info": "个人简介文本",
  "followerCount": 123,
  "uid": "用户 ID"
}
```

前端在 `Profile.jsx` 中消费 `profilePictureUrl`、`userName`、`date`、`info`；在 `UserMenu.jsx` 中消费 `profilePictureUrl`、`userName`、`followerCount`、`uid`。收到 401 错误时前端自动跳转到 `/main`。

---

### 4. 获取用户公开资料

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/user/{uid}` |
| **认证** | 不需要 |
| **调用位置** | `User.jsx`（通过 `fetchItem('user', uid)`） |

**路径参数：** `uid` — 目标用户 ID

**预期响应 data：**

```json
{
  "profilePictureUrl": "头像 URL",
  "userName": "用户名",
  "followerCount": 123,
  "followingCount": 45,
  "info": "个人简介",
  "uid": "用户 ID"
}
```

---

### 5. 获取个人资料子数据（投稿/收藏/历史/关注/消息）

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/user/profile/{profileType}/{dataType}` |
| **认证** | 需要（Bearer Token） |
| **调用位置** | `ProfileTabContent.jsx`、`ProfileFollow.jsx`、`ProfileMessage.jsx` |

**路径参数：**

- `profileType`：`'uploads'`（投稿）| `'favourites'`（收藏）| `'history'`（历史）| `'follow'`（关注）| `'message'`（消息）
- `dataType`：
  - profileType=uploads/favourites/history 时：`'videos'` | `'posts'` | `'essays'`
  - profileType=follow 时：`'followingList'`
  - profileType=message 时：`'dialogueList'` | `'notificationList'`

**查询参数：**

```
sort    — 排序方式（如 "-date"）
page    — 页码，默认 1
element — 每页数量，默认 16
```

**预期响应 data（列表类通用结构）：**

```json
{
  "items": [ ... ],
  "total": 100
}
```

根据 profileType/dataType 不同，`items` 中的元素结构不同：

**uploads/favourites/history → videos 的 item：** 同视频卡片数据结构（vid, title, coverUrl, viewCount, commentCount, uploader 等）

**uploads/favourites/history → posts 的 item：** 同图文卡片数据结构（pid, title, pictureList, videoList, viewCount 等）

**uploads/favourites/history → essays 的 item：** 同文章卡片数据结构（eid, title, thumbnailUrl, viewCount 等）

**follow/followingList 的 item：**

```json
{
  "uid": "用户 ID",
  "profilePictureUrl": "头像 URL",
  "userName": "用户名",
  "followerCount": 123
}
```

**message/dialogueList 的 item：**

```json
{
  "mid": "对话 ID",
  "opponent": {
    "uid": "对方用户 ID",
    "userName": "对方用户名",
    "profilePictureUrl": "对方头像 URL"
  },
  "sentences": [
    { "text": "消息文本", "date": "发送时间", "sender": "发送者标识" }
  ]
}
```

**message/notificationList 的 item：**

```json
{
  "mid": "消息 ID",
  "sender": {
    "uid": "发送者 ID",
    "userName": "发送者用户名",
    "profilePictureUrl": "发送者头像"
  },
  "text": "通知文本内容",
  "date": "时间",
  "targetType": "目标类型（如 comment）",
  "targetId": "目标 ID",
  "parentType": "父级类型（如 video）",
  "parentId": "父级 ID"
}
```

---

### 6. 发送私信

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/user/message/send` |
| **认证** | 需要（Bearer Token） |
| **调用位置** | `ProfileMessage.jsx` |

**请求体：**

```json
{
  "dialogueMid": "对话 ID（字符串）",
  "text": "消息文本内容"
}
```

**预期响应：** 成功/失败状态即可，前端采用乐观更新策略（先显示消息再发送请求）。

---

## 二、内容获取模块

### 7. 获取单个资源详情（通用）

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/{resourceType}/{id}` |
| **认证** | 不需要 |
| **调用位置** | `Video.jsx`、`Essay.jsx`、`Post.jsx`、`Tag.jsx`、`User.jsx` |

**路径参数：**

- `resourceType`：`'video'` | `'essay'` | `'post'` | `'tag'` | `'user'`
- `id`：资源 ID

**各类型预期响应 data：**

**视频详情（resourceType=video）：**

```json
{
  "vid": "视频 ID",
  "title": "视频标题",
  "coverUrl": "封面图 URL",
  "videoUrl": "视频播放 URL",
  "viewCount": 1234,
  "commentCount": 56,
  "date": "发布日期",
  "tagList": [
    { "tid": "标签 ID", "tagName": "标签名" }
  ],
  "uploader": {
    "uid": "上传者 ID",
    "userName": "上传者用户名",
    "profilePictureUrl": "头像 URL",
    "isFollowing": false
  },
  "isLiked": false,
  "likeCount": 100,
  "isFavourited": false,
  "favouriteCount": 50,
  "isReshared": false,
  "reshareCount": 20
}
```

**文章详情（resourceType=essay）：**

```json
{
  "eid": "文章 ID",
  "title": "文章标题",
  "text": "文章正文内容",
  "date": "发布日期",
  "viewCount": 123,
  "commentCount": 45,
  "uploader": {
    "uid": "作者 ID",
    "userName": "作者名",
    "profilePictureUrl": "头像 URL"
  },
  "isLiked": false,
  "likeCount": 10,
  "isFavourited": false,
  "favouriteCount": 5,
  "isReshared": false,
  "reshareCount": 2
}
```

**图文详情（resourceType=post）：**

```json
{
  "pid": "图文 ID",
  "title": "标题",
  "text": "文本内容",
  "date": "发布日期",
  "pictureList": ["图片URL1", "图片URL2"],
  "videoList": [
    { "videoUrl": "视频URL", "coverUrl": "封面URL" }
  ],
  "viewCount": 123,
  "commentCount": 45,
  "uploader": {
    "uid": "作者 ID",
    "userName": "作者名",
    "profilePictureUrl": "头像 URL"
  },
  "isLiked": false,
  "likeCount": 10,
  "isFavourited": false,
  "favouriteCount": 5,
  "isReshared": false,
  "reshareCount": 2
}
```

**标签详情（resourceType=tag）：**

```json
{
  "tid": "标签 ID",
  "tagName": "标签名称",
  "viewCount": 1234,
  "commentCount": 56
}
```

**用户详情（resourceType=user）：** 同第 4 接口的响应 data。

---

### 8. 获取资源列表（通用）

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/{resourceType}` |
| **认证** | 不需要 |
| **调用位置** | `Search.jsx`、`User.jsx`、`Dynamic.jsx`、`Video.jsx`（评论列表）、`Essay.jsx`（评论列表）、`Tag.jsx`（评论列表） |

**路径参数：** `resourceType`：`'video'` | `'essay'` | `'post'` | `'comment'` | `'user'` | `'tag'`

**查询参数：**

```
sort    — 排序方式（如 "-date" 表示按日期降序）
page    — 页码
element — 每页数量
q       — 搜索关键词（仅搜索页使用）
uid     — 用户 ID（用户主页筛选时使用）
vid     — 视频 ID（获取视频评论时使用）
```

**预期响应 data：**

```json
{
  "items": [ ... ],
  "total": 100
}
```

items 中的元素结构取决于 resourceType，分别对应 VideoCard / EssayCard / PostCard / CommentCard / UserCard / TagCard 所需的数据。

**评论 item 结构（resourceType=comment）：**

```json
{
  "cid": "评论 ID",
  "text": "评论内容",
  "date": "评论时间",
  "isLiked": false,
  "likeCount": 5,
  "isDisliked": false,
  "dislikeCount": 0,
  "commenter": {
    "uid": "评论者 ID",
    "userName": "评论者用户名",
    "profilePictureUrl": "头像 URL"
  },
  "subComments": [ ... ]
}
```

---

### 9. 获取首页主视频列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/video/main` |
| **认证** | 不需要 |
| **调用位置** | `Main.jsx` |

**查询参数：**

```
page    — 页码（默认 1）
element — 每页数量（默认 16）
```

**预期响应 data：** 同视频列表格式 `{ items: [...], total: N }`

---

### 10. 获取相关视频

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/video/related` |
| **认证** | 不需要 |
| **调用位置** | `Video.jsx`（通过 DataList） |

**查询参数：**

```
vid     — 当前视频 ID
sort    — 排序方式
page    — 页码
element — 每页数量
```

**预期响应 data：** 同视频列表格式

---

### 11. 获取轮播图

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/picture/carousel` |
| **认证** | 不需要 |
| **调用位置** | `Main.jsx` |

**查询参数：**

```
number — 需要的轮播图数量（前端传 5）
```

**预期响应 data：**

```json
{
  "items": [
    { "id": "图片 ID", "src": "图片 URL" }
  ]
}
```

---

## 三、内容上传模块

### 12. 上传视频

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/upload/video` |
| **认证** | 需要（Bearer Token） |
| **调用位置** | `UploadVideo.jsx` |

**请求体：**

```json
{
  "title": "视频标题",
  "description": "视频描述",
  "cover": "封面图 Base64 字符串（JPEG 格式）",
  "videoUrl": "视频文件 URL（Blob URL 或预设 URL）"
}
```

**预期响应：** 成功/失败状态。前端仅显示 alert 提示。

---

### 13. 上传文章

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/upload/essay` |
| **认证** | 需要（Bearer Token） |
| **调用位置** | `UploadEssay.jsx` |

**请求体：**

```json
{
  "title": "文章标题",
  "description": "文章内容/描述"
}
```

**预期响应：** 成功/失败状态。

---

### 14. 上传图文

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/upload/post` |
| **认证** | 需要（Bearer Token） |
| **调用位置** | `UploadPost.jsx` |

**请求体：**

```json
{
  "text": "图文文本内容",
  "images": [
    "data:image/png;base64,...",
    "data:image/jpeg;base64,..."
  ]
}
```

`images` 是 Base64 Data URL 字符串数组。

**预期响应：** 成功/失败状态。

---

## 四、社交互动模块（统一 interact 接口）

前端通过一个统一的 `interact(mediaType, action, mediaId)` 函数处理所有社交互动。`mediaType` 可选值为 `'video'` | `'essay'` | `'post'` | `'comment'` | `'user'`。所有互动请求体均为空对象 `{}`，需要认证。

### 15. 点赞 / 取消点赞

| 项目 | 内容 |
|------|------|
| **点赞路径** | `POST /api/{mediaType}/{mediaId}/like` |
| **取消点赞路径** | `DELETE /api/{mediaType}/{mediaId}/like` |
| **调用位置** | `InteractionBar.jsx`（视频/文章/图文）、`CommentCard.jsx`（评论） |

**前端行为：** 乐观更新，成功后保持状态，失败后回滚并显示 2 秒错误提示。

---

### 16. 收藏 / 取消收藏

| 项目 | 内容 |
|------|------|
| **收藏路径** | `POST /api/{mediaType}/{mediaId}/favourite` |
| **取消收藏路径** | `DELETE /api/{mediaType}/{mediaId}/favourite` |
| **调用位置** | `InteractionBar.jsx` |

---

### 17. 转发 / 取消转发

| 项目 | 内容 |
|------|------|
| **转发路径** | `POST /api/{mediaType}/{mediaId}/reshare` |
| **取消转发路径** | `DELETE /api/{mediaType}/{mediaId}/reshare` |
| **调用位置** | `InteractionBar.jsx` |

注意：标签（tag）类型不显示转发按钮（`showReshare=false`）。

---

### 18. 踩 / 取消踩

| 项目 | 内容 |
|------|------|
| **踩路径** | `POST /api/{mediaType}/{mediaId}/dislike` |
| **取消踩路径** | `DELETE /api/{mediaType}/{mediaId}/dislike` |
| **调用位置** | `CommentCard.jsx`（仅评论） |

---

### 19. 关注 / 取消关注

| 项目 | 内容 |
|------|------|
| **关注路径** | `POST /api/user/{uid}/follow` |
| **取消关注路径** | `DELETE /api/user/{uid}/follow` |
| **调用位置** | `User.jsx`（用户页关注按钮）、`UploaderCard.jsx`（视频页关注上传者）、`ProfileFollow.jsx`（关注列表管理） |

注意：此接口的 `mediaType` 固定为 `'user'`，`mediaId` 即目标用户的 `uid`。

---

## 五、完整接口路径速查表

| 序号 | 方法 | 路径 | 认证 | 功能 |
|------|------|------|------|------|
| 1 | POST | `/api/login` | 否 | 用户登录 |
| 2 | POST | `/api/register` | 否 | 用户注册 |
| 3 | GET | `/api/user/profile/` | 是 | 获取当前用户资料 |
| 4 | GET | `/api/user/{uid}` | 否 | 获取用户公开资料 |
| 5 | GET | `/api/user/profile/{profileType}/{dataType}` | 是 | 获取个人资料子数据 |
| 6 | POST | `/api/user/message/send` | 是 | 发送私信 |
| 7 | GET | `/api/{resourceType}/{id}` | 否 | 获取单个资源详情 |
| 8 | GET | `/api/{resourceType}` | 否 | 获取资源列表（含搜索/筛选） |
| 9 | GET | `/api/video/main` | 否 | 首页主视频列表 |
| 10 | GET | `/api/video/related` | 否 | 相关视频推荐 |
| 11 | GET | `/api/picture/carousel` | 否 | 轮播图 |
| 12 | POST | `/api/upload/video` | 是 | 上传视频 |
| 13 | POST | `/api/upload/essay` | 是 | 上传文章 |
| 14 | POST | `/api/upload/post` | 是 | 上传图文 |
| 15 | POST/DELETE | `/api/{mediaType}/{mediaId}/like` | 是 | 点赞/取消点赞 |
| 16 | POST/DELETE | `/api/{mediaType}/{mediaId}/favourite` | 是 | 收藏/取消收藏 |
| 17 | POST/DELETE | `/api/{mediaType}/{mediaId}/reshare` | 是 | 转发/取消转发 |
| 18 | POST/DELETE | `/api/{mediaType}/{mediaId}/dislike` | 是 | 踩/取消踩 |
| 19 | POST/DELETE | `/api/user/{uid}/follow` | 是 | 关注/取消关注 |

---

## 六、前端路由结构

| 路由路径 | 页面组件 | 核心功能 |
|----------|----------|----------|
| `/` `/main` | Main.jsx | 首页：轮播图 + 主视频列表 |
| `/video/:vid` | Video.jsx | 视频详情：播放器 + 评论 + 相关推荐 |
| `/essay/:eid` | Essay.jsx | 文章详情 + 评论 |
| `/post/:pid` | Post.jsx | 图文详情 |
| `/tag/:tid` | Tag.jsx | 标签详情 + 评论 |
| `/user/:uid` | User.jsx | 用户主页：资料 + 投稿(视频/图文/文章) |
| `/user/profile` | Profile.jsx | 个人中心：投稿/收藏/历史/关注/消息 |
| `/search` | Search.jsx | 搜索：视频/文章/图文/用户/标签 |
| `/dynamic` | Dynamic.jsx | 动态页：图文列表 |
| `/upload` | Upload.jsx | 上传页：视频/文章/图文 |

---

## 七、补充说明

**超时配置：** Axios 实例超时时间为 5000ms（5 秒）。

**响应数据解包：** `useData` Hook 统一从 `response.data.data` 中提取业务数据，因此后端返回需严格遵循 `{ code, message, data }` 三层结构。

**错误码处理：** 前端根据 `error.data.code` 做特殊处理，已识别的错误码包括：401（未登录，跳转首页）、404（资源不存在，显示未找到页面）。

**排序参数约定：** 前端使用 `-字段名` 表示降序、`字段名` 表示升序，如 `-date` 表示按日期降序。

**分页参数约定：** `page` 从 1 开始，`element` 表示每页数量（不同页面默认值不同，常见为 10 或 16）。
