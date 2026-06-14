import request from '@/utils/request'

// --- 认证相关 ---

export const login = (username, password) => 
    request.post('/api/login', { username, password });

export const register = (username, password) => 
    request.post('/api/register', { username, password });

// --- 用户资料相关 ---

// 获取当前登录用户的个人资料
export const getMyProfile = () => 
    request.get('/api/user/profile/', { needToken: true });

// 获取指定用户的公开资料
export const getUserPublicProfile = (uid) => 
    request.get(`/api/user/${uid}`);

// 获取个人中心下的子项数据（如收藏夹、历史记录等）
// RESTful 路径：/api/user/profile/{profileType}/{dataType}
//   profileType: 'uploads' | 'favourites' | 'history'
//   dataType:    'videos'   | 'posts'      | 'essays'
export const getProfileSubdata = (sort, page = 1, element = 16, profileType, dataType) => {
    return request.get(`/api/user/profile/${profileType}/${dataType}`, {
        params: { sort, page, element },
        needToken: true
    });
};

// 发送私信消息
export const sendMessage = (dialogueMid, text, receiverUid) =>
    request.post('/api/user/message/send', { dialogueMid, text, receiverUid }, { needToken: true });

// ==================== 用户级交互 API ====================
// 统一走 content.js 的 interact，不再单独维护
export { default as interact } from './content';
