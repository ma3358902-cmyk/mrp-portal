'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function RM(){
  const [plants, setPlants] = useState<any[]>([]);
  const [rms, setRms] = useState<any[]>([]);
  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0,7));
  const [lines, setLines] = useState<any[]>([]);
  const [message, setMessage] = useState<string|null>(null);

  useEffect(()=>{ (async()=>{
    const p = await api('/master/plants'); const r = await api('/master/raw');
    setPlants(p); setRms(r);
    const L:any[]=[]; p.forEach((pl:any)=> r.forEach((rm:any)=> L.push({ plantId: pl.id, rmId: rm.id, openingStock:0, purchasesMonth:0 })));
    setLines(L);
  })(); },[]);

  const save = async()=>{ setMessage(null); await api(`/rm/availability/${month}`, { method:'POST', body: JSON.stringify({ lines }) }); setMessage('Saved'); };

  return (
    <div className="card">
      <h2>RM Availability</h2>
      <div><label>Month</label><input className="input" type="month" value={month} onChange={e=>setMonth(e.target.value)} /></div>
      <table className="table"><thead><tr><th>Plant</th><th>RM</th><th>Opening</th><th>Purchases</th><th>Available</th></tr></thead>
        <tbody>
          {lines.map((ln:any, idx:number)=>{
            const avail = (ln.openingStock||0)+(ln.purchasesMonth||0);
            return (
              <tr key={idx}>
                <td><select className="input" value={ln.plantId} onChange={e=>{ const L=[...lines]; L[idx].plantId=Number(e.target.value); setLines(L); }}>{plants.map((p:any)=>(<option key={p.id} value={p.id}>{p.code}</option>))}</select></td>
                <td><select className="input" value={ln.rmId} onChange={e=>{ const L=[...lines]; L[idx].rmId=Number(e.target.value); setLines(L); }}>{rms.map((r:any)=>(<option key={r.id} value={r.id}>{r.code}</option>))}</select></td>
                <td><input className="input" type="number" step="0.001" value={ln.openingStock} onChange={e=>{ const L=[...lines]; L[idx].openingStock=Number(e.target.value); setLines(L); }}/></td>
                <td><input className="input" type="number" step="0.001" value={ln.purchasesMonth} onChange={e=>{ const L=[...lines]; L[idx].purchasesMonth=Number(e.target.value); setLines(L); }}/></td>
                <td>{avail.toFixed(3)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="btn" onClick={save}>Save</button> {message && <span>{message}</span>}
    </div>
  );
}
