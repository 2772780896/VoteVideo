import React from 'react';
import { Flex, Row, Col, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import FocusUploaderVideoApp from '@/components/feature/FocusUploaderVideo'

const App = () => {
    return(
        <Row>
            <Col span={2}>
                <Avatar size={50} icon={<UserOutlined />} />
            </Col>
            <Col>
                <Flex vertical justify="start" gap="middle">
                    <span>用户名</span>
                    <span>日期 投稿了视频</span>
                    <FocusUploaderVideoApp />
                    <Flex justify='space-between'>
                        <span>转发数</span>
                        <span>评论数</span>
                        <span>点赞数</span>
                    </Flex>
                </Flex>
            </Col>
        </Row>
    )
}
export default App