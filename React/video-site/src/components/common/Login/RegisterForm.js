import React from 'react';
import { Button, Form, Input, Alert } from 'antd';

import register from '@/apis/user/register';

const App = () => {
  const onFinish = async (data) => { 
    const response = await register(data.username, data.password)
    console.log('registerResponse:', response)
    alert('注册成功')
  }
  return(
    <Form
      name="register"
      initialValues={{ remember: true }}
      autoComplete="off"
      onFinish={onFinish}
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label={null} wrapperCol={{offset:20}}>
        <Button type="primary" htmlType="submit">
          注册
        </Button>
      </Form.Item>
    </Form>
  )
}
export default App;