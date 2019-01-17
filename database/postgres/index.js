const { Pool } = require('pg');
const { createRandomReviewPg } = require('../helpers.js');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'reserve_me',
});

pool.connect()
  .then(() => console.log('Connected to Postgres db'))
  .catch(err => console.error('Connection error:', err.stack));

const retrieveReviews = (restId, callback) => {
  pool.query(`SELECT * FROM reviews WHERE restaurant_id = ${restId};`, callback);
};

const addReview = (restId, callback) => {
  pool.query(`INSERT INTO reviews(restaurant_id,review_id,overall,food,service,ambience,value,\
    noise_level,recommend_to_friend,review_text,helpful_count,tags,reviewer_id,nickname,location,\
    review_count,date_dined) VALUES(${createRandomReviewPg(restId)});`, callback);
};

const deleteReviews = (restId, callback) => {
  pool.query(`DELETE FROM reviews WHERE restaurant_id = ${restId} AND id > 37042302;`, callback);
};



module.exports = {
  retrieveReviews,
  addReview,
  deleteReviews,
};
