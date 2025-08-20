'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Plants(){
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ api('/master/plants').then(setRows); }, []);
  return (
    <div className="card">
      <h2>Plants</h2>
      <table className="table"><thead><tr><th>Code</th><th>Type</th><th>Active</th></tr></thead>
        <tbody>{rows.map((p:any)=>(<tr key={p.id}><td>{p.code}</td><td>{p.type}</td><td>{String(p.active)}</td></tr>))}</tbody>
      </table>
    </div>
  );
}
