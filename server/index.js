const express = require('express');

const app = express();
const port = 3004;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const db = require('./../database/index.js');

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
  let sortQuery = 'newest';
  if (req.query.sort) {
    sortQuery = req.query.sort;
  }
  const parsedId = parseInt(req.params.id, 10);
  db.retrieveReviews(parsedId, sortQuery, (err, results) => {
    if (err) {
      res.status(404).end();
    }
    res.send(results);
  });
});

app.post('/api/restaurants/:id/reviews/:qty', (req, res) => {
  const parsedId = parseInt(req.params.id, 10);
  const quantity = req.params.qty;
  db.addReviews(parsedId, quantity, (err, results) => {
    if (err) {
      res.status(404).end();
    }
    res.status(201).send(results);
  });
});

app.put('/api/restaurants/:id/reviews', (req, res) => {

});

app.delete('/api/restaurants/:id/reviews', (req, res) => {
  const parsedId = parseInt(req.params.id, 10);
  db.deleteReviews(parsedId, (err, results) => {
    if (err) {
      res.status(404).end();
    }
    res.send(results);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
