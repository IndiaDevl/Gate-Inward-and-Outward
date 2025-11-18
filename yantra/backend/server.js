// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2/promise');
// const bcrypt = require('bcrypt');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // DB pool (adjust DB_NAME in .env as needed)
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'root',
//   database: process.env.DB_NAME || 'sap',
//   waitForConnections: true,
//   connectionLimit: 10,
//   port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
// });

// /* -------------------- Basic routes -------------------- */
// app.get('/', (req, res) => {
//   res.send('Yantra backend is running');
// });

// app.get('/health', async (req, res) => {
//   try {
//     const conn = await pool.getConnection();
//     await conn.ping();
//     conn.release();
//     res.json({ ok: true, db: 'connected' });
//   } catch (err) {
//     res.status(500).json({ ok: false, error: 'DB connection failed', details: err.message });
//   }
// });

// /* -------------------- Products APIs -------------------- */

// // GET /api/products
// app.get('/api/products', async (req, res) => {
//   console.log('GET /api/products');
//   try {
//     const [rows] = await pool.query('SELECT * FROM yantra WHERE isAvailable = 1');
//     res.json(rows);
//   } catch (err) {
//     console.error('Error GET /api/products:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // GET /api/products/:id
// app.get('/api/products/:id', async (req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT * FROM yantra WHERE idyantra = ?', [req.params.id]);
//     if (!rows || rows.length === 0) return res.status(404).json({ error: 'Product not found' });
//     res.json(rows[0]);
//   } catch (err) {
//     console.error('Error GET /api/products/:id', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // POST /api/products (admin - minimal)
// app.post('/api/products', async (req, res) => {
//   try {
//     const { yantraName, brandName, brandDesc, productCategory, productSize, productColor, productPrice, stockQuantity, imageURL } = req.body;
//     const [result] = await pool.query(
//       `INSERT INTO yantra 
//       (yantraName, brandName, brandDesc, productCategory, productSize, productColor, productPrice, stockQuantity, imageURL) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [yantraName, brandName, brandDesc, productCategory, productSize, productColor, productPrice, stockQuantity, imageURL]
//     );
//     const inserted = { idyantra: result.insertId, ...req.body };
//     res.status(201).json(inserted);
//   } catch (err) {
//     console.error('Error POST /api/products', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// /* -------------------- Customers APIs -------------------- */

// // POST /api/customers/register
// app.post('/api/customers/register', async (req, res) => {
//   try {
//     const { fullName, email, password } = req.body;
//     if (!email || !password || !fullName) return res.status(400).json({ error: 'fullName, email and password required' });

//     // check exists in customers table
//     const [exists] = await pool.query('SELECT customerId FROM customer WHERE email = ?', [email]);
//     if (exists.length) return res.status(400).json({ error: 'Email already registered' });

//     const passwordHash = await bcrypt.hash(password, 10);
//     const [result] = await pool.query(
//       `INSERT INTO customer (fullName, email, passwordHash)
//        VALUES (?, ?, ?)`,
//       [fullName, email, passwordHash]
//     );
//     res.status(201).json({ customerId: result.insertId, fullName, email });
//   } catch (err) {
//     console.error('POST /api/customers/register error', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // POST /api/customers/login
// app.post('/api/customers/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ error: 'email and password required' });

//     const [rows] = await pool.query('SELECT * FROM customer WHERE email = ?', [email]);
//     if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });
//     const customer = rows[0];
//     const ok = await bcrypt.compare(password, customer.passwordHash);
//     if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

//     const safe = {
//       customerId: customer.customerId,
//       fullName: customer.fullName,
//       email: customer.email,
//       phoneNumber: customer.phoneNumber,
//       addressLine1: customer.addressLine1,
//       city: customer.city,
//       state: customer.state,
//       pincode: customer.pincode,
//       country: customer.country
//     };
//     res.json(safe);
//   } catch (err) {
//     console.error('Error POST /api/customers/login', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// /* -------------------- Orders APIs -------------------- */

// // POST /api/orders
// app.post('/api/orders', async (req, res) => {
//   try {
//     const { customerId, productId, quantity = 1, paymentMode = 'COD', shippingAddress } = req.body;
//     if (!customerId || !productId) return res.status(400).json({ error: 'customerId and productId are required' });

//     const [productRows] = await pool.query('SELECT * FROM yantra WHERE idyantra = ?', [productId]);
//     const product = productRows && productRows[0];
//     if (!product) return res.status(404).json({ error: 'Product not found' });
//     if (!product.isAvailable || product.stockQuantity < quantity) return res.status(400).json({ error: 'Not enough stock or unavailable' });

//     const priceAtPurchase = Number(product.productPrice || 0);
//     const discountApplied = Number(product.discountPercent || 0);
//     const totalBefore = priceAtPurchase * quantity;
//     const discountAmount = (discountApplied / 100) * totalBefore;
//     const totalAmount = Number((totalBefore - discountAmount).toFixed(2));

//     const [result] = await pool.query(
//       `INSERT INTO orders
//         (customerId, productId, quantity, priceAtPurchase, discountApplied, totalAmount, paymentMode, paymentStatus, shippingAddress)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [customerId, productId, quantity, priceAtPurchase, discountApplied, totalAmount, paymentMode, 'Paid', shippingAddress || null]
//     );

//     // reduce stock
//     await pool.query('UPDATE yantra SET stockQuantity = stockQuantity - ? WHERE idyantra = ?', [quantity, productId]);

//     res.status(201).json({ orderId: result.insertId, customerId, productId, quantity, totalAmount });
//   } catch (err) {
//     console.error('Error POST /api/orders', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // GET orders by customer
// app.get('/api/orders/customer/:customerId', async (req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT * FROM orders WHERE customerId = ? ORDER BY orderDate DESC', [req.params.customerId]);
//     res.json(rows);
//   } catch (err) {
//     console.error('Error GET /api/orders/customer/:customerId', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// /* -------------------- Start server with DB ping check -------------------- */
// const port = process.env.PORT ? Number(process.env.PORT) : 5200;

// (async () => {
//   try {
//     const conn = await pool.getConnection();
//     await conn.ping();
//     conn.release();

//     app.listen(port, () => {
//       console.log(`Yantra backend running on http://localhost:${port}`);
//     });
//   } catch (err) {
//     console.error('Cannot connect to database. Check MySQL server and .env settings.');
//     console.error(err);
//     process.exit(1);
//   }
// })();

// server.js (robust startup that tolerates incompatible existing schema)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_NAME = process.env.DB_NAME || 'sap';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
const HTTP_PORT = process.env.PORT ? Number(process.env.PORT) : 5200;

let pool;

/* ---------- helper functions to inspect schema ---------- */

async function createDatabaseIfMissing() {
  const conn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT
  });
  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
    console.log(`Database ensured: ${DB_NAME}`);
  } finally {
    await conn.end();
  }
}

async function tableExists(poolRef, tableName) {
  const [rows] = await poolRef.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = ? AND table_name = ?`,
    [DB_NAME, tableName]
  );
  return rows[0].cnt > 0;
}

async function getPrimaryKeyColumn(poolRef, tableName) {
  const [rows] = await poolRef.query(
    `SELECT k.COLUMN_NAME
     FROM information_schema.table_constraints t
     JOIN information_schema.key_column_usage k
       ON t.constraint_name = k.constraint_name
      AND t.table_schema = k.table_schema
      AND t.table_name = k.table_name
     WHERE t.constraint_type = 'PRIMARY KEY'
       AND t.table_schema = ?
       AND t.table_name = ?`,
    [DB_NAME, tableName]
  );
  return rows.length ? rows[0].COLUMN_NAME : null;
}

async function getColumnDef(poolRef, tableName, columnName) {
  const [rows] = await poolRef.query(
    `SELECT COLUMN_TYPE, COLUMN_KEY, IS_NULLABLE, DATA_TYPE, COLUMN_NAME, COLUMN_DEFAULT, EXTRA
     FROM information_schema.COLUMNS
     WHERE table_schema = ? AND table_name = ? AND column_name = ?`,
    [DB_NAME, tableName, columnName]
  );
  return rows.length ? rows[0] : null;
}

/* ---------- ensure schema, but tolerant to mismatches ---------- */

async function ensureSchema(poolRef) {
  try {
    // 1) customer table: if exists, inspect PK and customerId; otherwise create canonical customer.
    const customerExists = await tableExists(poolRef, 'customer');
    if (customerExists) {
      console.log('Found existing table `customer`.');
      
      // Check if customerId column exists and has auto_increment
      const col = await getColumnDef(poolRef, 'customer', 'customerId');
      if (!col) {
        console.warn('customerId column not found in existing `customer` table.');
        // Drop and recreate the table with proper structure
        await poolRef.query(`DROP TABLE \`customer\``);
        console.log('Dropped existing customer table to recreate with proper schema.');
      } else {
        const alreadyAI = (col.EXTRA || '').toLowerCase().includes('auto_increment');
        if (!alreadyAI) {
          console.log('customer.customerId is not AUTO_INCREMENT - fixing...');
          try {
            // First check if there's a primary key constraint we need to drop
            const pkCol = await getPrimaryKeyColumn(poolRef, 'customer');
            if (pkCol) {
              await poolRef.query(`ALTER TABLE \`customer\` DROP PRIMARY KEY`);
            }
            
            // Modify the column to be AUTO_INCREMENT PRIMARY KEY
            await poolRef.query(`ALTER TABLE \`customer\` MODIFY COLUMN \`customerId\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY`);
            console.log('Successfully made customer.customerId AUTO_INCREMENT PRIMARY KEY.');
          } catch (err) {
            console.warn('Could not modify customer.customerId:', err.message);
            console.log('Dropping and recreating customer table...');
            await poolRef.query(`DROP TABLE \`customer\``);
          }
        } else {
          console.log('customer.customerId already AUTO_INCREMENT - OK.');
        }
      }
    }

    // 2) create canonical customer table if not exists
    await poolRef.query(`
      CREATE TABLE IF NOT EXISTS \`customer\` (
        \`customerId\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`fullName\` VARCHAR(200) NOT NULL,
        \`email\` VARCHAR(200) NOT NULL UNIQUE,
        \`phoneNumber\` VARCHAR(30),
        \`passwordHash\` VARCHAR(255),
        \`addressLine1\` VARCHAR(255),
        \`addressLine2\` VARCHAR(255),
        \`city\` VARCHAR(100),
        \`state\` VARCHAR(100),
        \`pincode\` VARCHAR(30),
        \`country\` VARCHAR(100) DEFAULT 'India',
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('Ensured table: customer');

    // 3) ensure yantra
    await poolRef.query(`
      CREATE TABLE IF NOT EXISTS \`yantra\` (
        \`idyantra\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`yantraName\` VARCHAR(200),
        \`brandName\` VARCHAR(200),
        \`brandDesc\` LONGTEXT,
        \`brandRate\` DECIMAL(10,2) DEFAULT NULL,
        \`productCategory\` VARCHAR(100),
        \`productSize\` VARCHAR(50),
        \`productColor\` VARCHAR(50),
        \`productPrice\` DECIMAL(10,2) DEFAULT 0,
        \`discountPercent\` DECIMAL(5,2) DEFAULT 0,
        \`stockQuantity\` INT DEFAULT 0,
        \`imageURL\` VARCHAR(512),
        \`launchDate\` DATETIME NULL,
        \`isAvailable\` TINYINT(1) DEFAULT 1,
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('Ensured table: yantra');

    // 4) create orders — try WITH foreign keys; if incompatible, create WITHOUT FK as a fallback
    const createOrdersWithFK = `
      CREATE TABLE IF NOT EXISTS \`orders\` (
        \`orderId\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        \`customerId\` INT NOT NULL,
        \`productId\` INT NOT NULL,
        \`quantity\` INT DEFAULT 1,
        \`priceAtPurchase\` DECIMAL(10,2) NOT NULL,
        \`discountApplied\` DECIMAL(5,2) DEFAULT 0,
        \`totalAmount\` DECIMAL(10,2) NOT NULL,
        \`orderDate\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`status\` VARCHAR(50) DEFAULT 'Pending',
        \`paymentMode\` VARCHAR(50),
        \`paymentStatus\` VARCHAR(50) DEFAULT 'Pending',
        \`shippingAddress\` VARCHAR(512),
        \`trackingNumber\` VARCHAR(200),
        \`expectedDelivery\` DATE,
        CONSTRAINT orders_fk_customer FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`customerId\`) ON DELETE CASCADE,
        CONSTRAINT orders_fk_product FOREIGN KEY (\`productId\`) REFERENCES \`yantra\`(\`idyantra\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    try {
      await poolRef.query(createOrdersWithFK);
      console.log('Ensured table: orders (with FKs)');
    } catch (err) {
      // if FK creation failed due to incompatible columns, fallback to creating table without FKs
      console.warn('Could not create orders with foreign keys. Falling back to creating orders without foreign keys. Reason:', err.message);
      const createOrdersNoFK = `
        CREATE TABLE IF NOT EXISTS \`orders\` (
          \`orderId\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          \`customerId\` INT NOT NULL,
          \`productId\` INT NOT NULL,
          \`quantity\` INT DEFAULT 1,
          \`priceAtPurchase\` DECIMAL(10,2) NOT NULL,
          \`discountApplied\` DECIMAL(5,2) DEFAULT 0,
          \`totalAmount\` DECIMAL(10,2) NOT NULL,
          \`orderDate\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`status\` VARCHAR(50) DEFAULT 'Pending',
          \`paymentMode\` VARCHAR(50),
          \`paymentStatus\` VARCHAR(50) DEFAULT 'Pending',
          \`shippingAddress\` VARCHAR(512),
          \`trackingNumber\` VARCHAR(200),
          \`expectedDelivery\` DATE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await poolRef.query(createOrdersNoFK);
      console.log('Ensured table: orders (without FKs). NOTE: foreign key constraints were not added due to schema incompatibility; you may add them later after a manual schema fix.');
    }

    // 5) seed yantra if empty
    const [pcount] = await poolRef.query('SELECT COUNT(*) AS cnt FROM `yantra`');
    if (pcount[0].cnt === 0) {
      await poolRef.query(
        `INSERT INTO \`yantra\` (yantraName, brandName, brandDesc, productCategory, productSize, productColor, productPrice, discountPercent, stockQuantity, imageURL, launchDate, isAvailable)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Classic Tee',
          'Yantra Originals',
          '100% cotton tee',
          'T-Shirt',
          'M',
          'Black',
          400.0,
          10.0,
          10,
          'https://via.placeholder.com/300',
          new Date().toISOString().slice(0, 19).replace('T', ' '),
          1
        ]
      );
      console.log('Inserted sample product into yantra');
    }

  } catch (err) {
    console.error('Error ensuring schema:', err);
    throw err;
  }
}

/* ---------- API routes (use global pool) ---------- */

// basic health
app.get('/', (req, res) => res.send('Yantra backend is running'));
app.get('/health', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    res.json({ ok: true, db: 'connected' });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'DB connection failed', details: err.message });
  }
});

// products
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM yantra WHERE isAvailable = 1');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/products error', err);
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM yantra WHERE idyantra = ?', [req.params.id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /api/products/:id error', err);
    res.status(500).json({ error: 'Server error' });
  }
});
// POST /api/products/create  -- manual product creation (admin)
app.post('/api/products/create', async (req, res) => {
  try {
    // Accepts fields from JSON body
    const {
      yantraName,
      brandName,
      brandDesc,
      brandRate,
      productCategory,
      productSize,
      productColor,
      productPrice,
      discountPercent,
      stockQuantity,
      imageURL,
      launchDate,
      isAvailable
    } = req.body || {};

    // Basic validation
    if (!yantraName || !brandName) {
      return res.status(400).json({ error: 'yantraName and brandName are required' });
    }

    const price = productPrice !== undefined && productPrice !== null ? Number(productPrice) : 0;
    const discount = discountPercent !== undefined && discountPercent !== null ? Number(discountPercent) : 0;
    const stock = Number.isFinite(Number(stockQuantity)) ? parseInt(stockQuantity, 10) : 0;
    const rate = (brandRate !== undefined && brandRate !== null) ? Number(brandRate) : null;
    const available = (isAvailable === undefined || isAvailable === null) ? 1 : (Number(isAvailable) ? 1 : 0);

    // Parse launch date (accept ISO string or null)
    let launch = null;
    if (launchDate) {
      const d = new Date(launchDate);
      if (!isNaN(d.getTime())) launch = d; // mysql2 will handle JS Date => DATETIME
    }

    // default image placeholder if not provided
    const img = imageURL && imageURL.trim() ? imageURL.trim() : 'https://via.placeholder.com/300';

    const [result] = await pool.query(
      `INSERT INTO yantra 
        (yantraName, brandName, brandDesc, brandRate, productCategory, productSize, productColor, productPrice, discountPercent, stockQuantity, imageURL, launchDate, isAvailable)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        yantraName, brandName, brandDesc || null, rate, productCategory || null,
        productSize || null, productColor || null, price, discount, stock, img, launch, available
      ]
    );

    // return created record id
    res.status(201).json({
      idyantra: result.insertId,
      yantraName,
      brandName,
      productPrice: price,
      stockQuantity: stock,
      imageURL: img
    });
  } catch (err) {
    console.error('POST /api/products/create error', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});


// // customers (singular)
// app.post('/api/customers/register', async (req, res) => {
//   try {
//     const { fullName, email, password } = req.body;
//     if (!email || !password || !fullName) return res.status(400).json({ error: 'fullName, email and password required' });

//     // check existing
//     const [exists] = await pool.query('SELECT customerId FROM customer WHERE email = ?', [email]);
//     if (exists.length) return res.status(400).json({ error: 'Email already registered' });

//     const passwordHash = await bcrypt.hash(password, 10);
//     const [result] = await pool.query(
//       `INSERT INTO customer (fullName, email, passwordHash) VALUES (?, ?, ?)`,
//       [fullName, email, passwordHash]
//     );
//     res.status(201).json({ customerId: result.insertId, fullName, email });
//   } catch (err) {
//     console.error('POST /api/customers/register error', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
// app.post('/api/customers/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ error: 'email and password required' });

//     const [rows] = await pool.query('SELECT * FROM customer WHERE email = ?', [email]);
//     if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });

//     const customer = rows[0];
//     const ok = await bcrypt.compare(password, customer.passwordHash);
//     if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

//     const safe = {
//       customerId: customer.customerId,
//       fullName: customer.fullName,
//       email: customer.email,
//       phoneNumber: customer.phoneNumber,
//       addressLine1: customer.addressLine1,
//       city: customer.city,
//       state: customer.state,
//       pincode: customer.pincode,
//       country: customer.country
//     };
//     res.json(safe);
//   } catch (err) {
//     console.error('POST /api/customers/login error', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // orders
// app.post('/api/orders', async (req, res) => {
//   try {
//     const { customerId, productId, quantity = 1, paymentMode = 'COD', shippingAddress } = req.body;
//     if (!customerId || !productId) return res.status(400).json({ error: 'customerId and productId are required' });

//     const [productRows] = await pool.query('SELECT * FROM yantra WHERE idyantra = ?', [productId]);
//     const product = productRows && productRows[0];
//     if (!product) return res.status(404).json({ error: 'Product not found' });
//     if (!product.isAvailable || product.stockQuantity < quantity) return res.status(400).json({ error: 'Not enough stock or unavailable' });

//     const priceAtPurchase = Number(product.productPrice || 0);
//     const discountApplied = Number(product.discountPercent || 0);
//     const totalBefore = priceAtPurchase * quantity;
//     const discountAmount = (discountApplied / 100) * totalBefore;
//     const totalAmount = Number((totalBefore - discountAmount).toFixed(2));

//     const [result] = await pool.query(
//       `INSERT INTO orders (customerId, productId, quantity, priceAtPurchase, discountApplied, totalAmount, paymentMode, paymentStatus, shippingAddress)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [customerId, productId, quantity, priceAtPurchase, discountApplied, totalAmount, paymentMode, 'Paid', shippingAddress || null]
//     );

//     await pool.query('UPDATE yantra SET stockQuantity = stockQuantity - ? WHERE idyantra = ?', [quantity, productId]);

//     res.status(201).json({ orderId: result.insertId, customerId, productId, quantity, totalAmount });
//   } catch (err) {
//     console.error('POST /api/orders error', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// ---- debug-friendly register (replace existing) ----
app.post('/api/customers/register', async (req, res) => {
  try {
    let { fullName, email, password } = req.body || {};
    if (!email || !password || !fullName) return res.status(400).json({ error: 'fullName, email and password required' });

    email = String(email).trim().toLowerCase();
    fullName = String(fullName).trim();

    // check exists
    const [exists] = await pool.query('SELECT customerId FROM customer WHERE email = ?', [email]);
    if (exists.length) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO customer (fullName, email, passwordHash) VALUES (?, ?, ?)`,
      [fullName, email, passwordHash]
    );

    console.log(`Registered user ${email} -> id ${result.insertId} (hash len=${passwordHash.length})`);
    res.status(201).json({ customerId: result.insertId, fullName, email });
  } catch (err) {
    console.error('POST /api/customers/register error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---- debug-friendly login (replace existing) ----
app.post('/api/customers/login', async (req, res) => {
  try {
    let { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    email = String(email).trim().toLowerCase();

    const [rows] = await pool.query('SELECT * FROM customer WHERE email = ?', [email]);
    if (!rows.length) {
      console.warn(`Login: no user found for email="${email}"`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const customer = rows[0];
    const hash = customer.passwordHash || '';
    console.log(`Login attempt for ${email}: found id=${customer.customerId} hash_len=${(hash||'').length} hash_head=${hash.slice(0,6)}...`);

    if (!hash) {
      console.warn(`Login: user ${email} has no passwordHash stored`);
      return res.status(500).json({ error: 'Account invalid (no password set). Please re-register or contact admin.' });
    }

    const ok = await bcrypt.compare(password, hash);
    if (!ok) {
      console.warn(`Login: password mismatch for email=${email}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // success: return safe fields
    const safe = {
      customerId: customer.customerId,
      fullName: customer.fullName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      addressLine1: customer.addressLine1,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      country: customer.country
    };
    console.log(`Login success for email=${email} id=${customer.customerId}`);
    res.json(safe);
  } catch (err) {
    console.error('POST /api/customers/login error', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/orders/customer/:customerId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders WHERE customerId = ? ORDER BY orderDate DESC', [req.params.customerId]);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/orders/customer error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* ---------- startup sequence ---------- */

(async () => {
  try {
    await createDatabaseIfMissing();

    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      port: DB_PORT
    });

    await ensureSchema(pool);

    app.listen(HTTP_PORT, () => {
      console.log(`Yantra backend running on http://localhost:${HTTP_PORT}`);
    });
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
})();