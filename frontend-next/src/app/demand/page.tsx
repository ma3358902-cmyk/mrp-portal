'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Demand(){
  const [items, setItems] = useState<any[]>([]);
  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0,7));
  const [market, setMarket] = useState<string>('Local');
  const [lines, setLines] = useState<any[]>([]);
  const [message, setMessage] = useState<string|null>(null);
  useEffect(()=>{ (async()=>{ const it = await api('/master/items'); setItems(it); setLines(it.map((i:any)=>({ fgId:i.id, backlockQty:0, newOrderQty:0 }))); })(); },[]);
  const save = async()=>{ setMessage(null); await api(`/plans/demand/${month}`, { method:'POST', body: JSON.stringify({ market, lines }) }); setMessage('Saved'); };
  return (
    <div className="card">
      <h2>Demand Plan</h2>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div><label>Month</label><input className="input" type="month" value={month} onChange={e=>setMonth(e.target.value)} /></div>
        <div><label>Market</label><select className="input" value={market} onChange={e=>setMarket(e.target.value)}><option>Local</option><option>Export</option></select></div>
      </div>
      <table className="table"><thead><tr><th>Item</th><th>Backlock</th><th>New</th><th>Total</th></tr></thead>
        <tbody>
          {lines.map((ln,idx)=>{
            const it = items.find((i:any)=>i.id===ln.fgId); const total=(ln.backlockQty||0)+(ln.newOrderQty||0);
            return (
              <tr key={ln.fgId}>
                <td>{it?.code} - {it?.name}</td>
                <td><input className="input" type="number" step="0.001" value={ln.backlockQty} onChange={e=>{ const L=[...lines]; L[idx].backlockQty=Number(e.target.value); setLines(L); }}/></td>
                <td><input className="input" type="number" step="0.001" value={ln.newOrderQty} onChange={e=>{ const L=[...lines]; L[idx].newOrderQty=Number(e.target.value); setLines(L); }}/></td>
                <td>{total.toFixed(3)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="btn" onClick={save}>Save</button> {message && <span>{message}</span>}
    </div>
  );
}
