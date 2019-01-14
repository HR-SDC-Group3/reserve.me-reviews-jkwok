const fs = require('fs');
const path = require('path');
const {
  createRandRestaurant, createRandRestaurantSQL, createRandomReviewSQL, generateRestReviewCount,
} = require('./helpers.js');

const dbName = 'Postgres';   // Set to Mongo or Postgres depending on which db to seed
const numRecords = 1000;
let percentComplete = 0;
let i = 1;
console.time('Runtime');

const createCompletionStatusLog = () => {
  if (i % (numRecords / 20) === 0 && i !== 0) {
    percentComplete += 5;
    const loadingMsg = `Writing to file...[${percentComplete}% complete]`;
    console.log(loadingMsg);
  }
  if (i === numRecords) {
    console.log('WRITING HAS COMPLETED!');
    console.timeEnd('Runtime');
  }
};

if (dbName === 'Mongo') {
  const writeStream = fs.createWriteStream(path.join(__dirname, `/data/sampleData${dbName}.csv`));
  const writeRecords = () => {
    let notBuffering = true;
    while (i <= numRecords && notBuffering) {
      const entry = createRandRestaurant(i);
      notBuffering = writeStream.write(`${JSON.stringify(entry)}\n`);

      createCompletionStatusLog();

      i += 1;
    }

    if (!notBuffering) {
      writeStream.once('drain', () => {
        writeRecords();
      });
    }
  };

  writeRecords();
} else {
  const writeStreamRest = fs.createWriteStream(path.join(__dirname, `/data/sampleData${dbName}Rest.csv`));
  const writeStreamRev = fs.createWriteStream(path.join(__dirname, `/data/sampleData${dbName}Rev.csv`));
  writeStreamRest.write('id,name\n');
  writeStreamRev.write('restaurant_id,review_id,overall,food,service,ambience,value,\
noise_level,recommend_to_friend,review_text,helpful_count,tags,reviewer_id,nickname,location,\
review_count,date_dined\n');

  const createReviewEntries = (restId) => {
    let reviewsOutput = '';
    for (let j = 0; j < generateRestReviewCount(); j += 1) {
      reviewsOutput += createRandomReviewSQL(restId, j);
    }
    return reviewsOutput;
  };

  const writeRecords = () => {
    let notBufferingRestaurant = true;
    let notBufferingReview = true;
    while (i <= numRecords && notBufferingRestaurant && notBufferingReview) {
      notBufferingRestaurant = writeStreamRest.write(createRandRestaurantSQL(i));
      notBufferingReview = writeStreamRev.write(createReviewEntries(i));

      createCompletionStatusLog();

      i += 1;
    }

    if (!notBufferingRestaurant) {
      writeStreamRest.once('drain', () => {
        writeRecords();
      });
    }

    if (!notBufferingReview) {
      writeStreamRev.once('drain', () => {
        writeRecords();
      });
    }
  };

  writeRecords();
}
