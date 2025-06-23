import { getUserExtension } from '../../publicState'
import Mock from 'mockjs'   
import { verifyAuthorization } from '../../utils/verifyAuthorization'
import sortData from '../../utils/sortData'

export const getProfileSubdata = Mock.mock(
    /^\/api\/user\/profile\/(.*?)\/(.*?)\/(\?.*)?$/,
    function(options) {
        // 获取所请求的子数据
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const match = options.url.match(/\/api\/user\/profile\/(.*?)\/(.*?)\//)
        const profileType = match[1]
        const dataType = match[2]

        // 获取子数据
        const [isLogin, uid] = verifyAuthorization(options)
        const dataList = getUserExtension(uid, profileType, dataType)
        console.log('mockProfileSubdata', dataList)

        // 排序
        const sort = url.searchParams.get('sort')
        const page = Number(url.searchParams.get('page'))
        const element = Number(url.searchParams.get('element'))
        console.log('sort:', sort, page, element)
        const sortList = sortData(dataList, sort, page, element)

        return Mock.mock({
            code: 200,
            message: 'ok',
            data: sortList
        })
    }
)
