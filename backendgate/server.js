const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(bodyParser.json());

// SAP Configuration
const SAP_CONFIG = {
  BASE_URL: 'https://my419577-api.s4hana.cloud.sap/sap/opu/odata/sap/YY1_GATE_CDS',
  SERVICE: 'YY1_GATE',
  USERNAME: process.env.SAP_USER || 'APICUSTOMERINVOICE', // Fallback for testing
  PASSWORD: process.env.SAP_PASS || '+[sB~j=%4Ce>[XxMX)6c-64JV8yF6+hjFhDXE-5G'  // Fallback for testing
};

// Helper function for SAP API calls
const sapApi = axios.create({
  baseURL: SAP_CONFIG.BASE_URL,
  auth: {
    username: SAP_CONFIG.USERNAME,
    password: SAP_CONFIG.PASSWORD
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


// Add this to your backend server
const CUSTOM_SAP_CONFIG = {
  BASE_URL2: 'https://my419577-api.s4hana.cloud.sap/sap/opu/odata/sap/YY1_GATE_ENTRY_CDS',
  SERVICE2: 'YY1_GATE_ENTRY',
  USERNAME: 'APICUSTOMERINVOICE', // Replace with actual credentials
  PASSWORD: '+[sB~j=%4Ce>[XxMX)6c-64JV8yF6+hjFhDXE-5G'  // Replace with actual credentials
};

// Create axios instance for custom business object
const customSapApi = axios.create({
  baseURL: CUSTOM_SAP_CONFIG.BASE_URL2,
  auth: {
    username: CUSTOM_SAP_CONFIG.USERNAME,
    password: CUSTOM_SAP_CONFIG.PASSWORD
  },
  headers: {
    'Content-Type': 'application/json',
     'Accept': 'application/json'
  }
});



// improved helper to generate a unique SpaceMatrixNumber
async function generateSpaceMatrixNumber(preferred) {
  if (preferred) return preferred;

  try {
    // fetch last entry (order desc, top 1)
    const resp = await sapApi.get(`/${SAP_CONFIG.SERVICE}?$orderby=SpaceMatrixNumber%20desc&$top=1`);
    let last = null;
    if (resp.data?.d?.results?.length) last = resp.data.d.results[0].SpaceMatrixNumber;
    else if (Array.isArray(resp.data?.value) && resp.data.value.length) last = resp.data.value[0].SpaceMatrixNumber;

    if (last) {
      // try to capture prefix and numeric part (e.g. "SM00001234" -> prefix "SM", num "00001234")
      const m = String(last).match(/^(\D*?)(\d+)$/);
      let prefix = 'SM';
      let num = null;
      let width = 0;

      if (m) {
        prefix = m[1] || '';
        num = parseInt(m[2], 10);
        width = m[2].length;
      } else {
        // fallback: grab last contiguous digits in the string
        const digits = String(last).match(/(\d+)/g);
        if (digits && digits.length) {
          const d = digits[digits.length - 1];
          prefix = String(last).split(d).shift() || 'SM';
          num = parseInt(d, 10);
          width = d.length;
        }
      }

      if (num !== null && !Number.isNaN(num)) {
        let next = num + 1;
        // create candidate preserving padding width
        let candidate = prefix + String(next).padStart(Math.max(width, String(next).length), '0');

        // check uniqueness against SAP (retry a few times)
        for (let i = 0; i < 10; i++) {
          try {
            const checkResp = await sapApi.get(`/${SAP_CONFIG.SERVICE}?$filter=SpaceMatrixNumber%20eq%20'${candidate}'&$top=1`);
            const exists = (checkResp.data?.d?.results?.length) || (Array.isArray(checkResp.data?.value) && checkResp.data.value.length);
            if (!exists) return candidate;
            next++;
            candidate = prefix + String(next).padStart(Math.max(width, String(next).length), '0');
          } catch (err) {
            // if check fails, break and fallback
            console.warn('generateSpaceMatrixNumber: existence check failed, breaking to fallback', err.message);
            break;
          }
        }
      }
    }
  } catch (err) {
    console.warn('generateSpaceMatrixNumber: unable to read last number, falling back to timestamp', err.message);
  }

  // fallback: timestamp-based unique id
  return `SM${Date.now().toString().slice(-10)}`;
}

// Routes

// Get all gate entries from SAP
app.get('/api/gate-entries', async (req, res) => {
  try {
    console.log('Fetching gate entries from SAP...');
    const response = await sapApi.get(`/${SAP_CONFIG.SERVICE}`);
    
    // Handle both OData V2 and V4 formats
    let entries = [];
    if (response.data.d) {
      // OData V2 format
      entries = response.data.d.results || [];
    } else if (response.data.value) {
      // OData V4 format
      entries = response.data.value || [];
    }
    
    console.log(`Found ${entries.length} entries`);
    
    // Transform SAP data to frontend format
    const transformedEntries = entries.map(entry => ({
      id: entry.SAP_UUID || entry.SAP_UUID,
      spaceMatrixNumber: entry.SpaceMatrixNumber || entry.SpaceMatrixNumber,
      description: entry.SAP_Description || entry.SAP_Description,
      spaceMatrixName: entry.SpaceMatrixName || entry.SpaceMatrixName,
      creationDate: entry.SMCreationDate || entry.SMCreationDate,
      entryTime: entry.SMEntryTime || entry.SMEntryTime,
      poNumber: entry.SMPO || entry.SMPO,
      invoiceNumber: entry.SMInvoice || entry.SMInvoice,
      active: entry.Active || entry.Active,
      canceled: entry.Canceled || entry.Canceled,
      createdBy: entry.CreatedBy || entry.CreatedBy,
      supplierCode: entry.SupplierCode || entry.SupplierCode,
      supplierName: entry.SupplierName || entry.SupplierName,
      plant: entry.Plant || entry.Plant,
      sapcreationdate: entry.SAP_CreatedDateTime || entry.SAP_CreatedDateTime,
      status: entry.SAP_LifecycleStatus || entry.SAP_LifecycleStatus,
      statusText: entry.SAP_LifecycleStatus_Text || entry.SAP_LifecycleStatus_Text,
      lastChanged: entry.SAP_LastChangedDateTime || entry.SAP_LastChangedDateTime
    }));
    
    res.json(transformedEntries);
  } catch (error) {
    console.error('Error fetching SAP gate entries:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch gate entries from SAP',
      details: error.message 
    });
  }
});

// Get single gate entry
app.get('/api/gate-entries/:id', async (req, res) => {
  try {
    const response = await sapApi.get(`/${SAP_CONFIG.SERVICE}(guid'${req.params.id}')`);
    const entry = response.data.d || response.data;
    
    const transformedEntry = {
      id: entry.SAP_UUID,
      spaceMatrixNumber: entry.SpaceMatrixNumber,
      description: entry.SAP_Description,
      spaceMatrixName: entry.SpaceMatrixName,
      creationDate: entry.SMCreationDate,
      entryTime: entry.SMEntryTime,
      poNumber: entry.SMPO,
      invoiceNumber: entry.SMInvoice,
      active: entry.Active,
      canceled: entry.Canceled,
      createdBy: entry.CreatedBy,
      supplierCode: entry.SupplierCode,
      supplierName: entry.SupplierName,
      plant: entry.Plant,
      status: entry.SAP_LifecycleStatus,
      statusText: entry.SAP_LifecycleStatus_Text,
      lastChanged: entry.SAP_LastChangedDateTime
    };
    
    res.json(transformedEntry);
  } catch (error) {
    console.error('Error fetching SAP gate entry:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch gate entry from SAP',
      details: error.message 
    });
  }
});

// Create new gate entry in SAP
app.post('/api/gate-entries', async (req, res) => {
  try {
    const {
      spaceMatrixNumber,
      description,
      spaceMatrixName,
      poNumber,
      invoiceNumber,
      supplierCode,
      supplierName,
      plant
    } = req.body;

    // generate or use provided spaceMatrixNumber
    const generatedSM = await generateSpaceMatrixNumber(spaceMatrixNumber);

    // Generate current time in SAP format
    const now = new Date();
    const timeString = `PT${now.getHours()}H${now.getMinutes()}M${now.getSeconds()}S`;

    const payload = {
      SpaceMatrixNumber: generatedSM,
      SAP_Description: description || 'New Gate Entry',
      SpaceMatrixName: spaceMatrixName || 'SpaceMatrix',
      SMCreationDate: now.toISOString().split('T')[0] + 'T00:00:00',
      SMEntryTime: timeString,
      SMPO: poNumber || 'PO0001',
      SMInvoice: invoiceNumber || 'INV0001',
      Active: true,
      Canceled: "No",
      
      CreatedBy: "BTP",
      SupplierCode: supplierCode || 'SUP001',
      SupplierName: supplierName || 'Default Supplier',
      Plant: plant || '2110',
      SAP_LifecycleStatus: "N" // New
    };

    console.log('Creating SAP entry with payload:', payload);

    // 1. Fetch CSRF token
    const csrfResp = await sapApi.get(`/${SAP_CONFIG.SERVICE}`, {
      headers: { 'x-csrf-token': 'Fetch' }
    });
    const csrfToken = csrfResp.headers['x-csrf-token'];
    const cookies = csrfResp.headers['set-cookie'];

    if (!csrfToken) {
      throw new Error('Failed to fetch CSRF token from SAP');
    }

    // 2. Use CSRF token and cookies in POST
    const response = await sapApi.post(
      `/${SAP_CONFIG.SERVICE}`,
      payload,
      {
        headers: {
          'x-csrf-token': csrfToken,
          'Cookie': cookies ? cookies.join('; ') : undefined
        }
      }
    );

    res.status(201).json({
      id: response.data.d.SAP_UUID,
      message: 'Gate entry created successfully in SAP',
      data: response.data.d
    });
  } catch (error) {
    console.error('Error creating SAP gate entry:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to create gate entry in SAP',
      details: error.response?.data || error.message
    });
  }
});

// Gate In operation - Update status to Active
app.post('/api/gate-in', async (req, res) => {
  try {
    const { entryId, securityName, remarks } = req.body;

    const payload = {
      SAP_LifecycleStatus: "A", // Active
      SAP_Description: `GATE IN - ${securityName} - ${remarks} - ${new Date().toLocaleString()}`
    };

    console.log('Performing Gate In with payload:', payload);

    const response = await sapApi.patch(`/${SAP_CONFIG.SERVICE}(guid'${entryId}')`, payload);
    
    res.json({ 
      message: 'Gate In operation completed successfully',
      timestamp: new Date().toISOString(),
      data: response.data.d
    });
  } catch (error) {
    console.error('Error performing Gate In:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to perform Gate In operation',
      details: error.response?.data || error.message 
    });
  }
});

// Gate Out operation - Update status to Completed
app.post('/api/gate-out', async (req, res) => {
  try {
    const { entryId, securityName, remarks } = req.body;

    const payload = {
      SAP_LifecycleStatus: "C", // Completed
      SAP_Description: `GATE OUT - ${securityName} - ${remarks} - ${new Date().toLocaleString()}`,
      Active: false
    };

    console.log('Performing Gate Out with payload:', payload);

    const response = await sapApi.patch(`/${SAP_CONFIG.SERVICE}(guid'${entryId}')`, payload);
    
    res.json({ 
      message: 'Gate Out operation completed successfully',
      timestamp: new Date().toISOString(),
      data: response.data.d
    });
  } catch (error) {
    console.error('Error performing Gate Out:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to perform Gate Out operation',
      details: error.response?.data || error.message 
    });
  }
});

// Cancel gate entry
app.post('/api/cancel-entry', async (req, res) => {
  try {
    const { entryId, reason } = req.body;

    const payload = {
      Canceled: "Yes",
      SAP_LifecycleStatus: "X", // Cancelled
      SAP_Description: `CANCELLED - ${reason} - ${new Date().toLocaleString()}`
    };

    console.log('Cancelling entry with payload:', payload);

    const response = await sapApi.patch(`/${SAP_CONFIG.SERVICE}(guid'${entryId}')`, payload);
    
    res.json({ 
      message: 'Gate entry cancelled successfully',
      timestamp: new Date().toISOString(),
      data: response.data.d
    });
  } catch (error) {
    console.error('Error cancelling gate entry:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to cancel gate entry',
      details: error.response?.data || error.message 
    });
  }
});


// // API endpoint to create audit entry in custom business object
// app.post('/api/gate-entries/audit', async (req, res) => {
//   try {
//     const { originalData, modifiedData, changedBy, changeReason } = req.body;
    
//     console.log('Creating audit entry in custom business object...');
    
//     // Prepare payload for custom business object
//     const auditPayload = {
//       GateEntryNo: originalData.spaceMatrixNumber,
//       PONumner: modifiedData.PONumner || originalData.poNumber,
//       InvoiceNumber: modifiedData.InvoiceNumber || originalData.invoiceNumber,
//       Supplier: modifiedData.Supplier || originalData.supplierCode,
//       SupplierName: modifiedData.SupplierName || originalData.supplierName,
//       Remakrs: modifiedData.Remakrs || originalData.description,
//       OriginalData: JSON.stringify(originalData),
//       ModifiedData: JSON.stringify(modifiedData),
//       ChangedBy: changedBy,
//       ChangeReason: changeReason,
//       ChangeTimestamp: new Date().toISOString()
//     };

//     console.log('Audit Payload:', auditPayload);

//     // Post to custom business object
//     const response = await customSapApi.post(`/${CUSTOM_SAP_CONFIG.SERVICE2}`, auditPayload, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       }
//     });

//     console.log('Audit entry created successfully:', response.data);
    
//     res.json({
//       success: true,
//       message: 'Audit entry created successfully',
//       auditId: response.data.d?.ObjectId || response.data.ObjectId
//     });
    
//   } catch (error) {
//     console.error('Error creating audit entry:', {
//       message: error.message,
//       status: error.response?.status,
//       data: error.response?.data
//     });
    
//     res.status(500).json({
//       success: false,
//       error: 'Failed to create audit entry',
//       details: error.response?.data?.error?.message?.value || error.message
//     });
//   }
// });

// API endpoint to create audit entry in custom business object with CSRF token
// app.post('/api/gate-entries/audit', async (req, res) => {
//   try {
//     const { originalData, modifiedData, changedBy, changeReason } = req.body;
    
//     console.log('📝 Creating audit entry in custom business object...');
    
//     // Prepare payload for custom business object
//     const auditPayload = {
//       GateEntryNo: originalData.spaceMatrixNumber,
//       PONumner: modifiedData.PONumner || originalData.poNumber,
//       InvoiceNumber: modifiedData.InvoiceNumber || originalData.invoiceNumber,
//       Supplier: modifiedData.Supplier || originalData.supplierCode,
//       SupplierName: modifiedData.SupplierName || originalData.supplierName,
//       Remakrs: modifiedData.Remakrs || originalData.description,
//       OriginalData: JSON.stringify(originalData),
//       ModifiedData: JSON.stringify(modifiedData),
//       ChangedBy: changedBy,
//       ChangeReason: changeReason,
//       ChangeTimestamp: new Date().toISOString()
//     };

//     console.log('📦 Audit Payload:', auditPayload);

//     // Step 1: First get CSRF token from SAP
//     console.log('🔐 Fetching CSRF token...');
//     const csrfResponse = await customSapApi.get(`/${CUSTOM_SAP_CONFIG.SERVICE2}`, {
//       headers: {
//         'X-CSRF-Token': 'Fetch',
//         'Content-Type': 'application/json'
//       }
//     });

//     const csrfToken = csrfResponse.headers['x-csrf-token'];
//     console.log('✅ CSRF Token received:', csrfToken);

//     if (!csrfToken) {
//       throw new Error('No CSRF token received from SAP');
//     }

//     // Step 2: Now make the POST request with CSRF token
//     console.log('🚀 Sending POST request with CSRF token...');
//     const response = await customSapApi.post(`/${CUSTOM_SAP_CONFIG.SERVICE2}`, auditPayload, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'X-CSRF-Token': csrfToken,
//         'X-Requested-With': 'XMLHttpRequest'
//       }
//     });

//     console.log('✅ Audit entry created successfully:', response.data);
    
//     res.json({
//       success: true,
//       message: 'Audit entry created successfully',
//       auditId: response.data.d?.ObjectId || response.data.ObjectId
//     });
    
//   } catch (error) {
//     console.error('❌ Error creating audit entry:', {
//       message: error.message,
//       status: error.response?.status,
//       headers: error.response?.headers,
//       data: error.response?.data
//     });
    
//     res.status(500).json({
//       success: false,
//       error: 'Failed to create audit entry',
//       details: error.response?.data?.error?.message?.value || error.message,
//       sapStatusCode: error.response?.status
//     });
//   }
// });


// // API endpoint to create audit entry in custom business object
// app.post('/api/gate-entries/audit', async (req, res) => {
//   let sessionCookies = null;

//   try {
//     const { originalData, modifiedData, changedBy, changeReason } = req.body;
    
//     console.log('📝 Creating audit entry in custom business object...');
    
//     // Prepare payload for custom business object
//     const auditPayload = {
//       GateEntryNo: originalData.spaceMatrixNumber,
//       PONumner: modifiedData.PONumner || originalData.poNumber,
//       InvoiceNumber: modifiedData.InvoiceNumber || originalData.invoiceNumber,
//       Supplier: modifiedData.Supplier || originalData.supplierCode,
//       SupplierName: modifiedData.SupplierName || originalData.supplierName,
//       Remakrs: modifiedData.Remakrs || originalData.description,
//       OriginalData: JSON.stringify(originalData),
//       ModifiedData: JSON.stringify(modifiedData),
//       ChangedBy: changedBy,
//       ChangeReason: changeReason,
//       ChangeTimestamp: new Date().toISOString()
//     };

//     console.log('📦 Audit Payload:', auditPayload);

//     // Step 1: Create a new axios instance for this session
//     const sapSession = axios.create({
//       baseURL: CUSTOM_SAP_CONFIG.BASE_URL2,
//       auth: {
//         username: CUSTOM_SAP_CONFIG.USERNAME,
//         password: CUSTOM_SAP_CONFIG.PASSWORD
//       },
//       timeout: 30000,
//       withCredentials: true, // Important for session cookies
//       maxRedirects: 0 // Prevent redirects that might break session
//     });

//     // Step 2: Get CSRF token with session
//     console.log('🔐 Fetching CSRF token with session...');
//     const csrfResponse = await sapSession.get(`/${CUSTOM_SAP_CONFIG.SERVICE2}`, {
//       headers: {
//         'X-CSRF-Token': 'Fetch',
//         'Content-Type': 'application/json'
//       }
//     });

//     const csrfToken = csrfResponse.headers['x-csrf-token'];
//     const cookies = csrfResponse.headers['set-cookie'];
    
//     console.log('✅ CSRF Token received:', csrfToken);
//     console.log('🍪 Cookies received:', cookies);

//     if (!csrfToken) {
//       throw new Error('No CSRF token received from SAP');
//     }

//     // Step 3: Prepare headers with CSRF token and cookies
//     const headers = {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//       'X-CSRF-Token': csrfToken,
//       'X-Requested-With': 'XMLHttpRequest'
//     };

//     // Add cookies to headers if present
//     if (cookies) {
//       headers['Cookie'] = cookies.join('; ');
//     }

//     // Step 4: Send POST request with same session
//     console.log('🚀 Sending POST request with CSRF token and session...');
//     const response = await sapSession.post(`/${CUSTOM_SAP_CONFIG.SERVICE2}`, auditPayload, {
//       headers: headers
//     });

//     console.log('✅ Audit entry created successfully:', response.data);
    
//     res.json({
//       success: true,
//       message: 'Audit entry created successfully',
//       auditId: response.data.d?.ObjectId || response.data.ObjectId
//     });
    
//   } catch (error) {
//     console.error('❌ Error creating audit entry:');
//     console.error('Message:', error.message);
//     console.error('Status:', error.response?.status);
//     console.error('Response Headers:', error.response?.headers);
//     console.error('Response Data:', error.response?.data);
    
//     res.status(500).json({
//       success: false,
//       error: 'Failed to create audit entry',
//       details: error.response?.data || error.message
//     });
//   }
// });



// API endpoint to create audit entry in custom business object
app.post('/api/gate-entries/audit', async (req, res) => {
  try {
    const { originalData, modifiedData, changedBy, changeReason } = req.body;
    
    console.log('📝 Creating audit entry in custom business object...');
    
    // Prepare payload - ONLY use fields that exist in your SAP custom business object
    // Based on your earlier message, these are the valid fields:
    const auditPayload = {
      GateEntryNo: originalData.spaceMatrixNumber || 'N/A',
      PONumner: modifiedData.PONumner || originalData.poNumber || 'N/A',
      InvoiceNumber: modifiedData.InvoiceNumber || originalData.invoiceNumber || 'N/A',
      Supplier: modifiedData.Supplier || originalData.supplierCode || 'N/A',
      SupplierName: modifiedData.SupplierName || originalData.supplierName || 'N/A',
      Remakrs: modifiedData.Remakrs || originalData.description || 'N/A'
      // Remove OriginalData, ModifiedData, ChangedBy, ChangeReason, ChangeTimestamp 
      // as they don't exist in your SAP custom object
    };

    console.log('📦 Audit Payload (SAP Compatible):', auditPayload);

    // Create a new axios instance for this session
    const sapSession = axios.create({
      baseURL: CUSTOM_SAP_CONFIG.BASE_URL2,
      auth: {
        username: CUSTOM_SAP_CONFIG.USERNAME,
        password: CUSTOM_SAP_CONFIG.PASSWORD
      },
      timeout: 30000,
      withCredentials: true
    });

    // Get CSRF token
    console.log('🔐 Fetching CSRF token...');
    const csrfResponse = await sapSession.get(`/${CUSTOM_SAP_CONFIG.SERVICE2}`, {
      headers: {
        'X-CSRF-Token': 'Fetch',
        'Content-Type': 'application/json'
      }
    });

    const csrfToken = csrfResponse.headers['x-csrf-token'];
    const cookies = csrfResponse.headers['set-cookie'];
    
    console.log('✅ CSRF Token received:', csrfToken);

    if (!csrfToken) {
      throw new Error('No CSRF token received from SAP');
    }

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRF-Token': csrfToken,
      'X-Requested-With': 'XMLHttpRequest'
    };

    // Add cookies to headers if present
    if (cookies) {
      headers['Cookie'] = cookies.join('; ');
    }

    // Send POST request
    console.log('🚀 Sending POST request to SAP...');
    const response = await sapSession.post(`/${CUSTOM_SAP_CONFIG.SERVICE2}`, auditPayload, {
      headers: headers
    });

    console.log('✅ Audit entry created successfully:', response.data);
    
    res.json({
      success: true,
      message: 'Audit entry created successfully',
      auditId: response.data.d?.ObjectId || response.data.ObjectId,
      sapResponse: response.data
    });
    
  } catch (error) {
    console.error('❌ Error creating audit entry:');
    console.error('Message:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Response Data:', error.response?.data);
    
    res.status(500).json({
      success: false,
      error: 'Failed to create audit entry',
      details: error.response?.data?.error?.message?.value || error.message,
      sapStatusCode: error.response?.status
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SAP Gate Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Test SAP connection
app.get('/api/test-sap', async (req, res) => {
  try {
    const response = await sapApi.get(`/${SAP_CONFIG.SERVICE}?$top=1`);
    res.json({ 
      status: 'SUCCESS', 
      message: 'SAP connection successful',
      data: response.data 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'SAP connection failed',
      error: error.message,
      details: error.response?.data 
    });
  }
});

// expose generateSpaceMatrixNumber via HTTP
app.get('/api/generate-space-matrix-number', async (req, res) => {
  try {
    const next = await generateSpaceMatrixNumber();
    res.json({ spaceMatrixNumber: next });
  } catch (err) {
    console.error('Error generating SpaceMatrixNumber', err);
    res.status(500).json({ error: 'Failed to generate SpaceMatrixNumber' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SAP Gate Management Server running on port ${PORT}`);
  console.log(`📊 SAP Base URL: ${SAP_CONFIG.BASE_URL}`);
  console.log(`🔧 Service: ${SAP_CONFIG.SERVICE}`);
  console.log(`👤 Username: ${SAP_CONFIG.USERNAME}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Test SAP: http://localhost:${PORT}/api/test-sap`);
});  

