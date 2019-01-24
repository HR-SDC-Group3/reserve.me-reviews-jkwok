require('newrelic');
const express = require('express');
const redis = require('redis');

const client = redis.createClient();
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

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression({ threshold: 0 }));

app.use('/restaurants/:id', express.static(`${__dirname}/../client/dist`));
app.use('/loaderio-eec1eb86093cadbb70df3564bb98f2a6.txt', express.static(`${__dirname}/../loaderio-eec1eb86093cadbb70df3564bb98f2a6.txt`));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
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
        res.status(404).end();
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
      client.set(`${restId}`, JSON.stringify(reviews), redis.print);
      res.send(reviews);
    });
  });
});

app.post('/api/restaurants/:id/reviews/', (req, res) => {
  const restId = parseInt(req.params.id, 10);
  db.addReview(restId, (err, results) => {
    if (err) {
      res.status(404).send();
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
      res.status(404).end();
    }
    res.send(results);
  });
});

app.delete('/api/restaurants/:id/reviews', (req, res) => {
  const restId = parseInt(req.params.id, 10);
  db.deleteReviews(restId, (err, results) => {
    if (err) {
      res.status(404).end();
    }
    res.send(results);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
