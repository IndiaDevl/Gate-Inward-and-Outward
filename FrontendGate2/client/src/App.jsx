import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import InitialRegistration from  "./pages/Gateinmovementin/InitialReg.jsx";
import QRScannerInward from "./pages/QRScanner/QRScanner.jsx";
import QRScannerInwardOut from "./pages/QRScanner/QRScannerout.jsx"; 
import CreateHeader from "./pages/Gateinmovementin/CreateHeader.jsx";
import MoveINHome from "./pages/Gateinmovementin/MoveINHome.jsx";
import MoveOutHome from "./pages/GateMovementOut/GateOutHome.jsx";
import MaterialINHome from "./pages/MaterialMovementIN/MaterialINHome.jsx";
import MaterialInward from "./pages/MaterialMovementIN/MaterialInward.jsx";
import MaterialOutward from "./pages/MaterialMovementIN/MaterialOutward.jsx";
import MaterialOutHome from "./pages/MaterialMovementOut/MaterialOutHome.jsx";  
import MaterialOut_Inward from "./pages/MaterialMovementOut/MatInward_out.jsx";
import MaterialOut_Outward from "./pages/MaterialMovementOut/MatOutward_out.jsx";
import Outward from "./pages/Gateinmovementin/Outward.jsx";
import GateOut_Inward from "./pages/GateMovementOut/GateEntryInward_Out.jsx";
import GateOut_Outward from "./pages/GateMovementOut/GateEntryOutward_Out.jsx";
import Internal_TransferPosting from "./pages/TransferPosting/emptytruckITP.jsx";
import Loaded_TransferPosting from "./pages/TransferPosting/loadedtruckITP.jsx";
import ITPHome from "./pages/TransferPosting/ITPHome.jsx";
import TruckRegistration from "./pages/TransferPosting/TruckReg.jsx";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const role = localStorage.getItem("role");
  if (!loggedIn) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "Yellow", fontWeight: "bold" }}>
        Your ID is not authorized for this page.
      </div>
    );
  }
  return children;
};

// Home Page Component
const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Gate Entry</h1>
        <nav className="main-nav">
          <Link to="/home" className="nav-link">Dashboard</Link>
          <Link to="/home/initial_registration" className="nav-link">Initial Registration</Link>
          <button 
            onClick={() => { localStorage.removeItem("loggedIn"); navigate("/"); }}
            className="logout-btn"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="home-main">
        <div className="dashboard-cards">
          <div className="card">
            <h3>Gate Entry Movement In</h3>
            <p>Gate movement in</p>
            <Link to="/home/movein" className="card-link">Gate Entry Movement IN</Link>
          </div>
          <div className="card">
            <h3>Material Movement Details IN</h3>
            <p>Gate Material Details</p>
            <Link to="/home/Materialin" className="card-link">Material Movement Details IN</Link>
          </div>
          <div className="card">
            <h3>Material Movement Details Out</h3>
            <p>Gate Material Details</p>
            <Link to="/home/materialout" className="card-link">Material Movement Details Out</Link>
          </div>
          <div className="card">
            <h3>Gate Entry Movement Out</h3>
            <p>Gate Movement Out Details</p>
            <Link to="/home/moveout" className="card-link">Gate Entry Movement Out</Link>
          </div>
            <div className="card">
            <h3>QR Scanner Inward</h3>
            <p>Inward</p>
            <Link to="/home/qrscanner/inward" className="card-link">QR Scanner Inward</Link>
          </div>
          <div className="card">
            <h3>QR Scanner Outward</h3>
            <p>Outward</p>
            <Link to="/home/qrscanner/outward" className="card-link">QR Scanner Outward</Link>
          </div>
          <div className="card">
            <h3>Internal Transfer Posting</h3>
            <p>ITP Details</p>
            <Link to="/home/transferposting" className="card-link">Internal Transfer Posting</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

// Login Page Component
const LoginPage = () => {
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === "admin" && pwd === "admin") {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("role", "admin");
      navigate("/home");
    } else if (user === "mm" && pwd === "mm") {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("role", "mm");
      navigate("/home");
    } else if (user === "sd" && pwd === "sd") {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("role", "sd");
      navigate("/home");
    } else {
      setError("Invalid credentials. Use admin/admin, mm/mm, or sd/sd");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Gate Entry System</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn">Login</button>
          <p className="help-text">Demo credentials: admin/admin, mm/mm, sd/sd</p>
        </form>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/home/initial_registration" element={<ProtectedRoute allowedRoles={["admin","mm"]}><InitialRegistration /></ProtectedRoute>} />
        <Route path="/home/create" element={<ProtectedRoute allowedRoles={["admin","mm"]}><CreateHeader /></ProtectedRoute>} />
        <Route path="/home/movein" element={<ProtectedRoute allowedRoles={["mm", "admin","sd"]}><MoveINHome /></ProtectedRoute>} />
        <Route path="/home/moveout" element={<ProtectedRoute allowedRoles={["sd", "admin","mm"]}><MoveOutHome /></ProtectedRoute>} />
        <Route path="/home/materialin" element={<ProtectedRoute allowedRoles={["mm", "admin","sd"]}><MaterialINHome /></ProtectedRoute>} />
        <Route path="/home/materialinward" element={<ProtectedRoute allowedRoles={["mm", "admin"]}><MaterialInward /></ProtectedRoute>} />
        <Route path="/home/materialoutward" element={<ProtectedRoute allowedRoles={["sd", "admin"]}><MaterialOutward /></ProtectedRoute>} />
        <Route path="/home/materialout" element={<ProtectedRoute allowedRoles={["sd", "admin","mm"]}><MaterialOutHome /></ProtectedRoute>} />
        <Route path="/home/materialout_inward" element={<ProtectedRoute allowedRoles={["admin","mm"]}><MaterialOut_Inward /></ProtectedRoute>} />
        <Route path="/home/movein/inward" element={<ProtectedRoute allowedRoles={["mm", "admin"]}><CreateHeader /></ProtectedRoute>} />
        <Route path="/home/movein/outward" element={<ProtectedRoute allowedRoles={["sd", "admin"]}><Outward /></ProtectedRoute>} />
        <Route path="/home/materialout_outward" element={<ProtectedRoute allowedRoles={["sd", "admin"]}><MaterialOut_Outward /></ProtectedRoute>} />
        <Route path="/home/gateout_inward" element={<ProtectedRoute allowedRoles={["mm", "admin"]}><GateOut_Inward /></ProtectedRoute>} />
        <Route path="/home/gateout_outward" element={<ProtectedRoute allowedRoles={["sd", "admin"]}><GateOut_Outward /></ProtectedRoute>} />
        <Route path="/home/qrscanner/inward" element={<ProtectedRoute allowedRoles={["mm", "admin"]}><QRScannerInward /></ProtectedRoute>} />
        <Route path="/home/qrscanner/outward" element={<ProtectedRoute allowedRoles={["mm", "admin"]}><QRScannerInwardOut /></ProtectedRoute>} />
        <Route path="/home/transferposting/itp" element={<ProtectedRoute allowedRoles={["sd", "admin"]}><Internal_TransferPosting /></ProtectedRoute>} />
        <Route path="/home/transferposting/loadeditp" element={<ProtectedRoute allowedRoles={["sd", "admin"]}><Loaded_TransferPosting /></ProtectedRoute>} />
        <Route path="/home/transferposting" element={<ProtectedRoute allowedRoles={["sd", "admin"]}><ITPHome /></ProtectedRoute>} />
        <Route path="/home/truckregistration" element={<ProtectedRoute allowedRoles={["admin","sd"]}><TruckRegistration /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}


