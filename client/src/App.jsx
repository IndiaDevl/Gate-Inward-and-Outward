import React, { useEffect, useState } from "react";

// Default API base - change if your backend runs on another origin
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000"; // set to http://localhost:5000 if needed

export default function GateApp() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [securityName, setSecurityName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [opMessage, setOpMessage] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    setLoading(true);
    setOpMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/gate-entries`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
      setOpMessage({ type: "error", text: `Failed to load entries: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }

  function pickEntry(e) {
    setSelected(e);
    setOpMessage(null);
  }

  async function doOperation(path) {
    if (!selected) {
      setOpMessage({ type: "error", text: "Please select an entry first." });
      return;
    }
    setOpMessage({ type: "info", text: "Working..." });
    try {
      const payload = { entryId: selected.id, securityName: securityName || "Security", remarks: remarks || "" };
      const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || j.message || res.statusText);
      setOpMessage({ type: "success", text: j.message || "Operation successful" });
      // refresh
      setTimeout(fetchEntries, 700);
    } catch (err) {
      console.error(err);
      setOpMessage({ type: "error", text: `Error: ${err.message}` });
    }
  }

  async function createSample() {
    setCreating(true);
    try {
      const sample = {
        spaceMatrixNumber: 'SM' + Date.now().toString().slice(-6),
        description: 'Frontend sample',
        spaceMatrixName: 'Studio',
        poNumber: 'PO' + Math.floor(Math.random() * 9999),
        invoiceNumber: 'INV' + Math.floor(Math.random() * 9999),
        supplierCode: 'SUP' + Math.floor(Math.random() * 99),
        supplierName: 'Demo Supplier',
        plant: '2110',
      };
      const res = await fetch(`${API_BASE}/api/gate-entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sample),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || j.message || res.statusText);
      setOpMessage({ type: "success", text: `Created entry ${j.id || "OK"}` });
      fetchEntries();
    } catch (err) {
      console.error(err);
      setOpMessage({ type: "error", text: `Create failed: ${err.message}` });
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">SAP Gate — React Frontend</h1>
          <div className="flex gap-2">
            <button onClick={fetchEntries} className="px-3 py-1 rounded bg-indigo-100 text-indigo-700">Refresh</button>
            <button onClick={createSample} disabled={creating} className="px-3 py-1 rounded bg-indigo-600 text-white">{creating? 'Creating...': 'Create sample'}</button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-8 bg-white rounded shadow p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm text-gray-600">Gate entries fetched from backend</div>
              <div className="text-sm text-gray-500">{entries.length} entries</div>
            </div>

            <div className="overflow-auto" style={{ maxHeight: '60vh' }}>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-500 border-b">
                    <th className="py-2">#</th>
                    <th className="py-2">SpaceMatrix#</th>
                    <th className="py-2">Description</th>
                    <th className="py-2">Created By</th>
                    <th className="py-2">Supplier</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={7} className="py-6 text-center text-gray-400">Loading...</td></tr>
                  )}

                  {!loading && entries.length === 0 && (
                    <tr><td colSpan={7} className="py-6 text-center text-gray-400">No entries found</td></tr>
                  )}

                  {!loading && entries.map((e, idx) => {
                    const created = e.creationDate ? new Date(e.creationDate).toLocaleString() : (e.lastChanged ? new Date(e.lastChanged).toLocaleString() : '');
                    return (
                      <tr key={e.id || idx} onClick={() => pickEntry(e)} className={`cursor-pointer ${selected && selected.id === e.id ? 'bg-indigo-50' : ''}`}>
                        <td className="py-2 text-sm">{idx+1}</td>
                        <td className="py-2 text-sm">{e.spaceMatrixNumber || e.id}</td>
                        <td className="py-2 text-sm">{e.description}</td>
                        <td className="py-2 text-sm">{e.createdBy}</td>
                        <td className="py-2 text-sm">{e.supplierName}</td>
                        <td className="py-2 text-sm">{e.status}</td>
                        <td className="py-2 text-sm">{created}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="col-span-4 bg-white rounded shadow p-4">
            <h2 className="text-lg font-medium">Selected Entry</h2>
            {!selected && (
              <div className="text-sm text-gray-500 mt-3">No entry selected. Click a row to select.</div>
            )}

            {selected && (
              <div className="mt-3 space-y-2">
                <div><strong>{selected.spaceMatrixNumber || selected.id}</strong></div>
                <div className="text-sm text-gray-600">{selected.description}</div>
                <div className="text-sm text-gray-500">Created By: {selected.createdBy}</div>
                <div className="text-sm text-gray-500">Supplier: {selected.supplierName}</div>
                <div className="text-sm text-gray-500">Status: <strong>{selected.status}</strong></div>

                <div className="mt-4">
                  <label className="block text-sm mb-1">Security Name</label>
                  <input className="w-full border rounded px-2 py-1" value={securityName} onChange={e=>setSecurityName(e.target.value)} placeholder="Security person" />
                </div>

                <div className="mt-3">
                  <label className="block text-sm mb-1">Remarks</label>
                  <textarea className="w-full border rounded px-2 py-1" rows={3} value={remarks} onChange={e=>setRemarks(e.target.value)} placeholder="remarks..." />
                </div>

                <div className="flex gap-2 mt-3">
                  <button onClick={()=>doOperation('/api/gate-in')} className="flex-1 px-3 py-2 bg-green-600 text-white rounded">Gate In</button>
                  <button onClick={()=>doOperation('/api/gate-out')} className="flex-1 px-3 py-2 bg-red-600 text-white rounded">Gate Out</button>
                </div>

                {opMessage && (
                  <div className={`mt-3 text-sm ${opMessage.type === 'error' ? 'text-red-600' : opMessage.type === 'success' ? 'text-green-600' : 'text-gray-600'}`}>{opMessage.text}</div>
                )}
              </div>
            )}

            <div className="mt-6 text-sm text-gray-500">Tip: Use the refresh button to reload entries after an operation.</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
