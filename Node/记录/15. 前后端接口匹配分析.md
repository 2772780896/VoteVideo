# VoteVideo 前后端接口匹配分析

## 一、技术栈概览

| 维度 | 前端（React） | 后端（Node） |
|------|--------------|-------------|
| 框架 | React + Vite + Ant Design | Express 5 + Prisma ORM |
| 数据库 | — | SQLite |
| 认证 | Cookie 存储 Bearer Token | JWT（7天过期） |
| HTTP 客户端 | Axios（5s 超时） | — |
| 响应解包 | `useData` Hook 取 `response.data.data` | 统一返回 `{ code, message, data }` |

---

## 二、路由与接口逐项对比

### 符号说明

- ✅ 匹配 — 路径、参数、响应格式均一致
- ⚠️ 部分匹配 — 存在字段缺失、类型不一致等小问题
- ❌ 不匹配 — 存在严重问题，前端无法正常工作
- 🆕 后端多余 — 后端有但前端未使用

---

### 1. 认证模块

#### 1.1 用户登录 `POST /api/login` ✅

| 维度 | 前端预期 | 后端实现 | 状态 |
|------|---------|---------|------|
| 请求体 | `{ username, password }` | `{ username, password }` | ✅ |
| 成功码 | `code === 200` | `code: 200` | ✅ |
| 响应 data | `{ token, uid }` | `{ token, uid }` | ✅ |
| 失败处理 | 显示 `res.data.message` | 返回 `message` 字段 | ✅ |

**结论：** 完全匹配。

---

#### 1.2 用户注册 `POST /api/register` ✅

| 维度 | 前端预期 | 后端实现 | 状态 |
|------|---------|---------|------|
| 请求体 | `{ username, password }` | `{ username, password }` | ✅ |
| 成功码 | `code === 201` | `code: 201` | ✅ |
| 响应 data | `{ token, uid }` | `{ token, uid }` | ✅ |

**结论：** 完全匹配。

---

### 2. 用户资料模块

#### 2.1 获取当前用户资料 `GET /api/user/profile/` ⚠️

| 维度 | 前端预期 | 后端实现 | 状态 |
|------|---------|---------|------|
| 路径 | `/api/user/profile/`（带尾部斜杠） | `/api/user/profile`（无尾部斜杠，由 authRoutes 注册） | ⚠️ |
| 认证 | Bearer Token（needToken） | needToken 中间件 | ✅ |
| 前端消费字段 | `profilePictureUrl`, `userName`, `date`, `info` | 返回 `profilePictureUrl`, `username`, `info`, `date`, `followerCount`, `followingCount` | ⚠️ |

**问题 1 — 字段名不一致：** 前端 `UserMenu.jsx` 消费 `userName`，后端返回的字段是 `username`（小写 n）。前端 `Profile.jsx` 也使用 `userName`。后端 `authController.getProfile` 直接返回 Prisma 原始字段名 `username`，没有做映射。

**问题 2 — 路由冲突：** `authRoutes` 和 `userRoutes` 都注册了 `GET /api/user/profile`。由于 `authRoutes` 先挂载，带 `needToken` 的版本优先生效。`userRoutes` 中无中间件的 `getProfile` 实际不可达。前端 `Profile.jsx` 使用 `needToken` 所以走的是正确路由。

**问题 3 — 尾部斜杠：** 前端 `getMyProfile()` 请求 `/api/user/profile/`（带尾部斜杠），后端路由是 `/api/user/profile`。Express 默认对尾部斜杠有宽容处理，但存在隐患。

---

#### 2.2 获取用户公开资料 `GET /api/user/{uid}` ✅

| 维度 | 前端预期 | 后端实现 | 状态 |
|------|---------|---------|------|
| 路径参数 | `uid` | `uid`（parseInt） | ✅ |
| 前端消费字段 | `profilePictureUrl`, `userName`, `followerCount`, `followingCount`, `info`, `uid` | 返回 `profilePictureUrl`, `userName`, `followerCount`, `followingCount` | ⚠️ |

**问题 — 缺少 `info` 字段：** 前端 `User.jsx` 消费了 `userData.info`（个人简介），但 `userController.getUserDetail` 的响应 data 中不包含 `info`（select 中虽然查了 `info`，但返回时被排除在转换后的对象之外）。

---

#### 2.3 获取个人资料子数据 `GET /api/user/profile/{profileType}/{dataType}` ⚠️

| 维度 | 前端预期 | 后端实现 | 状态 |
|------|---------|---------|------|
| 路径 | 匹配 | 匹配 | ✅ |
| 认证 | 需要 Token | 手动解析 JWT（未用 needToken 中间件） | ⚠️ |
| 查询参数 | `sort`, `page`, `element` | `sort`, `page`, `element` | ✅ |

**问题 1 — 认证方式不一致：** 后端 `userController.getProfileSubdata` 手动从 `req.headers.authorization` 解析 JWT，而不是使用 `needToken` 中间件。虽然功能等价，但风格不统一，且该路由未挂载 `needToken` 中间件，意味着无 Token 请求也能到达 handler（然后 handler 内部返回 401）。

**问题 2 — 前端使用的 profileType/dataType 组合与后端支持范围的对比：**

| profileType | dataType | 前端使用 | 后端支持 | 状态 |
|-------------|----------|---------|---------|------|
| uploads | videos | ✅ ProfileTabContent | ✅ | ✅ |
| uploads | posts | ✅ ProfileTabContent | ✅ | ✅ |
| uploads | essays | ✅ ProfileTabContent | ✅ | ✅ |
| favourites | videos | ✅ ProfileTabContent | ⚠️ 只返回原始 UserFavourite 记录 | ⚠️ |
| favourites | posts | ✅ ProfileTabContent | ⚠️ 同上 | ⚠️ |
| favourites | essays | ✅ ProfileTabContent | ⚠️ 同上 | ⚠️ |
| history | videos | ✅ ProfileTabContent | ⚠️ 只返回原始 UserHistory 记录 | ⚠️ |
| history | posts | ✅ ProfileTabContent | ⚠️ 同上 | ⚠️ |
| history | essays | ✅ ProfileTabContent | ⚠️ 同上 | ⚠️ |
| follow | followingList | ✅ ProfileFollow | ❌ 不支持 | ❌ |
| message | dialogueList | ✅ ProfileMessage | ❌ 不支持此路径 | ❌ |
| message | notificationList | ✅ ProfileMessage | ❌ 不支持此路径 | ❌ |

**问题 3 — 收藏和历史数据格式不完整：** 当 `profileType` 为 `favourites` 或 `history` 时，后端仅返回 `UserFavourite` / `UserHistory` 原始关联记录（只有 `uid, type, item_id, addDate`），没有关联查询实际的视频/文章/图文数据。前端期望的是与 uploads 相同格式的内容卡片数据。

**问题 4 — 关注列表完全缺失：** 前端通过 `getProfileSubdata(sort, page, element, 'follow', 'followingList')` 请求 `GET /api/user/profile/follow/followingList`，后端 `getProfileSubdata` 只处理了 `uploads`、`favourites`、`history` 三种 profileType，不支持 `follow`。

**问题 5 — 消息相关路由路径不一致：** 前端通过 `getProfileSubdata(sort, page, element, 'message', 'dialogueList')` 请求 `GET /api/user/profile/message/dialogueList`，但后端的消息功能由独立的 `messageRoutes` 提供：

- 对话列表：`GET /api/user/message/dialogues`
- 通知列表：`GET /api/user/message/notifications`

前端期望的路径 `/api/user/profile/message/dialogueList` 在后端根本不存在。

---

#### 2.4 发送私信 `POST /api/user/message/send` ❌

| 维度 | 前端预期 | 后端实现 | 状态 |
|------|---------|---------|------|
| 路径 | `/api/user/message/send` | `/api/user/message/send` | ✅ |
| 认证 | needToken | needToken | ✅ |
| 请求体 | `{ dialogueMid, text }` | `{ receiverUid, text }` | ❌ |

**严重不匹配 — 请求参数完全不同：**

- 前端发送 `{ dialogueMid, text }`，其中 `dialogueMid` 是现有对话的 ID
- 后端期望 `{ receiverUid, text }`，其中 `receiverUid` 是接收者的用户 ID

后端 `sendMessage` 的逻辑是根据两个用户 ID 查找或创建 Dialogue，然后添加消息。前端的逻辑是在已有对话中直接发送消息。两者的交互模型完全不同。

---

### 3. 内容获取模块

#### 3.1 获取资源详情（通用）`GET /api/{resourceType}/{id}` ✅

| 资源类型 | 前端路径 | 后端路径 | 状态 |
|---------|---------|---------|------|
| 视频 | `/api/video/{vid}` | `/api/video/:vid` | ✅ |
| 文章 | `/api/essay/{eid}` | `/api/essay/:eid` | ✅ |
| 图文 | `/api/post/{pid}` | `/api/post/:pid` | ✅ |
| 标签 | `/api/tag/{tid}` | `/api/tag/:tid` | ✅ |
| 用户 | `/api/user/{uid}` | `/api/user/:uid` | ✅ |

**视频详情数据格式对比：**

| 字段 | 前端消费 | 后端返回 | 状态 |
|------|---------|---------|------|
| `vid` | ✅ | ✅ | ✅ |
| `title` | ✅ | ✅ | ✅ |
| `coverUrl` | ✅ | ✅ | ✅ |
| `videoUrl` | ✅ | ✅（仅详情包含） | ✅ |
| `viewCount` | ✅ | ✅（格式化字符串如 "1.2k"） | ⚠️ |
| `commentCount` | ✅ | ✅（格式化字符串） | ⚠️ |
| `date` | ✅ | ✅（"YYYY-MM-DD" 字符串） | ✅ |
| `tagList` | ✅ `[{ tid, tagName }]` | ✅ `[{ tid, tagName, likeCount, favouriteCount, commentCount }]` | ✅ |
| `uploader` | `{ uid, userName, profilePictureUrl, isFollowing }` | `{ uid, userName, profilePictureUrl }` | ⚠️ |
| `isLiked` | ✅ | ✅ | ✅ |
| `likeCount` | ✅ | ❌ 不返回 | ❌ |
| `isFavourited` | ✅ | ✅ | ✅ |
| `favouriteCount` | ✅ | ❌ 不返回 | ❌ |
| `isReshared` | ✅ | ❌ 不存在 | ❌ |
| `reshareCount` | ✅ | ❌ 不存在 | ❌ |

**问题 1 — 缺少互动计数：** 前端 `InteractionBar.jsx` 初始化 `likeCount`、`favouriteCount`、`reshareCount` 状态来自 `item` prop。后端视频详情 `transformVideoData` 没有返回 `likeCount` 和 `favouriteCount`（只返回了 `viewCount` 和 `commentCount`）。`InteractionBar` 虽然仍能工作（初始值为 undefined/0），但无法显示正确的互动计数。

**问题 2 — 缺少转发功能：** 前端有 reshare/unreshare 互动和 `isReshared`/`reshareCount` 字段，但后端数据库中没有转发相关字段或关联表，`interactRoutes` 中也没有 reshare 路由。

**问题 3 — 缺少 `isFollowing`：** 前端 `UploaderCard.jsx` 初始化 `isFollowing` 来自 `uploader?.isFollowing`，后端 uploader 数据中没有该字段。

**文章详情数据格式对比：**

| 字段 | 前端消费 | 后端返回 | 状态 |
|------|---------|---------|------|
| `eid` | ✅ | ✅ | ✅ |
| `title` | ✅ | ✅ | ✅ |
| `text` | ✅ | ✅ | ✅ |
| `date` | ✅ | ✅ | ✅ |
| `uploader` | `{ uid, userName, profilePictureUrl }` | `{ uid, userName, profilePictureUrl }` | ✅ |
| `isLiked` / `likeCount` | ✅ | ✅ isLiked / ❌ 无 likeCount | ⚠️ |
| `isFavourited` / `favouriteCount` | ✅ | ✅ isFavourited / ❌ 无 favouriteCount | ⚠️ |
| `isReshared` / `reshareCount` | ✅ | ❌ / ❌ | ❌ |

**图文详情数据格式对比：**

| 字段 | 前端消费 | 后端返回 | 状态 |
|------|---------|---------|------|
| `pid` | ✅ | ✅ | ✅ |
| `text` | ✅ | ✅ | ✅ |
| `pictureList` | ✅ 数组 | ✅（JSON 解析后数组） | ✅ |
| `videoList` | ✅ 数组 | ✅（JSON 解析后数组） | ✅ |
| `date` | ✅ | ✅ | ✅ |
| `uploader` | ✅ | ✅ | ✅ |
| `isLiked` / `likeCount` | ✅ / ✅ | ✅ / ❌ | ⚠️ |
| `isFavourited` / `favouriteCount` | ✅ / ✅ | ❌ / ❌ | ❌ |
| `isReshared` / `reshareCount` | ✅ / ✅ | ❌ / ❌ | ❌ |

**标签详情数据格式对比：**

| 字段 | 前端消费 | 后端返回 | 状态 |
|------|---------|---------|------|
| `tid` | ✅ | ✅ | ✅ |
| `tagName` | ✅ | ✅ | ✅ |
| `viewCount` | ✅ | ❌ 数据库无此字段 | ❌ |
| `commentCount` | ✅ | ✅（格式化字符串） | ✅ |

**问题 — Tag 模型缺少 `viewCount`：** 前端 `Tag.jsx` 消费 `tagData.viewCount`，但数据库 `Tag` 模型中没有 `viewCount` 字段，后端也不返回。

---

#### 3.2 获取资源列表 `GET /api/{resourceType}` ✅

| 资源类型 | 前端路径 | 后端路径 | 状态 |
|---------|---------|---------|------|
| 视频 | `/api/video` | `/api/video` | ✅ |
| 文章 | `/api/essay` | `/api/essay` | ✅ |
| 图文 | `/api/post` | `/api/post` | ✅ |
| 评论 | `/api/comment` | `/api/comment` | ✅ |
| 用户 | `/api/user` | `/api/user` | ✅ |
| 标签 | `/api/tag` | `/api/tag` | ✅ |

**通用查询参数对比：**

| 参数 | 前端发送 | 后端接收 | 状态 |
|------|---------|---------|------|
| `sort` | 如 `-date` | 如 `-date` | ✅ |
| `page` | 数字 | 数字 | ✅ |
| `element` | 数字 | 数字 | ✅ |
| `q` | 搜索关键词 | 搜索关键词 | ✅ |
| `uid` | 用户 ID（用户页筛选） | ❌ 后端未处理 | ❌ |
| `vid` | 视频 ID（评论筛选） | ✅ commentService 处理 | ✅ |

**问题 — `uid` 查询参数未处理：** 前端在 `User.jsx` 中通过 `fetchItemList('video', { uid: user?.uid, sort, page, element })` 发送 `uid` 查询参数来筛选某用户的视频/图文/文章。后端的 `baseService.getListData` 只处理了 `q`（搜索关键词）作为 where 条件，不处理 `uid` 参数。这意味着用户页面无法正确过滤用户的投稿内容。

**响应格式：** 所有列表接口后端统一返回 `{ code, data: { items, total } }`，前端 `useData` Hook 取 `response.data.data`，然后消费 `data.items` 和 `data.total`。格式匹配。

**评论 item 数据格式对比：**

| 字段 | 前端消费 | 后端返回 | 状态 |
|------|---------|---------|------|
| `cid` | ✅ | ✅ | ✅ |
| `text` | ✅ | ✅ | ✅ |
| `date` | ✅ | ✅ | ✅ |
| `isLiked` | ✅ | ❌ 列表不返回 | ❌ |
| `likeCount` | ✅ | ✅（格式化字符串） | ✅ |
| `isDisliked` | ✅ | ❌ 不存在 | ❌ |
| `dislikeCount` | ✅ | ❌ 不存在 | ❌ |
| `commenter` | `{ uid, userName, profilePictureUrl }` | ❌ 字段名是 `uploader` | ❌ |
| `subComments` | 展开查看子评论 | `subCommentList`（字段名不同） | ⚠️ |

**问题 1 — 评论者字段名不匹配：** 前端 `CommentCard.jsx` 使用 `comment.commenter` 访问评论者信息，后端返回的是 `comment.uploader`。

**问题 2 — 缺少 dislike 功能：** 前端有 dislike/undislike 评论的功能，但后端没有 dislike 相关的数据模型和路由。

**问题 3 — 评论列表不返回 isLiked：** 评论列表接口没有像视频/文章列表那样做互动状态检查，所以不返回 `isLiked`。

**问题 4 — 子评论字段名不匹配：** 前端使用 `subComments`，后端返回 `subCommentList`。

---

#### 3.3 首页主视频列表 `GET /api/video/main` ✅

| 维度 | 前端 | 后端 | 状态 |
|------|------|------|------|
| 路径 | `/api/video/main` | `/api/video/main` | ✅ |
| 处理函数 | — | 同 `getVideoList` | ✅ |
| 查询参数 | `page=1, element=16` | `page, element` | ✅ |

**结论：** 路径和参数匹配。返回格式与通用视频列表一致。

---

#### 3.4 相关视频 `GET /api/video/related` ✅

| 维度 | 前端 | 后端 | 状态 |
|------|------|------|------|
| 路径 | `/api/video/related` | `/api/video/related` | ✅ |
| 查询参数 | `vid, sort, page, element` | `vid, sort, page, element(默认5)` | ✅ |

**结论：** 匹配。

---

#### 3.5 轮播图 `GET /api/picture/carousel` ⚠️

| 维度 | 前端预期 | 后端实现 | 状态 |
|------|---------|---------|------|
| 路径 | `/api/picture/carousel` | `/api/picture/carousel` | ✅ |
| 查询参数 | `number=5` | `number`（默认5） | ✅ |
| 响应 data | `{ items: [{ id, src }] }` | 直接返回数组 `[{ id, src }]` | ❌ |

**响应格式不匹配：** 前端 `Main.jsx` 通过 `useData` 解包后访问 `data.items`（即期望 data 是 `{ items: [...] }`），但后端 `getCarousel` 直接返回数组作为 data（即 `response.data.data` 就是一个数组）。前端访问 `data.items` 将得到 `undefined`。

---

### 4. 内容上传模块

#### 4.1 上传视频 `POST /api/upload/video` ✅

| 维度 | 前端预期 | 后端实现 | 状态 |
|------|---------|---------|------|
| 路径 | `/api/upload/video` | `/api/upload/video` | ✅ |
| 认证 | needToken | needToken | ✅ |
| 请求体 | `{ title, description, cover, videoUrl }` | `{ title, description, cover, videoUrl }` | ✅ |

**结论：** 完全匹配。

---

#### 4.2 上传文章 `POST /api/upload/essay` ✅

| 维度 | 前端预期 | 后端实现 | 状态 |
|------|---------|---------|------|
| 路径 | `/api/upload/essay` | `/api/upload/essay` | ✅ |
| 请求体 | `{ title, description }` | `{ title, description }` | ✅ |

**结论：** 完全匹配。

---

#### 4.3 上传图文 `POST /api/upload/post` ✅

| 维度 | 前端预期 | 后端实现 | 状态 |
|------|---------|---------|------|
| 路径 | `/api/upload/post` | `/api/upload/post` | ✅ |
| 请求体 | `{ text, images }` | `{ text, images }` | ✅ |

**结论：** 完全匹配。

---

### 5. 社交互动模块

#### 5.1 点赞/取消点赞 `POST/DELETE /api/{mediaType}/{mediaId}/like` ⚠️

| 维度 | 前端 | 后端 | 状态 |
|------|------|------|------|
| 路径模式 | `/api/{mediaType}/{mediaId}/like` | `/api/:type/:id/like` | ✅ |
| 支持类型 | video, essay, post, comment, user | video, essay, post, comment, tag | ⚠️ |
| 认证 | needToken | needToken | ✅ |
| 请求体 | `{}`（空对象） | 不读 body | ✅ |

**问题 — 支持的 mediaType 范围不同：**
- 前端对 `user` 类型不发 like 请求（用户只能 follow），对 `tag` 可能发 like 请求
- 后端 `RESOURCE_CONFIG` 支持 `tag` 但不支持 `user`
- 实际上两者在这点上基本兼容，因为前端不会对 user 发 like

**响应格式：** 后端返回 `{ code: 200, message: "...", data: { likeCount } }`。前端 `InteractionBar` 不消费响应的 data，仅依赖本地乐观更新。可兼容。

---

#### 5.2 收藏/取消收藏 `POST/DELETE /api/{mediaType}/{mediaId}/favourite` ✅

| 维度 | 前端 | 后端 | 状态 |
|------|------|------|------|
| 路径模式 | 匹配 | 匹配 | ✅ |
| 支持类型 | video, essay, post | video, essay, post（RESOURCE_CONFIG 中 hasFavourite=true） | ✅ |

**结论：** 匹配。

---

#### 5.3 转发/取消转发 `POST/DELETE /api/{mediaType}/{mediaId}/reshare` ❌

| 维度 | 前端 | 后端 | 状态 |
|------|------|------|------|
| 路径 | `/api/{mediaType}/{mediaId}/reshare` | 不存在 | ❌ |

**严重缺失：** 前端 `InteractionBar.jsx` 定义了 reshare/unreshare 行为并在 `ACTION_MAP` 中配置了路由，但后端完全没有 reshare 相关的路由、控制器、服务或数据库模型。

---

#### 5.4 踩/取消踩 `POST/DELETE /api/{mediaType}/{mediaId}/dislike` ❌

| 维度 | 前端 | 后端 | 状态 |
|------|------|------|------|
| 路径 | `/api/{mediaType}/{mediaId}/dislike` | 不存在 | ❌ |

**严重缺失：** 前端 `CommentCard.jsx` 有 dislike/undislike 功能，但后端没有 dislike 的路由和数据模型。

---

#### 5.5 关注/取消关注 `POST/DELETE /api/user/{uid}/follow` ✅

| 维度 | 前端 | 后端 | 状态 |
|------|------|------|------|
| 路径 | `/api/user/{mediaId}/follow` | `/api/user/:id/follow` | ✅ |
| 认证 | needToken | needToken | ✅ |

**结论：** 匹配。

---

### 6. 后端多余接口

| 路由 | 方法 | 说明 |
|------|------|------|
| `GET /api/user/message/stream` | GET | SSE 实时消息推送，前端未使用 |
| `GET /api/user/message/dialogues` | GET | 对话列表，前端期望走 `/api/user/profile/message/dialogueList` |
| `GET /api/user/message/notifications` | GET | 通知列表，前端期望走 `/api/user/profile/message/notificationList` |
| `GET /api/tag/hot` | GET | 热门标签，前端未调用 |
| `GET /api/comment/:cid` | GET | 评论详情，前端未直接调用 |
| `GET /api/user` | GET | 用户搜索（通过 `q` 参数），前端通过 `fetchItemList('user', ...)` 调用，路径匹配 |

**注意：** 后端的 `dialogues` 和 `notifications` 接口功能上与前端需要的 `dialogueList` 和 `notificationList` 相似，但路径完全不同，前端无法直接调用。

---

## 三、数据库模型与前端需求对比

### 缺失的数据模型/字段

| 缺失内容 | 影响范围 | 严重程度 |
|---------|---------|---------|
| **Reshare（转发）关联表** | InteractionBar 的转发功能完全不可用 | 高 |
| **Dislike（踩）关联表** | CommentCard 的踩功能完全不可用 | 高 |
| **Comment 的 `dislikeCount` 字段** | 评论无法显示踩计数 | 中 |
| **Tag 的 `viewCount` 字段** | Tag 详情页无法显示浏览量 | 低 |
| **Video/Essay/Post 的 `reshareCount` 字段** | 无法显示转发计数 | 中 |
| **User 的 `isFollowing` 计算** | 用户页面无法显示是否已关注 | 中 |

### 数据格式存储问题

| 问题 | 详情 |
|------|------|
| `Post.pictureList` | 以 JSON 字符串存储，读取时 JSON.parse，写入时 JSON.stringify。可工作但不够优雅 |
| `Post.videoList` | 同上 |
| `Comment.pictureList` | 同上 |

---

## 四、严重问题总结（必须修复）

### ❌ 问题 1：私信接口参数不匹配

- **前端** `POST /api/user/message/send` 发送 `{ dialogueMid, text }`
- **后端** `POST /api/user/message/send` 期望 `{ receiverUid, text }`
- **影响**：发送私信功能完全不可用
- **建议**：后端需要支持通过 `dialogueMid` 直接发送消息，或前端改为发送 `receiverUid`

### ❌ 问题 2：对话列表和通知列表路径不匹配

- **前端** 通过 `GET /api/user/profile/message/dialogueList` 和 `notificationList` 获取
- **后端** 提供 `GET /api/user/message/dialogues` 和 `notifications`
- **影响**：个人中心消息页面完全无法加载
- **建议**：后端在 `userRoutes` 中增加 `profile/message/dialogueList` 和 `notificationList` 的路由映射，或前端修改调用路径

### ❌ 问题 3：关注列表接口缺失

- **前端** 请求 `GET /api/user/profile/follow/followingList`
- **后端** `getProfileSubdata` 不支持 `follow` 类型
- **影响**：个人中心的关注列表页面无法加载
- **建议**：后端 `getProfileSubdata` 增加 `follow/followingList` 分支，查询 `UserFollowing` 表并关联用户数据

### ❌ 问题 4：轮播图响应格式不匹配

- **前端** 期望 `data.items`（对象包裹数组）
- **后端** 直接返回数组
- **影响**：首页轮播图无法渲染（`data.items` 为 undefined）
- **建议**：后端改为返回 `{ items: [...] }` 格式

### ❌ 问题 5：收藏/历史子数据返回格式不完整

- **前端** 期望收藏和历史页面返回与 uploads 相同格式的内容卡片数据
- **后端** 仅返回 `UserFavourite`/`UserHistory` 原始关联记录
- **影响**：收藏和历史页面无法正确显示内容卡片
- **建议**：后端在 favourites/history 分支中关联查询实际的 Video/Essay/Post 数据

### ❌ 问题 6：`uid` 查询参数未处理

- **前端** 在用户主页通过 `?uid=xxx` 筛选该用户的投稿
- **后端** `baseService.getListData` 不处理 `uid` 参数
- **影响**：用户主页无法显示该用户的投稿内容
- **建议**：后端在视频/图文/文章列表接口中增加 `uid` where 条件

---

## 五、中等问题总结（建议修复）

### ⚠️ 问题 7：缺少 `likeCount` / `favouriteCount` / `reshareCount` 返回

详情接口和列表接口中，后端 `transformVideoData` / `transformEssayData` / `transformPostData` 没有返回 `likeCount` 和 `favouriteCount`（被 formatCount 格式化后丢失）。前端 InteractionBar 需要这些初始值来显示计数。

### ⚠️ 问题 8：评论数据字段名不匹配

- 前端使用 `comment.commenter`，后端返回 `comment.uploader`
- 前端使用 `subComments`，后端返回 `subCommentList`

### ⚠️ 问题 9：用户详情缺少 `info` 字段

`userController.getUserDetail` 返回的对象中排除了 `info` 字段，但前端 `User.jsx` 消费 `userData.info`。

### ⚠️ 问题 10：`authController.getProfile` 返回 `username` 而非 `userName`

前端统一使用 `userName`（驼峰式），但 `authController.getProfile` 直接返回 Prisma 原始字段 `username`（全小写）。

### ⚠️ 问题 11：Uploader 缺少 `isFollowing` 字段

前端 `UploaderCard.jsx` 和 `User.jsx` 期望 uploader/user 数据中包含 `isFollowing` 布尔值，后端不返回此字段。

### ⚠️ 问题 12：计数格式化带来的类型问题

后端将所有计数（viewCount、likeCount 等）格式化为字符串（"1.2k"），前端可能期望数字类型来做进一步的计算或比较。尤其是 `InteractionBar` 中的乐观更新逻辑 `likeCount + 1` 会因为字符串类型而产生错误结果。

---

## 六、功能缺失总结（后端未实现）

| 前端功能 | 所需接口/数据 | 后端状态 |
|---------|-------------|---------|
| 转发内容（reshare） | reshare 路由 + 数据模型 | 完全缺失 |
| 踩评论（dislike） | dislike 路由 + 数据模型 | 完全缺失 |
| 通知中的发送者信息 | notification.from 需 userName/profilePictureUrl | 返回空字符串 |
| SSE 实时消息推送 | 前端未对接 | 后端已实现但前端未用 |
| 热门标签 | `GET /api/tag/hot` | 后端已实现但前端未用 |

---

## 七、匹配度统计

| 类别 | 总计 | ✅ 匹配 | ⚠️ 部分匹配 | ❌ 不匹配/缺失 |
|------|------|---------|------------|--------------|
| 路由路径 | 19 | 16 | 2 | 1 |
| 请求参数 | 19 | 15 | 2 | 2 |
| 响应数据格式 | 19 | 7 | 8 | 4 |
| 互动功能 | 5 | 2 | 1 | 2 |

**总体评估：** 后端实现了约 70% 的前端所需功能。基础的数据获取（CRUD）和认证模块较为完整，但在消息系统路径对齐、社交互动完整性（转发、踩）、个人资料子数据（关注列表、收藏/历史数据格式）、以及部分字段命名一致性方面存在较多需要修复的问题。
