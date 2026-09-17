const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'uniempleo.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

// Añade columnas nuevas a tablas ya existentes (CREATE TABLE IF NOT EXISTS no las agrega)
function ensureColumn(database, table, column, definition) {
  const existing = database.prepare(`PRAGMA table_info(${table})`).all();
  if (!existing.some(c => c.name === column)) {
    database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

function runMigrations(database) {
  ensureColumn(database, 'students', 'headline', 'TEXT');
  ensureColumn(database, 'students', 'available_travel', 'INTEGER DEFAULT 0');
  ensureColumn(database, 'students', 'available_relocate', 'INTEGER DEFAULT 0');
  ensureColumn(database, 'students', 'has_vehicle', 'INTEGER DEFAULT 0');
  ensureColumn(database, 'students', 'birth_date', 'TEXT');
  ensureColumn(database, 'students', 'gender', 'TEXT');
  ensureColumn(database, 'students', 'nationality', 'TEXT');
  ensureColumn(database, 'students', 'marital_status', 'TEXT');
  ensureColumn(database, 'students', 'document_id', 'TEXT');
  ensureColumn(database, 'students', 'address', 'TEXT');
  ensureColumn(database, 'students', 'department', 'TEXT');
  ensureColumn(database, 'students', 'country', "TEXT DEFAULT 'Colombia'");
  ensureColumn(database, 'students', 'education_level', 'TEXT');
  ensureColumn(database, 'students', 'interests', 'TEXT');
}

function initializeDatabase() {
  const database = getDb();
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  database.exec(schema);
  runMigrations(database);
  console.log('✅ Database schema initialized');
  return database;
}

module.exports = { getDb, initializeDatabase };
