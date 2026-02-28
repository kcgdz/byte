import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/newsdb',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = {
  query: <T = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> => {
    return pool.query(text, params);
  },

  getClient: () => pool.connect(),

  end: () => pool.end(),
};

export default db;
