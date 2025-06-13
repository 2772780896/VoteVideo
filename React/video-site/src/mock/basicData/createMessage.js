import Mock from 'mockjs'
import { addMessageList } from '@/mock/publicState'

const Random = Mock.Random
export const createMessage = (senderUser, receiverUser, number, addData={}) => {
    const messageList = [...Array(number)].map( (i) => ({
        mid: Random.integer(1, 9999),
        title: Random.cword(8,14),
        text: Random.cword(8, 20),
        sender: senderUser, 
        receiver: receiverUser,
        date: Random.datetime('yyyy-MM-dd'),
    }))
    for (let i of messageList) {
        // 额外数据的添加
        i = {...i, ...addData}
    } 
    addMessageList(messageList)
    return messageList
}