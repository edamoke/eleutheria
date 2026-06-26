import { NextRequest, NextResponse } from 'next/server'
import { getMissions, createMission } from '@/lib/actions'

export async function GET() {
  try {
    const missions = await getMissions()
    return NextResponse.json(missions)
  } catch (error) {
    console.error('Error fetching missions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch missions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const mission = await createMission(body)
    return NextResponse.json(mission, { status: 201 })
  } catch (error) {
    console.error('Error creating mission:', error)
    return NextResponse.json(
      { error: 'Failed to create mission' },
      { status: 500 }
    )
  }
}
