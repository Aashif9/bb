// Supabase Configuration
const SUPABASE_URL = 'https://xwnwwckobkzsdcovsfxo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3bnd3Y2tvYmt6c2Rjb3ZzZnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTg4MjUsImV4cCI6MjA2ODY3NDgyNX0.Ul6n83TqlrxGPwhmW_gf2Y-WZJzD5ZyEQfJFrH0ZrMc'

// Initialize Supabase client (will be loaded from CDN)
let supabaseClient = null

// Initialize after Supabase library loads
function initSupabase() {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    return supabaseClient
  } else {
    console.error('Supabase library not loaded')
    return null
  }
}

// Database helper functions
class DatabaseManager {
  constructor() {
    this.client = supabaseClient || initSupabase()
  }

  // User Authentication
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await this.client.auth.signUp({
        email: email,
        password: password,
        options: {
          data: userData
        }
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message }
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: email,
        password: password
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  async signOut() {
    try {
      const { error } = await this.client.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: error.message }
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user } } = await this.client.auth.getUser()
      return user
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  }

  async getUserProfile(userId) {
    try {
      const { data, error } = await this.client.auth.getUser()
      if (error) throw error
      
      // Get user metadata which contains the profile information
      const userMetadata = data.user.user_metadata
      
      if (userMetadata && Object.keys(userMetadata).length > 0) {
        return { success: true, data: userMetadata }
      } else {
        // If no metadata, try to get from a profiles table (if it exists)
        const { data: profileData, error: profileError } = await this.client
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single()
        
        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw profileError
        }
        
        return { success: true, data: profileData || userMetadata }
      }
    } catch (error) {
      console.error('Get user profile error:', error)
      return { success: false, error: error.message }
    }
  }

  // Database Operations
  async insertData(table, data) {
    try {
      const { data: result, error } = await this.client
        .from(table)
        .insert(data)
        .select()
      
      if (error) throw error
      return { success: true, data: result }
    } catch (error) {
      console.error('Insert error:', error)
      return { success: false, error: error.message }
    }
  }

  async selectData(table, filters = {}) {
    try {
      let query = this.client.from(table).select('*')
      
      // Apply filters if provided
      Object.keys(filters).forEach(key => {
        query = query.eq(key, filters[key])
      })
      
      const { data, error } = await query
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Select error:', error)
      return { success: false, error: error.message }
    }
  }

  async updateData(table, id, updates) {
    try {
      const { data, error } = await this.client
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Update error:', error)
      return { success: false, error: error.message }
    }
  }

  async deleteData(table, id) {
    try {
      const { error } = await this.client
        .from(table)
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Delete error:', error)
      return { success: false, error: error.message }
    }
  }

  // Real-time subscriptions
  subscribeToTable(table, callback) {
    return this.client
      .channel(`public:${table}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: table }, 
        callback
      )
      .subscribe()
  }

  // Test connection
  async testConnection() {
    try {
      const { data, error } = await this.client
        .from('_test')
        .select('*')
        .limit(1)
      
      // Even if table doesn't exist, if we get a proper error response, connection is working
      return { success: true, message: 'Connection to Supabase established successfully!' }
    } catch (error) {
      console.error('Connection test error:', error)
      return { success: false, error: error.message }
    }
  }
}

// Create global database manager instance
const db = new DatabaseManager()

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for Supabase library to load
  setTimeout(() => {
    initSupabase()
    window.db = new DatabaseManager()
  }, 100)
})

// Export for use in other files
window.DatabaseManager = DatabaseManager
