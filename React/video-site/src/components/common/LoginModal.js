import React, { useState } from 'react';
import { Button, Modal, Flex, Tabs } from 'antd';
import LoginFormApp from '@/components/common/LoginForm'
import RegisterFormApp from '@/components/common/RegisterForm'


const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const tab = [
    {key: '1', label: '登录', children: <LoginFormApp />},
    {key: '2', label: '注册', children: <RegisterFormApp />},
  ]
  return (
    <>
      <Button type="primary" onClick={showModal}>
        登录
      </Button>
      <Modal 
        title="密码登录" 
        open={isModalOpen} 
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={null}>
        <Flex justify='center'>
            <Tabs activeKey="1" items={tab}></Tabs>
        </Flex>
      </Modal>
    </>
  );
};
export default App;