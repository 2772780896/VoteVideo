import Mock from 'mockjs'
import { createUser } from '../createData/user'

const searchUserList = createUser(16*3)

export const searchUser = Mock.mock(
    /^\/api\/user\/search(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const sort = Number(url.searchParams.get('sort'))
        const page = Number(url.searchParams.get('page'))
        const element = Number(url.searchParams.get('element'))
        let dataList = []
        if (sort === 1) {
            // 实现粉丝数从高到低排序
            const fansSortList = [...searchUserList].sort((a,b) => {
                return b.fansCount - a.fansCount
            })
            dataList = fansSortList.slice((page-1)*element,page*element)
        }
        if (sort === 2){
            // 实现时间从新到旧排序
            const dateOrderList = [...searchUserList].sort((a,b) => {
                if (b.date > a.date) return 1
                if (a.date > b.date) return -1
                return 0
            })
            dataList = dateOrderList.slice((page-1)*element,page*element)
        }
        if (sort === 3){
            // 实现时间从旧到新排序
            const dateReverseList = [...searchUserList].sort((a,b) => {
                if (a.date > b.date) return 1
                if (b.date > a.date) return -1
                return 0
            })
            dataList = dateReverseList.slice((page-1)*element,page*element)
        }
        if (sort === 4){
            // 实现点赞数从高到低排序
            const likeSortList = [...searchUserList].sort((a,b) => {
                return b.likeCount - a.likeCount
            })
            dataList = likeSortList.slice((page-1)*element,page*element)
        }
        if (sort === 5){
            // 实现收藏数从高到低排序
            const favouriteSortList = [...searchUserList].sort((a,b) => {
                return b.favouriteCount - a.favouriteCount
            })
            dataList = favouriteSortList.slice((page-1)*element,page*element)
        }
        console.log('mockdata:', dataList)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataList,
            total: 16*3
        })
    }
)
