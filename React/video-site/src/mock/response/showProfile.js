import Mock from 'mockjs'
import { getUserList } from '../publicState'
import sortData from '../utils/sortData'

export const showProfile = Mock.mock(
    /^\/api\/profile\/show(\?.*)?$/,
    'post',
    function(options) {
        const data = JSON.parse(options.body)
        const uid = Number(data.uid)
        const token = data.token
        const subData = data.subData
        const sort = Number(data.sort)
        const page = Number(data.page)
        const element = Number(data.element)
        const sortType = [
            {code: 1, sortEle: 'addDate', orderBy: 'order'},
            {code: 2, sortEle: 'addDate', orderBy: 'reverse'},
            {code: 3, sortEle: 'viewCount', orderBy: 'order'},
            {code: 4, sortEle: 'date', orderBy: 'order'},
            {code: 5, sortEle: 'date', orderBy: 'reverse'},
            {code: 6, sortEle: 'likeCount', orderBy: 'order'},
            {code: 7, sortEle: 'favouriteCount', orderBy: 'order'},
        ]
        const profileList = getUserList()
        console.log('postData', data)
        console.log('tokenProfile', profileList)
        const profile = profileList.filter(i => (i.uid === uid && i.token === token))
        console.log('tureProfile', profile)
        if (profile.length === 0 ) {
            return {
                code: 401,
                message: '未登录',
                data: ''
            }
        }
        if (subData === 'basic') {
            let basicData = []
            for (const i of profile) {
                basicData.push({...i})
            }
            console.log('basicData:', basicData)
            for (const i of basicData) {
                delete i.upload
                delete i.favourite
                delete i.history
                delete i.message
                delete i.followPost
            }
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: basicData
            })
        }else if (subData === 'favouriteVideo') {
            const list = profile[0].favourite.favouriteVideoList
            const dataList = sortData(list, sort, page, element, sortType)
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList
            })
        }
        else if (subData === 'favouritePost') {
            const list = profile[0].favourite.favouritePostList
            const dataList = sortData(list, sort, page, element, sortType)
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList
            })
        }
        else if (subData === 'favouriteEssay') {
            const list = profile[0].favourite.favouriteEssayList
            const dataList = sortData(list, sort, page, element, sortType)
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList
            })
        }
        else if (subData === 'historyVideo') {
            const list = profile[0].history.historyVideoList
            console.log('hitorylist',list)
            const dataList = sortData(list, sort, page, element, sortType)
            console.log('hitorysortlist',dataList)
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList
            })
        }
        else if (subData === 'historyPost') {
            const list = profile[0].history.historyPostList
            const dataList = sortData(list, sort, page, element, sortType)
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList
            })
        }
        else if (subData === 'historyEssay') {
            const list = profile[0].history.historyEssayList
            const dataList = sortData(list, sort, page, element, sortType)
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList
            })
        }
        else if (subData === 'uploadEssay') {
            const list = profile[0].upload.uploadEssayList
            console.log('unsort', list)
            const dataList = sortData(list, sort, page, element)
            console.log('sort', dataList)
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList
            })
        }
        else if (subData === 'uploadVideo') {
            const list = profile[0].upload.uploadVideoList
            console.log('unsort', list)
            const dataList = sortData(list, sort, page, element)
            console.log('sort', dataList)
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList
            })
        }
        else if (subData === 'uploadPost') {
            const list = profile[0].upload.uploadPostList
            console.log('unsort', list)
            const dataList = sortData(list, sort, page, element)
            console.log('sort', dataList)
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList
            })
        }
        else if (subData === 'dialoge') {
            console.log('dialoage')
            const dataList = profile[0].message.dialogueList
            console.log('mockDialogeList', dataList)
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList
            })
        }
        else if (subData === 'atedMessage') {
            const dataList = profile[0].message.atedMessageList
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList
            })
        }
        else if (subData === 'praisedMessage') {
            const dataList = profile[0].message.praisedMessageList
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList
            })
        }
        else if (subData === 'systemMessage') {
            const dataList = profile[0].message.systemMessageList
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList
            })
        }
        else if (subData === 'followUser') {
            const dataList = profile[0].followPost
            return Mock.mock({
                code: 200,
                message: 'ok',
                data: dataList
            })
        }
        else if (subData === 'followPost') {
            const uploader = data.uploader
            const followPostList = profile[0].followPost
            for (const i of followPostList) {
                if (i.uploader.userName === uploader) {
                    return Mock.mock({
                        code: 200,
                        message: 'ok',
                        data: i.post
                    })
                }
            }
        }
    }
)