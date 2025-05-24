import React from 'react';
import { Col, Row, Segmented, Tabs } from "antd";
import ChatApp from '@/components/common/Chat'

const App = () => {
    const tab = [
        {key: '1', label: '用户1', children: <ChatApp />},
        {key: '2', label: '用户2', children: <ChatApp />},
        {key: '3', label: '用户3', children: <ChatApp />}
    ]
    return (
        <>
            <div>我的对话</div>
            <Tabs tabPosition='left' activeKey="1" items={tab}></Tabs>
        </>
    )
}

export default App