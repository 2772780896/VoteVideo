import React from 'react';
import { Flex, Row, Col, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import SubCommentCard from '@/components/common/SubCommentCard'

const App = (props) => {
    return(
        <Row>
            <Col span={1}>
                <Avatar size={14} icon={<UserOutlined />} />
            </Col>
            <Col span={20}>
                <div>用户名</div>
                <div>评论内容</div>
                <Flex justify="start" gap="middle">
                    <span>日期</span>
                    <span>点赞数</span>
                    <span>点踩</span>
                    <span>回复</span>
                </Flex>
                {props.haveSub && (
                    <SubCommentCard />
                )}
            </Col>
        </Row>
    )
}
export default App