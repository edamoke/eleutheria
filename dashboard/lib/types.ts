// Database table types
export interface Agent {
  id: string
  name: string
  status: 'active' | 'inactive' | 'pending'
  location: string
  missions_completed: number
  created_at: string
  updated_at: string
}

export interface Mission {
  id: string
  title: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assigned_agents: string[]
  description: string
  created_at: string
  updated_at: string
}

export interface SystemMetric {
  id: string
  metric_type: string
  value: number
  timestamp: string
}

export interface MediaAsset {
  id: string
  name: string
  url: string
  type: 'image' | 'document' | 'video'
  size: number
  uploaded_at: string
}
