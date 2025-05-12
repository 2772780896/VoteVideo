import React from 'react';
import { Col, Row, Segmented, Tabs } from "antd";
import FocusUploaderFlexApp from '@/components/feature/FocusUploaderFlex'

const App = () => {
    const tab = [
        {key: '1', label: 'Up1', children: <FocusUploaderFlexApp />},
        {key: '2', label: 'Up2', children: <FocusUploaderFlexApp />},
        {key: '3', label: 'Up3', children: <FocusUploaderFlexApp />},
        {key: '4', label: 'Up4', children: <FocusUploaderFlexApp />},
    ]
    return (
        <Tabs defaultActiveKey="1" items={tab}></Tabs>
    )
}

export default App