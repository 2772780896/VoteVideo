import React, {useMemo, useState} from 'react';
import { Flex } from "antd";
import MessageCard from '@/components/feature/Profile/ProfileMessage/MessageCard'
import useData from '@/hooks/useData';
import { getAtedMessage } from '@/apis/user/showMessage';

const App = ({token, uid}) => {
    const dataList = useData(getAtedMessage, uid, token)?.data

    const atedMessageList = useMemo(() => (
        (dataList?.length !== 0 && dataList?.map(i => (
            <MessageCard key={i.mid} message={i} />
        ))
    )), [dataList])

    return (
        <>
            <Flex vertical>
                {atedMessageList}
            </Flex>
        </>
    )
}

export default App