import { useState, useEffect } from "react"

const useData = (requestFunc, ...params) => {
    const [data, setData] = useState({'data': []})
    useEffect(() => {
        async function getData() {
            const response = await requestFunc(...params)
            setData(response.data)
        }
        getData()
        console.log('useData执行了')
    },[...params])
    return data
}
export default useData