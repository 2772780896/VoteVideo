import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import router from '@/router/index';
import { RouterProvider } from 'react-router-dom'
import '@/mock/index'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </RouterProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// App.js 或入口文件