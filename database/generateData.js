const fs = require('fs');
const faker = require('faker');
const path = require('path');
const { createRandomReview } = require('./helpers.js');

const generateRestaurantId = () => faker.random.number({ min: 1, max: 50000 });
let fileNumber = 1;
const writeStream = fs.createWriteStream(path.join(__dirname, `/data/sampleData${fileNumber}.txt`));
const numRecords = 10000000;
let percentComplete = 0;
let i = 0;
console.time('Runtime');

const writeOneRecord = () => {
  while (i < numRecords) {
    const restId = generateRestaurantId();
    const entry = {
      id: i,
      review: createRandomReview(restId),
    };

    if (!writeStream.write(`${JSON.stringify(entry)}\n`)) {
      return;
    }
    if (i % (numRecords / 20) === 0 && i !== 0) {
      percentComplete += 5;
      const loadingMsg = `Writing to file...[${percentComplete}% complete]`;
      console.log(loadingMsg);
      fileNumber += 1;
    }

    i += 1;
  }
  writeStream.end();
  console.log('Done writing!');
  console.timeEnd('Runtime');
};

writeStream.on('drain', () => {
  writeOneRecord();
});

writeOneRecord();
