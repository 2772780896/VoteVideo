import React from 'react';
import { Flex, Row, Col, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import FocusUploaderVideoApp from '@/components/feature/FocusUploaderVideo'
import FocusUploaderTextApp from '@/components/feature/FocusUploaderText'

const App = ({type='video'}) => {
    const showContent = (type) => {
        if (type === 'video') {
            return (
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
            )
        } else if (type === 'text') {
            return (
                <Flex vertical justify="start" gap="middle">
                    <span>用户名</span>
                    <span>日期</span>
                    <div style={{width:'60%'}}>
                        <FocusUploaderTextApp />
                    </div>
                    <Flex justify='space-between'>
                        <span>转发数</span>
                        <span>评论数</span>
                        <span>点赞数</span>
                    </Flex>
                </Flex>
            )
        }
    }
    return(
        <Row>
            <Col span={2}>
                <Avatar size={50} icon={<UserOutlined />} />
            </Col>
            <Col span={22}>
                {showContent(type)}
            </Col>
        </Row>
    )
}
export default App