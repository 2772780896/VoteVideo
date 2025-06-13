import React, {useMemo, useState} from 'react';
import { Flex } from "antd";
import MessageCard from '@/components/feature/Profile/ProfileMessage/MessageCard'
import useData from '@/hooks/useData';
import { getSystemMessage } from '@/apis/profile/showMessage';

const App = ({token, uid}) => {
    const dataList = useData(getSystemMessage, uid, token)?.data

    const systemMessageList = useMemo(() => (
        (dataList?.length !== 0 && dataList?.map(i => (
            <MessageCard key={i.mid} message={i} />
        ))
    )), [dataList])

    return (
        <>
            <Flex vertical>
                {systemMessageList}
            </Flex>
        </>
    )
}

export default App