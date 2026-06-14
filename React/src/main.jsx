import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import router from '@/router/index.jsx';
import { RouterProvider } from 'react-router-dom'
import useAuthStore from '@/stores/authStore'

/**
 * 应用入口文件
 * 
 * 初始化 Zustand 认证状态
 * 虽然 store 的初始值已经设置为从 Cookie 读取，
 * 但仍然调用 initAuth() 为将来可能的 token 验证预留接口
 */

// 初始化认证状态（在渲染前调用）
useAuthStore.getState().initAuth()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
