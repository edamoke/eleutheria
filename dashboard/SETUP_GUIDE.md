# Supabase & Blob Integration Setup Guide

## Overview
This project is configured with complete Supabase database and Vercel Blob storage integration. Follow these steps to set up your database schema.

## 1. Database Schema Setup

Copy and run these SQL commands in your Supabase SQL editor to create the required tables:

### Create Agents Table
```sql
CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'pending')),
  location TEXT,
  missions_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX agents_status_idx ON agents(status);
CREATE INDEX agents_created_at_idx ON agents(created_at);
```

### Create Missions Table
```sql
CREATE TABLE missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_agents TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX missions_status_idx ON missions(status);
CREATE INDEX missions_priority_idx ON missions(priority);
CREATE INDEX missions_created_at_idx ON missions(created_at);
```

### Create Media Assets Table
```sql
CREATE TABLE media_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT CHECK (type IN ('image', 'document', 'video')),
  size INTEGER,
  uploaded_at TIMESTAMP DEFAULT now()
);

CREATE INDEX media_assets_type_idx ON media_assets(type);
CREATE INDEX media_assets_uploaded_at_idx ON media_assets(uploaded_at);
```

### Create System Metrics Table
```sql
CREATE TABLE system_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  timestamp TIMESTAMP DEFAULT now()
);

CREATE INDEX system_metrics_type_idx ON system_metrics(metric_type);
CREATE INDEX system_metrics_timestamp_idx ON system_metrics(timestamp);
```

## 2. Environment Variables

All environment variables are automatically set up:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key for client-side access
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for server-side admin operations
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token

## 3. Usage Examples

### Fetching Agents
```typescript
import { getAgents } from '@/lib/actions'

const agents = await getAgents()
```

### Creating a Mission
```typescript
import { createMission } from '@/lib/actions'

const newMission = await createMission({
  title: 'Operation Stealth',
  status: 'pending',
  priority: 'high',
  assigned_agents: ['agent-1', 'agent-2'],
  description: 'Classified mission details'
})
```

### Uploading an Image
```typescript
const formData = new FormData()
formData.append('file', imageFile)
formData.append('folder', 'agents')

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
})

const blob = await response.json()
console.log('Image URL:', blob.url)
```

### Storing Media Asset Reference
```typescript
import { createMediaAsset } from '@/lib/actions'

await createMediaAsset({
  name: 'Agent Profile Photo',
  url: blobUrl,
  type: 'image',
  size: fileSize
})
```

## 4. API Endpoints

- `GET /api/agents` - Fetch all agents
- `POST /api/agents` - Create new agent
- `GET /api/missions` - Fetch all missions
- `POST /api/missions` - Create new mission
- `GET /api/media` - Fetch all media assets
- `POST /api/media` - Create media asset record
- `POST /api/upload` - Upload file to Blob storage

## 5. Database Functions

All operations are in `/lib/actions.ts` with full CRUD support:

### Agents
- `getAgents()` - Fetch all agents
- `getAgentById(id)` - Fetch single agent
- `createAgent(data)` - Create agent
- `updateAgent(id, updates)` - Update agent
- `deleteAgent(id)` - Delete agent

### Missions
- `getMissions()` - Fetch all missions
- `getMissionById(id)` - Fetch single mission
- `createMission(data)` - Create mission
- `updateMission(id, updates)` - Update mission
- `deleteMission(id)` - Delete mission

### Media Assets
- `getMediaAssets()` - Fetch all assets
- `createMediaAsset(data)` - Create asset record
- `deleteMediaAsset(id)` - Delete asset record

## 6. Blob Storage Functions

Available in `/lib/blob.ts`:

- `uploadImage(file, pathname)` - Upload file to Blob storage
- `deleteImage(url)` - Delete file from Blob storage
- `listImages(pathname)` - List all files in a folder

## 7. Next Steps

1. Run the SQL schema setup in Supabase
2. Test API endpoints with sample data
3. Integrate components with real data using server actions
4. Build your dashboard features with the API layer ready
