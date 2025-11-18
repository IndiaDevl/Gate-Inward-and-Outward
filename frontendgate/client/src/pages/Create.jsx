import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Create.css';

export default function Create(){
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState(null);
  const [spaceMatrixNumber, setSpaceMatrixNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // fetch next SpaceMatrixNumber from backend on mount
    async function loadNext() {
      try {
        const API_BASE = 'http://localhost:5000'; // adjust if your backend uses different port
        const res = await fetch(`${API_BASE}/api/generate-space-matrix-number`);
        const data = await res.json();
        if (res.ok && data?.spaceMatrixNumber) {
          setSpaceMatrixNumber(data.spaceMatrixNumber);
        } else {
          // leave empty or fallback
          console.warn('Could not load generated SpaceMatrixNumber', data);
        }
      } catch (err) {
        console.error('Failed to fetch generated SpaceMatrixNumber', err);
      }
    }
    loadNext();
  }, []);

  async function onSubmit(e){
    e.preventDefault();
    setCreating(true);
    setMsg(null);

    const f = e.target;
    const payload = {
      spaceMatrixNumber: spaceMatrixNumber || f.spaceMatrixNumber.value,
      description: f.description.value,
      spaceMatrixName: f.spaceMatrixName.value,
      poNumber: f.poNumber.value,
      invoiceNumber: f.invoiceNumber.value,
      supplierCode: f.supplierCode.value,
      supplierName: f.supplierName.value,
      plant: f.plant.value
    };

    try {
      const res = await fetch('http://localhost:5000/api/gate-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Create failed');
      setMsg({ type: 'success', text: 'Created' });
      navigate('/list');
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: err.message || 'Create error' });
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="create-form-container">
      <h2>Create Gate Entry</h2>
      {msg && (
        <div className={`create-form-message ${msg.type}`}>
          {msg.text}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div className="create-form-group">
          <label>SpaceMatrix Number</label>
          <input name="spaceMatrixNumber" value={spaceMatrixNumber} onChange={e=>setSpaceMatrixNumber(e.target.value)} />
        </div>
        <div className="create-form-group">
          <label>Description</label>
          <input name="description" />
        </div>
        <div className="create-form-group">
          <label>SpaceMatrix Name</label>
          <input name="spaceMatrixName"/>
        </div>
        <div className="create-form-row">
          <div className="create-form-group" style={{flex:1}}>
            <label>PO Number</label>
            <input name="poNumber" />
          </div>
          <div className="create-form-group" style={{flex:1}}>
            <label>Invoice Number</label>
            <input name="invoiceNumber" />
          </div>
        </div>
        <div className="create-form-row">
          <div className="create-form-group" style={{flex:1}}>
            <label>Supplier Code</label>
            <input name="supplierCode" />
          </div>
          <div className="create-form-group" style={{flex:1}}>
            <label>Supplier Name</label>
            <input name="supplierName" />
          </div>
        </div>
        <div className="create-form-group">
          <label>Plant</label>
          <input name="plant" defaultValue="2110" />
        </div>
        <div className="create-form-actions">
          <button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create'}</button>
          <button type="button" onClick={()=>navigate('/list')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
