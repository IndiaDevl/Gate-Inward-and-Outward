import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar({ customer, onLogout }) {
  return (
    <header className="navbar">
      <div className="brand"><Link to="/">Yantra — Store</Link></div>
      <nav>
        <Link to="/">Products</Link>
        <Link to="/cart">Cart</Link>
        {!customer && <Link to="/register">Register</Link>}
        {!customer && <Link to="/login">Login</Link>}
        {customer && (
          <>
            <span className="muted">Hi, {customer.fullName}</span>
            <button onClick={onLogout} className="small">Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}
