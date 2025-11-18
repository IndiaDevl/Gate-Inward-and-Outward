import React, { useState } from "react";
import { api } from "../api";

export default function GateOut() {
  const [entryId, setEntryId] = useState("");
  const [securityName, setSecurityName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await api.gateOut({ entryId, securityName, remarks });
      setMsg({ type: "ok", text: res.message || "Gate Out done" });
      setEntryId(""); setSecurityName(""); setRemarks("");
    } catch (err) {
      setMsg({ type: "err", text: err.body?.error || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Gate Out</h3>
      <form onSubmit={submit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <label>
          Entry ID (SAP UUID)
          <input value={entryId} onChange={(e)=>setEntryId(e.target.value)} required
            placeholder="e.g. 42010a0b-8285-1fe0-a8d6-cba6e4348819"
            style={{ width: "100%", padding: 8 }}/>
        </label>
        <label>
          Security Name
          <input value={securityName} onChange={(e)=>setSecurityName(e.target.value)} required
            style={{ width: "100%", padding: 8 }}/>
        </label>
        <label>
          Remarks
          <input value={remarks} onChange={(e)=>setRemarks(e.target.value)}
            style={{ width: "100%", padding: 8 }}/>
        </label>

        <button disabled={loading} type="submit" style={{ padding: "10px 14px" }}>
          {loading ? "Processing..." : "Gate Out"}
        </button>

        {msg && (
          <div style={{
            padding: 10, borderRadius: 8,
            background: msg.type === "ok" ? "#e8f7ed" : "#fdecea",
            color: msg.type === "ok" ? "#0a6" : "#b00020"
          }}>{msg.text}</div>
        )}
      </form>
    </div>
  );
}
