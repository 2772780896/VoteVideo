import React from 'react';
import { Flex, Row, Col, Avatar, Typography} from 'antd';

const { Text } = Typography
const App = ({profile}) => {
    return(
        <Row>
            <Col span={2}>
                <Avatar size={50} src={profile?.profilePictureUrl} />
            </Col>
            <Col>
                <Flex justify="start" gap="middle">
                    <Text strong>{profile?.userName}</Text>
                    <span>{profile?.date}</span>
                </Flex>
                <div>{profile?.info}</div>
            </Col>
        </Row>
    )
}
export default App