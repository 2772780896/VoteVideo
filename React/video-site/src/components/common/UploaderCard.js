import React from 'react';
import { Flex, Row, Col, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const App = ({playVideo}) => {
    return(
        <Row>
            <Col span={5}>
                <Avatar size={50} icon={<UserOutlined />} />
            </Col>
            <Col span={19}>
                <Flex justify="start" gap="middle">
                    <div>{playVideo?.uploader?.userName}</div>
                    <a>发消息</a>
                </Flex>
                <Button type="primary">+关注 粉丝数</Button>
            </Col>
        </Row>
    )
}
export default App