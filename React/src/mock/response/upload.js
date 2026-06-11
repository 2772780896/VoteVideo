import Mock from 'mockjs'
import { verifyAuthorization } from '../utils/verifyAuthorization'
import { addVideo, addEssay, addPost } from '../publicState'

export const upload = Mock.mock(
    /^\/api\/upload\/(video|essay|post)(\?.*)?$/,
    'post',
    function(options) {
        const [isLogin, uid] = verifyAuthorization(options)
        if (!isLogin) {
            return Mock.mock({ code: 401, message: '未登录' })
        }

        const match = options.url.match(/\/api\/upload\/(video|essay|post)/)
        const type = match[1]
        const body = JSON.parse(options.body)
        const { title, description, cover, videoUrl, text, images } = body

        const Random = Mock.Random
        const now = Random.datetime('yyyy-MM-dd HH:mm')

        if (type === 'video') {
            const video = {
                vid: Random.integer(1000, 99999),
                title,
                info: description,
                coverUrl: cover || Random.image('1920x1080', Random.color(), Random.color(), 'cover'),
                videoUrl: videoUrl || Random.url('mp4'),
                viewCount: 0,
                likeCount: 0,
                commentCount: 0,
                date: now,
                duration: Random.time('mm:ss'),
                uploader: { uid, userName: '当前用户', profilePictureUrl: '' },
                tagList: [],
            }
            addVideo([video])
            return Mock.mock({ code: 200, message: 'ok', data: video })
        }

        if (type === 'essay') {
            const essay = {
                eid: Random.integer(1000, 99999),
                title,
                info: description,
                content: description,
                coverUrl: Random.image('1920x1080', Random.color(), Random.color(), 'cover'),
                viewCount: 0,
                likeCount: 0,
                commentCount: 0,
                date: now,
                uploader: { uid, userName: '当前用户', profilePictureUrl: '' },
                tagList: [],
            }
            addEssay([essay])
            return Mock.mock({ code: 200, message: 'ok', data: essay })
        }

        if (type === 'post') {
            const post = {
                pid: Random.integer(1000, 99999),
                title: text?.slice(0, 20) || '动态',
                text: text || '',
                pictureList: images || [],
                viewCount: 0,
                likeCount: 0,
                commentCount: 0,
                date: now,
                uploader: { uid, userName: '当前用户', profilePictureUrl: '' },
                tagList: [],
            }
            addPost([post])
            return Mock.mock({ code: 200, message: 'ok', data: post })
        }
    }
)
