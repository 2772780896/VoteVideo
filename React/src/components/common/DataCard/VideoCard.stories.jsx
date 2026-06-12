import VideoCard from './VideoCard'
import { BrowserRouter } from 'react-router-dom'

// VideoCard 内部用了 <Link>，必须包在 Router 里
export default {
  title: 'Components/VideoCard',
  component: VideoCard,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
}

// ① 正常卡片
export const Default = {
  args: {
    video: {
      vid: 1,
      coverUrl: 'https://picsum.photos/300/170?random=1',
      title: 'React 19 新特性深度解析',
      viewCount: '12.3万',
      commentCount: '456',
      duration: '10:30',
      uploader: { userName: '张三' },
      date: '2024-01-15',
    },
  },
}

// ② 超长标题 — 测试 line-clamp-2 是否生效
export const LongTitle = {
  args: {
    video: {
      ...Default.args.video,
      title: '这是一个超级无敌巨长无比的视频标题用来测试 line-clamp-2 限制两行截断效果到底能不能在超长文本下正常显示',
    },
  },
}

// ③ 无上传者 — 测试 uploader?.userName 可选链
export const NoUploader = {
  args: {
    video: {
      ...Default.args.video,
      vid: 2,
      coverUrl: 'https://picsum.photos/300/170?random=2',
      title: '匿名用户上传的视频',
      uploader: null,
    },
  },
}

// ④ 短标题
export const ShortTitle = {
  args: {
    video: {
      ...Default.args.video,
      vid: 3,
      coverUrl: 'https://picsum.photos/300/170?random=3',
      title: 'Vite',
    },
  },
}

// ⑤ 大数字 — 百万级播放量
export const LargeNumbers = {
  args: {
    video: {
      ...Default.args.video,
      vid: 4,
      coverUrl: 'https://picsum.photos/300/170?random=4',
      title: '爆款视频',
      viewCount: '999.9万',
      commentCount: '2.3万',
    },
  },
}
