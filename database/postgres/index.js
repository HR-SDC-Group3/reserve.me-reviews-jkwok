const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'reserve_me',
});

pool.connect()
  .then(() => console.log('Connected to Postgres db'))
  .catch(err => console.error('Connection error:', err.stack));

const retrieveReviews = (restId, callback) => {
  pool.query(`SELECT * FROM reviews WHERE restaurant_id = ${restId}`, callback);
};

module.exports = {
  retrieveReviews,
};
