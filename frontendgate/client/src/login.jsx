// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './login.css'; // <--- added import

// export default function LoginPage({ onLogin }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   // Front-end only credentials (change as needed)
//   const TEST_USER = {
//     email: 'test@local.test',
//     password: 'Test1234',
//     fullName: 'Test User',
//     customerId: 'local-test'
//   };

//   async function submit(e) {
//     e.preventDefault();
//     setError('');

//     // simple front-end validation
//     if (!email || !password) {
//       setError('Email and password required');
//       return;
//     }

//     // check against hardcoded credentials
//     if (email === TEST_USER.email && password === TEST_USER.password) {
//       const user = {
//         customerId: TEST_USER.customerId,
//         fullName: TEST_USER.fullName,
//         email: TEST_USER.email
//       };
//       localStorage.setItem('yantra_user', JSON.stringify(user));
//       if (onLogin) onLogin(user);
//       navigate('/'); // or '/list'
//       return;
//     }

//     // optionally allow any non-empty credentials for local dev:
//     // if you prefer that, uncomment below:
//     // const user = { customerId: 'dev-' + Date.now(), fullName: email.split('@')[0], email };
//     // localStorage.setItem('yantra_user', JSON.stringify(user));
//     // if (onLogin) onLogin(user);
//     // navigate('/');

//     setError('Invalid credentials');
//   }

//   return (
//     <div className="login-card">
//       <h2>Login</h2>
//       <form onSubmit={submit} className="flex-col">
//         <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required />
//         <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required />
//         {error && <div className="error">{error}</div>}
//         <div className="actions">
//           <button type="submit">Login</button>
//           <button type="button" className="secondary" onClick={()=>{ setEmail(TEST_USER.email); setPassword(TEST_USER.password); }}>Fill</button>
//         </div>
//       </form>
//       <p className="test-creds">Test creds: {TEST_USER.email} / {TEST_USER.password}</p>
//     </div>
//   );
// }



//Version 2

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './login.css';

// export default function LoginPage({ onLogin }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const TEST_USER = {
//     email: 'test@local.test',
//     password: 'Test1234',
//     fullName: 'Test User',
//     customerId: 'local-test'
//   };

//   async function submit(e) {
//     e.preventDefault();
//     setError('');

//     if (!email || !password) {
//       setError('Email and password required');
//       return;
//     }

//     if (email === TEST_USER.email && password === TEST_USER.password) {
//       const user = {
//         customerId: TEST_USER.customerId,
//         fullName: TEST_USER.fullName,
//         email: TEST_USER.email,
//         // IMPORTANT: default to false so mandatory flow triggers if you use it
//         hasAccess: false
//       };
//       localStorage.setItem('yantra_user', JSON.stringify(user));
//       if (onLogin) onLogin(user);
//       navigate('/mandatory-access'); // force mandatory flow
//       return;
//     }

//     setError('Invalid credentials');
//   }

//   return (
//     <div className="login-page">
//       {/* decorative animated blobs */}
//       <div className="bg-blobs" aria-hidden="true">
//         <span className="blob b1" />
//         <span className="blob b2" />
//         <span className="blob b3" />
//       </div>

//       <main className="login-wrap" role="main">
//         <section className="login-card" aria-labelledby="login-title">
//           <div className="brand">
//             {/* simple inline SVG logo / illustration */}
//             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//               <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#g1)"/>
//               <path d="M7 12h10M7 8h10M7 16h6" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
//               <defs>
//                 <linearGradient id="g1" x1="0" x2="1">
//                   <stop offset="0" stopColor="rgba(255,255,255,0.12)"/>
//                   <stop offset="1" stopColor="rgba(255,255,255,0.06)"/>
//                 </linearGradient>
//               </defs>
//             </svg>

//             <div className="brand-text">
//               <h2 id="login-title">Yantra — Gate Login</h2>
//               <small>Secure access to SAP Gate</small>
//             </div>
//           </div>

//           <form onSubmit={submit} className="form-col" noValidate>
//             <label className="field">
//               <span className="label-text">Email</span>
//               <input
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 placeholder="you@company.com"
//                 type="email"
//                 inputMode="email"
//                 aria-label="Email"
//                 required
//               />
//             </label>

//             <label className="field">
//               <span className="label-text">Password</span>
//               <input
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 type="password"
//                 aria-label="Password"
//                 required
//               />
//             </label>

//             {error && <div className="error" role="alert">{error}</div>}

//             <div className="actions">
//               <button className="btn primary" type="submit">Sign in</button>
//               <button
//                 type="button"
//                 className="btn ghost"
//                 onClick={() => {
//                   setEmail(TEST_USER.email);
//                   setPassword(TEST_USER.password);
//                 }}
//               >
//                 Fill demo
//               </button>
//             </div>

//             <div className="meta">
//               <p className="small">Demo credentials: <strong>{TEST_USER.email}</strong> / <strong>{TEST_USER.password}</strong></p>
//             </div>
//           </form>
//         </section>
//       </main>
//     </div>
//   );
// }


// Version 3 - Updated styling and structure
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // refs for blobs (for parallax)
  const blob1 = useRef(null);
  const blob2 = useRef(null);
  const blob3 = useRef(null);
  const shapesRef = useRef(null);

  const TEST_USER = {
    email: 'test@local.test',
    password: 'Test1234',
    fullName: 'Test User',
    customerId: 'local-test'
  };

  useEffect(() => {
    // mouse parallax handler
    let rafId = null;
    let lastX = 0;
    let lastY = 0;

    function onMove(e) {
      const x = e.clientX / window.innerWidth - 0.5; // -0.5 .. 0.5
      const y = e.clientY / window.innerHeight - 0.5;

      lastX = x;
      lastY = y;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const r1 = blob1.current;
        const r2 = blob2.current;
        const r3 = blob3.current;
        const shapes = shapesRef.current;

        if (r1) r1.style.transform = `translate3d(${lastX * -30}px, ${lastY * -18}px, 0) scale(1.02)`;
        if (r2) r2.style.transform = `translate3d(${lastX * 24}px, ${lastY * 12}px, 0) scale(1.01)`;
        if (r3) r3.style.transform = `translate3d(${lastX * -16}px, ${lastY * 22}px, 0) scale(1.02)`;
        if (shapes) shapes.style.transform = `translate3d(${lastX * 10}px, ${lastY * 6}px, 0)`;
      });
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', (ev) => {
      if (ev.touches && ev.touches[0]) onMove(ev.touches[0]);
    }, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password required');
      return;
    }

    if (email === TEST_USER.email && password === TEST_USER.password) {
      const user = {
        customerId: TEST_USER.customerId,
        fullName: TEST_USER.fullName,
        email: TEST_USER.email,
        hasAccess: false
      };
      localStorage.setItem('yantra_user', JSON.stringify(user));
      if (onLogin) onLogin(user);
      navigate('/mandatory-access');
      return;
    }

    setError('Invalid credentials');
  }

  return (
    <div className="login-page">
      {/* decorative animated blobs (with refs for parallax) */}
      <div className="bg-blobs" aria-hidden="true" ref={shapesRef}>
        <span className="blob b1" ref={blob1} />
        <span className="blob b2" ref={blob2} />
        <span className="blob b3" ref={blob3} />
        {/* rotating geometric shapes */}
        <svg className="shape s1" width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
          <polygon points="80,10 140,140 20,140" />
        </svg>
        <svg className="shape s2" width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="52" />
        </svg>
      </div>

      {/* subtle particle layer */}
      <div className="particle-layer" aria-hidden="true">
        <span className="dot d1" />
        <span className="dot d2" />
        <span className="dot d3" />
        <span className="dot d4" />
        <span className="dot d5" />
        <span className="dot d6" />
      </div>

      <main className="login-wrap" role="main">
        <section className="login-card" aria-labelledby="login-title">
          <div className="brand">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="6" fill="#ffffff" opacity="0.9"/>
              <path d="M7 12h10M7 8h10M7 16h6" stroke="#0b2545" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            <div className="brand-text">
              <h2 id="login-title">Yantra — Gate Login</h2>
              <small>Secure access to SAP Gate</small>
            </div>
          </div>

          <form onSubmit={submit} className="form-col" noValidate>
            <label className="field">
              <span className="label-text">Email</span>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                type="email"
                inputMode="email"
                aria-label="Email"
                required
              />
            </label>

            <label className="field">
              <span className="label-text">Password</span>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                aria-label="Password"
                required
              />
            </label>

            {error && <div className="error" role="alert">{error}</div>}

            <div className="actions">
              <button className="btn primary" type="submit">Sign in</button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  setEmail(TEST_USER.email);
                  setPassword(TEST_USER.password);
                }}
              >
                Fill demo
              </button>
            </div>

            <div className="meta">
              <p className="small">Demo credentials: <strong>{TEST_USER.email}</strong> / <strong>{TEST_USER.password}</strong></p>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
