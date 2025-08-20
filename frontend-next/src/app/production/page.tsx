'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Production(){
  const [items, setItems] = useState<any[]>([]);
  const [plants, setPlants] = useState<any[]>([]);
  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0,7));
  const [lines, setLines] = useState<any[]>([]);
  const [rmReqs, setRmReqs] = useState<any[]>([]);
  const [message, setMessage] = useState<string|null>(null);

  useEffect(()=>{ (async()=>{ setItems(await api('/master/items')); setPlants(await api('/master/plants')); })(); },[]);
  const addLine = ()=> setLines([...lines, { fgId: items[0]?.id, plantId: plants[0]?.id, plannedQty: 0 }]);
  const save = async()=>{
    setMessage(null); await api(`/plans/production/${month}`, { method:'POST', body: JSON.stringify({ lines }) });
    setMessage('Saved! Calculating RM requirements...');
    const r = await api(`/reports/rm-req/${month}`); setRmReqs(r);
  };

  return (
    <div className="card">
      <h2>Production Plan</h2>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div><label>Month</label><input className="input" type="month" value={month} onChange={e=>setMonth(e.target.value)} /></div>
        <div><button className="btn" onClick={addLine}>+ Add Line</button></div>
      </div>
      <table className="table"><thead><tr><th>FG</th><th>Plant</th><th>Planned Qty</th></tr></thead>
        <tbody>
          {lines.map((ln:any, idx:number)=>(
            <tr key={idx}>
              <td><select className="input" value={ln.fgId} onChange={e=>{ const L=[...lines]; L[idx].fgId=Number(e.target.value); setLines(L); }}>{items.map((i:any)=>(<option key={i.id} value={i.id}>{i.code}</option>))}</select></td>
              <td><select className="input" value={ln.plantId} onChange={e=>{ const L=[...lines]; L[idx].plantId=Number(e.target.value); setLines(L); }}>{plants.map((p:any)=>(<option key={p.id} value={p.id}>{p.code}</option>))}</select></td>
              <td><input className="input" type="number" step="0.001" value={ln.plannedQty} onChange={e=>{ const L=[...lines]; L[idx].plannedQty=Number(e.target.value); setLines(L); }}/></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn" onClick={save}>Save & Compute RM</button> {message && <span>{message}</span>}
      {rmReqs?.length>0 && (<div style={{marginTop:16}}>
        <h3>RM Requirements</h3>
        <table className="table"><thead><tr><th>RM Code</th><th>Required Qty</th></tr></thead>
          <tbody>{rmReqs.map((r:any, i:number)=>(<tr key={i}><td>{r.rmCode}</td><td>{r.requiredQty.toFixed(3)}</td></tr>))}</tbody>
        </table>
      </div>)}
    </div>
  );
}
