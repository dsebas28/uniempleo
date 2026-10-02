const { Pool, types } = require('pg');
const path = require('path');
const fs = require('fs');

const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Tipos que PostgreSQL devuelve como texto y la API entrega como siempre:
types.setTypeParser(20, (v) => parseInt(v, 10));     // bigint (COUNT(*)) -> número
types.setTypeParser(1700, (v) => parseFloat(v));     // numeric (rating)  -> número
types.setTypeParser(16, (v) => (v === 't' ? 1 : 0)); // boolean -> 1 / 0 (el frontend compara con 1 y 0)
types.setTypeParser(1114, (v) => v);                 // timestamp -> 'YYYY-MM-DD HH:MM:SS'
types.setTypeParser(1082, (v) => v);                 // date      -> 'YYYY-MM-DD'

let pool;

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('Falta DATABASE_URL en backend/.env (ver backend/.env.example)');
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Las fechas se guardan en UTC, igual que hacía datetime('now') en SQLite.
      options: '-c TimeZone=UTC',
    });
  }
  return pool;
}

// Las consultas se escriben con "?" y se traducen a los parámetros posicionales
// de PostgreSQL ($1, $2...). Los valores nunca se concatenan al SQL.
function toPostgres(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

function statement(runner, sql) {
  const text = toPostgres(sql);
  return {
    async get(...params) {
      return (await runner.query(text, params)).rows[0];
    },
    async all(...params) {
      return (await runner.query(text, params)).rows;
    },
    // Los INSERT que necesitan el id nuevo terminan en "RETURNING id".
    async run(...params) {
      const result = await runner.query(text, params);
      return { changes: result.rowCount, lastInsertRowid: result.rows[0]?.id };
    },
  };
}

function wrap(runner) {
  return { prepare: (sql) => statement(runner, sql) };
}

function getDb() {
  return wrap(getPool());
}

// Ejecuta fn dentro de una transacción: o se guarda todo o no se guarda nada.
async function transaction(fn) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(wrap(client));
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function initializeDatabase() {
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  await getPool().query(schema);
  console.log('✅ Database schema initialized');
}

async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = { getDb, transaction, initializeDatabase, closeDatabase };
