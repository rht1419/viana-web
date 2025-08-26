import React from 'react';
import { Link } from 'react-router-dom';
import { getStorageUrl } from '../../../lib/supabase';

const RecentMemories = ({ memories, loading, user, onSignInClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMemoryIcon = (type) => {
    const icons = {
      photo: '📷',
      video: '🎥',
      text: '📝',
      audio: '🎵'
    };
    return icons?.[type] || '💭';
  };

  if (loading) {
    return (
      <section className="mb-12">
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Recent Memories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 })?.map((_, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!memories || memories?.length === 0) {
    return (
      <section className="mb-12">
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-3xl font-bold text-gray-800">Recent Memories ✨</h3>
        <Link
          to="/family-memories-scrapbook-page"
          className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1 hover:underline transition-colors duration-200"
        >
          <span>View All</span>
          <span>→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories?.slice(0, 6)?.map((memory, index) => (
          <div
            key={memory?.id}
            className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 hover:bg-white/80 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
          >
            {/* Featured badge */}
            {memory?.is_featured && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                ⭐ Featured
              </div>
            )}

            {/* Memory type icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getMemoryIcon(memory?.memory_type)}</span>
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {memory?.memory_type}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {formatDate(memory?.created_at)}
              </span>
            </div>

            {/* Memory content */}
            <div className="mb-4">
              <h4 className="font-bold text-gray-800 mb-2 line-clamp-2">
                {memory?.title}
              </h4>
              
              {memory?.memory_type === 'photo' && memory?.media_url && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  <img
                    src={getStorageUrl('memory-photos', memory?.media_url) || memory?.media_url}
                    alt={memory?.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              
              {memory?.memory_type === 'video' && memory?.media_url && (
                <div className="mb-3 rounded-lg overflow-hidden relative">
                  {memory?.media_thumbnail_url ? (
                    <img
                      src={getStorageUrl('memory-videos', memory?.media_thumbnail_url) || memory?.media_thumbnail_url}
                      alt={memory?.title}
                      className="w-full h-32 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <span className="text-4xl">🎥</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center">
                      <span className="text-2xl">▶️</span>
                    </div>
                  </div>
                </div>
              )}

              {(memory?.description || memory?.content) && (
                <p className="text-gray-600 text-sm line-clamp-3">
                  {memory?.description || memory?.content}
                </p>
              )}
            </div>

            {/* Memory footer */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">By</span>
                <span className="font-medium text-gray-700">
                  {memory?.created_by_profile?.display_name || memory?.created_by_profile?.full_name || 'Family Member'}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-500">
                {memory?.likes_count > 0 && (
                  <span className="flex items-center space-x-1">
                    <span>💝</span>
                    <span>{memory?.likes_count}</span>
                  </span>
                )}
                {memory?.memory_comments?.length > 0 && (
                  <span className="flex items-center space-x-1">
                    <span>💬</span>
                    <span>{memory?.memory_comments?.length}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Hover sparkle effect */}
            <div 
              className="absolute top-2 right-2 w-1 h-1 bg-yellow-400 rounded-full animate-twinkle opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ animationDelay: `${index * 0.2}s` }}
            ></div>
          </div>
        ))}
      </div>
      {memories?.length > 6 && (
        <div className="text-center mt-8">
          <Link
            to="/family-memories-scrapbook-page"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">📸</span>
            View All {memories?.length} Memories
          </Link>
        </div>
      )}
    </section>
  );
};

export default RecentMemories;
