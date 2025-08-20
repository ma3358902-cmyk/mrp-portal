'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Raw(){
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({ code:'', name:'', uom:'KG', supplier:'' });
  const load = async()=> setRows(await api('/master/raw'));
  useEffect(()=>{ load() }, []);
  const create = async(e:any)=>{ e.preventDefault(); await api('/master/raw',{ method:'POST', body: JSON.stringify(form)}); setForm({ code:'', name:'', uom:'KG', supplier:'' }); load(); };
  return (
    <div className="card">
      <h2>Raw Materials</h2>
      <form onSubmit={create} className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
        <input className="input" placeholder="Code" value={form.code} onChange={e=>setForm({...form, code:e.target.value})}/>
        <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input className="input" placeholder="UOM" value={form.uom} onChange={e=>setForm({...form, uom:e.target.value})}/>
        <input className="input" placeholder="Supplier" value={form.supplier} onChange={e=>setForm({...form, supplier:e.target.value})}/>
        <button className="btn">Add RM</button>
      </form>
      <table className="table"><thead><tr><th>Code</th><th>Name</th><th>UOM</th><th>Supplier</th><th>Status</th></tr></thead>
        <tbody>{rows.map((i:any)=>(<tr key={i.id}><td>{i.code}</td><td>{i.name}</td><td>{i.uom}</td><td>{i.supplier||''}</td><td>{i.status}</td></tr>))}</tbody>
      </table>
    </div>
  );
}
