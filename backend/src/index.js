require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { initializeDatabase } = require('./database/db');
const { seedDatabase } = require('./database/seed');

// Routes
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Centralized API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404 handler
app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Initialize DB and start server
async function start() {
  try {
    initializeDatabase();
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`\n🚀 UniEmpleo Backend corriendo en http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`\n📧 Credenciales de prueba:`);
      console.log(`   Estudiante: estudiante@demo.com / demo1234`);
      console.log(`   Empresa:    empresa@demo.com / demo1234`);
      console.log(`   Admin:      admin@uniempleo.com / admin1234\n`);
    });
  } catch (err) {
    console.error('Error iniciando el servidor:', err);
    process.exit(1);
  }
}

start();
