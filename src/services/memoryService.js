import { supabase } from '../lib/supabase';

export const memoryService = {
  // Get all memories for an event
  async getMemories(eventId = null, privacyLevel = 'family_only') {
    try {
      if (!supabase) {
        return [];
      }
      let query = supabase?.from('memories')?.select(`
          *,
          created_by_profile:user_profiles!memories_created_by_fkey(
            id,
            display_name,
            full_name,
            avatar_url
          ),
          memory_likes(count),
          memory_comments(
            id,
            comment_text,
            created_at,
            user_profile:user_profiles!memory_comments_user_id_fkey(
              display_name,
              full_name
            )
          )
        `)?.order('created_at', { ascending: false });

      if (eventId) {
        query = query?.eq('event_id', eventId);
      }

      // Filter by privacy level if specified
      if (privacyLevel) {
        if (privacyLevel === 'public') {
          query = query?.eq('privacy_level', 'public');
        } else {
          query = query?.in('privacy_level', ['public', 'family_only']);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching memories:', error);
      throw error;
    }
  },

  // Get featured memories
  async getFeaturedMemories(eventId = null) {
    try {
      if (!supabase) {
        return [];
      }
      let query = supabase?.from('memories')?.select(`
          *,
          created_by_profile:user_profiles!memories_created_by_fkey(
            id,
            display_name,
            full_name,
            avatar_url
          )
        `)?.eq('is_featured', true)?.order('created_at', { ascending: false });

      if (eventId) {
        query = query?.eq('event_id', eventId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured memories:', error);
      throw error;
    }
  },

  // Create a new memory
  async createMemory(memoryData) {
    try {
      if (!supabase) {
        throw new Error('Data service unavailable');
      }
      const { data, error } = await supabase?.from('memories')?.insert([{
          ...memoryData,
          created_at: new Date()?.toISOString()
        }])?.select(`
          *,
          created_by_profile:user_profiles!memories_created_by_fkey(
            id,
            display_name,
            full_name,
            avatar_url
          )
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating memory:', error);
      throw error;
    }
  },

  // Update a memory
  async updateMemory(memoryId, updates) {
    try {
      if (!supabase) {
        throw new Error('Data service unavailable');
      }
      const { data, error } = await supabase?.from('memories')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', memoryId)?.select(`
          *,
          created_by_profile:user_profiles!memories_created_by_fkey(
            id,
            display_name,
            full_name,
            avatar_url
          )
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating memory:', error);
      throw error;
    }
  },

  // Delete a memory
  async deleteMemory(memoryId) {
    try {
      if (!supabase) {
        throw new Error('Data service unavailable');
      }
      const { error } = await supabase?.from('memories')?.delete()?.eq('id', memoryId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting memory:', error);
      throw error;
    }
  },

  // Like/unlike a memory
  async toggleLike(memoryId, userId) {
    try {
      if (!supabase) {
        throw new Error('Data service unavailable');
      }
      // Check if already liked
      const { data: existingLike } = await supabase?.from('memory_likes')?.select('id')?.eq('memory_id', memoryId)?.eq('user_id', userId)?.single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase?.from('memory_likes')?.delete()?.eq('id', existingLike?.id);

        if (error) throw error;
        return { liked: false };
      } else {
        // Like
        const { error } = await supabase?.from('memory_likes')?.insert([{
            memory_id: memoryId,
            user_id: userId
          }]);

        if (error) throw error;
        return { liked: true };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Add comment to memory
  async addComment(memoryId, userId, commentText) {
    try {
      if (!supabase) {
        throw new Error('Data service unavailable');
      }
      const { data, error } = await supabase?.from('memory_comments')?.insert([{
          memory_id: memoryId,
          user_id: userId,
          comment_text: commentText
        }])?.select(`
          *,
          user_profile:user_profiles!memory_comments_user_id_fkey(
            display_name,
            full_name,
            avatar_url
          )
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Upload media file for memory
  async uploadMemoryMedia(file, memoryId, type = 'photo') {
    try {
      if (!supabase) {
        throw new Error('Storage service unavailable');
      }
      const bucket = type === 'video' ? 'memory-videos' : 'memory-photos';
      const fileExtension = file?.name?.split('.')?.pop();
      const fileName = `${memoryId}-${Date.now()}.${fileExtension}`;
      
      const { data, error } = await supabase?.storage?.from(bucket)?.upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrl } = supabase?.storage?.from(bucket)?.getPublicUrl(fileName);

      return {
        path: data?.path,
        url: publicUrl?.publicUrl
      };
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }
};

export default memoryService;