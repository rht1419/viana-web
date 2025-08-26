import React, { useState, useMemo } from 'react';
import MemoryCard from './MemoryCard';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const MemoryGallery = ({ memories, onDeleteMemory }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  const sortedAndFilteredMemories = React.useMemo(() => {
    let filtered = [...memories];

    // Apply filter
    if (filterBy !== 'all') {
      filtered = filtered?.filter(memory => memory?.type === filterBy);
    }

    // Apply sort
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a?.title?.localeCompare(b?.title);
        case 'author':
          return a?.author?.localeCompare(b?.author);
        default:
          return 0;
      }
    });

    return filtered;
  }, [memories, sortBy, filterBy]);

  const getFilterCount = (type) => {
    if (type === 'all') return memories?.length;
    return memories?.filter(memory => memory?.type === type)?.length;
  };

  if (memories?.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-dreamy flex items-center justify-center animate-gentle-float">
          <Icon name="Heart" size={32} color="white" />
        </div>
        
        <h3 className="font-heading font-bold text-2xl text-text-primary mb-2">
          No Memories Yet
        </h3>
        
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          Start building Viana's digital scrapbook by adding your first memory. 
          Share photos, videos, and heartfelt messages to celebrate her special day!
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
          <Icon name="Sparkles" size={16} />
          <span>Click the + button to add your first memory</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={18} color="var(--color-text-secondary)" />
          <span className="text-sm font-medium text-text-secondary">Filter & Sort</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Filter Buttons */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All', icon: 'Grid3X3' },
              { key: 'image', label: 'Photos', icon: 'Image' },
              { key: 'video', label: 'Videos', icon: 'Video' },
              { key: 'text', label: 'Notes', icon: 'FileText' }
            ]?.map((filter) => (
              <Button
                key={filter?.key}
                variant={filterBy === filter?.key ? 'default' : 'outline'}
                size="xs"
                onClick={() => setFilterBy(filter?.key)}
                iconName={filter?.icon}
                iconSize={14}
                className="text-xs"
              >
                {filter?.label} ({getFilterCount(filter?.key)})
              </Button>
            ))}
          </div>
          
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-1.5 text-xs border border-border rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-magical"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">By Title</option>
            <option value="author">By Author</option>
          </select>
        </div>
      </div>
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Showing {sortedAndFilteredMemories?.length} of {memories?.length} memories
        </p>
        
        {filterBy !== 'all' && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setFilterBy('all')}
            iconName="X"
            iconSize={14}
            className="text-text-secondary hover:text-primary"
          >
            Clear filter
          </Button>
        )}
      </div>
      {/* Memory Grid */}
      {sortedAndFilteredMemories?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAndFilteredMemories?.map((memory) => (
            <MemoryCard
              key={memory?.id}
              memory={memory}
              onDelete={onDeleteMemory}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Icon name="Search" size={24} color="var(--color-text-secondary)" />
          </div>
          
          <h3 className="font-heading font-bold text-lg text-text-primary mb-2">
            No memories found
          </h3>
          
          <p className="text-text-secondary mb-4">
            Try adjusting your filter or sort options to see more memories.
          </p>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterBy('all')}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default MemoryGallery;