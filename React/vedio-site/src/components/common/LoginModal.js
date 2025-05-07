import React, { useState } from 'react';
import { Button, Modal, Flex, Segmented } from 'antd';
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
  const [isLogin, setForm] = useState(true)
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
            <Segmented
                options={[
                    { label: '注册', value: false },
                    { label: '登录', value: true }
                ]}
                value={isLogin}
                onChange={setForm}/>
        </Flex>
        { isLogin ? <LoginFormApp /> : <RegisterFormApp /> }
      </Modal>
    </>
  );
};
export default App;