const fs = require('fs');
const faker = require('faker');
const path = require('path');
const { createRandomReview } = require('./helpers.js');

const generateRestaurantId = () => faker.random.number({ min: 1, max: 50000 });
const writeStream = fs.createWriteStream(path.join(__dirname, '/data/sampleData1.txt'));
const numRecords = 1000000;
let i = 0;

const writeOneRecord = () => {
  while (i < numRecords) {
    const restId = generateRestaurantId();
    const entry = {
      id: i,
      review: createRandomReview(restId),
    };

    if (!writeStream.write(JSON.stringify(entry) + '\n')) {
      return;
    }

    i += 1;
  }
  writeStream.end();
};

writeStream.on('drain', () => {
  writeOneRecord();
});

writeOneRecord();
