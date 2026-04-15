'use client';
import { useState, useEffect } from 'react';

const ENGINE = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';

export default function LiveStatsBanner() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    fetch(`${ENGINE}/hal/stats`).then(r => r.json()).then(setStats).catch(() => {});
  }, []);
  if (!stats) return null;
  return (
    <div className="bg-gray-900 border border-amber-800/30 rounded-xl p-4 mb-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-400 font-mono">
            {stats.hallucinationsCaught?.toLocaleString() || '0'}
          </p>
          <p className="text-xs text-gray-500">Caught by HAL</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400 font-mono">
            {stats.catchRate != null ? `${(stats.catchRate * 100).toFixed(1)}%` : '—'}
          </p>
          <p className="text-xs text-gray-500">Catch Rate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-400 font-mono">
            {stats.avgLatencyMs ? `${stats.avgLatencyMs}ms` : '—'}
          </p>
          <p className="text-xs text-gray-500">Avg Latency</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
        <span className="text-xs text-gray-500 font-mono">Track A Live</span>
      </div>
    </div>
  );
}
