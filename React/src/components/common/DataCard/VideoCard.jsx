import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  return (
    <Link
      to={`/video/${video.vid}`}
      className="group block w-full no-underline text-inherit transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative flex flex-col space-y-2">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
          <img
            src={video.coverUrl}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-2 text-xs text-white">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span>▶</span>
                <span>{video.viewCount}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>💬</span>
                <span>{video.messageCount}</span>
              </span>
            </div>
            <span>{video.duration}</span>
          </div>
        </div>
        <div className="flex flex-col space-y-1 px-1">
          <h3 className="line-clamp-2 h-10 text-sm font-bold leading-tight text-gray-900 group-hover:text-blue-600">
            {video.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <Link
              to={`/user/${video.uploader?.uid}`}
              onClick={(e) => e.stopPropagation()}
              className="text-gray-500 hover:text-blue-600 transition-colors no-underline"
            >
              {video.uploader?.userName}
            </Link>
            <span>{video.date}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard;
