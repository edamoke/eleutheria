import { NextRequest, NextResponse } from 'next/server'
import { getMediaAssets, createMediaAsset } from '@/lib/actions'

export async function GET() {
  try {
    const assets = await getMediaAssets()
    return NextResponse.json(assets)
  } catch (error) {
    console.error('Error fetching media assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media assets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const asset = await createMediaAsset(body)
    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    console.error('Error creating media asset:', error)
    return NextResponse.json(
      { error: 'Failed to create media asset' },
      { status: 500 }
    )
  }
}
