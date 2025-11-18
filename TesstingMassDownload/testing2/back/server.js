// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// const path = require('path');
// const xml2js = require('xml2js');

// const app = express();
// const port = process.env.PORT || 4403;

// app.use(cors());
// app.use(express.json());
// app.use(express.static(path.join(__dirname)));

// // SAP API credentials
// const SAP_BASE_URL = "https://my420794-api.s4hana.cloud.sap";
// const AUTH = {
//   username: "BTP_DEV_INTEGRATION",
//   password: "BTP_DEV_Integration@12345678"
// };

// // Endpoint to get billing documents by reference ID
// app.get('/api/billing-documents', async (req, res) => {
//   try {
//     const { referenceId } = req.query;
    
//     if (!referenceId) {
//       return res.status(400).json({ error: 'Reference ID is required' });
//     }

//     const sapUrl = `${SAP_BASE_URL}/sap/opu/odata/sap/YY1_BILLINGREPORTJOURNAL_CDS/YY1_BillingReportJournal?$filter=DocumentReferenceID eq '${referenceId}'`;
    
//     const response = await axios.get(sapUrl, {
//       auth: AUTH,
//       headers: { Accept: 'application/xml' }
//     });

//     xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
//       if (err) {
//         console.error('XML parse error:', err);
//         return res.status(500).json({ error: 'Error parsing XML response' });
//       }

//       const entries = result.feed.entry;
//       if (!entries) {
//         return res.status(404).json({ error: 'No billing documents found for this reference' });
//       }

//       // Handle single entry or multiple entries
//       const entryArray = Array.isArray(entries) ? entries : [entries];
//       const documents = entryArray.map(e => ({
//         billingDocument: e.content['m:properties']['d:BillingDocument'],
//         documentType: e.content['m:properties']['d:BillingDocumentType'],
//         companyCode: e.content['m:properties']['d:CompanyCode'],
//         referenceId: e.content['m:properties']['d:DocumentReferenceID']
//       }));

//       res.json({
//         success: true,
//         referenceId,
//         count: documents.length,
//         documents
//       });
//     });

//   } catch (error) {
//     console.error('SAP API Error:', error.message);
//     res.status(500).json({ 
//       error: 'Failed to fetch billing documents',
//       details: error.message
//     });
//   }
// });

// // Endpoint to download PDF for a billing document
// app.get('/api/download-pdf', async (req, res) => {
//   try {
//     const { billingDocument } = req.query;
    
//     if (!billingDocument) {
//       return res.status(400).json({ error: 'Billing document number is required' });
//     }

//     const pdfUrl = `${SAP_BASE_URL}/sap/opu/odata/sap/API_BILLING_DOCUMENT_SRV/GetPDF?BillingDocument='${billingDocument}'`;
    
//     const response = await axios.get(pdfUrl, {
//       auth: AUTH,
//       headers: { Accept: 'application/xml' },
//       responseType: 'text'
//     });

//     xml2js.parseString(response.data, (err, result) => {
//       if (err) {
//         console.error('PDF XML parse error:', err);
//         return res.status(500).json({ error: 'Error parsing PDF response' });
//       }

//       const pdfBase64 = result['d:GetPDF']['d:BillingDocumentBinary'][0];
//       if (!pdfBase64) {
//         return res.status(404).json({ error: 'PDF content not found in response' });
//       }

//       // Send the PDF file
//       const pdfBuffer = Buffer.from(pdfBase64, 'base64');
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=Billing_${billingDocument}.pdf`);
//       res.send(pdfBuffer);
//     });

//   } catch (error) {
//     console.error('PDF Download Error:', error.message);
//     res.status(500).json({ 
//       error: 'Failed to download PDF',
//       details: error.message
//     });
//   }
// });

// app.listen(port, () => {
//   console.log(`✅ Server running at http://localhost:${port}`);
// });


// // server.js
// const express = require('express');
// const cors = require('cors');
// const app = express();
// const port = 4404;

// // Enable CORS - temporarily permissive for debugging
// app.use(cors());

// // Test endpoint
// app.get('/api/test', (req, res) => {
//   res.json({ message: "Backend is working!" });
// });

// // Your actual endpoint
// app.get('/api/billing-documents', async (req, res) => {
//   try {
//     const { referenceId } = req.query;
//     console.log(`Received request for referenceId: ${referenceId}`);
//     // Your implementation here...
//     res.json({ success: true, documents: [] }); // Sample response
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(port, '0.0.0.0', () => {
//   console.log(`✅ Backend running on http://localhost:${port}`);
// });


// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const xml2js = require('xml2js');
// const app = express();
// const port = 4404;

// // Configure CORS properly
// app.use(cors({
//   origin: 'http://localhost:5173', // Your React dev server port
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type']
// }));

// // SAP Configuration
// const SAP_BASE_URL = "https://my420794-api.s4hana.cloud.sap";
// const AUTH = {
//   username: "BTP_DEV_INTEGRATION",
//   password: "BTP_DEV_Integration@12345678"
// };

// // API to get billing documents by reference ID
// app.get('/api/billing-documents', async (req, res) => {
//   try {
//     const { referenceId } = req.query;
    
//     if (!referenceId) {
//       return res.status(400).json({ error: 'Reference ID is required' });
//     }

//     const sapUrl = `${SAP_BASE_URL}/sap/opu/odata/sap/YY1_BILLINGREPORTJOURNAL_CDS/YY1_BillingReportJournal?$filter=DocumentReferenceID eq '${referenceId}'`;
    
//     const response = await axios.get(sapUrl, {
//       auth: AUTH,
//       headers: { Accept: 'application/xml' }
//     });

//     xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
//       if (err) {
//         console.error('XML parse error:', err);
//         return res.status(500).json({ error: 'Error parsing XML response' });
//       }

//       if (!result.feed || !result.feed.entry) {
//         return res.status(404).json({ error: 'No billing documents found' });
//       }

//       const entries = Array.isArray(result.feed.entry) ? result.feed.entry : [result.feed.entry];
//       const documents = entries.map(entry => ({
//         billingDocument: entry.content['m:properties']['d:BillingDocument'],
//         documentType: entry.content['m:properties']['d:BillingDocumentType'],
//         companyCode: entry.content['m:properties']['d:CompanyCode'],
//         referenceId: entry.content['m:properties']['d:DocumentReferenceID']
//       }));

//       res.json({
//         success: true,
//         referenceId,
//         count: documents.length,
//         documents
//       });
//     });

//   } catch (error) {
//     console.error('SAP API Error:', error.message);
//     res.status(500).json({ 
//       error: 'Failed to fetch billing documents',
//       details: error.message
//     });
//   }
// });

// // API to download PDF
// app.get('/api/download-pdf', async (req, res) => {
//   try {
//     const { billingDocument } = req.query;
    
//     if (!billingDocument) {
//       return res.status(400).json({ error: 'Billing document number is required' });
//     }

//     const pdfUrl = `${SAP_BASE_URL}/sap/opu/odata/sap/API_BILLING_DOCUMENT_SRV/GetPDF?BillingDocument='${billingDocument}'`;
    
//     const response = await axios.get(pdfUrl, {
//       auth: AUTH,
//       headers: { Accept: 'application/xml' },
//       responseType: 'text'
//     });

//     xml2js.parseString(response.data, (err, result) => {
//       if (err) {
//         console.error('PDF XML parse error:', err);
//         return res.status(500).json({ error: 'Error parsing PDF response' });
//       }

//       const pdfBase64 = result['d:GetPDF']['d:BillingDocumentBinary'][0];
//       if (!pdfBase64) {
//         return res.status(404).json({ error: 'PDF content not found' });
//       }

//       const pdfBuffer = Buffer.from(pdfBase64, 'base64');
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=Billing_${billingDocument}.pdf`);
//       res.send(pdfBuffer);
//     });

//   } catch (error) {
//     console.error('PDF Download Error:', error.message);
//     res.status(500).json({ 
//       error: 'Failed to download PDF',
//       details: error.message
//     });
//   }
// });

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date() });
// });

// app.listen(port, '0.0.0.0', () => {
//   console.log(`✅ Backend running on http://localhost:${port}`);
// });






// // backend/server.js
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// const xml2js = require('xml2js');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = 3017;

// // SAP credentials and endpoint
// const SAP_BASE_URL = 'https://my420794-api.s4hana.cloud.sap';
// const SAP_USER = 'BTP_DEV_INTEGRATION';
// const SAP_PASSWORD = 'BTP_DEV_Integration@12345678';

// const auth = {
//   username: SAP_USER,
//   password: SAP_PASSWORD,
// };

// // Endpoint: /billing/MH2511000025
// app.get('/billing/:referenceId', async (req, res) => {
//   const { referenceId } = req.params;

//   const url = `${SAP_BASE_URL}/sap/opu/odata/sap/YY1_BILLINGREPORTJOURNAL_CDS/YY1_BillingReportJournal?$filter=DocumentReferenceID eq '${referenceId}'`;

//   try {
//     const response = await axios.get(url, {
//       auth,
//       headers: {
//         Accept: 'application/xml',
//       },
//     });

//     // Convert XML to JSON
//     xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
//       if (err) return res.status(500).send('Parsing error');

//       const entries = result['feed']?.['entry'];
//       if (!entries || entries.length === 0) return res.status(404).send('No data found');

//       // Support single or multiple entries
//       const content = Array.isArray(entries)
//         ? entries[0]['content']['m:properties']
//         : entries['content']['m:properties'];

//       const parsed = {};
//       for (const key in content) {
//         parsed[key.replace('d:', '')] = content[key];
//       }

//       res.json(parsed);
//     });
//   } catch (error) {
//     console.error('SAP API error:', error.message);
//     res.status(500).send('Error fetching from SAP');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`✅ Node.js server running at http://localhost:${PORT}`);
// });

// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const AdmZip = require('adm-zip');

// const app = express();

// // ✅ CORS middleware (place at the top)
// const corsOptions = {
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// };

// app.use(cors(corsOptions));


// app.use(express.json());

// // SAP Credentials
// const SAP_BASE_URL = 'https://my420794-api.s4hana.cloud.sap';
// const SAP_USERNAME = 'BTP_DEV_INTEGRATION';
// const SAP_PASSWORD = 'BTP_DEV_Integration@12345678';

// const CDS_URL = `${SAP_BASE_URL}/sap/opu/odata/sap/YY1_PONUMBERRANGESTABLE_CDS/YY1_PONUMBERRANGESTABLE`;

// // Auth headers
// const getAuthHeader = () => ({
//   auth: {
//     username: SAP_USERNAME,
//     password: SAP_PASSWORD,
//   },
//   headers: {
//     Accept: 'application/json',
//   },
// });

// // SAP PDF download function
// const getBillingDocumentPDF = async (billingNumber) => {
//   try {
//     const response = await axios.get(
//       `${SAP_BASE_URL}/sap/opu/odata/sap/API_BILLING_DOCUMENT_SRV/GetPDF?A_BillingDocument='${billingNumber}'`,
//       {
//         responseType: 'arraybuffer',
//         ...getAuthHeader(),
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching PDF for billing: ${billingNumber}`, error.message);
//     return null;
//   }
// };

// // API Endpoint
// app.post('/api/downloadBillingPDFsByReference', async (req, res) => {
//   const { referenceNumber } = req.body;

//   try {
//     const cdsRes = await axios.get(
//       `${CDS_URL}?$filter=Reference eq '${referenceNumber}'`,
//       getAuthHeader()
//     );

//     const results = cdsRes.data?.d?.results || [];
//     if (results.length === 0) {
//       return res.status(404).json({ message: 'No billing documents found for reference number' });
//     }

//     const billingDocs = results.map((item) => item.BillingDocument);
//     const zip = new AdmZip();

//     for (let doc of billingDocs) {
//       const pdfBuffer = await getBillingDocumentPDF(doc);
//       if (pdfBuffer) {
//         zip.addFile(`Billing_${doc}.pdf`, pdfBuffer);
//       }
//     }

//     const zipBuffer = zip.toBuffer();
//     const zipBase64 = zipBuffer.toString('base64');
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // ✅ Explicit CORS header
//     res.json({ zipFile: zipBase64 });
//   } catch (err) {
//     console.error('Error:', err.message);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Start server
// app.listen(3018, () => {
//   console.log('✅ Server running on http://localhost:3018');
// });

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const xml2js = require('xml2js');
const AdmZip = require('adm-zip');
const app = express();

// Enhanced CORS and middleware
app.use(cors({
  origin: ['http://localhost:3019', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

const SAP_BASE_URL = 'https://my420794-api.s4hana.cloud.sap';
const SAP_USER = 'BTP_DEV_INTEGRATION';
const SAP_PASS = 'BTP_DEV_Integration@12345678';

// Improved SAP request handler with better error handling
const makeSapRequest = async (url, options = {}) => {
  try {
    const response = await axios({
      url,
      method: options.method || 'GET',
      auth: { username: SAP_USER, password: SAP_PASS },
      headers: { 
        Accept: options.accept || 'application/json',
        ...options.headers
      },
      responseType: options.responseType || 'json',
      timeout: 20000
    });
    return response.data;
  } catch (error) {
    console.error('SAP API Error:', {
      url,
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error(`SAP request failed: ${error.message}`);
  }
};

// Fixed endpoint URL (corrected typo)
app.post('/api/downloadBillingPDFsByReference', async (req, res) => {
  try {
    const { referenceId } = req.body;
    
    // Validate input
    if (!referenceId) {
      return res.status(400).json({ 
        error: 'Missing referenceId',
        solution: 'Please provide a reference document ID'
      });
    }

    // 1. Fetch billing documents by reference
    const billingData = await makeSapRequest(
      `${SAP_BASE_URL}/sap/opu/odata/sap/API_BILLING_DOCUMENT_SRV/A_BillingDocument?$filter=ReferenceDocument eq '${referenceId}'`
    );

    const documents = billingData.d?.results || [];
    if (documents.length === 0) {
      return res.status(404).json({ 
        error: 'No documents found',
        referenceId
      });
    }

    // 2. Download PDFs
    const zip = new AdmZip();
    const results = [];
    
    for (const doc of documents) {
      try {
        const pdfData = await makeSapRequest(
          `${SAP_BASE_URL}/sap/opu/odata/sap/API_BILLING_DOCUMENT_SRV/GetPDF?BillingDocument='${doc.BillingDocument}'`,
          { 
            accept: 'application/xml',
            responseType: 'text'
          }
        );

        const parsed = await xml2js.parseStringPromise(pdfData);
        const pdfContent = parsed['d:GetPDF']?.['d:BillingDocumentBinary']?.[0];
        
        if (pdfContent) {
          zip.addFile(
            `Billing_${doc.BillingDocument}.pdf`, 
            Buffer.from(pdfContent, 'base64')
          );
          results.push({ success: true, document: doc.BillingDocument });
        } else {
          results.push({ 
            success: false, 
            document: doc.BillingDocument,
            error: 'No PDF content found' 
          });
        }
      } catch (error) {
        results.push({
          success: false,
          document: doc.BillingDocument,
          error: error.message
        });
      }
    }

    if (zip.getEntries().length === 0) {
      return res.status(404).json({
        error: 'No PDFs could be downloaded',
        results
      });
    }

    // 3. Return zip file
    res.json({
      success: true,
      zipFile: zip.toBuffer().toString('base64'),
      documentCount: zip.getEntries().length,
      results
    });

  } catch (error) {
    console.error('Endpoint Error:', {
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      reference: 'SERVER_LOGS_' + Date.now()
    });
  }
});

const PORT = process.env.PORT || 3019;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`SAP Base URL: ${SAP_BASE_URL}`);
});