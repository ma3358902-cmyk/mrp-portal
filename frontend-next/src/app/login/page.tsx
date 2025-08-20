'use client';
import { useState } from 'react';
import { API_URL } from '@/lib/api';

export default function Login(){
  const [email, setEmail] = useState('admin@mrp.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string|null>(null);

  const submit = async(e:any)=>{
    e.preventDefault();
    setError(null);
    try{
      const res = await fetch(`${API_URL}/auth/login`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      });
      if(!res.ok) throw new Error(await res.text());
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href='/dashboard';
    }catch(err:any){ setError(err.message || 'Login failed'); }
  };

  return (
    <div className="card" style={{maxWidth:420, margin:'80px auto'}}>
      <h2>Sign in</h2>
      <form onSubmit={submit} className="grid">
        <div><label>Email</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)}/></div>
        <div><label>Password</label><input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)}/></div>
        {error && <div style={{color:'#ff8a8a'}}>{error}</div>}
        <button className="btn">Login</button>
      </form>
    </div>
  );
}
