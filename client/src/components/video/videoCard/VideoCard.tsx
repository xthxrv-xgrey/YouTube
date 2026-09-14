import { EllipsisVertical } from "lucide-react";

interface Video {
  thumbnail: string;
  title: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  uploadedAt: string;
  duration: string;
}

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  return (
    <div className="w-full min-w-0 cursor-pointer">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-800">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.02]"
        />

        {/* Duration */}
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {video.duration}
        </span>
      </div>

      {/* Video information */}
      <div className="mt-3 flex min-w-0 gap-3">
        {/* Channel avatar */}
        <div className="shrink-0">
          <img
            src={video.channelAvatar}
            alt={video.channelName}
            className="h-9 w-9 rounded-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 text-base font-semibold leading-5 text-white">
            {video.title}
          </h2>

          <p className="mt-1 text-sm text-gray-400">{video.channelName}</p>

          <p className="text-sm text-gray-400">
            {video.views} views · {video.uploadedAt}
          </p>
        </div>

        {/* Menu */}
        <button
          className="h-9 w-9 shrink-0 rounded-full p-2 text-white hover:bg-white/10"
          aria-label="More options"
        >
          <EllipsisVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
