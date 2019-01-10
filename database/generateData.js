const fs = require('fs');
const faker = require('faker');
const { createRandomReview } = require('./helpers.js');

const generateRestaurantId = () => faker.random.number({ min: 1, max: 2000000 });
