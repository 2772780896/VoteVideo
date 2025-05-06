import React from 'react';
import { Flex, Row, Col, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const App = () => {
    return(
        <Row>
            <Col span={1}>
                <Avatar size={14} icon={<UserOutlined />} />
            </Col>
            {false && (
                <Col span={20}>
                    <div>用户名回复@用户名: 评论内容</div>
                    <Flex justify="start" gap="middle">
                        <span>点赞数</span>
                        <span>点踩</span>
                        <span>日期</span>
                    </Flex>
                </Col>
            )}
            {!false && (
                <Col span={20}>
                    <div>用户名 评论内容</div>
                    <Flex justify="start" gap="middle">
                        <span>点赞数</span>
                        <span>点踩</span>
                        <span>日期</span>
                    </Flex>
                </Col>
            )}
        </Row>
    )
}
export default App