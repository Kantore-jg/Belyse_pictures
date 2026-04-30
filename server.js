import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5173;
const SECRET_KEY = process.env.JWT_SECRET || 'belyse-picture-secret';

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

const readJSON = (file) => {
  const filePath = path.join(DATA_DIR, `${file}.json`);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const writeJSON = (file, data) => {
  const filePath = path.join(DATA_DIR, `${file}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };

  // Auth
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const { users } = readJSON('users');
    const user = users.find((u) => u.email === email);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1d' });
      res.json({ token, user: { id: user.id, email: user.email } });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });

  // Photos
  app.get('/api/photos', (req, res) => {
    res.json(readJSON('photos'));
  });

  app.post('/api/photos', authenticate, upload.array('images'), (req, res) => {
    const photos = readJSON('photos');
    const newPhotos = req.files.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      title: req.body.title || file.originalname,
      category: req.body.category || 'general',
      url: `/uploads/${file.filename}`,
      featured: req.body.featured === 'true',
      createdAt: new Date().toISOString()
    }));
    const updatedPhotos = [...photos, ...newPhotos];
    writeJSON('photos', updatedPhotos);
    res.json(newPhotos);
  });

  app.delete('/api/photos/:id', authenticate, (req, res) => {
    let photos = readJSON('photos');
    const photoToDelete = photos.find((p) => p.id === req.params.id);
    if (photoToDelete && photoToDelete.url.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, photoToDelete.url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    photos = photos.filter((p) => p.id !== req.params.id);
    writeJSON('photos', photos);
    res.json({ success: true });
  });

  // Events
  app.get('/api/events', (req, res) => {
    res.json(readJSON('events'));
  });

  app.post('/api/events', authenticate, (req, res) => {
    const events = readJSON('events');
    const newEvent = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
    events.push(newEvent);
    writeJSON('events', events);
    res.json(newEvent);
  });

  app.delete('/api/events/:id', authenticate, (req, res) => {
    let events = readJSON('events');
    events = events.filter((e) => e.id !== req.params.id);
    writeJSON('events', events);
    res.json({ success: true });
  });

  // Bookings
  app.get('/api/bookings', authenticate, (req, res) => {
    res.json(readJSON('bookings'));
  });

  app.post('/api/bookings', (req, res) => {
    const bookings = readJSON('bookings');
    const newBooking = { 
      id: Date.now().toString(), 
      ...req.body, 
      status: 'pending',
      createdAt: new Date().toISOString() 
    };
    bookings.push(newBooking);
    writeJSON('bookings', bookings);
    res.json(newBooking);
  });

  app.patch('/api/bookings/:id', authenticate, (req, res) => {
    const bookings = readJSON('bookings');
    const index = bookings.findIndex((b) => b.id === req.params.id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...req.body };
      writeJSON('bookings', bookings);
      res.json(bookings[index]);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  });

  // Messages
  app.get('/api/messages', authenticate, (req, res) => {
    res.json(readJSON('messages'));
  });

  app.post('/api/messages', (req, res) => {
    const messages = readJSON('messages');
    const newMessage = { 
      id: Date.now().toString(), 
      ...req.body, 
      createdAt: new Date().toISOString() 
    };
    messages.push(newMessage);
    writeJSON('messages', messages);
    res.json(newMessage);
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
