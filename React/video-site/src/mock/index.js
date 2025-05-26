import Mock from 'mockjs'
const Random = Mock.Random
export const carouselPicture = Mock.mock(
    /^\/picture\/carousel(\?.*)?$/,
    'get',
    function(options) {
        const relativePath = options.url
        const url = new URL(relativePath, 'http://localhost')
        const number = Number(url.searchParams.get('number'))
        return Mock.mock({
            code: 200,
            message: 'ok',
            data: [...Array(number)].map( (i) => ({
                id: Random.integer(1, 999),
                src: Random.image('1920x1080', Random.color(), Random.color(), 'jpg', Random.string(1,5))
            }))
        })
    }
)
