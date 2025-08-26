import React, { useState, useRef } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';

const AddMemoryModal = ({ isOpen, onClose, onAddMemory }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    author: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFileSelect(e?.dataTransfer?.files?.[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file && (file?.type?.startsWith('image/') || file?.type?.startsWith('video/'))) {
      setSelectedFile(file);
    } else {
      alert('Please select an image or video file.');
    }
  };

  const handleFileInputChange = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFileSelect(e?.target?.files?.[0]);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData?.title?.trim() || !formData?.message?.trim() || !formData?.author?.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsUploading(true);

    try {
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newMemory = {
        id: Date.now(),
        title: formData?.title?.trim(),
        message: formData?.message?.trim(),
        author: formData?.author?.trim(),
        tags: formData?.tags?.split(',')?.map(tag => tag?.trim())?.filter(tag => tag),
        type: selectedFile ? (selectedFile?.type?.startsWith('image/') ? 'image' : 'video') : 'text',
        mediaUrl: selectedFile ? URL.createObjectURL(selectedFile) : null,
        createdAt: new Date()?.toISOString(),
        likes: 0,
        comments: 0
      };

      onAddMemory(newMemory);
      
      // Reset form
      setFormData({
        title: '',
        message: '',
        author: '',
        tags: ''
      });
      setSelectedFile(null);
      onClose();
    } catch (error) {
      alert('Failed to add memory. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-floating w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full gradient-dreamy flex items-center justify-center">
              <Icon name="Plus" size={20} color="white" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-text-primary">
                Add New Memory
              </h2>
              <p className="text-sm text-text-secondary">
                Share a special moment for Viana's birthday
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
            className="text-text-secondary hover:text-text-primary"
          >
            <span className="sr-only">Close modal</span>
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-text-primary">
              Add Photo or Video
            </label>
            
            <div
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center transition-magical
                ${dragActive 
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    {selectedFile?.type?.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-mesh rounded-xl flex items-center justify-center">
                        <Icon name="Video" size={32} color="white" />
                      </div>
                    )}
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeFile}
                      className="absolute -top-2 -right-2 bg-white shadow-magical hover:bg-error hover:text-white"
                      iconName="X"
                      iconSize={16}
                    >
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                  
                  <p className="text-sm text-text-primary font-medium">
                    {selectedFile?.name}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full gradient-dreamy flex items-center justify-center">
                    <Icon name="Upload" size={24} color="white" />
                  </div>
                  
                  <div>
                    <p className="text-text-primary font-medium mb-1">
                      Drag and drop your file here
                    </p>
                    <p className="text-sm text-text-secondary mb-4">
                      or click to browse (Images and Videos only)
                    </p>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef?.current?.click()}
                      iconName="FolderOpen"
                      iconPosition="left"
                    >
                      Choose File
                    </Button>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Memory Title"
              name="title"
              type="text"
              placeholder="Give your memory a title..."
              value={formData?.title}
              onChange={handleInputChange}
              required
              className="md:col-span-2"
            />
            
            <Input
              label="Your Name"
              name="author"
              type="text"
              placeholder="Who's sharing this memory?"
              value={formData?.author}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Tags (optional)"
              name="tags"
              type="text"
              placeholder="birthday, family, fun (comma separated)"
              value={formData?.tags}
              onChange={handleInputChange}
              description="Add tags to help organize memories"
            />
          </div>

          <Input
            label="Your Message"
            name="message"
            type="text"
            placeholder="Share your thoughts, wishes, or story about this memory..."
            value={formData?.message}
            onChange={handleInputChange}
            required
            description="Write a heartfelt message to go with your memory"
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="sm:flex-1"
              disabled={isUploading}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="default"
              loading={isUploading}
              iconName="Heart"
              iconPosition="left"
              className="sm:flex-1"
            >
              {isUploading ? 'Adding Memory...' : 'Add Memory'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemoryModal;