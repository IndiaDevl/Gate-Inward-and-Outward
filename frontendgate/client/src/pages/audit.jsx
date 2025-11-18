// import React, { useEffect, useState } from "react";
// //import { api } from "../api";

// export default function List() {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [editingRow, setEditingRow] = useState(null);
//   const [editForm, setEditForm] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [showAuditModal, setShowAuditModal] = useState(false);
//   const [changeReason, setChangeReason] = useState("");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const data = await api.list();
//       setRows(data);
//       setErr(null);
//     } catch (e) {
//       setErr(e.body?.error || e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Start editing - show audit modal first
//   const handleEditClick = (row) => {
//     setEditingRow(row);
//     setEditForm({
//       PONumner: row.poNumber || "",
//       InvoiceNumber: row.invoiceNumber || "",
//       Supplier: row.supplierCode || "",
//       SupplierName: row.supplierName || "",
//       Remakrs: row.description || ""
//     });
//     setShowAuditModal(true);
//   };

//   // Create audit entry and proceed with edit
//   const handleAuditConfirm = async () => {
//     if (!editingRow || !changeReason.trim()) {
//       alert("Please provide a reason for the change");
//       return;
//     }

//     try {
//       setSaving(true);
      
//       // Get current user (you can modify this based on your auth system)
//       const currentUser = JSON.parse(localStorage.getItem("yantra_user"))?.username || "Unknown User";
      
//       // Prepare audit data
//       const auditData = {
//         originalData: editingRow,
//         modifiedData: editForm,
//         changedBy: currentUser,
//         changeReason: changeReason.trim()
//       };

//       console.log("Creating audit entry:", auditData);

//       // Create audit entry in custom business object
//               const API_BASE = 'http://localhost:5000'; // adjust if your backend uses different port
//         const auditResponse = await fetch(`${API_BASE}/api/gate-entries/audit`,{
// //      const auditResponse = await fetch('/api/gate-entries/audit', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(auditData)
//       });

//       const auditResult = await auditResponse.json();

//       if (!auditResponse.ok) {
//         throw new Error(auditResult.error || 'Failed to create audit entry');
//       }

//       console.log("Audit created successfully:", auditResult);
      
//       // Close modal and show success
//       setShowAuditModal(false);
//       setChangeReason("");
      
//       alert(`Changes recorded for audit. Audit ID: ${auditResult.auditId}`);
      
//       // Here you can add logic to actually update the main record if needed
//       // For now, we'll just refresh the data
//       fetchData();
      
//     } catch (error) {
//       console.error("Audit creation error:", error);
//       setErr(error.message);
//     } finally {
//       setSaving(false);
//       setEditingRow(null);
//       setEditForm({});
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingRow(null);
//     setEditForm({});
//     setShowAuditModal(false);
//     setChangeReason("");
//   };

//   const handleInputChange = (field, value) => {
//     setEditForm(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading…</div>;
//   if (err) return <div style={{ color: "crimson", padding: '20px' }}>Error: {err}</div>;

//   return (
//     <div style={{ padding: '20px' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//         <h3>Gate Entries</h3>
//         <button 
//           onClick={fetchData}
//           style={{
//             padding: '8px 16px',
//             background: '#007acc',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           Refresh
//         </button>
//       </div>

//       {/* Audit Modal */}
//       {showAuditModal && editingRow && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0,0,0,0.5)',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 1000
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             padding: '30px',
//             borderRadius: '8px',
//             width: '90%',
//             maxWidth: '500px',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
//           }}>
//             <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
//               📝 Record Changes for Audit
//             </h3>
            
//             <div style={{ marginBottom: '20px' }}>
//               <p><strong>Editing:</strong> {editingRow.spaceMatrixNumber}</p>
//               <p style={{ fontSize: '0.9em', color: '#666' }}>
//                 All changes will be recorded in the audit trail for compliance purposes.
//               </p>
//             </div>

//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
//                 Reason for Change *
//               </label>
//               <textarea
//                 value={changeReason}
//                 onChange={(e) => setChangeReason(e.target.value)}
//                 placeholder="Explain why you are making these changes..."
//                 style={{
//                   width: '100%',
//                   padding: '10px',
//                   border: '1px solid #ddd',
//                   borderRadius: '4px',
//                   minHeight: '80px',
//                   resize: 'vertical',
//                   fontSize: '0.9em'
//                 }}
//               />
//             </div>

//             {/* Changes Preview */}
//             <div style={{ 
//               marginBottom: '20px',
//               padding: '15px',
//               backgroundColor: '#f8f9fa',
//               borderRadius: '4px',
//               fontSize: '0.9em'
//             }}>
//               <strong>Changes to be made:</strong>
//               <div style={{ marginTop: '10px' }}>
//                 {Object.entries(editForm).map(([key, value]) => {
//                   const originalValue = editingRow[key.toLowerCase().replace('numner', 'number')] || 
//                                       editingRow[key.toLowerCase()] || 
//                                       '';
//                   if (value !== originalValue && value !== '') {
//                     return (
//                       <div key={key} style={{ marginBottom: '5px' }}>
//                         <span style={{ color: '#666' }}>{key}: </span>
//                         <span style={{ textDecoration: 'line-through', color: '#dc3545' }}>
//                           {originalValue || 'Empty'}
//                         </span>
//                         <span> → </span>
//                         <span style={{ color: '#28a745', fontWeight: 'bold' }}>
//                           {value}
//                         </span>
//                       </div>
//                     );
//                   }
//                   return null;
//                 }).filter(Boolean)}
//               </div>
//             </div>

//             <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
//               <button
//                 onClick={handleCancelEdit}
//                 disabled={saving}
//                 style={{
//                   padding: '10px 20px',
//                   background: '#6c757d',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAuditConfirm}
//                 disabled={saving || !changeReason.trim()}
//                 style={{
//                   padding: '10px 20px',
//                   background: saving ? '#6c757d' : '#28a745',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: saving ? 'not-allowed' : 'pointer'
//                 }}
//               >
//                 {saving ? 'Creating Audit...' : 'Confirm & Record Changes'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div style={{ overflowX: "auto", backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//         <table style={{ borderCollapse: "collapse", width: "100%" }}>
//           <thead>
//             <tr style={{ backgroundColor: '#f8f9fa' }}>
//               {["Space Matrix No", "PO Number", "Invoice Number", "Supplier Name", "Status", "Active", "Created Date", "Actions"].map(h => (
//                 <th 
//                   key={h} 
//                   style={{
//                     borderBottom: "1px solid #ddd",
//                     borderRight: "1px solid #ddd",
//                     textAlign: "left",
//                     padding: "12px",
//                     fontWeight: "600",
//                     fontSize: "0.9em"
//                   }}
//                 >
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row) => (
//               <tr key={row.id} style={{ borderBottom: "1px solid #eee" }}>
//                 <td style={{ padding: "12px", borderRight: "1px solid #eee" }}>
//                   <strong>{row.spaceMatrixNumber || "N/A"}</strong>
//                 </td>
//                 <td style={{ padding: "12px", borderRight: "1px solid #eee" }}>
//                   {row.poNumber || "N/A"}
//                 </td>
//                 <td style={{ padding: "12px", borderRight: "1px solid #eee" }}>
//                   {row.invoiceNumber || "N/A"}
//                 </td>
//                 <td style={{ padding: "12px", borderRight: "1px solid #eee" }}>
//                   {row.supplierName || "N/A"}
//                 </td>
//                 <td style={{ padding: "12px", borderRight: "1px solid #eee" }}>
//                   <span style={{
//                     padding: "4px 8px",
//                     borderRadius: "12px",
//                     fontSize: "0.8em",
//                     fontWeight: "500",
//                     backgroundColor: row.statusText === 'Active' ? '#d4edda' : '#f8d7da',
//                     color: row.statusText === 'Active' ? '#155724' : '#721c24'
//                   }}>
//                     {row.statusText || "N/A"}
//                   </span>
//                 </td>
//                 <td style={{ padding: "12px", borderRight: "1px solid #eee" }}>
//                   <span style={{
//                     color: row.active ? '#28a745' : '#dc3545',
//                     fontWeight: "500"
//                   }}>
//                     {row.active ? "Yes" : "No"}
//                   </span>
//                 </td>
//                 <td style={{ padding: "12px", borderRight: "1px solid #eee" }}>
//                   {row.creationDate ? new Date(row.creationDate).toLocaleDateString() : "N/A"}
//                 </td>
//                 <td style={{ padding: "12px" }}>
//                   <button
//                     onClick={() => handleEditClick(row)}
//                     style={{
//                       padding: "6px 12px",
//                       background: "#007bff",
//                       color: "white",
//                       border: "none",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                       fontSize: "0.8em"
//                     }}
//                   >
//                     Edit & Audit
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {rows.length === 0 && (
//         <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
//           No gate entries found.
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";

export default function List() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [changeReason, setChangeReason] = useState("");

  const API_BASE = 'http://localhost:5000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Direct API call instead of using api.js
      const response = await fetch(`${API_BASE}/api/gate-entries`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRows(data);
      setErr(null);
    } catch (e) {
      setErr(e.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Start editing - show audit modal first
  const handleEditClick = (row) => {
    setEditingRow(row);
    setEditForm({
      PONumner: row.poNumber || "",
      InvoiceNumber: row.invoiceNumber || "",
      Supplier: row.supplierCode || "",
      SupplierName: row.supplierName || "",
      Remakrs: row.description || ""
    });
    setShowAuditModal(true);
  };

  // Create audit entry and proceed with edit
  const handleAuditConfirm = async () => {
    if (!editingRow || !changeReason.trim()) {
      alert("Please provide a reason for the change");
      return;
    }

    try {
      setSaving(true);
      
      // Get current user (you can modify this based on your auth system)
      const currentUser = JSON.parse(localStorage.getItem("yantra_user"))?.username || "Unknown User";
      
      // Prepare audit data
      const auditData = {
        originalData: editingRow,
        modifiedData: editForm,
        changedBy: currentUser,
        changeReason: changeReason.trim()
      };

      console.log("Creating audit entry:", auditData);

      // Create audit entry in custom business object
      const auditResponse = await fetch(`${API_BASE}/api/gate-entries/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditData)
      });

      const auditResult = await auditResponse.json();

      if (!auditResponse.ok) {
        throw new Error(auditResult.error || 'Failed to create audit entry');
      }

      console.log("Audit created successfully:", auditResult);
      
      // Close modal and show success
      setShowAuditModal(false);
      setChangeReason("");
      
      alert(`Changes recorded for audit. Audit ID: ${auditResult.auditId}`);
      
      // Refresh the data
      fetchData();
      
    } catch (error) {
      console.error("Audit creation error:", error);
      setErr(error.message);
    } finally {
      setSaving(false);
      setEditingRow(null);
      setEditForm({});
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditForm({});
    setShowAuditModal(false);
    setChangeReason("");
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading…</div>;
  if (err) return <div style={{ color: "crimson", padding: '20px' }}>Error: {err}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Gate Entries</h3>
        <button 
          onClick={fetchData}
          style={{
            padding: '8px 16px',
            background: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>

      {/* Audit Modal */}
      {showAuditModal && editingRow && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
              📝 Record Changes for Audit
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Editing:</strong> {editingRow.spaceMatrixNumber}</p>
              <p style={{ fontSize: '0.9em', color: '#666' }}>
                All changes will be recorded in the audit trail for compliance purposes.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Reason for Change *
              </label>
              <textarea
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Explain why you are making these changes..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  minHeight: '80px',
                  resize: 'vertical',
                  fontSize: '0.9em'
                }}
              />
            </div>

            {/* Changes Preview */}
            <div style={{ 
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '0.9em'
            }}>
              <strong>Changes to be made:</strong>
              <div style={{ marginTop: '10px' }}>
                {Object.entries(editForm).map(([key, value]) => {
                  const originalValue = editingRow[key.toLowerCase().replace('numner', 'number')] || 
                                      editingRow[key.toLowerCase()] || 
                                      '';
                  if (value !== originalValue && value !== '') {
                    return (
                      <div key={key} style={{ marginBottom: '5px' }}>
                        <span style={{ color: '#666' }}>{key}: </span>
                        <span style={{ textDecoration: 'line-through', color: '#dc3545' }}>
                          {originalValue || 'Empty'}
                        </span>
                        <span> → </span>
                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                          {value}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }).filter(Boolean)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                style={{
                  padding: '10px 20px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAuditConfirm}
                disabled={saving || !changeReason.trim()}
                style={{
                  padding: '10px 20px',
                  background: saving ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                {saving ? 'Creating Audit...' : 'Confirm & Record Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ overflowX: "auto", backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              {["Space Matrix No", "PO Number", "Invoice Number", "Supplier Name", "Status", "Active", "Created Date", "Actions"].map(h => (
                <th 
                  key={h} 
                  style={{
                    borderBottom: "1px solid #ddd",
                    borderRight: "1px solid #ddd",
                    textAlign: "left",
                    padding: "12px",
                    fontWeight: "600",
                    fontSize: "0.9em"
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", borderRight: "1px solid #eee" }}>
                  <strong>{row.spaceMatrixNumber || "N/A"}</strong>
                </td>
                <td style={{ padding: "12px", borderRight: "1px solid #eee" }}>
                  {row.poNumber || "N/A"}
                </td>
                <td style={{ padding: "12px", borderRight: "1px solid #eee" }}>
                  {row.invoiceNumber || "N/A"}
                </td>
                <td style={{ padding: "12px", borderRight: "1px solid #eee" }}>
                  {row.supplierName || "N/A"}
                </td>
                <td style={{ padding: "12px", borderRight: "1px solid #eee" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.8em",
                    fontWeight: "500",
                    backgroundColor: row.statusText === 'Active' ? '#d4edda' : '#f8d7da',
                    color: row.statusText === 'Active' ? '#155724' : '#721c24'
                  }}>
                    {row.statusText || "N/A"}
                  </span>
                </td>
                <td style={{ padding: "12px", borderRight: "1px solid #eee" }}>
                  <span style={{
                    color: row.active ? '#28a745' : '#dc3545',
                    fontWeight: "500"
                  }}>
                    {row.active ? "Yes" : "No"}
                  </span>
                </td>
                <td style={{ padding: "12px", borderRight: "1px solid #eee" }}>
                  {row.creationDate ? new Date(row.creationDate).toLocaleDateString() : "N/A"}
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => handleEditClick(row)}
                    style={{
                      padding: "6px 12px",
                      background: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.8em"
                    }}
                  >
                    Edit & Audit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          No gate entries found.
        </div>
      )}
    </div>
  );
}