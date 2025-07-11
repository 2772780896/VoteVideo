import Mock from 'mockjs'
import { addUser } from '@/mock/publicState'

const Random = Mock.Random
export const createUser = (number=1, addData={}) => {
    const userList = [...Array(number)].map( (i) => ({
        uid: Random.integer(1, 999),
        userName: Random.cword(2,6),
        info: Random.cword(10,30),
        profilePictureUrl: Random.image('1920x1080', Random.color(), Random.color(), 'jpg', Random.string(1,5)),
        fansCount: Random.integer(100, 9999),
        followCount: Random.integer(50, 1000),
        date: Random.datetime('yyyy-MM-dd'),
    })).map( (i) => ({...i, ...addData})) // 使用map方法直接添加额外数据
    
    addUser(userList)
    return userList
}
