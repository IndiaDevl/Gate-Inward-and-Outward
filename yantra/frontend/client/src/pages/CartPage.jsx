import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CartPage({ customer }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('yantra_cart')) || []);
  const [shipping, setShipping] = useState('');
  const navigate = useNavigate();

  function updateQty(id, qty) {
    setCart(prev => { const updated = prev.map(p => p.idyantra === id ? {...p, quantity: Math.max(1, qty)} : p); localStorage.setItem('yantra_cart', JSON.stringify(updated)); return updated; });
  }
  function removeItem(id) { setCart(prev => { const updated = prev.filter(p => p.idyantra !== id); localStorage.setItem('yantra_cart', JSON.stringify(updated)); return updated; }); }

  async function checkoutAll() {
    if (!customer) return alert('Please register or login first');
    if (cart.length === 0) return alert('Cart empty');

    for (const item of cart) {
      const body = {
        customerId: customer.customerId,
        productId: item.idyantra,
        quantity: item.quantity || 1,
        paymentMode: 'COD',
        shippingAddress: shipping || customer.addressLine1 || customer.email
      };
      try {
              const API_BASE = 'http://localhost:5200';
         const url = `${API_BASE}/api/products`;
         const res = await fetch(url, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Order failed');
        console.log('Ordered', data);
      } catch (err) {
        console.error('Order failed for', item, err);
        alert('One or more orders failed (see console)');
      }
    }
    // clear cart
    localStorage.removeItem('yantra_cart');
    setCart([]);
    navigate('/');
  }

  return (
    <div>
      <h2>Cart ({cart.length})</h2>
      {cart.length === 0 && <div className="muted">Cart is empty</div>}
      {cart.map(item => (
        <div key={item.idyantra} className="cart-item">
          <img src={item.imageURL || 'https://via.placeholder.com/80'} alt={item.yantraName} />
          <div>{item.yantraName}</div>
          <div>Price: ₹{Number(item.productPrice).toFixed(2)}</div>
          <div>Qty: <input type="number" value={item.quantity} onChange={e=>updateQty(item.idyantra, Number(e.target.value)||1)} /></div>
          <div><button onClick={()=>removeItem(item.idyantra)} className="small danger">Remove</button></div>
        </div>
      ))}

      <div style={{marginTop:12}}>
        <input placeholder="Shipping address (optional)" value={shipping} onChange={e=>setShipping(e.target.value)} style={{width:'100%'}} />
        <div style={{marginTop:8}}>
          <button onClick={checkoutAll} className="primary">Place all orders</button>
        </div>
      </div>
    </div>
  );
}
