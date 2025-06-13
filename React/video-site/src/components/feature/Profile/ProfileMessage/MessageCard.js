import React from 'react';
import { Row, Col, Avatar } from 'antd';

const App = ({message}) => {
    return(
        <Row style={{border:'1px solid blue'}}>
            <Col span={1}>
                <Avatar size={14} src={message.sender.profilePictureUrl} />
            </Col>
            <Col span={20}>
                <div>{message.sender.userName}</div>  
                <div>{message.text}</div>
                <div>{message.date}</div>
            </Col>
        </Row>
    )
}
export default App