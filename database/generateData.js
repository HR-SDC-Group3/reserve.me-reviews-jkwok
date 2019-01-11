const fs = require('fs');
const faker = require('faker');
const path = require('path');
const { createRandomReview, createRandRestaurant } = require('./helpers.js');

const generateRestaurantId = () => faker.random.number({ min: 1, max: 100 });
let fileNumber = 1000;
const writeStream = fs.createWriteStream(path.join(__dirname, `/data/sampleData${fileNumber}.csv`));
const numRecords = 1000;
let percentComplete = 0;
let i = 1;
console.time('Runtime');

const writeRecords = () => {
  let notBuffering = true;
  while (i <= numRecords && notBuffering) {
    // const restId = generateRestaurantId();
    const entry = createRandRestaurant(i);
    notBuffering = writeStream.write(`${JSON.stringify(entry)}\n`);

    if (i % (numRecords / 20) === 0 && i !== 0) {
      percentComplete += 5;
      const loadingMsg = `Writing to file...[${percentComplete}% complete]`;
      console.log(loadingMsg);
      fileNumber += 1;
    }
    if (i === numRecords) {
      console.log('WRITING HAS COMPLETED!');
      console.timeEnd('Runtime');
    }

    i += 1;
  }

  if (!notBuffering) {
    writeStream.once('drain', () => {
      writeRecords();
    });
  }
};

writeRecords();
