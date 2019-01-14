const uri = 'mongodb://localhost:27017/reserve-me';
const mongoose = require('mongoose');
const { createRandomReview, createRandRestaurant } = require('./helpers.js');

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

const reviewSchema = mongoose.Schema({
  reviewer: {
    id: {
      type: Number,
    },
    nickname: String,
    location: String,
    review_count: Number,
    date_dined: Date,
  },
  review: {
    id: {
      type: Number,
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
  _id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
  },
  reviews: [reviewSchema],
});

const Restaurant = conn.model('Restaurant', restaurantSchema);

// Legacy Code - No longer applies //
const save = (reviews, callback) => {
  Restaurant.insertMany(reviews, callback);
};
// ************************* //

const retrieveReviews = (restId, callback) => {
  Restaurant.findOne({ _id: restId })
    .exec(callback);
};

const addReview = (restId, callback) => {
  Restaurant.findOneAndUpdate(
    { _id: restId },
    { $push: {reviews: createRandomReview()} },
    callback,
  );
};

const replaceReviews = (restId, callback) => {
  Restaurant.findOneAndReplace(
    { _id: restId },
    createRandRestaurant(restId),
    callback,
  );
};

const deleteReviews = (restId, callback) => {
  Restaurant.findOneAndUpdate(
    { _id: restId },
    { reviews: [] },
    callback,
  );
};

module.exports = {
  conn,
  save,
  retrieveReviews,
  addReview,
  replaceReviews,
  deleteReviews,
};
