const uri = 'mongodb://localhost:27017/reserve-me';
const mongoose = require('mongoose');
const { createRandomReview } = require('./helpers.js');

const serverOptions = {
  auto_reconnect: true,
  socketOptions: {
    keepAlive: 1,
    connectTimeoutMS: 9000000,
    socketTimeoutMS: 9000000,
  },
};
const conn = mongoose.createConnection(uri, {
  server: serverOptions,
  useCreateIndex: true,
  useNewUrlParser: true,
});

const reviewsSchema = mongoose.Schema({
  name: String,
  restaurant: {
    id: Number,
  },
  reviewer: {
    id: {
      type: Number,
      unique: true,
    },
    nickname: String,
    location: String,
    review_count: Number,
    date_dined: Date,
  },
  review: {
    id: {
      type: Number,
      unique: true,
    },
    ratings: {
      overall: Number,
      food: Number,
      service: Number,
      ambience: Number,
      value: Number,
      noise_level: String,
    },
    recommend_to_friend: Boolean,
    text: String,
    helpful_count: Number,
    tags: [String],
  },
});

const reviewSchema = mongoose.Schema({
  reviewer: {
    id: {
      type: Number,
      unique: true,
    },
    nickname: String,
    location: String,
    review_count: Number,
    date_dined: Date,
  },
  review: {
    id: {
      type: Number,
      unique: true,
    },
    ratings: {
      overall: Number,
      food: Number,
      service: Number,
      ambience: Number,
      value: Number,
      noise_level: String,
    },
    recommend_to_friend: Boolean,
    text: String,
    helpful_count: Number,
    tags: [String],
  },
});

const restaurantSchema = mongoose.Schema({
  _id: Number,
  name: String,
  reviews: [reviewSchema],
});

const Restaurant = conn.model('Restaurant', restaurantSchema);
// const Review = conn.model('Review', reviewsSchema);

const save = (reviews, callback) => {
  Restaurant.insertMany(reviews, callback);
};

const retrieveReviews = (restId, callback) => {
  Restaurant.findOne({ _id: restId })
    .exec(callback);
};

// need to refactor
const addReviews = (restId, qty, callback) => {
  const reviews = [];
  for (let i = 0; i < qty; i += 1) {
    reviews.push(createRandomReview(restId));
  }
  Restaurant.create(reviews, callback);
};

const deleteReviews = (restId, callback) => {
  Restaurant.deleteOne({ _id: restId }, callback);
};

module.exports = {
  conn,
  save,
  retrieveReviews,
  addReviews,
  deleteReviews,
};
