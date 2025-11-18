import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const card = {
    flex: 1,
    minHeight: 160,
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 2px 10px rgba(0,0,0,.05)"
  };

  return (
    <div>
      <h3>Choose an action</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Link to="/gate-in" style={{ textDecoration: "none", color: "inherit" }}>
          <div style={card}>
            <div style={{ fontSize: 48 }}>⬅️</div>
            <div>
              <h4>Gate In</h4>
              <p>Mark an entry as Active with remarks.</p>
            </div>
          </div>
        </Link>
        <Link to="/gate-out" style={{ textDecoration: "none", color: "inherit" }}>
          <div style={card}>
            <div style={{ fontSize: 48 }}>➡️</div>
            <div>
              <h4>Gate Out</h4>
              <p>Complete an entry and deactivate it.</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}