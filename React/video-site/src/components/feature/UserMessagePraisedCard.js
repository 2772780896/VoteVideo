import React from 'react';
import { Flex, Row, Col, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const App = () => {
    return(
        <Row>
            <Col span={1}>
                <Avatar size={14} icon={<UserOutlined />} />
            </Col>
            <Col span={20}>
                <Flex justify='start' gap='middle'>
                    <span>用户名</span>
                    <span>赞了我的评论</span>
                </Flex>    
                <div>评论内容</div>
                <div>日期</div>
            </Col>
        </Row>
    )
}
export default App