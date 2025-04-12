require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.SUPABASE_DB_URL,
    }
  },
  migrations: {
    directory: './src/database/migrations'
  },
}
