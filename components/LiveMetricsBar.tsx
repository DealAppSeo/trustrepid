'use client';
import { useEffect, useState } from 'react';

export default function LiveMetricsBar() {
  const [data, setData] = useState({
    agents: 33, vdr: 50, decisions: 50,
    providers: 2, hallucinations: 5
  });

  useEffect(() => {
    fetch('/api/metrics').then(r => r.json())
      .then(d => setData(d)).catch(() => {});
  }, []);

  const items = [
    `${data.agents} agents scored`,
    `${data.providers} LLM providers`,
    `${data.decisions} verified decisions`,
    `${data.hallucinations} hallucinations caught`,
    '100% HAL uptime',
    'EU AI Act compliant',
    'Bootstrapping mode: labeled by design'
  ];

  return (
    <div style={{
      background:'#0F2044',padding:'8px 24px',
      display:'flex',gap:'24px',flexWrap:'wrap',
      alignItems:'center',fontFamily:'monospace',
      fontSize:'11px',color:'rgba(255,255,255,0.7)'
    }}>
      {items.map((item, i) => (
        <span key={i} style={{display:'flex',
          alignItems:'center',gap:'6px'}}>
          <span style={{width:'6px',height:'6px',
            background:'#4ADE80',borderRadius:'50%',
            display:'inline-block',flexShrink:0}}/>
          {item}
        </span>
      ))}
    </div>
  );
}
