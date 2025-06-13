import React, {useState} from 'react';
import { Tabs } from "antd";
import ProfileMessageDialogue from '@/components/feature/Profile/ProfileMessage/MessageDialogue'
import ProfileMessageAted from '@/components/feature/Profile/ProfileMessage/MessageAted'
import ProfileMessagePraised from '@/components/feature/Profile/ProfileMessage/MessagePraised'
import ProfileMessageSystem from '@/components/feature/Profile/ProfileMessage/MessageSystem'

const App = ({uid, token}) => {
    const tab = [
        {key: '1', label: '我的对话', children: <ProfileMessageDialogue token={token} uid={uid}/>},
        {key: '2', label: '@消息', children: <ProfileMessageAted token={token} uid={uid} />},
        {key: '3', label: '收到的赞', children: <ProfileMessagePraised token={token} uid={uid} />},
        {key: '4', label: '系统通知', children: <ProfileMessageSystem token={token} uid={uid} />},
    ]
    const [activeKey, setActiveKey] = useState('1')
    const handleChange = (key) => {setActiveKey(key)}
    return (
        <Tabs tabPosition='left' destroyInactiveTabPane activeKey={activeKey} items={tab} onChange={handleChange}></Tabs>
    )
}

export default App