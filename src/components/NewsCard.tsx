import { useState, useMemo } from "react";
import { Calendar, User, ExternalLink, Link, Play, Pause, MessageCircle } from "lucide-react";
import PodcastComments from "./PodcastComments";

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  author: string;
  publishDate: string;
  category: string;
  imageUrl?: string;
  readTime: string;
  originalUrl?: string;
  onReadMore: (id: string) => void;
  onPlayPodcast?: (id: string, text: string) => void;
  isPlaying?: boolean;
}

const NewsCard = ({ 
  id, 
  title, 
  summary, 
  author, 
  publishDate, 
  category, 
  imageUrl, 
  readTime, 
  originalUrl, 
  onReadMore,
  onPlayPodcast,
  isPlaying = false
}: NewsCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 使用 useMemo 确保图片URL在组件生命周期内保持稳定
  const stableImageUrl = useMemo(() => {
    if (imageUrl && !imgError) {
      return imageUrl;
    }
    // 基于ID生成稳定的图片ID
    const imageId = Math.abs(id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0)) % 1000 + 1;
    return `https://picsum.photos/800/600?random=${imageId}`;
  }, [id, imageUrl, imgError]);

  const handleOriginalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (originalUrl) {
      window.open(originalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePlayPodcast = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayPodcast) {
      const podcastText = `${title}。${summary}`;
      onPlayPodcast(id, podcastText);
    }
  };

  const handleCommentsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowComments(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImageLoaded(false);
    }
  };

  return (
    <>
      <article
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-48 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-700/50 animate-pulse flex items-center justify-center">
              <div className="text-slate-400 text-sm">加载中...</div>
            </div>
          )}
          <img
            src={stableImageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-300 hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full">
              {category}
            </span>
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            {onPlayPodcast && (
              <button
                onClick={handlePlayPodcast}
                className={`p-2 backdrop-blur-sm rounded-full text-white transition-colors ${
                  isPlaying 
                    ? 'bg-green-500/70 hover:bg-green-600/70' 
                    : 'bg-black/50 hover:bg-black/70'
                }`}
                title={isPlaying ? "暂停播客" : "播放播客"}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
            )}
            <button
              onClick={handleCommentsClick}
              className="p-2 bg-purple-500/70 backdrop-blur-sm rounded-full text-white hover:bg-purple-600/70 transition-colors"
              title="播客评论"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
            {originalUrl && (
              <button
                onClick={handleOriginalLinkClick}
                className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                title="查看原文"
              >
                <Link className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{publishDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{author}</span>
              </div>
            </div>
            <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded">
              {readTime}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 hover:text-blue-400 transition-colors duration-200">
            {title}
          </h3>

          <p className="text-slate-300 mb-4 line-clamp-3 leading-relaxed">
            {summary}
          </p>

          <div className="flex items-center justify-between">
            <button
              onClick={() => onReadMore(id)}
              className={`flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-all duration-200 font-medium ${
                isHovered ? "transform translate-x-1" : ""
              }`}
            >
              <span>阅读更多</span>
              <ExternalLink className="h-4 w-4" />
            </button>
            
            {originalUrl && (
              <button
                onClick={handleOriginalLinkClick}
                className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors text-sm"
              >
                <Link className="h-3 w-3" />
                <span>原文链接</span>
              </button>
            )}
          </div>
        </div>
      </article>

      <PodcastComments
        newsId={id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </>
  );
};

export default NewsCard;
