// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ SAP S/4HANA Public Cloud Configuration
const SAP_BASE_URL = 'https://my419577-api.s4hana.cloud.sap';
const SAP_ENTITY_ENDPOINT = '/sap/opu/odata/sap/YY1_PONUMBERRANGESTABLE_CDS/YY1_PONUMBERRANGESTABLE';
const SAP_USER = 'APICUSTOMERINVOICE';
const SAP_PASS = 'SpaceMtarix@12345678';

// ✅ MySQL Database Config
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sap'
});

// ✅ Cron Job: every 1 minute
cron.schedule('* * * * *', () => {
  console.log('🔍 Running job to check new records...');

  const selectQuery = 'SELECT * FROM potable';

  db.query(selectQuery, async (err, results) => {
    if (err) {
      console.error('❌ MySQL SELECT Error:', err.message);
      return;
    }

    for (const row of results) {
      try {
        // 🔐 Get CSRF Token from SAP
        const csrfResponse = await axios.get(`${SAP_BASE_URL}${SAP_ENTITY_ENDPOINT}`, {
          auth: { username: SAP_USER, password: SAP_PASS },
          headers: {
            'X-CSRF-Token': 'Fetch',
            'Accept': 'application/json'
          }
        });

        const csrfToken = csrfResponse.headers['x-csrf-token'];
        const cookies = csrfResponse.headers['set-cookie'];

        // 📨 Prepare Data Payload
        const payload = {
          CompanyCode: row.companycode,
          DocumentType: row.documenttype,
          PONumberRanges: row.ponumberranges,
          SAP_Description: row.SAP_Description || 'Auto from Node.js',
          Tablelogic_ac: row.Tablelogic_ac === 'yes',
          Testing: row.Testing || 'Node.js Auto Upload'
        };

        // 🚀 POST to SAP
        await axios.post(`${SAP_BASE_URL}${SAP_ENTITY_ENDPOINT}`, payload, {
          auth: { username: SAP_USER, password: SAP_PASS },
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': csrfToken,
            'Cookie': cookies.join(';')
          }
        });

        // ✅ Update as Uploaded
        const updateQuery = 'UPDATE potable SET uploaded = 1 WHERE companycode = ? AND documenttype = ?';
        db.query(updateQuery, [row.companycode, row.documenttype]);

        console.log(`✅ Uploaded: ${row.companycode} - ${row.documenttype}`);
      } catch (uploadError) {
        const errMsg = uploadError.response?.data || uploadError.message;
        console.error(`❌ Upload Failed for ${row.companycode}:`, errMsg);
      }
    }
  });
});

// ➕ Optional API to insert test data
app.post('/api/add-entry', (req, res) => {
  const { companycode, documenttype, ponumberranges, SAP_Description, Tablelogic_ac, Testing } = req.body;

  const insertQuery = `
    INSERT INTO potable (companycode, documenttype, ponumberranges, SAP_Description, Tablelogic_ac, Testing, uploaded)
    VALUES (?, ?, ?, ?, ?, ?, 0)
  `;

  db.query(
    insertQuery,
    [companycode, documenttype, ponumberranges, SAP_Description, Tablelogic_ac, Testing],
    (err, result) => {
      if (err) {
        console.error('❌ MySQL INSERT Error:', err.message);
        res.status(500).json({ success: false, error: err.message });
      } else {
        res.json({ success: true, message: '✅ Inserted into DB', id: result.insertId });
      }
    }
  );
});

// 🌐 Start Express Server
const PORT = 3011;
app.listen(PORT, () => {
  console.log(`🚀 Node.js server running at http://localhost:${PORT}`);
});
