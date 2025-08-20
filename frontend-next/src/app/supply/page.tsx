'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Supply(){
  const [items, setItems] = useState<any[]>([]);
  const [plants, setPlants] = useState<any[]>([]);
  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0,7));
  const [lines, setLines] = useState<any[]>([]);
  const [message, setMessage] = useState<string|null>(null);

  useEffect(()=>{ (async()=>{
    const it = await api('/master/items'); const pl = await api('/master/plants'); setItems(it); setPlants(pl);
    setLines(it.map((i:any)=>{
      const plMatch = pl.find((p:any)=> (i.category==='BOPP' && (p.code==='IPAK'||p.code==='GPAK')) || (i.category==='CPP' && p.code==='CPAK') || (i.category==='BOPET' && p.code==='PETPAK'));
      return { fgId:i.id, plantId: plMatch?.id || pl[0]?.id, openingStock:0, productionQty:0 };
    }));
  })(); },[]);

  const save = async()=>{ setMessage(null); await api(`/plans/supply/${month}`, { method:'POST', body: JSON.stringify({ lines }) }); setMessage('Saved'); };

  return (
    <div className="card">
      <h2>Supply Plan</h2>
      <div><label>Month</label><input className="input" type="month" value={month} onChange={e=>setMonth(e.target.value)} /></div>
      <table className="table"><thead><tr><th>Item</th><th>Plant</th><th>Opening</th><th>Production</th><th>Total</th></tr></thead>
        <tbody>
          {lines.map((ln:any, idx:number)=>{
            const it = items.find((i:any)=>i.id===ln.fgId); const total=(ln.openingStock||0)+(ln.productionQty||0);
            const eligible = plants.filter((p:any)=> (it?.category==='BOPP' && (p.code==='IPAK'||p.code==='GPAK')) || (it?.category==='CPP' && p.code==='CPAK') || (it?.category==='BOPET' && p.code==='PETPAK'));
            return (
              <tr key={idx}>
                <td>{it?.code} - {it?.name}</td>
                <td><select className="input" value={ln.plantId} onChange={e=>{ const L=[...lines]; L[idx].plantId=Number(e.target.value); setLines(L); }}>{eligible.map((p:any)=>(<option key={p.id} value={p.id}>{p.code}</option>))}</select></td>
                <td><input className="input" type="number" step="0.001" value={ln.openingStock} onChange={e=>{ const L=[...lines]; L[idx].openingStock=Number(e.target.value); setLines(L); }}/></td>
                <td><input className="input" type="number" step="0.001" value={ln.productionQty} onChange={e=>{ const L=[...lines]; L[idx].productionQty=Number(e.target.value); setLines(L); }}/></td>
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
