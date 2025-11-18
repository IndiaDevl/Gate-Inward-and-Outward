import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ p, onAdd }) {
  return (
    <div className="card">
      <Link to={`/product/${p.idyantra}`}><img src={p.imageURL || 'https://via.placeholder.com/300'} alt={p.yantraName} /></Link>
      <h3>{p.yantraName}</h3>
      <p className="muted">{(p.brandDesc || '').slice(0,80)}</p>
      <div className="meta">
        <div>Price: ₹{Number(p.productPrice).toFixed(2)}</div>
        <div>Stock: {p.stockQuantity ?? '—'}</div>
      </div>
      <div className="actions">
        <button onClick={() => onAdd(p)} disabled={!p.isAvailable}>Add to cart</button>
        <Link to={`/product/${p.idyantra}`} className="small">View</Link>
      </div>
    </div>
  );
}
