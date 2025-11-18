// src/App.jsx
import React, { useState } from "react";

function normalizeItem(item) {
  // Map many possible SAP field names to our display fields.
  // Add more keys if your SAP metadata uses different names.
  return {
    po: item.PurchaseOrder ?? item.PurchaseOrderID ?? item.PO ?? item.PurchaseOrderNumber ?? "",
    item: item.PurchaseOrderItem ?? item.POItem ?? item.Item ?? item.PurchaseOrderItemID ?? "",
    description:
      item.PurchaseOrderItemText ??
      item.MaterialDescription ??
      item.ItemDescription ??
      item.Description ??
      "",
    qty:
      // OrderQuantity sometimes is an object {value:..} -> try to cover it
      (item.OrderQuantity && (item.OrderQuantity.Value ?? item.OrderQuantity.value ?? item.OrderQuantity)) ??
      item.Quantity ??
      item.ItemQuantity ??
      "",
    material: item.Material ?? item.MaterialNumber ?? "",
    netPrice:
      (item.NetPrice && (item.NetPrice.Value ?? item.NetPrice.value ?? item.NetPrice)) ??
      item.Price ??
      item.NetAmount ??
      "",
    currency: item.Currency ?? item.OrderCurrency ?? "",
    raw: item, // keep original for debug
  };
}

export default function App() {
  const [poNumber, setPoNumber] = useState("");
  const [poList, setPoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawResponse, setRawResponse] = useState(null);

  async function fetchPOList() {
    setLoading(true);
    setError("");
    setPoList([]);
    setRawResponse(null);

    try {
      const res = await fetch(`http://localhost:4600/api/purchaseorders?PurchaseOrder=${encodeURIComponent(poNumber)}`);
      const data = await res.json();

      // show raw response so you can inspect actual field names in browser
      setRawResponse(data);

      if (!res.ok) {
        setError(JSON.stringify(data, null, 2));
        return;
      }

      // candidates where items may be located
      let items = data.items ?? data.value ?? data.d?.results ?? data.d ?? [];

      // if single object (not array), wrap into array
      if (!Array.isArray(items)) items = [items];

      // Normalize mapping to display-friendly shape
      const normalized = items.map(normalizeItem);
      setPoList(normalized);
    } catch (err) {
      setError(err.message || "Failed to fetch PO");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 28, fontFamily: "'Inter', system-ui, -apple-system, Roboto, Arial" }}>
      <h2 style={{ color: "#123", marginBottom: 12 }}>PO Lookup</h2>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <input
          style={{ padding: "8px 10px", width: 260, borderRadius: 6, border: "1px solid #cfd8e6" }}
          placeholder="Enter PO number"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
        />
        <button
          onClick={fetchPOList}
          disabled={!poNumber || loading}
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            border: "none",
            background: "#2f6df6",
            color: "#fff",
            cursor: !poNumber || loading ? "not-allowed" : "pointer",
            boxShadow: "0 6px 14px rgba(47,109,246,0.12)",
          }}
        >
          {loading ? "Loading..." : "Show PO List"}
        </button>
      </div>

      {error && (
        <pre style={{ background: "#fff0f0", color: "#900", padding: 12, borderRadius: 8 }}>
          Error: {error}
        </pre>
      )}

      {poList.length > 0 ? (
        <table style={{ borderCollapse: "collapse", width: 640, marginTop: 12 }}>
          <thead>
            <tr>
              <th style={thStyle}>PO</th>
              <th style={thStyle}>Item</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Qty</th>
              <th style={thStyle}>Material</th>
              <th style={thStyle}>Net Price</th>
            </tr>
          </thead>
          <tbody>
            {poList.map((row, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{row.po}</td>
                <td style={tdStyle}>{row.item}</td>
                <td style={tdStyle}>{row.description}</td>
                <td style={tdStyle}>{row.qty}</td>
                <td style={tdStyle}>{row.material}</td>
                <td style={tdStyle}>{row.netPrice} {row.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <div style={{ color: "#666", marginTop: 8 }}>No items found yet.</div>
      )}

      {/* raw response inspector for debugging */}
      <div style={{ marginTop: 18 }}>
        <details style={{ background: "#fafafa", padding: 10, borderRadius: 8 }}>
          <summary style={{ cursor: "pointer" }}>Show raw server response (for debugging)</summary>
          <pre style={{ whiteSpace: "pre-wrap", maxHeight: 360, overflow: "auto" }}>{JSON.stringify(rawResponse, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
}

const thStyle = {
  border: "1px solid #c9cfe5",
  padding: "10px 12px",
  background: "#f7fbff",
  textAlign: "left",
  fontWeight: 700,
};
const tdStyle = {
  border: "1px solid #e7eaf6",
  padding: "10px 12px",
};
