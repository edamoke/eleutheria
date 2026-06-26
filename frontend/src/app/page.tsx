"use client";

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Wallet, 
  ShieldCheck, 
  Zap, 
  Coins, 
  ArrowRight,
  RefreshCcw,
  Clock
} from 'lucide-react';
import axios from 'axios';

// --- Components ---

const Card = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: any }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl">
    <div className="flex items-center gap-3 mb-4 text-slate-400">
      {Icon && <Icon size={20} className="text-blue-500" />}
      <h3 className="text-sm font-mono uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </div>
);

const Stat = ({ label, value, unit }: { label: string, value: string | number, unit?: string }) => (
  <div className="mb-4">
    <p className="text-xs text-slate-500 uppercase font-mono mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
      {unit && <span className="text-xs text-slate-400 font-mono">{unit}</span>}
    </div>
  </div>
);

// --- Main Page ---

export default function Dashboard() {
  const [intent, setIntent] = useState({ action: 'proposal', stake: 100 });
  const [queue, setQueue] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [protocolState, setProtocolState] = useState({
    totalITP: '1,240,500',
    stabilityIndex: '100%',
    activeIntents: 0
  });

  const fetchQueue = async () => {
    try {
      const res = await axios.get('http://localhost:3001/queue');
      setQueue(res.data);
      setProtocolState(prev => ({ ...prev, activeIntents: res.data.length }));
    } catch (err) {
      console.error("MION service unreachable");
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmitIntent = async () => {
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:3001/intent', {
        user: '0xf39...2266', // Local account 0
        action: intent.action,
        stake: intent.stake,
        expiry: Math.floor(Date.now() / 1000) + 3600,
        signature: '0x_simulated_sig'
      });
      fetchQueue();
    } catch (err) {
      alert("MION API Error. Is the service running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-slate-200 p-8 font-sans">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-white flex items-center gap-3">
            <ShieldCheck className="text-blue-500" size={32} />
            ELEUTHERIA NETWORK <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2 py-1 rounded">v1.0 MVP</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs mt-1">SOVEREIGN SERVER INTERFACE // DECENTRALIZED CORE</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded text-sm hover:bg-slate-800 transition">
          <Wallet size={16} />
          0xf39...2266
        </button>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Submission */}
        <div className="space-y-6">
          <Card title="Submit Intent" icon={Zap}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-2">ACTION TYPE</label>
                <select 
                  title="Select Action Type"
                  className="w-full bg-black border border-slate-700 rounded p-2 text-sm text-white"
                  value={intent.action}
                  onChange={(e) => setIntent({...intent, action: e.target.value})}
                >
                  <option value="proposal">PROPOSAL / VOTE</option>
                  <option value="execution">BATCH EXECUTION</option>
                  <option value="transfer">ASSET TRANSFER</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-2">STAKE AMOUNT (ITP)</label>
                <input 
                  title="Stake Amount"
                  type="number"
                  className="w-full bg-black border border-slate-700 rounded p-2 text-sm text-white"
                  value={intent.stake}
                  onChange={(e) => setIntent({...intent, stake: parseInt(e.target.value)})}
                />
              </div>
              <button 
                onClick={handleSubmitIntent}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? <RefreshCcw className="animate-spin" /> : <ArrowRight size={18} />}
                SIGN & SUBMIT TO MION
              </button>
            </div>
          </Card>

          <Card title="Node Sovereignty" icon={ShieldCheck}>
            <Stat label="Local NPU Load" value="24" unit="%" />
            <Stat label="AI Model" value="LLM INT4" />
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full w-[85%]"></div>
            </div>
            <p className="text-[10px] text-slate-600 font-mono mt-3 uppercase tracking-tighter">
              Status: 100% LOCAL INFERENCE // ZERO CLOUD DEPENDENCY
            </p>
          </Card>
        </div>

        {/* Middle Col: MION Queue */}
        <div className="md:col-span-2 space-y-6">
          <Card title="MION Active Intent Queue" icon={Activity}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-mono text-slate-500 border-b border-slate-800">
                    <th className="pb-3 px-2">USER</th>
                    <th className="pb-3">ACTION</th>
                    <th className="pb-3">STAKE</th>
                    <th className="pb-3">PRIORITY</th>
                    <th className="pb-3 text-right">EXPIRY</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {queue.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-600 italic">No active intents in queue...</td>
                    </tr>
                  ) : queue.map((item: any, idx) => (
                    <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition">
                      <td className="py-4 px-2 font-mono text-blue-400">{item.user}</td>
                      <td className="py-4 uppercase text-xs font-bold">{item.action}</td>
                      <td className="py-4">{item.stake} ITP</td>
                      <td className="py-4">
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px] font-mono">
                          {Math.log(item.stake + 1).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 text-right font-mono text-xs text-slate-500">
                        {new Date(item.expiry * 1000).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="ITP Rewards" icon={Coins}>
              <Stat label="Total Distributed" value={protocolState.totalITP} unit="ITP" />
              <button className="text-xs text-blue-400 font-mono hover:underline flex items-center gap-1">
                VIEW DISTRIBUTOR CONTRACT <ArrowRight size={10} />
              </button>
            </Card>
            <Card title="Edge Process Monitoring" icon={Activity}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-500">SYSTEM THROUGHPUT</span>
                <span className="text-xs font-mono text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> ACTIVE
                </span>
              </div>
              <div className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                842.10 <span className="text-xs text-slate-500 font-normal">OPS/SEC</span>
              </div>
              <p className="text-[10px] text-slate-600 font-mono mt-4">LAST SYNC: SATELLITE POLLING // 12S AGO</p>
            </Card>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-600">
        <div className="flex gap-6">
          <span className="flex items-center gap-1"><Clock size={10} /> SATELLITE LATENCY: 800MS</span>
          <span className="flex items-center gap-1"><Zap size={10} /> LORA UPLINK: ACTIVE</span>
        </div>
        <div>
          ELEUTHERIA_NODE_ID: ALPHA-EDGE-01
        </div>
      </footer>
    </main>
  );
}
