const App = ({ playVideo, loading, error, onRefresh }) => {
  if (loading) {
    return <div className="w-full aspect-video bg-gray-200 animate-pulse rounded-xl" />
  }
  if (error) {
    return (
      <div className="w-full aspect-video bg-gray-100 flex flex-col items-center justify-center text-gray-400 gap-3">
        <span className="text-4xl">⚠</span>
        <span>视频加载失败</span>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-4 py-1.5 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            重试
          </button>
        )}
      </div>
    )
  }
  return (
    <video
      controls
      poster={playVideo?.coverUrl}
      key={playVideo?.vid}
      className="w-full aspect-video rounded-xl"
    >
      <source src={playVideo?.videoUrl} type="video/mp4" />
    </video>
  )
}

export default App
