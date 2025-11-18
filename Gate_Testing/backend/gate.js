// server.js (improved)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
// allow CORS for development (restrict in production)
app.use(cors({ origin: true, credentials: true }));

// === SAP config - prefer using env vars
const SAP_BASE_PO = process.env.SAP_BASE_PO || 'https://my430243-api.s4hana.cloud.sap/sap/opu/odata4/sap/api_purchaseorder_2/srvd_a2x/sap/purchaseorder/0001/';
const SAP_BASE_SO = process.env.SAP_BASE_SO || 'https://my430243-api.s4hana.cloud.sap/sap/opu/odata/sap/API_SALES_ORDER_SRV';
const SAP_USER_PO = process.env.SAP_USER_PO || 'BTPDEV_INTEGRATION';
const SAP_PASS_PO = process.env.SAP_PASS_PO || 'ZEQd}vfWrz]QRPg-rhn=>n7CM4Xtz@5R&D%J>aZ{';

const sapAxiosPO = axios.create({
  baseURL: SAP_BASE_PO,
  auth: { username: SAP_USER_PO, password: SAP_PASS_PO },
  headers: { Accept: 'application/json' },
  validateStatus: () => true,
});
const sapAxiosSO = axios.create({
  baseURL: SAP_BASE_SO,
  auth: { username: SAP_USER_PO, password: SAP_PASS_PO },
  headers: { Accept: 'application/json' },
  validateStatus: () => true,
});

// helper to normalize OData response (V4: data.value, V2: data.d.results, single: data.d)
function normalizeOData(respData) {
  if (!respData) return [];
  if (Array.isArray(respData)) return respData;
  if (respData.value) return respData.value;
  if (respData.d && respData.d.results) return respData.d.results;
  if (respData.d) return [respData.d];
  // fallback: return object inside array
  return [respData];
}

app.get('/api/purchaseorders', async (req, res) => {
  const poNumber = (req.query.PurchaseOrder || req.query.po || '').trim();
  if (!poNumber) return res.status(400).json({ error: 'Missing PurchaseOrder query param (e.g. ?PurchaseOrder=9000000001)' });

  // Candidates to try (order matters) — adjust if your SAP metadata shows different names
  const candidates = [
    `A_PurchaseOrderItem?$filter=PurchaseOrder eq '${poNumber}'&$format=json`,
    `A_PurchaseOrder?$filter=PurchaseOrder eq '${poNumber}'&$format=json`,
    `PurchaseOrder?$filter=PurchaseOrder eq '${poNumber}'&$format=json`,
    // Try direct key access (if endpoint supports it)
    `PurchaseOrder('${poNumber}')?$format=json`,
  ];

  let lastError = null;
  for (const path of candidates) {
    try {
      console.log('[SAP] Trying:', sapAxiosPO.defaults.baseURL + path);
      const resp = await sapAxiosPO.get(path);
      console.log(`[SAP] status ${resp.status} for ${path}`);
      if (resp.status >= 400) {
        lastError = { path, status: resp.status, data: resp.data };
        // if 404 try next candidate
        if (resp.status === 404) continue;
        // if 401/403 return immediately
        if (resp.status === 401 || resp.status === 403) {
          return res.status(resp.status).json({ error: 'SAP auth error', details: resp.data });
        }
        // try next candidate for other errors
        continue;
      }

      const items = normalizeOData(resp.data);
      // if we found meaningful items return them
      if (items && items.length > 0) {
        return res.json({ items });
      } else {
        // If empty results but 200, return empty array (valid)
        return res.json({ items: [] });
      }
    } catch (err) {
      console.error('[SAP REQUEST ERROR]', err.message, err.response?.status);
      lastError = { path, message: err.message, resp: err.response?.data };
      // try next candidate
    }
  }

  // if we come here, all candidates failed
  return res.status(502).json({
    error: 'Failed to fetch PO from SAP. Tried multiple endpoints.',
    lastError,
    note: 'Check SAP base URL, credentials, and entity set names (A_PurchaseOrderItem, A_PurchaseOrder, PurchaseOrder).'
  });
});

app.get('/api/salesorders/:soNumber', async (req, res) => {
  const soNumber = req.params.soNumber;
  try {
    const filter = `$filter=SalesOrder eq '${soNumber}'&$format=json`;
    const resp = await sapAxiosSO.get(`/A_SalesOrder?${filter}`);
    const results = resp.data?.d?.results || [];
    if (results.length === 0) return res.status(404).json({ error: 'Sales Order not found' });
    res.json(results[0]);
  } catch (err) {
    console.error('SO fetch error', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch sales order' });
  }
});

const PORT = process.env.PORT || 4610;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT} (proxy to SAP at ${SAP_BASE_PO})`));
