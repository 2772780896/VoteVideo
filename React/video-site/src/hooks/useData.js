import { useState, useEffect } from "react"

const useData = (requestFunc, ...params) => {
    const [data, setData] = useState({'data': []})
    async function getData() {
        try {
            const response = await requestFunc(...params)
            setData(response.data)
            console.log('useDataResponse', response)
        } catch (error) {
            console.log('useDataError:', error)
            setData(error.data)
        }
    }
    useEffect(() => {
        getData()
    },[...params])
    return data
}
export default useData