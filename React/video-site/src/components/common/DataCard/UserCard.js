import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, Row, Col, Avatar, Button } from 'antd';

const App = ({user}) => {
    const link = `/user?uid=${user?.uid}`
    return(
        <Link to={link} style={{ color: 'inherit', textDecoration: 'none' }}>
            <Row style={{minWidth:'250px'}}>
                <Col span={5}>
                    <Avatar size={50} src={user?.profilePictureUrl} />
                </Col>
                <Col span={19}>
                    <Flex justify="start" gap="middle">
                        <div>{user?.userName}</div>
                        <a>发消息</a>
                    </Flex>
                    <Button type="primary">+关注 {user?.fansCount}</Button>
                </Col>
            </Row>
        </Link>
    )
}
export default App