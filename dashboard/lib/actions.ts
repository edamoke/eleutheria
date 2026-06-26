'use server'

import { createServerClient } from './supabase'
import type { Agent, Mission, MediaAsset } from './types'

// Agent operations
export async function getAgents() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching agents:', error)
    throw error
  }
  return data as Agent[]
}

export async function getAgentById(id: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching agent:', error)
    throw error
  }
  return data as Agent
}

export async function createAgent(agent: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('agents')
    .insert([agent])
    .select()
  
  if (error) {
    console.error('Error creating agent:', error)
    throw error
  }
  return data[0] as Agent
}

export async function updateAgent(id: string, updates: Partial<Agent>) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('agents')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Error updating agent:', error)
    throw error
  }
  return data[0] as Agent
}

export async function deleteAgent(id: string) {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting agent:', error)
    throw error
  }
}

// Mission operations
export async function getMissions() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching missions:', error)
    throw error
  }
  return data as Mission[]
}

export async function getMissionById(id: string) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching mission:', error)
    throw error
  }
  return data as Mission
}

export async function createMission(mission: Omit<Mission, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('missions')
    .insert([mission])
    .select()
  
  if (error) {
    console.error('Error creating mission:', error)
    throw error
  }
  return data[0] as Mission
}

export async function updateMission(id: string, updates: Partial<Mission>) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('missions')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Error updating mission:', error)
    throw error
  }
  return data[0] as Mission
}

export async function deleteMission(id: string) {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('missions')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting mission:', error)
    throw error
  }
}

// Media asset operations
export async function getMediaAssets() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .order('uploaded_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching media assets:', error)
    throw error
  }
  return data as MediaAsset[]
}

export async function createMediaAsset(asset: Omit<MediaAsset, 'id' | 'uploaded_at'>) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('media_assets')
    .insert([{ ...asset, uploaded_at: new Date().toISOString() }])
    .select()
  
  if (error) {
    console.error('Error creating media asset:', error)
    throw error
  }
  return data[0] as MediaAsset
}

export async function deleteMediaAsset(id: string) {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('media_assets')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting media asset:', error)
    throw error
  }
}
