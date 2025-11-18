const express = require('express');
const cors = require('cors');
const axios = require('axios');
const xml2js = require('xml2js');
const AdmZip = require('adm-zip');
const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions)); // Enable preflight for all routes

app.use(express.json());

// Your existing SAP configuration
const SAP_BASE_URL = 'https://my420794-api.s4hana.cloud.sap';
const SAP_USER = 'BTP_DEV_INTEGRATION';
const SAP_PASS = 'BTP_DEV_Integration@12345678';

// API to check reference ID - with CORS headers
app.get('/api/check-reference', async (req, res) => {
  try {
    const { referenceId } = req.query;
    
    if (!referenceId) {
      return res.status(400).json({ error: 'Reference ID is required' });
    }

    const response = await axios.get(
      `${SAP_BASE_URL}/sap/opu/odata/sap/YY1_BILLINGREPORTJOURNAL_CDS/YY1_BillingReportJournal`,
      {
        auth: { username: SAP_USER, password: SAP_PASS },
        params: {
          $filter: `DocumentReferenceID eq '${referenceId}'`,
          $select: 'BillingDocument,BillingDocumentType,CompanyCode,DocumentReferenceID'
        }
      }
    );

    const documents = response.data.d.results;
    
    if (!documents || documents.length === 0) {
      return res.status(404).json({ error: 'No billing documents found for this reference' });
    }

    // Explicitly set CORS headers in response
    res.header('Access-Control-Allow-Origin', corsOptions.origin);
    res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
    res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
    
    res.json({
      success: true,
      referenceId,
      billingDocuments: documents.map(doc => doc.BillingDocument)
    });

  } catch (error) {
    console.error('Reference Check Error:', error);
    res.status(500).json({ 
      error: 'Failed to check reference',
      details: error.message
    });
  }
});

// Your existing PDF download endpoint with CORS headers
app.post('/api/downloadBillingPDFs', async (req, res) => {
  try {
    // Your existing download logic...

    // Set CORS headers in response
    res.header('Access-Control-Allow-Origin', corsOptions.origin);
    res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
    res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
    
    // Your existing response logic...
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Error handling middleware with CORS headers
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.header('Access-Control-Allow-Origin', corsOptions.origin);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3008;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});