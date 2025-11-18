// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const SAP_BASE_URL = 'https://my419577-api.s4hana.cloud.sap';
const SAP_ENTITY_ENDPOINT = '/sap/opu/odata/sap/YY1_PONUMBERRANGESTABLE_CDS/YY1_PONUMBERRANGESTABLE'; // Replace with your correct service/entity
const SAP_USER = 'APICUSTOMERINVOICE';
const SAP_PASS = 'SpaceMtarix@12345678';

app.post('/api/create-po-number', async (req, res) => {
  const {
    CompanyCode,
    DocumentType,
    PONumberRanges,
    SAP_Description,
    Tablelogic_ac,
    Testing
  } = req.body;

  const payload = {
    CompanyCode,
    DocumentType,
    PONumberRanges,
    SAP_Description: SAP_Description || 'Created from UI',
    Tablelogic_ac: Tablelogic_ac ?? true,
    Testing: Testing || 'Manual Test'
  };

  try {
    // Step 1: Get CSRF token
    const csrfResponse = await axios.get(
      `${SAP_BASE_URL}${SAP_ENTITY_ENDPOINT}`,
      {
        auth: {
          username: SAP_USER,
          password: SAP_PASS
        },
        headers: {
          'X-CSRF-Token': 'Fetch',
          'Accept': 'application/json'
        }
      }
    );

    const csrfToken = csrfResponse.headers['x-csrf-token'];
    const cookies = csrfResponse.headers['set-cookie'];

    // Step 2: POST with CSRF token
    const response = await axios.post(
      `${SAP_BASE_URL}${SAP_ENTITY_ENDPOINT}`,
      payload,
      {
        auth: {
          username: SAP_USER,
          password: SAP_PASS
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': csrfToken,
          'Cookie': cookies.join(';') // Send cookies back with POST
        }
      }
    );

    res.json({ success: true, message: 'PO Number Range created', data: response.data });

  } catch (error) {
    console.error('Error creating PO Number Range:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});


const PORT = 3010;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const app = express();

// app.use(cors());
// app.use(express.json());

// const SAP_BASE_URL = 'https://my419577-api.s4hana.cloud.sap';
// const SAP_ODATA_ENDPOINT = '/sap/opu/odata/sap/YY1_PONUMBERRANGESTABLE_CDS/YY1_PONUMBERRANGESTABLE';
// const SAP_USER = 'APICUSTOMERINVOICE';
// const SAP_PASS = 'SpaceMtarix@12345678';

// // Create PO Number Range
// app.post('/api/createPONumberRange', async (req, res) => {
//   try {
//     const { companyCode, documentType, poNumberRange, description, testing } = req.body;

//     if (!companyCode || !documentType || !poNumberRange) {
//       return res.status(400).json({ 
//         success: false,
//         error: 'CompanyCode, DocumentType and PONumberRanges are required fields'
//       });
//     }

//     const payload = {
//       CompanyCode: companyCode,
//       DocumentType: documentType,
//       PONumberRanges: poNumberRange,
//       SAP_Description: description || 'Created via Node.js API',
//       Tablelogic_ac: true,
//       Testing: testing || 'From Node.js'
//     };

//     const response = await axios.post(
//       `${SAP_BASE_URL}${SAP_ODATA_ENDPOINT}`,
//       payload,
//       {
//         auth: {
//           username: SAP_USER,
//           password: SAP_PASS
//         },
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       }
//     );

//     res.json({
//       success: true,
//       data: response.data,
//       message: 'PO Number Range created successfully'
//     });

//   } catch (error) {
//     console.error('Error creating PO Number Range:', error.response?.data || error.message);
//     res.status(500).json({
//       success: false,
//       error: error.response?.data || error.message
//     });
//   }
// });

// const PORT = process.env.PORT || 3010;
// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });