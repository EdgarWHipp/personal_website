import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Chat session helpers
export const chatSessionService = {
  // Get today's chat session for the user
  async getTodaysSession(userId) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('session_date', today)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching session:', error);
      return null;
    }
    
    return data;
  },

  // Create new chat session for today
  async createTodaysSession(userId) {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([
        {
          user_id: userId,
          session_date: today,
          messages: [],
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating session:', error);
      return null;
    }
    
    return data;
  },

  // Update chat session with new messages
  async updateSessionMessages(sessionId, messages) {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ 
        messages: messages,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating session:', error);
      return null;
    }
    
    return data;
  },

  // Get user's chat history (last 30 days)
  async getUserChatHistory(userId, limit = 30) {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('session_date', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
    
    return data || [];
  }
};

// Authentication helpers
export const authService = {
  // Sign up with email and password
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    return { data, error };
  },

  // Sign in with email and password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  }
};

// Lesson archiving helpers
export const lessonArchiveService = {
  // Archive a lesson when user indicates good comprehension
  async archiveLesson(userId, lessonData) {
    try {
      console.log('🔍 Debug: Attempting to archive lesson...', {
        userId,
        lessonData,
        hasSupabase: !!supabase,
        supabaseUrl: supabase?.supabaseUrl
      });

      // First, check if the table exists by trying a simple select
      const { data: testData, error: testError } = await supabase
        .from('archived_lessons')
        .select('count')
        .limit(1);

      if (testError) {
        console.error('🔍 Debug: Table might not exist:', testError);
        
        // The table doesn't exist, provide instructions
        console.log('📋 Need to create archived_lessons table in Supabase');
        const tableCreateInstructions = `
-- Execute this SQL in your Supabase SQL Editor:

CREATE TABLE archived_lessons (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  scenario TEXT DEFAULT 'cafe',
  lesson_script TEXT NOT NULL,
  comprehension_level TEXT DEFAULT '80%+',
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lesson_duration TEXT DEFAULT '30s',
  word_count INTEGER DEFAULT 0,
  difficulty_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_archived_lessons_user_id ON archived_lessons(user_id);
CREATE INDEX idx_archived_lessons_language ON archived_lessons(language);

-- Enable RLS (Row Level Security)
ALTER TABLE archived_lessons ENABLE ROW LEVEL SECURITY;

-- Create policy for users to access their own lessons
CREATE POLICY "Users can access their own lessons" ON archived_lessons
  FOR ALL USING (auth.uid() = user_id);
        `;
        
        console.log('📋 Table creation SQL:', tableCreateInstructions);
        
        return { 
          success: false, 
          error: { 
            message: `Database table 'archived_lessons' doesn't exist. Please create it in Supabase SQL Editor first.`,
            details: testError,
            instructions: tableCreateInstructions
          } 
        };
      }

      // Now try to insert the lesson
      const { data, error } = await supabase
        .from('archived_lessons')
        .insert([
          {
            user_id: userId,
            language: lessonData.language,
            scenario: lessonData.scenario,
            lesson_script: lessonData.script,
            comprehension_level: '80%+',
            archived_at: new Date().toISOString(),
            lesson_duration: lessonData.duration || '30s',
            word_count: lessonData.wordCount || 0
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Error archiving lesson:', error);
        console.error('🔍 Full error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return { success: false, error };
      }

      console.log('✅ Lesson archived successfully:', data);
      return { success: true, data };
      
    } catch (error) {
      console.error('❌ Unexpected error in archiveLesson:', error);
      return { 
        success: false, 
        error: { 
          message: `Unexpected error: ${error.message}`,
          details: error
        } 
      };
    }
  },

  // Get user's archived lessons
  async getUserArchivedLessons(userId, language = null) {
    let query = supabase
      .from('archived_lessons')
      .select('*')
      .eq('user_id', userId)
      .order('archived_at', { ascending: false });

    if (language) {
      query = query.eq('language', language);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching archived lessons:', error);
      return [];
    }

    return data || [];
  },

  // Get lesson statistics for user
  async getUserLessonStats(userId) {
    const { data, error } = await supabase
      .from('archived_lessons')
      .select('language, scenario, archived_at')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching lesson stats:', error);
      return { totalLessons: 0, languages: [], scenarios: [] };
    }

    const stats = {
      totalLessons: data.length,
      languages: [...new Set(data.map(lesson => lesson.language))],
      scenarios: [...new Set(data.map(lesson => lesson.scenario))],
      recentActivity: data.slice(0, 5)
    };

    return stats;
  }
};

export default supabase; 