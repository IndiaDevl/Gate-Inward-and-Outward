import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage({ onRegistered }) {
  const [form, setForm] = useState({ fullName:'', email:'', password:'' });
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const API_BASE = 'http://localhost:5200';
      const url = `${API_BASE}/api/customers/register`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Register failed');
      if (onRegistered) onRegistered({ customerId: data.customerId, fullName: data.fullName, email: data.email });
      alert('Registered. You are now logged in.');
      navigate('/');
    } catch (err) {
      alert(err.message || 'Register error');
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={submit} className="form">
        <input value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} placeholder="Full name" required />
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" type="email" required />
        <input value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="Password" type="password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
