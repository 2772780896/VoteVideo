import React from 'react';
import { Row, Col, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const App = () => {
    return(
        <Row>
            <Col span={1}>
                <Avatar size={14} icon={<UserOutlined />} />
            </Col>
            <Col span={20}>
                <div>通知者</div>  
                <div>通知内容</div>
                <div>日期</div>
            </Col>
        </Row>
    )
}
export default App