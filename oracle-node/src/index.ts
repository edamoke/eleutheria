import axios from 'axios';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

// Configuration for MION Service
const MION_SERVICE_URL = process.env.MION_SERVICE_URL || 'http://localhost:3001';

// Configuration for Blockchain Interaction
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const RPC_URL = process.env.RPC_URL || 'http://localhost:8545'; // Hardhat default
const WION_CONTRACT_ADDRESS = process.env.WION_CONTRACT_ADDRESS as string;

// Ensure required environment variables are set
if (!PRIVATE_KEY) {
  console.error('PRIVATE_KEY is not set in environment variables.');
  process.exit(1);
}
if (!WION_CONTRACT_ADDRESS) {
  console.error('WION_CONTRACT_ADDRESS is not set in environment variables.');
  process.exit(1);
}

// Setup Ethers provider and signer
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// WION Contract ABI (simplified for executeBatch)
const WION_ABI = [
  "function executeBatch(tuple(tuple(address sender, string action, uint256 stake, uint256 expiry, bytes signature)[] io, bytes32 rootHash) batch)"
];
const wionContract = new ethers.Contract(WION_CONTRACT_ADDRESS, WION_ABI, signer);

interface Intent {
  user: string;
  action: string;
  stake: number;
  expiry: number;
  signature: string;
}

// Placeholder for Merkle Tree generation (will be more complex in a real implementation)
const generateMerkleRoot = (intents: Intent[]): string => {
  // In a real scenario, this would generate a Merkle root from the intents
  // For MVP, we'll just use a hash of the concatenated intent data
  const intentHashes = intents.map(intent => ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(intent))));
  // Simple concatenation hash as a placeholder for a proper Merkle tree
  if (intentHashes.length === 0) return ethers.ZeroHash;
  let currentHash = intentHashes[0];
  for (let i = 1; i < intentHashes.length; i++) {
    currentHash = ethers.keccak256(ethers.concat([currentHash, intentHashes[i]]));
  }
  return currentHash;
};

const pollAndExecute = async () => {
  try {
    const response = await axios.get<Intent[]>(`${MION_SERVICE_URL}/queue`);
    const intents = response.data;

    if (intents.length === 0) {
      console.log('No intents in queue. Waiting...');
      return;
    }

    console.log(`Fetched ${intents.length} intents from MION queue.`);

    // For MVP, let's take a batch of up to 16 intents (as per the spec)
    const batchSize = Math.min(intents.length, 16);
    const batchIntents = intents.slice(0, batchSize);

    // Clear these intents from MION (this would ideally be a POST to /queue/clear or similar)
    // For MVP, assume MION clears after a GET, or implement a separate endpoint
    // await axios.post(`${MION_SERVICE_URL}/queue/clear`, { count: batchSize });

    const rootHash = generateMerkleRoot(batchIntents);

    const formattedBatch = {
      io: batchIntents.map(intent => ({
        sender: intent.user, // Assuming user is an address
        action: intent.action,
        stake: intent.stake,
        expiry: intent.expiry,
        signature: intent.signature,
      })),
      rootHash: rootHash,
    };

    console.log(`Executing batch with ${batchIntents.length} intents. Root Hash: ${rootHash}`);
    const tx = await wionContract.executeBatch(formattedBatch);
    await tx.wait();
    console.log(`Batch executed on-chain. Transaction hash: ${tx.hash}`);

  } catch (error) {
    console.error('Error polling MION or executing batch:', error);
  }
};

// Poll every 5 seconds (adjust as needed)
setInterval(pollAndExecute, 5000);

console.log('Oracle Node started. Polling MION service for intents...');