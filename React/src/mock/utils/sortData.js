
const sortData = (list, sort, page = 1, element = 16) => {
    // sort 为 null/undefined → 不排序，只分页
    if (!sort) {
        return list.slice((page - 1) * element, page * element)
    }

    let dataList = []
    const regex = /^([+-])?(.+)$/
    const match = sort.match(regex)
    const sortOrder = match[1]
    const sortType = match[2]
    if (sortOrder === '+' || sortOrder === undefined) {
        const sortList = [...list].sort((a, b) => {
            if (a[sortType] > b[sortType]) return 1
            if (b[sortType] > a[sortType]) return -1
            return 0
        })
        dataList = sortList.slice((page - 1) * element, page * element)
    } else if (sortOrder === '-') {
        const sortList = [...list].sort((a, b) => {
            if (b[sortType] > a[sortType]) return 1
            if (a[sortType] > b[sortType]) return -1
            return 0
        })
        dataList = sortList.slice((page - 1) * element, page * element)
    }
    return dataList
}

export default sortData