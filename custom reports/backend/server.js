// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const SAP_BASE_URL = 'https://my420794-api.s4hana.cloud.sap';
const ODATA_ENDPOINT = '/sap/opu/odata/sap/YY1_COLLECTION_REP_API_CDS/YY1_Collection_Rep_API';
const SAP_USERNAME = 'BTP_DEV_INTEGRATION';
const SAP_PASSWORD = 'BTP_DEV_Integration@12345678';

const auth = {
  username: SAP_USERNAME,
  password: SAP_PASSWORD
};

// Endpoint to get all collection reports
app.get('/api/collections', async (req, res) => {
  try {
    const response = await axios.get(`${SAP_BASE_URL}${ODATA_ENDPOINT}`, {
      auth,
      headers: {
        'Accept': 'application/json'
      }
    });

    const results = response.data.d.results;
    res.json(results);
  } catch (error) {
    console.error('Error fetching collection reports:', error.message);
    res.status(500).send('Error fetching data from SAP');
  }
});

const PORT = 3111;
app.listen(PORT, () => {
  console.log(`✅ Node.js server running on http://localhost:${PORT}`);
});
