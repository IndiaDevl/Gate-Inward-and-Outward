// import React, { useEffect, useState } from 'react';
// import './App.css';

// const API_BASE ='http://localhost:5200';

// function App() {
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState(() => {
//     try { return JSON.parse(localStorage.getItem('yantra_cart')) || []; } catch { return []; }
//   });
//   const [customer, setCustomer] = useState(() => {
//     try { return JSON.parse(localStorage.getItem('yantra_customer')) || null; } catch { return null; }
//   });

//   const [reg, setReg] = useState({ fullName:'', email:'', password:'' });
//   const [loginCred, setLoginCred] = useState({ email:'', password:'' });
//   const [shippingAddr, setShippingAddr] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState(null);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('yantra_cart', JSON.stringify(cart));
//   }, [cart]);

//   useEffect(() => {
//     localStorage.setItem('yantra_customer', JSON.stringify(customer));
//   }, [customer]);

//   async function fetchProducts() {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE}/api/products`);
//       const data = await res.json();
//       setProducts(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error(err);
//       setMsg({ type: 'error', text: 'Could not fetch products' });
//     } finally {
//       setLoading(false);
//     }
//   }

//   function addToCart(product) {
//     setCart(prev => {
//       const found = prev.find(p => p.idyantra === product.idyantra);
//       if (found) {
//         return prev.map(p => p.idyantra === product.idyantra ? { ...p, quantity: Math.min((p.quantity || 1) + 1, product.stockQuantity || 9999) } : p);
//       }
//       return [...prev, { ...product, quantity: 1 }];
//     });
//     setMsg({ type: 'success', text: `${product.yantraName} added to cart` });
//   }

//   function updateQty(productId, qty) {
//     setCart(prev => prev.map(p => p.idyantra === productId ? { ...p, quantity: Math.max(1, qty) } : p));
//   }

//   function removeFromCart(productId) {
//     setCart(prev => prev.filter(p => p.idyantra !== productId));
//   }

//   async function registerCustomer(e) {
//     e.preventDefault();
//     if (!reg.fullName || !reg.email || !reg.password) {
//       setMsg({ type: 'error', text: 'Name, email and password required' });
//       return;
//     }
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE}/customers/register`, {
//         method: 'POST',
//         headers: {'Content-Type':'application/json'},
//         body: JSON.stringify(reg)
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setMsg({ type: 'error', text: data.error || 'Registration failed' });
//         return;
//       }
//       setCustomer({ customerId: data.customerId, fullName: data.fullName, email: data.email });
//       setMsg({ type: 'success', text: 'Registered successfully' });
//     } catch (err) {
//       console.error(err);
//       setMsg({ type: 'error', text: 'Registration error' });
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function loginCustomer(e) {
//     e.preventDefault();
//     if (!loginCred.email || !loginCred.password) {
//       setMsg({ type: 'error', text: 'Email and password required' });
//       return;
//     }
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE}/customers/login`, {
//         method: 'POST',
//         headers: {'Content-Type':'application/json'},
//         body: JSON.stringify(loginCred)
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setMsg({ type: 'error', text: data.error || 'Login failed' });
//         return;
//       }
//       setCustomer(data);
//       setMsg({ type: 'success', text: `Welcome back, ${data.fullName}` });
//     } catch (err) {
//       console.error(err);
//       setMsg({ type: 'error', text: 'Login error' });
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function placeOrderForItem(item) {
//     if (!customer) {
//       setMsg({ type: 'error', text: 'Please register or login before placing orders' });
//       return null;
//     }
//     try {
//       setLoading(true);
//       const body = {
//         customerId: customer.customerId,
//         productId: item.idyantra,
//         quantity: item.quantity || 1,
//         paymentMode: 'COD',
//         shippingAddress: shippingAddr || customer.addressLine1 || customer.email
//       };
//       const res = await fetch(`${API_BASE}/orders`, {
//         method: 'POST',
//         headers: {'Content-Type':'application/json'},
//         body: JSON.stringify(body)
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         return { ok: false, error: data.error || 'Order failed' };
//       }
//       return { ok: true, orderId: data.orderId };
//     } catch (err) {
//       console.error(err);
//       return { ok: false, error: 'Order request error' };
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function checkoutItem(item) {
//     const result = await placeOrderForItem(item);
//     if (result && result.ok) {
//       setMsg({ type: 'success', text: `Order placed (ID: ${result.orderId})` });
//       removeFromCart(item.idyantra);
//       await fetchProducts();
//     } else {
//       setMsg({ type: 'error', text: result.error || 'Order failed' });
//     }
//   }

//   // Place all items in cart (creates one order per cart item)
//   async function checkoutAll() {
//     if (!customer) {
//       setMsg({ type: 'error', text: 'Please register/login first' });
//       return;
//     }
//     if (cart.length === 0) {
//       setMsg({ type: 'error', text: 'Cart is empty' });
//       return;
//     }
//     setLoading(true);
//     const results = [];
//     for (const item of cart) {
//       const res = await placeOrderForItem(item);
//       results.push({ item, res });
//     }
//     setLoading(false);

//     const succeeded = results.filter(r => r.res && r.res.ok);
//     const failed = results.filter(r => !r.res || !r.res.ok);

//     if (succeeded.length) {
//       // remove succeeded items from cart
//       setCart(prev => prev.filter(p => !succeeded.find(s => s.item.idyantra === p.idyantra)));
//       await fetchProducts();
//     }

//     let msgText = '';
//     if (succeeded.length) msgText += `${succeeded.length} item(s) ordered successfully. `;
//     if (failed.length) msgText += `${failed.length} item(s) failed. See console for details.`;
//     setMsg({ type: failed.length ? 'error' : 'success', text: msgText });
//     console.log('checkoutAll results', results);
//   }

//   function logout() {
//     setCustomer(null);
//     localStorage.removeItem('yantra_customer');
//     setMsg({ type: 'success', text: 'Logged out' });
//   }

//   return (
//     <div className="app">
//       <header>
//         <h1>Yantra — Store</h1>
//         <div className="header-right">
//           {customer ? (
//             <div>
//               <span>Hi, <b>{customer.fullName}</b></span>
//               <button onClick={logout} className="small">Logout</button>
//             </div>
//           ) : (
//             <span className="muted">Not logged in</span>
//           )}
//         </div>
//       </header>

//       <main>
//         <section className="products">
//           <h2>Products</h2>
//           {loading && <div className="muted">Loading...</div>}
//           <div className="grid">
//             {products.length === 0 && !loading && <div>No products found</div>}
//             {products.map(p => (
//               <div key={p.idyantra} className="card">
//                 <img src={p.imageURL || 'https://via.placeholder.com/300'} alt={p.yantraName} />
//                 <h3>{p.yantraName}</h3>
//                 <p className="muted">{p.brandDesc?.slice(0, 80)}</p>
//                 <div className="meta">
//                   <div>Price: ₹{Number(p.productPrice).toFixed(2)}</div>
//                   <div>Stock: {p.stockQuantity ?? '—'}</div>
//                 </div>
//                 <div className="actions">
//                   <button disabled={!p.isAvailable} onClick={()=>addToCart(p)}>Add to cart</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         <aside className="sidebar">
//           <div className="block">
//             <h3>Cart ({cart.length})</h3>
//             {cart.length === 0 && <div className="muted">Cart is empty</div>}
//             {cart.map(item => (
//               <div key={item.idyantra} className="cart-item">
//                 <img src={item.imageURL || 'https://via.placeholder.com/80'} alt={item.yantraName}/>
//                 <div className="ci-info">
//                   <div className="ci-title">{item.yantraName}</div>
//                   <div>Price: ₹{Number(item.productPrice).toFixed(2)}</div>
//                   <div>
//                     Qty: <input type="number" value={item.quantity} min="1" max={item.stockQuantity || 9999}
//                                 onChange={(e)=>updateQty(item.idyantra, Number(e.target.value) || 1)} />
//                   </div>
//                 </div>
//                 <div className="ci-actions">
//                   <button onClick={()=>checkoutItem(item)}>Checkout</button>
//                   <button className="small danger" onClick={()=>removeFromCart(item.idyantra)}>Remove</button>
//                 </div>
//               </div>
//             ))}

//             {cart.length > 0 && (
//               <div style={{marginTop:10}}>
//                 <button onClick={checkoutAll} className="primary">Place all orders</button>
//               </div>
//             )}
//           </div>

//           <div className="block">
//             <h3>Register</h3>
//             {!customer ? (
//               <form onSubmit={registerCustomer} className="form">
//                 <input placeholder="Full name" value={reg.fullName} onChange={e=>setReg({...reg, fullName:e.target.value})} required />
//                 <input placeholder="Email" value={reg.email} onChange={e=>setReg({...reg, email:e.target.value})} required />
//                 <input placeholder="Password" type="password" value={reg.password} onChange={e=>setReg({...reg, password:e.target.value})} required />
//                 <button type="submit">Register</button>
//               </form>
//             ) : (
//               <div className="muted">Registered as <b>{customer.fullName}</b> ({customer.email})</div>
//             )}
//           </div>

//           <div className="block">
//             <h3>Login</h3>
//             <form onSubmit={loginCustomer} className="form">
//               <input placeholder="Email" value={loginCred.email} onChange={e=>setLoginCred({...loginCred, email:e.target.value})} />
//               <input placeholder="Password" type="password" value={loginCred.password} onChange={e=>setLoginCred({...loginCred, password:e.target.value})} />
//               <button type="submit">Login</button>
//             </form>
//           </div>

//           <div className="block">
//             <h3>Shipping address</h3>
//             <input placeholder="Address for orders" value={shippingAddr} onChange={e=>setShippingAddr(e.target.value)} />
//             <div className="muted small">If empty, email or customer address is used</div>
//           </div>

//           <div className="block">
//             <h3>Quick actions</h3>
//             <button onClick={fetchProducts}>Refresh products</button>
//             <button onClick={()=>{ setCart([]); localStorage.removeItem('yantra_cart'); setMsg({type:'success', text:'Cart cleared'}); }}>Clear cart</button>
//           </div>

//           <div className="block">
//             <h3>Messages</h3>
//             {msg ? <div className={msg.type === 'error' ? 'msg error' : 'msg success'}>{msg.text}</div> : <div className="muted">No messages</div>}
//           </div>
//         </aside>
//       </main>

//       <footer>
//         <small>Yantra demo frontend • API: {API_BASE}</small>
//       </footer>
//     </div>
//   );
// }

// export default App;









// import React from 'react';
// import { Routes, Route, useNavigate } from 'react-router-dom';

// function Home() {
//   const navigate = useNavigate();
//   return (
//     <div>
//       <h2>Home</h2>
//       <button onClick={() => navigate('/about')}>Go to About</button>
//     </div>
//   );
// }
// function About() {
//   return <h2>About</h2>;
// }

// export default function App() {
//   return (
//     <div>
//       <h1>My App</h1>
//       <Routes>
//         <Route path="/" element={<Home/>} />
//         <Route path="/about" element={<About/>} />
//       </Routes>
//     </div>
//   );
// }



import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './componets/NavBar';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CreateProductPage from './pages/CreateProductPage';
import { API_BASE } from './api';

function App() {
  const [customer, setCustomer] = useState(() => {
    try { return JSON.parse(localStorage.getItem('yantra_customer')) || null; } catch { return null; }
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('yantra_customer', JSON.stringify(customer));
  }, [customer]);

  function logout() {
    setCustomer(null);
    localStorage.removeItem('yantra_customer');
    navigate('/');
  }

  return (
    <div className="app">
      <NavBar customer={customer} onLogout={logout} />
      <main>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage customer={customer} />} />
          <Route path="/register" element={<RegisterPage onRegistered={setCustomer} />} />
          <Route path="/login" element={<LoginPage onLogin={setCustomer} />} />
          <Route path="/createproduct" element={<CreateProductPage customer={customer} />} />
        </Routes>
      </main>
      <footer className="footer">Yantra • API: {API_BASE}</footer>
    </div>
  );
}

export default App;
