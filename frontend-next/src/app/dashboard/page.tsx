'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Dashboard(){
  const [name, setName] = useState('User'); const [role, setRole] = useState('');
  useEffect(()=>{
    const u = localStorage.getItem('user'); if(u){ const j = JSON.parse(u); setName(j.name); setRole(j.role); }
  },[]);

  const logout = ()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/login'; };

  return (
    <div>
      <div className="nav card">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/demand">Demand</Link>
        <Link href="/supply">Supply</Link>
        <Link href="/production">Production</Link>
        <Link href="/rm">RM Availability</Link>
        <Link href="/admin">Admin</Link>
        <div className="right"><button className="btn" onClick={logout}>Logout</button></div>
      </div>
      <div className="card">
        <h2>Welcome, {name}</h2>
        <p>Role: {role}</p>
        <small className="muted">Use the nav above to work on monthly plans and masters.</small>
      </div>
    </div>
  );
}
