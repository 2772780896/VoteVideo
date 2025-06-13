import React, { useState } from 'react';
import { Button, Modal, Flex, Tabs } from 'antd';
import LoginFormApp from '@/components/common/Login/LoginForm'
import RegisterFormApp from '@/components/common/Login/RegisterForm'

const App = ({show=false}) => {
  const [modalOpen, setModalOpen] = useState(show);
  const showModal = () => {
    setModalOpen(true);
  };
  const handleOk = () => {
    setModalOpen(false);
  };
  const handleCancel = () => {
    setModalOpen(false);
  };
  const tab = [
    {key: '1', label: '登录', children: <LoginFormApp />},
    {key: '2', label: '注册', children: <RegisterFormApp />},
  ]

  const [activeKey, setActiveKey] = useState('1')
  const handleChange = (key) => {
        setActiveKey(key)
    }
  return (
    <>
      <Button type="primary" onClick={showModal}>
        登录
      </Button>
      <Modal 
        title="密码登录" 
        open={modalOpen} 
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={null}>
        <Flex justify='center'>
            <Tabs activeKey={activeKey} items={tab} onChange={handleChange}></Tabs>
        </Flex>
      </Modal>
    </>
  );
};
export default App;