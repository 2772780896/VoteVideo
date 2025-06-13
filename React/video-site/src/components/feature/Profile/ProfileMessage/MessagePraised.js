import React, {useMemo, useState} from 'react';
import { Flex } from "antd";
import MessageCard from '@/components/feature/Profile/ProfileMessage/MessageCard'
import useData from '@/hooks/useData';
import { getPraisedMessage } from '@/apis/profile/showMessage';

const App = ({token, uid}) => {
    const dataList = useData(getPraisedMessage, uid, token)?.data

    const praisedMessageList = useMemo(() => (
        (dataList?.length !== 0 && dataList?.map(i => (
            <MessageCard key={i.mid} message={i} />
        ))
    )), [dataList])

    return (
        <>
            <Flex vertical>
                {praisedMessageList}
            </Flex>
        </>
    )
}

export default App