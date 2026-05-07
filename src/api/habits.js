import { supabase } from '../lib/supabase'

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }

  return supabase
}

export async function fetchHabits(userId) {
  const { data, error } = await requireSupabase()
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createHabit(habit) {
  const { data, error } = await requireSupabase()
    .from('habits')
    .insert([habit])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateHabit(id, updates) {
  const { data, error } = await requireSupabase()
    .from('habits')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteHabit(id) {
  const { error } = await requireSupabase().from('habits').delete().eq('id', id)
  if (error) throw error
}
