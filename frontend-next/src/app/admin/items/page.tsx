'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Items(){
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ code:'', name:'', category:'BOPP', subCategory:'', uom:'KG' });
  const load = async()=> setItems(await api('/master/items'));
  useEffect(()=>{ load() }, []);
  const create = async(e:any)=>{ e.preventDefault(); await api('/master/items',{ method:'POST', body: JSON.stringify(form)}); setForm({ code:'', name:'', category:'BOPP', subCategory:'', uom:'KG' }); load(); };
  return (
    <div className="card">
      <h2>Finished Goods</h2>
      <form onSubmit={create} className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
        <input className="input" placeholder="Code" value={form.code} onChange={e=>setForm({...form, code:e.target.value})}/>
        <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <select className="input" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}><option>BOPP</option><option>CPP</option><option>BOPET</option></select>
        <input className="input" placeholder="Sub-category" value={form.subCategory} onChange={e=>setForm({...form, subCategory:e.target.value})}/>
        <input className="input" placeholder="UOM" value={form.uom} onChange={e=>setForm({...form, uom:e.target.value})}/>
        <button className="btn">Add Item</button>
      </form>
      <table className="table"><thead><tr><th>Code</th><th>Name</th><th>Category</th><th>Sub</th><th>UOM</th><th>Status</th></tr></thead>
        <tbody>{items.map((i:any)=>(<tr key={i.id}><td>{i.code}</td><td>{i.name}</td><td>{i.category}</td><td>{i.subCategory}</td><td>{i.uom}</td><td>{i.status}</td></tr>))}</tbody>
      </table>
    </div>
  );
}
