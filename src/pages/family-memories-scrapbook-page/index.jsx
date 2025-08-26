import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from 'components/ui/Header';
import BackButton from './components/BackButton';
import MemoryGallery from './components/MemoryGallery';
import AddMemoryModal from './components/AddMemoryModal';
import FloatingAddButton from './components/FloatingAddButton';
import Icon from 'components/AppIcon';

const FamilyMemoriesScrapbookPage = () => {
  const [memories, setMemories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock initial memories data
  const initialMemories = [
    {
      id: 1,
      title: "Viana\'s First Steps",
      message: `What an incredible milestone! Today Viana took her very first steps all by herself. She was so determined, holding onto the coffee table and then just let go and walked three whole steps to reach her favorite toy. \n\nThe look of pure joy and accomplishment on her face was absolutely priceless. We all cheered and she clapped her little hands together, so proud of herself. This is definitely a moment we'll treasure forever!`,
      author: "Mom Sarah",
      type: "image",
      mediaUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=500&h=400&fit=crop",
      createdAt: "2024-08-15T10:30:00Z",
      likes: 12,
      comments: 5,
      tags: ["milestone", "first-steps", "proud-moment"]
    },
    {
      id: 2,
      title: "Grandpa\'s Bedtime Stories",
      message: `Every night, Grandpa reads the most wonderful stories to Viana. Tonight it was 'The Very Hungry Caterpillar' and she was so engaged, pointing at all the colorful pictures and making little sounds. \n\nShe especially loves when he does different voices for each character. The bond between them is so special and heartwarming to watch.`,
      author: "Dad Michael",
      type: "video",
      mediaUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      createdAt: "2024-08-20T19:45:00Z",
      likes: 8,
      comments: 3,
      tags: ["grandpa", "bedtime", "stories", "bonding"]
    },
    {
      id: 3,
      title: "Birthday Preparations",
      message: `The whole family is getting ready for Viana's big day! We've been decorating with pink and purple balloons, setting up the most beautiful butterfly-themed party. \n\nAunt Lisa made the most adorable butterfly cake, and Uncle Tom is setting up the photo booth with magical props. Everyone is so excited to celebrate our little princess!`,
      author: "Aunt Lisa",
      type: "image",
      mediaUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=400&fit=crop",
      createdAt: "2024-08-25T14:20:00Z",
      likes: 15,
      comments: 8,
      tags: ["birthday", "preparations", "family", "party"]
    },
    {
      id: 4,
      title: "Sweet Dreams Little Angel",
      message: `Just wanted to share how peaceful Viana looks when she sleeps. She's been such a good baby, sleeping through the night now and always waking up with the biggest smile. \n\nWatching her grow and develop her own little personality has been the greatest joy of our lives. We love you so much, sweet Viana!`,
      author: "Grandma Rose",
      type: "text",
      mediaUrl: null,
      createdAt: "2024-08-22T21:15:00Z",
      likes: 6,
      comments: 2,
      tags: ["sleep", "peaceful", "love", "growth"]
    },
    {
      id: 5,
      title: "Playing in the Garden",
      message: `Viana discovered the joy of playing with bubbles today! She was giggling and trying to catch them with her tiny hands. The way she squeals with delight every time a bubble pops is absolutely adorable. \n\nShe's becoming such an active and curious little explorer, always finding new things to investigate and play with.`,
      author: "Uncle Tom",
      type: "image",
      mediaUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=400&fit=crop",
      createdAt: "2024-08-18T16:00:00Z",
      likes: 10,
      comments: 4,
      tags: ["garden", "bubbles", "playing", "giggles"]
    }
  ];

  useEffect(() => {
    // Simulate loading initial memories
    const loadMemories = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMemories(initialMemories);
      setIsLoading(false);
    };

    loadMemories();
  }, []);

  const handleAddMemory = (newMemory) => {
    setMemories(prev => [newMemory, ...prev]);
  };

  const handleDeleteMemory = (memoryId) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      setMemories(prev => prev?.filter(memory => memory?.id !== memoryId));
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Family Memories - Viana's Birthday Scrapbook</title>
        <meta name="description" content="Share and preserve precious memories for Viana's birthday celebration. Upload photos, videos, and heartfelt messages to create a digital scrapbook filled with love." />
        <meta name="keywords" content="birthday memories, family scrapbook, photo sharing, video memories, birthday celebration" />
      </Helmet>
      <div className="min-h-screen relative overflow-hidden" style={{
        background: 'radial-gradient(1400px 700px at -10% -10%, rgba(255,42,173,0.16), transparent 60%), radial-gradient(1200px 600px at 110% -10%, rgba(34,211,238,0.14), transparent 60%), linear-gradient(180deg, #0a0214 0%, #12042a 50%, #0b0516 100%)'
      }}>
        {/* Magical Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating clouds */}
          <div className="absolute top-20 left-10 w-32 h-20 bg-white/30 rounded-full blur-xl animate-gentle-float"></div>
          <div className="absolute top-40 right-20 w-24 h-16 bg-pink-200/20 rounded-full blur-lg animate-gentle-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 left-1/4 w-28 h-18 bg-purple-200/20 rounded-full blur-lg animate-gentle-float" style={{ animationDelay: '4s' }}></div>
          
          {/* Sparkle effects */}
          <div className="absolute top-32 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-gentle-float opacity-60"></div>
          <div className="absolute top-60 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-gentle-float opacity-50" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-60 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-gentle-float opacity-70" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-96 left-20 w-1.5 h-1.5 bg-pink-300 rounded-full animate-gentle-float opacity-40" style={{ animationDelay: '5s' }}></div>
        </div>

        <Header />

        <main className="relative z-10 pt-20 pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <BackButton />

            {/* Page Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-magical animate-gentle-float" style={{ background: 'linear-gradient(135deg, #ff2aad, #d946ef, #22d3ee)' }}>
                <Icon name="Heart" size={32} color="white" />
              </div>
              
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl heading-gradient mb-4 drop-shadow-lg">FAMILY MEMORIES</h1>
              
              <p className="text-lg md:text-xl text-[color:var(--color-text-secondary)] mb-2 drop-shadow-sm max-w-2xl mx-auto">
                A digital scrapbook filled with love for Viana's special day
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-white/80">
                <Icon name="Sparkles" size={16} />
                <span className="text-sm font-caption">
                  Share photos, videos, and heartfelt messages
                </span>
                <Icon name="Sparkles" size={16} />
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-dreamy flex items-center justify-center animate-spin">
                  <Icon name="Loader2" size={24} color="white" />
                </div>
                <p className="text-text-secondary">Loading precious memories...</p>
              </div>
            ) : (
              /* Memory Gallery */
              (<MemoryGallery 
                memories={memories} 
                onDeleteMemory={handleDeleteMemory}
              />)
            )}
          </div>
        </main>

        {/* Floating Add Button */}
        <FloatingAddButton onClick={openAddModal} />

        {/* Add Memory Modal */}
        <AddMemoryModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onAddMemory={handleAddMemory}
        />

        {/* Footer */}
        <footer className="relative z-10 bg-white/10 backdrop-blur-sm border-t border-white/20 py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Icon name="Heart" size={20} color="var(--color-primary)" />
              <span className="font-heading font-bold text-lg text-text-primary">
                Made with love for Viana
              </span>
              <Icon name="Heart" size={20} color="var(--color-primary)" />
            </div>
            
            <p className="text-sm text-text-secondary">
              © {new Date()?.getFullYear()} Family Memories. Creating magical moments together.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default FamilyMemoriesScrapbookPage;