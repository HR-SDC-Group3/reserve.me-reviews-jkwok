require('newrelic');
const express = require('express');
const redis = require('redis');
const { redisPw } = require('../redis-config.js');

const client = redis.createClient({
  host: '54.183.9.244',
  port: 6379,
  password: `${redisPw}`,
});
client.on('connect', () => {
  console.log('Connected to Redis cache');
});
client.on('error', err => {
  console.log(`Redis Connection Error: ${err}`);
});

const app = express();
const port = 3004;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const _ = require('underscore');
// const db = require('./../database/index.js');           // if using MongoDB
const db = require('./../database/postgres/index.js');     // if using Postgres

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression({ threshold: 0 }));

app.use('/restaurants/:id', express.static(`${__dirname}/../client/dist`));

// MAKE SURE TO CHANGE THE PATH BELOW TO THE CORRECT LOADERIO FILE
app.use('/loaderio-c06363cb9e949c431c07196476e87a17.txt', express.static(`${__dirname}/../loaderio-c06363cb9e949c431c07196476e87a17.txt`));
app.use(morgan('tiny'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/restaurants/random/reviews', (req, res) => {
  let sort = 'newest';
  if (req.query.sort) {
    sort = req.query.sort;
  }

  let restId;
  if (Math.random() < 0.7) {
    restId = Math.ceil(Math.random() * 100) + 9900000;
  } else {
    restId = Math.floor(Math.random() * 9900000);
  }

  const sortReviews = (reviews) => {
    if (reviews.length > 0) {
      reviews = _.sortBy(reviews, (review) => {
        if (sort === 'newest') {
          return -review.reviewer.date_dined;
        }
        if (sort === 'highest_rating') {
          return -review.review.ratings.overall;
        }
        if (sort === 'lowest_rating') {
          return review.review.ratings.overall;
        }
      });
    }
    return reviews;
  };

  client.get(`${restId}`, (redisErr, cacheResults) => {
    if (cacheResults) {
      const sortedReviews = sortReviews(JSON.parse(cacheResults));
      return res.send(sortedReviews);
    }

    db.retrieveReviews(restId, (err, results) => {
      if (err) {
        res.status(500).send('Internal Server Error');
      }
      let reviews = results.rows.map((review) => {
        return {
          reviewer: {
            id: review.reviewer_id,
            nickname: review.nickname,
            location: review.location,
            review_count: review.review_count,
            date_dined: review.date_dined,
          },
          review: {
            id: review.id,
            ratings: {
              overall: review.overall,
              food: review.food,
              service: review.service,
              ambience: review.ambience,
              value: review.value,
              noise_level: review.noise_level,
            },
            recommend_to_friend: review.recommend_to_friend,
            text: review.review_text,
            helpful_count: review.helpful_count,
            tags: (review.tags === null) ? [] : review.tags.split('|'),
          },
        };
      });
      reviews = sortReviews(reviews);
      client.set(`${restId}`, JSON.stringify(reviews), 'EX', 3600);
      res.send(reviews);
    });
  });
});

app.get('/api/restaurants/:id/reviews', (req, res) => {
  let sort = 'newest';
  if (req.query.sort) {
    sort = req.query.sort;
  }
  const restId = parseInt(req.params.id, 10);
  const sortReviews = (reviews) => {
    if (reviews.length > 0) {
      reviews = _.sortBy(reviews, (review) => {
        if (sort === 'newest') {
          return -review.reviewer.date_dined;
        }
        if (sort === 'highest_rating') {
          return -review.review.ratings.overall;
        }
        if (sort === 'lowest_rating') {
          return review.review.ratings.overall;
        }
      });
    }
    return reviews;
  };

  client.get(`${restId}`, (redisErr, cacheResults) => {
    if (cacheResults) {
      const sortedReviews = sortReviews(JSON.parse(cacheResults));
      return res.send(sortedReviews);
    }

    db.retrieveReviews(restId, (err, results) => {
      if (err) {
        res.status(500).send('Internal Server Error');
      }
      let reviews = results.rows.map((review) => {
        return {
          reviewer: {
            id: review.reviewer_id,
            nickname: review.nickname,
            location: review.location,
            review_count: review.review_count,
            date_dined: review.date_dined,
          },
          review: {
            id: review.id,
            ratings: {
              overall: review.overall,
              food: review.food,
              service: review.service,
              ambience: review.ambience,
              value: review.value,
              noise_level: review.noise_level,
            },
            recommend_to_friend: review.recommend_to_friend,
            text: review.review_text,
            helpful_count: review.helpful_count,
            tags: (review.tags === null) ? [] : review.tags.split('|'),
          },
        };
      });
      reviews = sortReviews(reviews);
      client.set(`${restId}`, JSON.stringify(reviews), 'EX', 3600);
      res.send(reviews);
    });
  });
});

app.post('/api/restaurants/:id/reviews/', (req, res) => {
  const restId = parseInt(req.params.id, 10);
  db.addReview(restId, (err, results) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    }
    res.status(201).send(results);
  });
});

app.put('/api/restaurants/:id/reviews/:revid', (req, res) => {
  const restId = parseInt(req.params.id, 10);
  const revId = req.params.revid;
  const newText = req.body.review_text;
  db.updateReview(restId, revId, newText, (err, results) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    }
    res.send(results);
  });
});

app.delete('/api/restaurants/:id/reviews', (req, res) => {
  const restId = parseInt(req.params.id, 10);
  db.deleteReviews(restId, (err, results) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    }
    res.send(results);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
