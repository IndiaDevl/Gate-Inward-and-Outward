// App.jsx or CreatePOForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function CreatePOForm() {
  const [formData, setFormData] = useState({
    CompanyCode: '',
    DocumentType: '',
    PONumberRanges: '',
    SAP_Description: '',
    Tablelogic_ac: true,
    Testing: ''
  });

  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3010/api/create-po-number', formData);
      setResponse({ success: true, message: res.data.message });
    } catch (error) {
      setResponse({ success: false, message: error.response?.data?.error || 'Error occurred' });
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Create PO Number Range</h2>
      <form onSubmit={handleSubmit}>
        <input name="CompanyCode" placeholder="Company Code" onChange={handleChange} required />
        <input name="DocumentType" placeholder="Document Type" onChange={handleChange} required />
        <input name="PONumberRanges" placeholder="PO Number Ranges" onChange={handleChange} required />
        <input name="SAP_Description" placeholder="Description" onChange={handleChange} />
        <input name="Testing" placeholder="Testing Info" onChange={handleChange} />
        <label>
          Tablelogic_ac:
          <input type="checkbox" name="Tablelogic_ac" checked={formData.Tablelogic_ac} onChange={handleChange} />
        </label>
        <button type="submit">Create</button>
      </form>
      {response && (
        <div style={{ marginTop: '10px', color: response.success ? 'green' : 'red' }}>
          {response.message}
        </div>
      )}
    </div>
  );
}


// import React, { useState } from 'react';
// import './App.css';

// function App() {
//   const [formData, setFormData] = useState({
//     companyCode: '',
//     documentType: '',
//     poNumberRange: '',
//     description: '',
//     testing: ''
//   });
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [createdEntry, setCreatedEntry] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.companyCode || !formData.documentType || !formData.poNumberRange) {
//       setMessage('❗ Company Code, Document Type and PO Number Range are required');
//       return;
//     }

//     setLoading(true);
//     setMessage('');

//     try {
//       const response = await fetch('http://localhost:3010/api/createPONumberRange', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (!data.success) {
//         throw new Error(data.error || 'Failed to create PO Number Range');
//       }

//       setMessage('✅ PO Number Range created successfully');
//       setCreatedEntry(data.data);
//     } catch (error) {
//       console.error('Creation error:', error);
//       setMessage(`❌ Error: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Create PO Number Range in SAP</h1>
      
//       <form onSubmit={handleSubmit} className="form-container">
//         <div className="form-group">
//           <label htmlFor="companyCode">Company Code*</label>
//           <input
//             id="companyCode"
//             type="text"
//             name="companyCode"
//             value={formData.companyCode}
//             onChange={handleChange}
//             placeholder="e.g. 4000"
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label htmlFor="documentType">Document Type*</label>
//           <input
//             id="documentType"
//             type="text"
//             name="documentType"
//             value={formData.documentType}
//             onChange={handleChange}
//             placeholder="e.g. KR"
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label htmlFor="poNumberRange">PO Number Range*</label>
//           <input
//             id="poNumberRange"
//             type="text"
//             name="poNumberRange"
//             value={formData.poNumberRange}
//             onChange={handleChange}
//             placeholder="e.g. 05"
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label htmlFor="description">Description</label>
//           <input
//             id="description"
//             type="text"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             placeholder="Optional description"
//           />
//         </div>
        
//         <div className="form-group">
//           <label htmlFor="testing">Testing Note</label>
//           <input
//             id="testing"
//             type="text"
//             name="testing"
//             value={formData.testing}
//             onChange={handleChange}
//             placeholder="Optional testing note"
//           />
//         </div>
        
//         <button type="submit" disabled={loading} className="submit-button">
//           {loading ? 'Creating...' : 'Create PO Number Range'}
//         </button>
//       </form>

//       {message && (
//         <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
//           {message}
//         </div>
//       )}

//       {createdEntry && (
//         <div className="result-container">
//           <h3>Created Entry Details:</h3>
//           <pre>{JSON.stringify(createdEntry, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;