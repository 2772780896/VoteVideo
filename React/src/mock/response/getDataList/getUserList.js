import Mock from 'mockjs'
import { createUser } from '../../basicData/createUser'
import sortData from '../../utils/sortData'

const total = 16*3
const userList = createUser(total)

export const getUserList = Mock.mock(
    /^\/api\/user(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const sort = url.searchParams.get('sort')
        const page = Number(url.searchParams.get('page'))
        const element = Number(url.searchParams.get('element'))
        const q = url.searchParams.get('q')
        let list = [...userList]
        if (q) {
            const kw = q.toLowerCase()
            list = list.filter(item =>
                item.userName?.toLowerCase().includes(kw) ||
                item.info?.toLowerCase().includes(kw)
            )
        }
        const dataList = sortData(list, sort, page, element)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataList,
            total: list.length
        })
    }
)
