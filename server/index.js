import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Data directory paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const IPS_FILE = path.join(DATA_DIR, 'ips.json');

// Ensure data directory exists
try {
  await fs.mkdir(DATA_DIR, { recursive: true });
} catch (error) {
  console.log('Data directory already exists or created');
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(express.json());

// Helper functions
async function readJsonFile(filePath, defaultData = []) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Initialize default admin user if no users exist
async function initializeDefaultUser() {
  const users = await readJsonFile(USERS_FILE, []);
  if (users.length === 0) {
    const hashedPassword = await bcryptjs.hash('admin123', 10);
    const defaultUser = {
      id: '1',
      name: 'Administrator',
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    await writeJsonFile(USERS_FILE, [defaultUser]);
    console.log('Default admin user created: admin@company.com / admin123');
  }
}

await initializeDefaultUser();

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readJsonFile(USERS_FILE, []);
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/register', authenticateToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const users = await readJsonFile(USERS_FILE, []);
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeJsonFile(USERS_FILE, users);

    res.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// IP management routes
app.get('/api/ips', authenticateToken, async (req, res) => {
  try {
    const ips = await readJsonFile(IPS_FILE, []);
    res.json(ips);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/ips', authenticateToken, async (req, res) => {
  try {
    const ips = await readJsonFile(IPS_FILE, []);
    const newIp = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    ips.push(newIp);
    await writeJsonFile(IPS_FILE, ips);
    res.json(newIp);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/ips/:id', authenticateToken, async (req, res) => {
  try {
    const ips = await readJsonFile(IPS_FILE, []);
    const index = ips.findIndex(ip => ip.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'IP not found' });
    }

    ips[index] = {
      ...ips[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await writeJsonFile(IPS_FILE, ips);
    res.json(ips[index]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/ips/:id', authenticateToken, async (req, res) => {
  try {
    const ips = await readJsonFile(IPS_FILE, []);
    const filteredIps = ips.filter(ip => ip.id !== req.params.id);
    
    if (filteredIps.length === ips.length) {
      return res.status(404).json({ error: 'IP not found' });
    }
    
    await writeJsonFile(IPS_FILE, filteredIps);
    res.json({ message: 'IP deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Export data
app.get('/api/export/:format', authenticateToken, async (req, res) => {
  try {
    const ips = await readJsonFile(IPS_FILE, []);
    const format = req.params.format;

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=ips-export.json');
      res.send(JSON.stringify(ips, null, 2));
    } else if (format === 'csv') {
      if (ips.length === 0) {
        return res.status(404).json({ error: 'No data to export' });
      }

      const headers = Object.keys(ips[0]).join(',');
      const rows = ips.map(ip => Object.values(ip).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(','));
      
      const csv = [headers, ...rows].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=ips-export.csv');
      res.send(csv);
    } else {
      res.status(400).json({ error: 'Invalid format' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});