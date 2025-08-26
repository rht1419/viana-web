-- Location: supabase/migrations/20250826121647_girly_butterfly_dashboard.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete new schema
-- Dependencies: None - creating base schema

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'family_member', 'viewer');
CREATE TYPE public.memory_type AS ENUM ('photo', 'video', 'text', 'audio');
CREATE TYPE public.privacy_level AS ENUM ('private', 'family_only', 'public');

-- 2. Core User Management Table
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    role public.user_role DEFAULT 'family_member'::public.user_role,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Birthday Events Table
CREATE TABLE public.birthday_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    birthday_person_name TEXT NOT NULL,
    birthday_date DATE NOT NULL,
    celebration_theme TEXT DEFAULT 'butterfly',
    background_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Memories Table (photos, videos, text messages)
CREATE TABLE public.memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.birthday_events(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    memory_type public.memory_type NOT NULL,
    media_url TEXT, -- For photos/videos from Supabase Storage
    media_thumbnail_url TEXT, -- For video thumbnails
    content TEXT, -- For text memories
    privacy_level public.privacy_level DEFAULT 'family_only'::public.privacy_level,
    is_featured BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Memory Likes Table
CREATE TABLE public.memory_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID REFERENCES public.memories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(memory_id, user_id)
);

-- 6. Memory Comments Table
CREATE TABLE public.memory_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID REFERENCES public.memories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_birthday_events_date ON public.birthday_events(birthday_date);
CREATE INDEX idx_birthday_events_created_by ON public.birthday_events(created_by);
CREATE INDEX idx_memories_event_id ON public.memories(event_id);
CREATE INDEX idx_memories_created_by ON public.memories(created_by);
CREATE INDEX idx_memories_type ON public.memories(memory_type);
CREATE INDEX idx_memories_privacy ON public.memories(privacy_level);
CREATE INDEX idx_memories_featured ON public.memories(is_featured);
CREATE INDEX idx_memory_likes_memory_id ON public.memory_likes(memory_id);
CREATE INDEX idx_memory_likes_user_id ON public.memory_likes(user_id);
CREATE INDEX idx_memory_comments_memory_id ON public.memory_comments(memory_id);

-- 8. Storage Buckets for Media Files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('memory-photos', 'memory-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
    ('memory-videos', 'memory-videos', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
    ('user-avatars', 'user-avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- 9. Functions for User Profile Management
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, display_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'family_member')::public.user_role
    );
    RETURN NEW;
END;
$$;

-- Function to update memory likes count
CREATE OR REPLACE FUNCTION public.update_memory_likes_count()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.memories 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.memory_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.memories 
        SET likes_count = GREATEST(likes_count - 1, 0)
        WHERE id = OLD.memory_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- 10. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_memory_like_changed
    AFTER INSERT OR DELETE ON public.memory_likes
    FOR EACH ROW EXECUTE FUNCTION public.update_memory_likes_count();

-- 11. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_comments ENABLE ROW LEVEL SECURITY;

-- 12. RLS Policies - Using Pattern 1 and Pattern 2 (simple ownership)

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for birthday events
CREATE POLICY "users_manage_own_birthday_events"
ON public.birthday_events
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Pattern 4: Public read, private write for memories
CREATE POLICY "public_can_read_memories"
ON public.memories
FOR SELECT
TO public
USING (privacy_level = 'public'::public.privacy_level);

CREATE POLICY "family_can_read_family_memories"
ON public.memories
FOR SELECT
TO authenticated
USING (privacy_level IN ('public'::public.privacy_level, 'family_only'::public.privacy_level));

CREATE POLICY "users_manage_own_memories"
ON public.memories
FOR INSERT, UPDATE, DELETE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Pattern 2: Simple user ownership for memory likes
CREATE POLICY "users_manage_own_memory_likes"
ON public.memory_likes
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 2: Simple user ownership for memory comments
CREATE POLICY "users_manage_own_memory_comments"
ON public.memory_comments
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow reading comments for memories that user can view
CREATE POLICY "users_can_read_memory_comments"
ON public.memory_comments
FOR SELECT
TO authenticated
USING (
    memory_id IN (
        SELECT id FROM public.memories 
        WHERE privacy_level IN ('public'::public.privacy_level, 'family_only'::public.privacy_level)
    )
);

-- 13. Storage RLS Policies

-- Memory photos - public read, authenticated upload
CREATE POLICY "public_can_view_memory_photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'memory-photos');

CREATE POLICY "authenticated_users_upload_memory_photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'memory-photos');

CREATE POLICY "owners_manage_memory_photos"
ON storage.objects
FOR UPDATE, DELETE
TO authenticated
USING (bucket_id = 'memory-photos' AND owner = auth.uid());

-- Memory videos - public read, authenticated upload
CREATE POLICY "public_can_view_memory_videos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'memory-videos');

CREATE POLICY "authenticated_users_upload_memory_videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'memory-videos');

CREATE POLICY "owners_manage_memory_videos"
ON storage.objects
FOR UPDATE, DELETE
TO authenticated
USING (bucket_id = 'memory-videos' AND owner = auth.uid());

-- User avatars - public read, own upload
CREATE POLICY "public_can_view_user_avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'user-avatars');

CREATE POLICY "users_upload_own_avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'user-avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users_manage_own_avatars"
ON storage.objects
FOR UPDATE, DELETE
TO authenticated
USING (bucket_id = 'user-avatars' AND owner = auth.uid());

-- 14. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    family_uuid UUID := gen_random_uuid();
    event_uuid UUID := gen_random_uuid();
    memory1_uuid UUID := gen_random_uuid();
    memory2_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@butterfly.family', crypt('ButterflyAdmin2024!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Family Admin", "display_name": "Mom Sarah", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (family_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'family@butterfly.family', crypt('ButterflyFamily2024!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Family Member", "display_name": "Dad Michael", "role": "family_member"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create birthday event for Viana
    INSERT INTO public.birthday_events (id, created_by, birthday_person_name, birthday_date, celebration_theme, is_active)
    VALUES (event_uuid, admin_uuid, 'Viana', '2024-08-27', 'Magical Butterfly Garden', true);

    -- Create sample memories
    INSERT INTO public.memories (id, event_id, created_by, title, description, memory_type, content, privacy_level, is_featured)
    VALUES 
        (memory1_uuid, event_uuid, admin_uuid, 'Viana''s First Steps', 
         'What an incredible milestone! Today Viana took her very first steps all by herself.',
         'text', 'She was so determined, holding onto the coffee table and then just let go and walked three whole steps to reach her favorite toy. The look of pure joy and accomplishment on her face was absolutely priceless. We all cheered and she clapped her little hands together, so proud of herself. This is definitely a moment we''ll treasure forever!',
         'family_only', true),
        (memory2_uuid, event_uuid, family_uuid, 'Birthday Preparations',
         'The whole family is getting ready for Viana''s big day!',
         'text', 'We''ve been decorating with pink and purple balloons, setting up the most beautiful butterfly-themed party. Aunt Lisa made the most adorable butterfly cake, and Uncle Tom is setting up the photo booth with magical props. Everyone is so excited to celebrate our little princess!',
         'family_only', false);

    -- Create sample likes and comments
    INSERT INTO public.memory_likes (memory_id, user_id)
    VALUES (memory1_uuid, family_uuid), (memory2_uuid, admin_uuid);

    INSERT INTO public.memory_comments (memory_id, user_id, comment_text)
    VALUES 
        (memory1_uuid, family_uuid, 'Such a precious moment! I can''t believe how fast she''s growing up.'),
        (memory2_uuid, admin_uuid, 'The decorations look absolutely magical! She''s going to love it.');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 15. Cleanup Function (for development)
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@butterfly.family';

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.memory_comments WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.memory_likes WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.memories WHERE created_by = ANY(auth_user_ids_to_delete);
    DELETE FROM public.birthday_events WHERE created_by = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;