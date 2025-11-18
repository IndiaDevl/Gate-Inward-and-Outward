// import React, { useState } from "react";
// import { Routes, Route, Link, Navigate } from "react-router-dom";
// import Home from "./pages/Homee";
// import GateIn from "./pages/GateIn";
// import GateOut from "./pages/GateOut";
// import List from "./pages/List";
// import Create from "./pages/Create";
// import Details from "./pages/Details";
// import dashboard from "./pages/dashreport";
// import LoginPage from "./login.jsx";

// function ProtectedRoute({ children }) {
//   const user = JSON.parse(localStorage.getItem("yantra_user"));
//   if (!user) return <Navigate to="/register-or-login" replace />;
//   return children;
// }

// export default function App() {
//   const [user, setUser] = useState(
//     () => JSON.parse(localStorage.getItem("yantra_user")) || null
//   );

//   return (
//     <div style={{ fontFamily: "Arial, sans-serif", padding: 20 }}>
//       <header
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: 20,
//         }}
//       >
//         <h2>SAP Gate — React</h2>
//         <nav style={{ display: "flex", gap: 12 }}>
//           <Link to="/">🏠 Home</Link>
//           <Link to="/list">📋 List</Link>
//           <Link to="/dashboard">DashBourd</Link>
//           <Link to="/create">➕ Create</Link>
//           <Link to="/gate-in">⬅️ Gate In</Link>
//           <Link to="/gate-out">➡️ Gate Out</Link>
//         </nav>
//       </header>

//       <Routes>
//         <Route
//           path="/register-or-login"
//           element={<LoginPage onLogin={(u) => setUser(u)} />}
//         />

//         {/* public example route */}
//         <Route path="/public" element={<div style={{ padding: 20 }}>Public page</div>} />

//         {/* protected Home at root */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//         />

//         {/* protected List */}
//         <Route
//           path="/list"
//           element={
//             <ProtectedRoute>
//               <List />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />

//         <Route
//           path="/create"
//           element={
//             <ProtectedRoute>
//               <Create />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/gate-in"
//           element={
//             <ProtectedRoute>
//               <GateIn />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/gate-out"
//           element={
//             <ProtectedRoute>
//               <GateOut />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/details/:id"
//           element={
//             <ProtectedRoute>
//               <Details />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="*"
//           element={<Navigate to={user ? "/list" : "/register-or-login"} replace />}
//         />
//       </Routes>
//     </div>
//   );
// }


// Version 2 wokring fine but logic page access issue

import React, { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Homee";
import GateIn from "./pages/GateIn";
import GateOut from "./pages/GateOut";
import List from "./pages/List";
import Create from "./pages/Create";
import Details from "./pages/Details";
import Dashboard from "./pages/dashreport"; // Fixed import
import CustomReport from "./pages/customreport.jsx";
import Audit from "./pages/audit.jsx";
import QRCode from "./pages/QRCode.jsx";
import LoginPage from "./login.jsx";

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("yantra_user"));
  if (!user) return <Navigate to="/register-or-login" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("yantra_user")) || null
  );

  const handleLogout = () => {
    localStorage.removeItem("yantra_user");
    setUser(null);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          paddingBottom: 10,
          borderBottom: "1px solid #eee",
        }}
      >
        <h2 style={{ margin: 0 }}>SAP Gate — React</h2>
        <nav style={{ display: "flex", gap: 15, alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#007acc" }}>🏠 Home</Link>
          <Link to="/list" style={{ textDecoration: "none", color: "#007acc" }}>📋 List</Link>
          <Link to="/dashboard" style={{ textDecoration: "none", color: "#007acc" }}>📊 Dashboard</Link>
          <Link to="/customreport" style={{ textDecoration: "none", color: "#007acc" }}>📊 Custom Report</Link>
          <Link to="/audit" style={{ textDecoration: "none", color: "#007acc" }}>📊 Audit</Link>
          <Link to="/qrcode" style={{ textDecoration: "none", color: "#007acc" }}>📊 QRCode</Link>
          <Link to="/create" style={{ textDecoration: "none", color: "#007acc" }}>➕ Create</Link>
          <Link to="/gate-in" style={{ textDecoration: "none", color: "#007acc" }}>⬅️ Gate In</Link>
          <Link to="/gate-out" style={{ textDecoration: "none", color: "#007acc" }}>➡️ Gate Out</Link>
          
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "0.9em", color: "#666" }}>
                👤 {user.username || user.email}
              </span>
              <button 
                onClick={handleLogout}
                style={{
                  padding: "5px 10px",
                  background: "#ff4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.8em"
                }}
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route
            path="/register-or-login"
            element={<LoginPage onLogin={(u) => setUser(u)} />}
          />

          <Route 
            path="/public" 
            element={
              <div style={{ padding: 20 }}>
                <h3>Public Page</h3>
                <p>This page is accessible without login</p>
              </div>
            } 
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/list"
            element={
              <ProtectedRoute>
                <List />
              </ProtectedRoute>
            }
          />

          {/* ✅ FIXED: Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

                    <Route
            path="/customreport"
            element={
              <ProtectedRoute>
                <CustomReport />
              </ProtectedRoute>
            }
          />

            <Route
            path="/audit"
            element={
              <ProtectedRoute>
                <Audit/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/qrcode"
            element={
              <ProtectedRoute>
                <QRCode/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gate-in"
            element={
              <ProtectedRoute>
                <GateIn />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gate-out"
            element={
              <ProtectedRoute>
                <GateOut />
              </ProtectedRoute>
            }
          />

          <Route
            path="/details/:id"
            element={
              <ProtectedRoute>
                <Details />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/register-or-login"} replace />}
          />
        </Routes>
      </main>
    </div>
  );
}


