import React, { useState } from 'react';

const API_BASE = 'http://localhost:5200';

export default function CreateProductPage() {
  const [form, setForm] = useState({
    yantraName: '',
    brandName: '',
    brandDesc: '',
    brandRate: '',
    productCategory: '',
    productSize: '',
    productColor: '',
    productPrice: '',
    discountPercent: '',
    stockQuantity: '',
    imageURL: '',
    launchDate: '',
    isAvailable: 1
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const url = `${API_BASE}/api/products/create`;
      const body = {
        ...form,
        // cast number-like fields to numbers (optional)
        brandRate: form.brandRate ? Number(form.brandRate) : null,
        productPrice: form.productPrice ? Number(form.productPrice) : 0,
        discountPercent: form.discountPercent ? Number(form.discountPercent) : 0,
        stockQuantity: form.stockQuantity ? parseInt(form.stockQuantity, 10) : 0,
        isAvailable: form.isAvailable ? 1 : 0,
        launchDate: form.launchDate || null
      };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Create failed');
      setMessage({ type: 'success', text: `Product created (id ${data.idyantra})` });
      // reset some fields
      setForm({
        yantraName: '',
        brandName: '',
        brandDesc: '',
        brandRate: '',
        productCategory: '',
        productSize: '',
        productColor: '',
        productPrice: '',
        discountPercent: '',
        stockQuantity: '',
        imageURL: '',
        launchDate: '',
        isAvailable: 1
      });
    } catch (err) {
      console.error('Create product error', err);
      setMessage({ type: 'error', text: err.message || 'Server error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2>Create Product</h2>
      {message && (
        <div style={{ padding: 8, marginBottom: 12, background: message.type === 'error' ? '#ffdede' : '#e6ffed' }}>
          {message.text}
        </div>
      )}
      <form onSubmit={submit}>
        <label>Product name (yantraName)</label>
        <input required value={form.yantraName} onChange={e => setForm({ ...form, yantraName: e.target.value })} />

        <label>Brand name</label>
        <input required value={form.brandName} onChange={e => setForm({ ...form, brandName: e.target.value })} />

        <label>Description</label>
        <textarea value={form.brandDesc} onChange={e => setForm({ ...form, brandDesc: e.target.value })} />

        <label>Brand rate</label>
        <input value={form.brandRate} onChange={e => setForm({ ...form, brandRate: e.target.value })} />

        <label>Category</label>
        <input value={form.productCategory} onChange={e => setForm({ ...form, productCategory: e.target.value })} />

        <label>Size</label>
        <input value={form.productSize} onChange={e => setForm({ ...form, productSize: e.target.value })} />

        <label>Color</label>
        <input value={form.productColor} onChange={e => setForm({ ...form, productColor: e.target.value })} />

        <label>Price</label>
        <input value={form.productPrice} onChange={e => setForm({ ...form, productPrice: e.target.value })} />

        <label>Discount %</label>
        <input value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: e.target.value })} />

        <label>Stock Quantity</label>
        <input value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} />

        <label>Image URL</label>
        <input value={form.imageURL} onChange={e => setForm({ ...form, imageURL: e.target.value })} />

        <label>Launch date (YYYY-MM-DD or ISO)</label>
        <input value={form.launchDate} onChange={e => setForm({ ...form, launchDate: e.target.value })} placeholder="2025-10-10 12:00:00" />

        <label>
          <input type="checkbox" checked={!!form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked ? 1 : 0 })} />
          Available
        </label>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Product'}</button>
        </div>
      </form>
      <p style={{ marginTop: 18, color: '#666' }}>API: {API_BASE}/api/products/create</p>
    </div>
  );
}
