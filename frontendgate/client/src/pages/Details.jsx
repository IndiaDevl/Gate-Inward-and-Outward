import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function Details(){
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [security, setSecurity] = useState('');
  const [remarks, setRemarks] = useState('');
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(()=> {
    api.getEntry(id).then(data => setEntry(data)).catch(err => setMsg({type:'error', text:String(err)}));
  }, [id]);

  async function op(fn){
    setMsg({type:'info', text:'Working...'});
    try {
      const payload = { entryId: id, securityName: security || 'Security', remarks };
      await fn(payload);
      setMsg({type:'success', text:'Operation done'});
      // refresh details
      const d = await api.getEntry(id);
      setEntry(d);
    } catch (err) {
      setMsg({type:'error', text:String(err)});
    }
  }

  if (!entry) return <div>Loading details...</div>;

  return (
    <div>
      <h2>Details — {entry.spaceMatrixNumber || entry.id}</h2>
      {msg && <div style={{color: msg.type==='error' ? 'red' : msg.type==='success' ? 'green' : '#333'}}>{msg.text}</div>}
      <div style={{background:'#fff', padding:12, borderRadius:6}}>
        <div><strong>Description:</strong> {entry.description}</div>
        <div><strong>Created By:</strong> {entry.createdBy}</div>
        <div><strong>Supplier:</strong> {entry.supplierName}</div>
        <div><strong>Plant:</strong> {entry.plant}</div>
        <div style={{marginTop:8}}>
          <input placeholder="Security" value={security} onChange={e=>setSecurity(e.target.value)} style={{marginRight:8}}/>
          <input placeholder="Remarks" value={remarks} onChange={e=>setRemarks(e.target.value)} style={{marginRight:8}}/>
          <button onClick={()=>op(api.gateIn)}>Gate In</button>
          <button onClick={()=>op(api.gateOut)} style={{marginLeft:8}}>Gate Out</button>
          <button onClick={()=>navigate('/list')} style={{marginLeft:8}}>Back to list</button>
        </div>
      </div>
    </div>
  );
}
