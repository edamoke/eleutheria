import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

interface Intent {
  user: string;
  action: string;
  stake: number;
  expiry: number;
  signature: string;
}

const intentQueue: Intent[] = [];

// Middleware for Intent Validation
const validateIntent = (intent: Intent): boolean => {
  if (!intent.user || !intent.signature || !intent.action) return false;
  if (intent.expiry < Date.now() / 1000) return false;
  // Signature verification logic would go here
  return true;
};

// Sorting Logic: priority = log(stake) * weight
const sortQueue = () => {
  const weight = 1.0; // Default constraint weight
  intentQueue.sort((a, b) => {
    const priorityA = Math.log(a.stake + 1) * weight;
    const priorityB = Math.log(b.stake + 1) * weight;
    return priorityB - priorityA;
  });
};

app.post('/intent', (req: Request, res: Response) => {
  const intent: Intent = req.body;

  if (!validateIntent(intent)) {
    return res.status(400).json({ error: 'Invalid Intent' });
  }

  intentQueue.push(intent);
  sortQueue();

  console.log(`Intent received from ${intent.user}. Priority Queue Size: ${intentQueue.length}`);
  
  res.status(201).json({ message: 'Intent queued', priority: intentQueue.indexOf(intent) });
});

app.get('/queue', (req: Request, res: Response) => {
  res.json(intentQueue);
});

app.listen(port, () => {
  console.log(`MION Service running on http://localhost:${port}`);
});
