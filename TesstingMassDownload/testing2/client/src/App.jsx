// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [referenceId, setReferenceId] = useState('');
//   const [billingDocuments, setBillingDocuments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const searchByReference = async () => {
//     if (!referenceId.trim()) {
//       setError('Please enter a reference ID');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setMessage('');
    
//     try {
//       const response = await axios.get(`http://localhost:4403/api/billing-documents?referenceId=${referenceId}`);
      
//       if (response.data.documents && response.data.documents.length > 0) {
//         setBillingDocuments(response.data.documents);
//         setMessage(`Found ${response.data.count} billing documents`);
//       } else {
//         setMessage('No billing documents found for this reference');
//         setBillingDocuments([]);
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to search documents');
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadPdf = async (billingDocument) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `http://localhost:4403/api/download-pdf?billingDocument=${billingDocument}`,
//         { responseType: 'blob' }
//       );
      
//       // Create download link
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `Billing_${billingDocument}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
      
//       setMessage(`PDF for ${billingDocument} downloaded successfully`);
//     } catch (err) {
//       setError(`Failed to download PDF for ${billingDocument}`);
//       console.error('Download error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       <h1>Billing Document Search</h1>
      
//       <div className="search-container">
//         <input
//           type="text"
//           value={referenceId}
//           onChange={(e) => setReferenceId(e.target.value)}
//           placeholder="Enter Reference ID"
//           disabled={loading}
//         />
//         <button 
//           onClick={searchByReference} 
//           disabled={loading}
//         >
//           {loading ? 'Searching...' : 'Search'}
//         </button>
//       </div>

//       {error && <div className="error">{error}</div>}
//       {message && <div className="message">{message}</div>}

//       {billingDocuments.length > 0 && (
//         <div className="results-container">
//           <h2>Found Documents</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>Billing Document</th>
//                 <th>Document Type</th>
//                 <th>Company Code</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {billingDocuments.map((doc, index) => (
//                 <tr key={index}>
//                   <td>{doc.billingDocument}</td>
//                   <td>{doc.documentType}</td>
//                   <td>{doc.companyCode}</td>
//                   <td>
//                     <button 
//                       onClick={() => downloadPdf(doc.billingDocument)}
//                       disabled={loading}
//                     >
//                       Download PDF
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// // App.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [referenceId, setReferenceId] = useState('TS2551000051'); // Pre-filled for testing
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [apiStatus, setApiStatus] = useState('');

//   const checkBackend = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('http://localhost:4404/api/test');
//       setApiStatus(`Backend connected: ${response.data.message}`);
//       return true;
//     } catch (err) {
//       setApiStatus('Backend NOT reachable. Is server running?');
//       console.error('Backend check failed:', err);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const searchByReference = async () => {
//     if (!(await checkBackend())) return;

//     setLoading(true);
//     setError('');
    
//     try {
//       const response = await axios.get(
//         'http://localhost:4404/api/billing-documents',
//         { params: { referenceId } }
//       );
      
//       console.log('API Response:', response.data);
//       // Handle successful response
//     } catch (err) {
//       let errorMsg = 'Failed to search documents';
//       if (err.response) {
//         if (err.response.status === 404) {
//           errorMsg = 'Endpoint not found. Check backend routes.';
//         } else {
//           errorMsg = err.response.data?.error || err.message;
//         }
//       } else if (err.request) {
//         errorMsg = 'No response received. Check network connection.';
//       }
//       setError(errorMsg);
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       <h1>Billing Document Search</h1>
      
//       <div className="status">{apiStatus}</div>
      
//       <div className="search-container">
//         <input
//           type="text"
//           value={referenceId}
//           onChange={(e) => setReferenceId(e.target.value)}
//           placeholder="Enter Reference ID"
//         />
//         <button onClick={searchByReference} disabled={loading}>
//           {loading ? 'Searching...' : 'Search'}
//         </button>
//       </div>

//       {error && <div className="error">{error}</div>}

//       {/* Results display would go here */}
//     </div>
//   );
// }

// export default App;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [referenceId, setReferenceId] = useState('');
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [backendStatus, setBackendStatus] = useState('');

//   // Check backend connection on startup
//   useEffect(() => {
//     checkBackendConnection();
//   }, []);

//   const checkBackendConnection = async () => {
//     try {
//       const response = await axios.get('http://localhost:4404/api/health');
//       setBackendStatus(`Backend connected: ${response.data.status}`);
//       return true;
//     } catch (err) {
//       setBackendStatus('Backend not reachable. Please start the server.');
//       return false;
//     }
//   };

//   const searchDocuments = async () => {
//     if (!referenceId.trim()) {
//       setError('Please enter a reference ID');
//       return;
//     }

//     if (!(await checkBackendConnection())) {
//       setError('Cannot connect to backend');
//       return;
//     }

//     setLoading(true);
//     setError('');
    
//     try {
//       const response = await axios.get('http://localhost:4404/api/billing-documents', {
//         params: { referenceId }
//       });
      
//       if (response.data.documents && response.data.documents.length > 0) {
//         setDocuments(response.data.documents);
//       } else {
//         setError('No documents found for this reference');
//         setDocuments([]);
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to fetch documents');
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadPdf = async (docNumber) => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:4404/api/download-pdf', {
//         params: { billingDocument: docNumber },
//         responseType: 'blob'
//       });
      
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `Billing_${docNumber}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to download PDF');
//       console.error('Download error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       <h1>Billing Document Search</h1>
//       <div className="status">{backendStatus}</div>
      
//       <div className="search-box">
//         <input
//           type="text"
//           value={referenceId}
//           onChange={(e) => setReferenceId(e.target.value)}
//           placeholder="Enter Reference ID (e.g. TS2551000051)"
//           disabled={loading}
//         />
//         <button onClick={searchDocuments} disabled={loading}>
//           {loading ? 'Searching...' : 'Search'}
//         </button>
//       </div>

//       {error && <div className="error-message">{error}</div>}

//       {documents.length > 0 && (
//         <div className="results">
//           <h2>Found Documents</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>Billing Document</th>
//                 <th>Type</th>
//                 <th>Company Code</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {documents.map((doc, index) => (
//                 <tr key={index}>
//                   <td>{doc.billingDocument}</td>
//                   <td>{doc.documentType}</td>
//                   <td>{doc.companyCode}</td>
//                   <td>
//                     <button 
//                       onClick={() => downloadPdf(doc.billingDocument)}
//                       disabled={loading}
//                     >
//                       Download PDF
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// import React, { useState, useEffect } from 'react';
// import './App.css';

// function App() {
//   const [invoices, setInvoices] = useState([]);
//   const [filteredInvoices, setFilteredInvoices] = useState([]);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');
//   const [referenceId, setReferenceId] = useState('');

//   const getProp = (obj, key, defaultValue = '') => {
//     const val = obj[`d:${key}`] || obj[key];
//     if (val && typeof val === 'object') {
//       if ('m:null' in val) return '';
//       if ('$' in val) return val['$'];
//       return JSON.stringify(val);
//     }
//     return val || defaultValue;
//   };

//   // Fetch invoices by reference ID
//   const fetchInvoices = async () => {
//     if (!referenceId) {
//       setMessage("Please enter a Reference ID");
//       setMessageType("warning");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:4405/api/billing-documents?referenceId=${referenceId}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       setInvoices(data);
//       setMessage(`${data.length} billing document(s) found.`);
//       setMessageType("success");
//     } catch (err) {
//       setMessage(`Failed to load invoice data: ${err.message}`);
//       setMessageType("error");
//     }
//   };

//   const handleFilter = () => {
//     if (!startDate || !endDate) {
//       setMessage("Please select both Start and End dates.");
//       setMessageType("warning");
//       return;
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     const filtered = invoices.filter(inv => {
//       const dateStr = getProp(inv, 'BillingDocumentDate');
//       const billDate = new Date(dateStr);
//       return billDate >= start && billDate <= end;
//     });

//     setFilteredInvoices(filtered);
//     setMessage(`${filtered.length} document(s) match the date range.`);
//     setMessageType("info");
//   };

//   return (
//     <div className="app-container">
//       <div className="app-inner">
//         <h1 className="app-title">Billing Document Filter</h1>

//         {/* Add Reference ID search */}
//         <div className="filter-grid">
//           <div>
//             <label className="input-label">Reference ID</label>
//             <input
//               type="text"
//               value={referenceId}
//               onChange={e => setReferenceId(e.target.value)}
//               placeholder="Enter Reference ID"
//               className="input-box"
//             />
//           </div>
//           <button onClick={fetchInvoices} className="filter-button">
//             Search by Reference
//           </button>
//         </div>

//         <div className="filter-grid">
//           <div>
//             <label className="input-label">Start Date</label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={e => setStartDate(e.target.value)}
//               className="input-box"
//             />
//           </div>
//           <div>
//             <label className="input-label">End Date</label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={e => setEndDate(e.target.value)}
//               className="input-box"
//             />
//           </div>
//           <button onClick={handleFilter} className="filter-button">
//             Filter by Date
//           </button>
//         </div>

//         {message && (
//           <div className={`message ${messageType}`}>
//             {message}
//           </div>
//         )}

//         {(filteredInvoices.length > 0 || invoices.length > 0) && (
//           <div className="table-container">
//             <table className="table-style">
//               <thead>
//                 <tr>
//                   <th>Billing Document</th>
//                   <th>Date</th>
//                   <th>Reference ID</th>
//                   <th>Sales Document</th>
//                   <th>Plan Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {(filteredInvoices.length > 0 ? filteredInvoices : invoices).map((inv, index) => (
//                   <tr key={index}>
//                     <td>{getProp(inv, 'BillingDocument')}</td>
//                     <td>{getProp(inv, 'BillingDocumentDate')}</td>
//                     <td>{getProp(inv, 'DocumentReferenceID')}</td>
//                     <td>{getProp(inv, 'SalesDocument')}</td>
//                     <td>{getProp(inv, 'BillingPlanAmount')}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

// import React, { useState } from 'react';
// import './App.css';

// function App() {
//   const [invoices, setInvoices] = useState([]);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');
//   const [referenceId, setReferenceId] = useState(''); // No default value

//   // Simplified property accessor
//   const getProp = (obj, prop) => {
//     if (!obj) return '';
//     // Handle both XML-parsed format and direct property access
//     if (obj[`d:${prop}`]) {
//       const val = obj[`d:${prop}`];
//       return typeof val === 'object' ? val['$'] || '' : val;
//     }
//     return obj[prop] || '';
//   };

//   const fetchInvoices = async () => {
//     if (!referenceId.trim()) {
//       setMessage("Please enter a Reference ID");
//       setMessageType("warning");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:4405/api/billing-documents?referenceId=${referenceId}`
//       );
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
      
//       // Ensure data is in correct format
//       const formattedData = Array.isArray(data) ? data : [data];
      
//       setInvoices(formattedData);
//       setMessage(`${formattedData.length} billing document(s) found.`);
//       setMessageType("success");
      
//     } catch (err) {
//       setMessage(`Failed to load data: ${err.message}`);
//       setMessageType("error");
//       console.error('Fetch error:', err);
//     }
//   };

//   return (
//     <div className="app-container">
//       <div className="app-inner">
//         <h1 className="app-title">Billing Document Search</h1>

//         <div className="filter-grid">
//           <div>
//             <label className="input-label">Reference ID</label>
//             <input
//               type="text"
//               value={referenceId}
//               onChange={e => setReferenceId(e.target.value)}
//               className="input-box"
//               placeholder="Enter Reference ID"
//             />
//           </div>
//           <button onClick={fetchInvoices} className="filter-button">
//             Search Documents
//           </button>
//         </div>

//         {message && (
//           <div className={`message ${messageType}`}>
//             {message}
//           </div>
//         )}

//         {invoices.length > 0 && (
//           <div className="table-container">
//             <table className="table-style">
//               <thead>
//                 <tr>
//                   <th>Billing Document</th>
//                   <th>Reference ID</th>
//                   <th>Sales Document</th>
//                   <th>Plan Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {invoices.map((inv, index) => (
//                   <tr key={index}>
//                     <td>{getProp(inv, 'BillingDocument')}</td>
//                     <td>{getProp(inv, 'DocumentReferenceID')}</td>
//                     <td>{getProp(inv, 'SalesDocument')}</td>
//                     <td>{formatCurrency(getProp(inv, 'BillingPlanAmount'))}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Helper function to format currency
// function formatCurrency(amount) {
//   if (!amount) return '';
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD'
//   }).format(amount);
// }

// export default App;



// // frontend/src/App.js
// import React, { useState } from "react";
// import axios from "axios";

// function App() {
//   const [referenceId, setReferenceId] = useState("");
//   const [billingData, setBillingData] = useState(null);

//   const handleSearch = async () => {
//     try {
//       const res = await axios.get(`http://localhost:3017/billing/${referenceId}`);
//       setBillingData(res.data);
//     } catch (err) {
//       alert("No data found or server error");
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Billing Document Fetch</h2>
//       <input
//         type="text"
//         value={referenceId}
//         onChange={(e) => setReferenceId(e.target.value)}
//         placeholder="Enter Reference Document ID"
//       />
//       <button onClick={handleSearch}>Search</button>

//       {billingData && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Result:</h3>
//           <p><strong>Billing Document:</strong> {billingData.BillingDocument}</p>
//           <p><strong>Net Amount:</strong> {billingData.NetAmount}</p>
//           <p><strong>Tax Amount:</strong> {billingData.TaxAmount}</p>
//           <p><strong>Sold To Party:</strong> {billingData.SoldToParty}</p>
//           <p><strong>Plant:</strong> {billingData.Plant}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// // export default App;


// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [referenceNumber, setReferenceNumber] = useState('');
//   const [message, setMessage] = useState('');

//   const handleDownload = async () => {
//     try {
//       const res = await axios.post('http://localhost:3018/api/downloadBillingPDFsByReference', {
//         referenceNumber: referenceNumber.trim(),
//       });

//       if (res.data?.zipFile) {
//         const link = document.createElement('a');
//         link.href = `data:application/zip;base64,${res.data.zipFile}`;
//         link.download = `Billing_PDFs_${referenceNumber}.zip`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         setMessage('Downloaded ZIP successfully!');
//       } else {
//         setMessage('No ZIP file found.');
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage('Download failed.');
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Billing PDF ZIP Downloader</h2>
//       <input
//         type="text"
//         placeholder="Enter Reference Number"
//         value={referenceNumber}
//         onChange={(e) => setReferenceNumber(e.target.value)}
//         style={{ padding: 8, width: 300 }}
//       />
//       <button onClick={handleDownload} style={{ padding: 8, marginLeft: 10 }}>
//         Download ZIP
//       </button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }
import React, { useState } from 'react';
import axios from 'axios';

const BillingDownloader = () => {
  const [referenceId, setReferenceId] = useState('');
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  const testBackendConnection = async () => {
    try {
      const response = await axios.get('http://localhost:3019', { timeout: 3000 });
      return true;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  };

  const handleDownload = async () => {
    setStatus({ loading: true, error: null, success: false });
    
    // First test backend connection
    const isBackendUp = await testBackendConnection();
    if (!isBackendUp) {
      setStatus({
        loading: false,
        error: {
          message: 'Backend server is not reachable',
          details: 'Please ensure the backend is running on port 3019'
        },
        success: false
      });
      return;
    }

    // Proceed with download if backend is up
    try {
      const response = await axios.post(
        'http://localhost:3019/api/downloadBillingPDFsByReference',
        { referenceId: referenceId.trim() },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        }
      );

      if (response.data.zipFile) {
        const link = document.createElement('a');
        link.href = `data:application/zip;base64,${response.data.zipFile}`;
        link.download = `billing-${referenceId}.zip`;
        link.click();
        setStatus({ loading: false, error: null, success: true });
      }
    } catch (error) {
      setStatus({
        loading: false,
        error: {
          message: error.response?.data?.error || 'Download failed',
          details: error.message
        },
        success: false
      });
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial'
    }}>
      <h2>Billing Document Download</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={referenceId}
          onChange={(e) => setReferenceId(e.target.value)}
          placeholder="Enter Reference ID"
          style={{ flex: 1, padding: '8px' }}
        />
        <button
          onClick={handleDownload}
          disabled={status.loading}
          style={{
            padding: '8px 16px',
            background: status.loading ? '#ccc' : '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {status.loading ? 'Processing...' : 'Download'}
        </button>
      </div>

      {status.error && (
        <div style={{
          padding: '15px',
          background: '#ffebee',
          borderLeft: '4px solid #f44336',
          marginBottom: '20px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            {status.error.message}
          </div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>
            {status.error.details}
          </div>
          <div style={{ marginTop: '15px', fontSize: '0.9em' }}>
            <p>Try these steps:</p>
            <ol style={{ marginLeft: '20px', paddingLeft: '0' }}>
              <li>Ensure backend server is running</li>
              <li>Check terminal for any errors</li>
              <li>Refresh this page and try again</li>
            </ol>
          </div>
        </div>
      )}

      {status.success && (
        <div style={{
          padding: '15px',
          background: '#e8f5e9',
          borderLeft: '4px solid #4caf50',
          marginBottom: '20px'
        }}>
          Download successful! Check your downloads folder.
        </div>
      )}
    </div>
  );
};

export default BillingDownloader;