import { supabase } from '../lib/supabase'

export async function fetchHabits(userId) {
  const { data } = await supabase.from('habits').select('*').eq('user_id', userId)
  return data || []
}

export async function createHabit(habit) {
  const { data } = await supabase.from('habits').insert([habit])
  return data
}

export async function updateHabit(id, updates) {
  const { data } = await supabase.from('habits').update(updates).eq('id', id)
  return data
}

export async function deleteHabit(id) {
  await supabase.from('habits').delete().eq('id', id)
}
