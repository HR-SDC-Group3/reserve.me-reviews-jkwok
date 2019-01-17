const express = require('express');

const app = express();
const port = 3004;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const _ = require('underscore');
// const db = require('./../database/index.js');   // if using MongoDB
const db = require('./../database/postgres/index.js');     // if using Postgres

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(compression({ threshold: 0 }));

app.use('/restaurants/:id', express.static(`${__dirname}/../client/dist`));

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
  const parsedId = parseInt(req.params.id, 10);
  db.retrieveReviews(parsedId, (err, results) => {
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
          tags: review.tags.split('|'),
        },
      };
    });
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
    res.send(reviews);
  });
});

app.post('/api/restaurants/:id/reviews/', (req, res) => {
  const parsedId = parseInt(req.params.id, 10);
  db.addReview(parsedId, (err, results) => {
    if (err) {
      res.status(404).send();
    }
    res.status(201).send(results);
  });
});

app.put('/api/restaurants/:id/reviews/', (req, res) => {
  const parsedId = parseInt(req.params.id, 10);
  db.replaceReviews(parsedId, (err, results) => {
    if (err) {
      res.status(404).end();
    }
    res.send(results);
  });
});

app.delete('/api/restaurants/:id/reviews', (req, res) => {
  const parsedId = parseInt(req.params.id, 10);
  db.deleteReview(parsedId, (err, results) => {
    if (err) {
      res.status(404).end();
    }
    res.send(results);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
