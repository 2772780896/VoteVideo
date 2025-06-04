import Mock from 'mockjs'
import { getEssayList } from '../publicState'

export const showEssay = Mock.mock(
    /^\/api\/essay\/show(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const eid = Number(url.searchParams.get('eid'))
        const searchEssayList = getEssayList()
        const dataEssay = searchEssayList.filter(i => (i.eid === eid))
        console.log(dataEssay)
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: dataEssay
        })
    }
)
