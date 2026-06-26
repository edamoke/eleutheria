'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Agent, Mission } from '@/lib/types'

export function DashboardWithData() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [agentsRes, missionsRes] = await Promise.all([
          fetch('/api/agents'),
          fetch('/api/missions')
        ])

        if (!agentsRes.ok || !missionsRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const agentsData = await agentsRes.json()
        const missionsData = await missionsRes.json()

        setAgents(agentsData)
        setMissions(missionsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-6 p-4">
      {/* Agents Card */}
      <Card>
        <CardHeader>
          <CardTitle>Active Agents</CardTitle>
          <CardDescription>Total agents: {agents.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {agents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No agents found</p>
            ) : (
              agents.slice(0, 5).map((agent) => (
                <div key={agent.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">{agent.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{agent.missions_completed} missions</p>
                    <p className={`text-xs ${agent.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                      {agent.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Missions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Active Missions</CardTitle>
          <CardDescription>Total missions: {missions.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {missions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No missions found</p>
            ) : (
              missions.slice(0, 5).map((mission) => (
                <div key={mission.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{mission.title}</p>
                    <p className="text-sm text-muted-foreground">{mission.assigned_agents.length} agents assigned</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-medium ${mission.priority === 'critical' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {mission.priority}
                    </p>
                    <p className="text-xs text-muted-foreground">{mission.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
