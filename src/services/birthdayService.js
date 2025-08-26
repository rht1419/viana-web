import { supabase } from '../lib/supabase';

export const birthdayService = {
  // Get all birthday events
  async getBirthdayEvents() {
    try {
      if (!supabase) {
        return [];
      }
      const { data, error } = await supabase?.from('birthday_events')?.select(`
          *,
          created_by_profile:user_profiles!birthday_events_created_by_fkey(
            id,
            display_name,
            full_name,
            avatar_url
          )
        `)?.eq('is_active', true)?.order('birthday_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching birthday events:', error);
      throw error;
    }
  },

  // Get active birthday event (most recent or upcoming)
  async getActiveBirthdayEvent() {
    try {
      if (!supabase) {
        return null;
      }
      const today = new Date()?.toISOString()?.split('T')?.[0];
      
      // First, try to get today's birthday
      let { data, error } = await supabase?.from('birthday_events')?.select(`*,created_by_profile:user_profiles!birthday_events_created_by_fkey(id,display_name,full_name,avatar_url)`)?.eq('is_active', true)?.eq('birthday_date', today)?.single();

      if (error && error?.code === 'PGRST116') {
        // No birthday today, get the most recent or upcoming one
        const { data: events, error: eventsError } = await supabase?.from('birthday_events')?.select(`*,created_by_profile:user_profiles!birthday_events_created_by_fkey(id,display_name,full_name,avatar_url)`)?.eq('is_active', true)?.order('birthday_date', { ascending: false })?.limit(1);

        if (eventsError) throw eventsError;
        return events?.[0] || null;
      }

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching active birthday event:', error);
      throw error;
    }
  },

  // Create a new birthday event
  async createBirthdayEvent(eventData) {
    try {
      if (!supabase) {
        throw new Error('Data service unavailable');
      }
      const { data, error } = await supabase?.from('birthday_events')?.insert([{
          ...eventData,
          created_at: new Date()?.toISOString()
        }])?.select(`
          *,
          created_by_profile:user_profiles!birthday_events_created_by_fkey(
            id,
            display_name,
            full_name,
            avatar_url
          )
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating birthday event:', error);
      throw error;
    }
  },

  // Update a birthday event
  async updateBirthdayEvent(eventId, updates) {
    try {
      if (!supabase) {
        throw new Error('Data service unavailable');
      }
      const { data, error } = await supabase?.from('birthday_events')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', eventId)?.select(`
          *,
          created_by_profile:user_profiles!birthday_events_created_by_fkey(
            id,
            display_name,
            full_name,
            avatar_url
          )
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating birthday event:', error);
      throw error;
    }
  },

  // Calculate days until birthday
  calculateDaysUntilBirthday(birthdayDate) {
    if (!birthdayDate) return null;

    const today = new Date();
    const birthday = new Date(birthdayDate);
    
    // Set birthday to current year
    birthday?.setFullYear(today?.getFullYear());
    
    // If birthday has passed this year, set to next year
    if (birthday < today) {
      birthday?.setFullYear(today?.getFullYear() + 1);
    }
    
    const diffTime = birthday?.getTime() - today?.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  },

  // Get next birthday date for countdown
  getNextBirthdayDate(birthdayDate) {
    if (!birthdayDate) return null;

    const today = new Date();
    const birthday = new Date(birthdayDate);
    
    // Extract month and day
    const month = birthday?.getMonth();
    const day = birthday?.getDate();
    
    // Create next birthday date
    let nextBirthday = new Date(today.getFullYear(), month, day);
    
    // If birthday has passed this year, set to next year
    if (nextBirthday <= today) {
      nextBirthday = new Date(today.getFullYear() + 1, month, day);
    }
    
    return nextBirthday?.toISOString();
  }
};

export default birthdayService;