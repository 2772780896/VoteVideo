import React from 'react';
import { Col, Row, Segmented, Tabs } from "antd";
import UserMessageChatApp from '@/components/feature/UserMessage/UserMessageChat'
import UserMessageAtedApp from '@/components/feature/UserMessage/UserMessageAted'
import UserMessagePraisedApp from '@/components/feature/UserMessage/UserMessagePraised'
import UserMessageSystemApp from '@/components/feature/UserMessage/UserMessageSystem'

const App = () => {
    const tab = [
        {key: '1', label: '我的对话', children: <UserMessageChatApp />},
        {key: '2', label: '@我的', children: <UserMessageAtedApp />},
        {key: '3', label: '收到的赞', children: <UserMessagePraisedApp />},
        {key: '4', label: '系统通知', children: <UserMessageSystemApp />},
    ]
    return (
        <Tabs tabPosition='left' activeKey="1" items={tab}></Tabs>
    )
}

export default App