import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email:'', password:'' });
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const API_BASE = 'http://localhost:5200';
      const url = `${API_BASE}/api/customers/login`;
      const res = await fetch(url, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Login failed');
      onLogin(data);
      alert('Login successful');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      alert(err.message || 'Login error — check backend logs and network tab');
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
