import React, { useEffect, useState } from 'react';
import ProductCard from '../componets/ProductCard';
import { apiFetch } from '../api';

export default function ProductsPage(){
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(()=> JSON.parse(localStorage.getItem('yantra_cart')) || []);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ fetchProducts(); }, []);

  useEffect(()=>{ localStorage.setItem('yantra_cart', JSON.stringify(cart)); }, [cart]);

  async function fetchProducts(){
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE || 'http://localhost:5200'}/api/products`);
      const data = await res.json();
      setProducts(Array.isArray(data)? data : []);
    } catch(err) {
      console.error('fetchProducts', err);
    } finally { setLoading(false); }
  }

  function addToCart(product){
    setCart(prev => {
      const found = prev.find(p => p.idyantra === product.idyantra);
      if (found) return prev.map(p => p.idyantra === product.idyantra ? {...p, quantity: Math.min((p.quantity||1)+1, product.stockQuantity||9999)} : p);
      return [...prev, {...product, quantity:1}];
    });
  }

  return (
    <section>
      <h2>Products</h2>
      {loading && <div className="muted">Loading...</div>}
      <div className="grid">
        {products.map(p => <ProductCard key={p.idyantra} p={p} onAdd={addToCart} />)}
      </div>
    </section>
  );
}
