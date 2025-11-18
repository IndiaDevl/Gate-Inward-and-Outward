import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function List() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.list();
        setRows(data);
      } catch (e) {
        setErr(e.body?.error || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading…</div>;
  if (err) return <div style={{ color: "crimson" }}>{err}</div>;

  return (
    <div>
      <h3>Gate Entries</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {["id","spaceMatrixNumber","poNumber","invoiceNumber","supplierName","statusText","active"].map(h=>(
                <th key={h} style={{borderBottom:"1px solid #ddd", textAlign:"left", padding:"8px"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{padding:8}}>{r.id}</td>
                <td style={{padding:8}}>{r.spaceMatrixNumber}</td>
                <td style={{padding:8}}>{r.poNumber}</td>
                <td style={{padding:8}}>{r.invoiceNumber}</td>
                <td style={{padding:8}}>{r.supplierName}</td>
                <td style={{padding:8}}>{r.statusText}</td>
                <td style={{padding:8}}>{String(r.active)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
