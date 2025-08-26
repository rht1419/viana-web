import React, { useState } from 'react';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const MemoryCard = ({ memory, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text?.length <= maxLength) return text;
    return text?.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-2xl shadow-magical p-4 transition-magical hover:shadow-floating hover:scale-105">
      {/* Media Preview */}
      <div className="relative mb-4 rounded-xl overflow-hidden bg-muted h-48">
        {memory?.type === 'image' ? (
          <Image
            src={memory?.mediaUrl}
            alt={memory?.title}
            className="w-full h-full object-cover"
          />
        ) : memory?.type === 'video' ? (
          <div className="relative w-full h-full bg-gradient-mesh flex items-center justify-center">
            <Icon name="Play" size={48} color="white" />
            <video
              src={memory?.mediaUrl}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
              muted
            />
          </div>
        ) : (
          <div className="w-full h-full gradient-dreamy flex items-center justify-center">
            <Icon name="FileText" size={48} color="white" />
          </div>
        )}
        
        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(memory?.id)}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-error hover:text-error"
          iconName="Trash2"
          iconSize={16}
        >
          <span className="sr-only">Delete memory</span>
        </Button>
      </div>
      {/* Memory Content */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-heading font-bold text-lg text-text-primary line-clamp-2">
            {memory?.title}
          </h3>
          <span className="text-xs text-text-secondary font-caption ml-2 whitespace-nowrap">
            {formatDate(memory?.createdAt)}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="User" size={16} />
          <span className="font-body">{memory?.author}</span>
        </div>

        <div className="text-sm text-text-primary">
          <p className="leading-relaxed">
            {isExpanded ? memory?.message : truncateText(memory?.message)}
          </p>
          
          {memory?.message?.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/80 font-medium mt-1 transition-magical"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Tags */}
        {memory?.tags && memory?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {memory?.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded-full font-caption"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Interaction Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-4 text-xs text-text-secondary">
            <div className="flex items-center space-x-1">
              <Icon name="Heart" size={14} />
              <span>{memory?.likes || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="MessageCircle" size={14} />
              <span>{memory?.comments || 0}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="xs"
            iconName="Share2"
            iconSize={14}
            className="text-text-secondary hover:text-primary"
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;