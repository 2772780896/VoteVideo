
const sortData = (list, sort, page, element) => {
    let dataList = []
    const regex = /^([+-])?(.+)$/
    const match = sort.match(regex)
    const sortOrder = match[1]
    const sortType = match[2]
    console.log('sortOrder:aaa', sortOrder, 'aaa', 'sortType:aaa', sortType, 'aaa')
    if (sortOrder === '+' || sortOrder === undefined) { // 实现递增排序
        const sortList = [...list].sort((a,b) => {
            if (a[sortType] > b[sortType]) return 1
            if (b[sortType] > a[sortType]) return -1
            return 0
        })
        dataList = sortList.slice((page-1)*element, page*element)

    }else if (sortOrder === '-') { // 实现递减排序
        const sortList = [...list].sort((a,b) => {
            console.log('mockSrot', sortType)
            if (b[sortType] > a[sortType]) return 1
            if (a[sortType] > b[sortType]) return -1
            return 0
        })
        dataList = sortList.slice((page-1)*element, page*element)
    }
    console.log('dataList:', dataList)
    return dataList
}

export default sortData