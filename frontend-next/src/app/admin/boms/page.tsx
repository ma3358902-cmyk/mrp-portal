'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function BOMs(){
  const [items, setItems] = useState<any[]>([]);
  const [rms, setRms] = useState<any[]>([]);
  const [boms, setBoms] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ fgId:'', normalLossPct:2, lines:[{ rmId:'', rmPct:85 }, { rmId:'', rmPct:10 }, { rmId:'', rmPct:3 }] });
  const load = async()=>{
    setItems(await api('/master/items'));
    setRms(await api('/master/raw'));
    setBoms(await api('/master/boms'));
  };
  useEffect(()=>{ load() }, []);
  const addLine = ()=> setForm({...form, lines:[...form.lines, { rmId:'', rmPct:0 }]});
  const save = async(e:any)=>{
    e.preventDefault();
    const payload = { fgId:Number(form.fgId), normalLossPct:Number(form.normalLossPct)/100, lines: form.lines.map((l:any)=>({ rmId:Number(l.rmId), rmPct:Number(l.rmPct)/100 })) };
    await api('/master/boms',{ method:'POST', body: JSON.stringify(payload) });
    setForm({ fgId:'', normalLossPct:2, lines:[{ rmId:'', rmPct:85 }] }); load();
  };
  return (
    <div className="card">
      <h2>BOMs</h2>
      <form onSubmit={save} className="grid">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <select className="input" value={form.fgId} onChange={e=>setForm({...form, fgId:e.target.value})}>
            <option value="">Select Finished Good</option>
            {items.map(i=>(<option key={i.id} value={i.id}>{i.code} - {i.name}</option>))}
          </select>
          <input className="input" type="number" step="0.01" placeholder="Normal Loss %" value={form.normalLossPct} onChange={e=>setForm({...form, normalLossPct:e.target.value})}/>
        </div>
        <div>
          <h4>Lines</h4>
          {form.lines.map((l:any, idx:number)=>(
            <div key={idx} style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:8}}>
              <select className="input" value={l.rmId} onChange={e=>{ const lines=[...form.lines]; lines[idx].rmId=e.target.value; setForm({...form, lines}); }}>
                <option value="">Raw Material</option>
                {rms.map((r:any)=>(<option key={r.id} value={r.id}>{r.code} - {r.name}</option>))}
              </select>
              <input className="input" type="number" step="0.01" placeholder="RM %" value={l.rmPct} onChange={e=>{ const lines=[...form.lines]; lines[idx].rmPct=e.target.value; setForm({...form, lines}); }}/>
            </div>
          ))}
          <button type="button" className="btn" onClick={addLine}>+ Add Line</button>
        </div>
        <button className="btn">Save BOM</button>
      </form>

      <h3 style={{marginTop:20}}>Existing BOMs</h3>
      <table className="table">
        <thead><tr><th>FG</th><th>Version</th><th>Normal Loss %</th><th>Lines</th></tr></thead>
        <tbody>
          {boms.map((b:any)=>(
            <tr key={b.id}>
              <td>{b.fg.code}</td><td>{b.version}</td><td>{(b.normalLossPct*100).toFixed(2)}</td>
              <td>{b.lines.map((l:any)=>`${l.rm.code} ${(l.rmPct*100).toFixed(1)}%`).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
