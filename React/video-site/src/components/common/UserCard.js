import React from 'react';
import { Flex, Row, Col, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const App = () => {
    return(
        <Row>
            <Col span={2}>
                <Avatar size={50} icon={<UserOutlined />} />
            </Col>
            <Col>
                <Flex justify="start" gap="middle">
                    <span>用户名</span>
                    <span>等级</span>
                </Flex>
                <div>简介</div>
            </Col>
        </Row>
    )
}
export default App