import React, {useMemo, useState} from 'react';
import { Tabs } from "antd";
import ChatApp from '@/components/common/Chat'
import useData from '@/hooks/useData';
import { getDialogue } from '@/apis/profile/showMessage';

const App = ({token, uid}) => {
    const dataList = useData(getDialogue, uid, token)?.data
    console.log('dialogueList:', dataList)

    const dialogueList = useMemo(() => (
        (dataList?.length !== 0 && dataList?.map(i => (
            {key: i.opponent.uid, label: i.opponent.userName, children:(
                <ChatApp key={i.mid} dialogue={i} />)
            }
        ))
    )), [dataList])

    const [activeKey, setActiveKey] = useState(dataList?.[0]?.mid)
    const handleChange = (key) => {setActiveKey(key)}
    return (
        <>
            <div>我的对话</div>
            <Tabs tabPosition='left' activeKey={activeKey} items={dialogueList} onChange={handleChange}></Tabs>
        </>
    )
}

export default App