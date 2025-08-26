import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

// Do not crash the app if env vars are missing; degrade gracefully in dev/demo
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  // eslint-disable-next-line no-console
  console.warn('Supabase disabled: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Auth/data features will be unavailable.');
}

// Helper function to get public URL for storage files
export const getStorageUrl = (bucket, path) => {
  if (!path) return null;
  return supabase?.storage?.from(bucket)?.getPublicUrl(path)?.data?.publicUrl;
};

// Helper function to upload files
export const uploadFile = async (bucket, path, file, options = {}) => {
  try {
    const { data, error } = await supabase?.storage?.from(bucket)?.upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        ...options
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error uploading to ${bucket}:`, error);
    throw error;
  }
};

// Helper function to delete files
export const deleteFile = async (bucket, path) => {
  try {
    const { error } = await supabase?.storage?.from(bucket)?.remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting from ${bucket}:`, error);
    throw error;
  }
};

export default supabase;