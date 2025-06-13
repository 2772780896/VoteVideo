import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input } from 'antd';
import login from '@/apis/profile/login'
import Cookies from 'js-cookie'

const App = () => {
  const [data, setData] = useState()
  const onFinish = async (data) => { 
    const response = await login(data.username, data.password)
    setData(response)
  }
  const navigate = useNavigate()
  useEffect(() => {
    if (data?.data?.message === 'ok') {
      for (const [key, value] of Object.entries(data.data.data)) {
        Cookies.set(key, value)
        navigate('/profile')
      }
    }else if (data?.data?.message === 'fail') {
        alert('登录失败')
    }
    console.log('cookie:', Cookies.get())
  },[data])
  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="账号"
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
      <a>忘记密码？</a>

      <Form.Item label={null} wrapperCol={{offset:20}}>
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  )
}
export default App;