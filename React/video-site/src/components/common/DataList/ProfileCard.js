import React from 'react';
import { Flex, Row, Col, Avatar, Typography} from 'antd';

const { Text } = Typography
const App = ({user}) => {
    return(
        <Row>
            <Col span={2}>
                <Avatar size={50} src={user?.profilePictureUrl} />
            </Col>
            <Col>
                <Flex justify="start" gap="middle">
                    <Text strong>{user?.userName}</Text>
                    <span>{user?.date}</span>
                </Flex>
                <div>{user?.info}</div>
            </Col>
        </Row>
    )
}
export default App