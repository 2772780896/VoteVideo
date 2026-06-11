import request from '@/utils/request'

// ==================== 特殊子资源 URL 映射表 ====================
// key: 媒体类型，value: { subType: url }
// 没有 subType → 默认 /api/{mediaType}

const SUBTYPE_MAP = {
  video: {
    main:     '/api/video/main',
    related:  '/api/video/related',
  },
  picture: {
    carousel: '/api/picture/carousel',
  },
}

// ==================== 底层请求函数 ====================

// 获取单个资源
const fetchItem = (resourceType, id) => request.get(`/api/${resourceType}/${id}`)

// 获取资源列表（统一入口）
const fetchItemList = (resourceType, params = {}) => {
  const { subType, ...rest } = params
  const baseUrl = SUBTYPE_MAP[resourceType]?.[subType] ?? `/api/${resourceType}`
  return request.get(baseUrl, { params: rest })
}

// 上传内容（视频 / 文章）
const uploadContent = (type, data) =>
  request.post(`/api/upload/${type}`, data, { needToken: true })



// ==================== 统一交互 API ====================
// 【面试必考】映射表模式：mediaType + action → HTTP method + 路径
// 新增资源类型/动作只需在 ACTION_MAP 追加，无需加新函数

const ACTION_MAP = {
  // 视频 & 通用
  like:       { method: 'post',   path: ':mediaType/:mediaId/like' },
  unlike:     { method: 'delete', path: ':mediaType/:mediaId/like' },
  favourite:  { method: 'post',   path: ':mediaType/:mediaId/favourite' },
  unfavourite:{ method: 'delete', path: ':mediaType/:mediaId/favourite' },
  reshare:    { method: 'post',   path: ':mediaType/:mediaId/reshare' },
  unreshare:  { method: 'delete', path: ':mediaType/:mediaId/reshare' },
  // 评论专用
  dislike:    { method: 'post',   path: ':mediaType/:mediaId/dislike' },
  undislike:  { method: 'delete', path: ':mediaType/:mediaId/dislike' },
  // 用户专用
  follow:     { method: 'post',   path: ':mediaType/:mediaId/follow' },
  unfollow:   { method: 'delete', path: ':mediaType/:mediaId/follow' },
};

/**
 * 统一交互入口
 * @param {string} mediaType - 'video' | 'comment' | 'user'
 * @param {string} action - 'like' | 'unlike' | 'favourite' | 'unfavourite' | ...
 * @param {string|number} mediaId - 资源 ID
 */
const interact = (mediaType, action, mediaId) => {
  const config = ACTION_MAP[action];
  if (!config) throw new Error(`Unknown action: ${action}`);

  const path = config.path
    .replace(':mediaType', mediaType)
    .replace(':mediaId', mediaId);

  return request({
    url: `/api/${path}`,
    method: config.method,
    data: {},
    needToken: true,
  });
};

export { fetchItem, fetchItemList, uploadContent, interact }
export default interact
