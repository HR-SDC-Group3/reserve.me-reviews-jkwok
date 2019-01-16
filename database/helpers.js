const faker = require('faker');

const generateNickname = () => faker.name.firstName() + faker.name.lastName().slice(0, 1);
const generateLocation = () => faker.address.city();
const generateRestReviewCount = () => faker.random.number({ min: 0, max: 15 });
const generateReviewCount = () => faker.random.number({ min: 1, max: 27 });
const generateDateDined = () => faker.date.between('2016-01-01', '2018-12-31');
const generateRatings = () => faker.random.number({ min: 1, max: 5 });
const generateNoiseLevel = () => faker.random.arrayElement(['do not recall', 'quiet', 'moderate', 'energetic']);
const generateRecommend = () => faker.random.boolean();
const generateReviewContent = () => faker.lorem.paragraphs(1);
const generateHelpfulCount = () => faker.random.number({ min: 0, max: 3 });
const generateRandomReviewerId = () => faker.random.number(50000000);
const generateRandomReviewId = () => faker.random.number(50000000);
const generateTags = () => {
  const tagsArr = [];
  let randNum = faker.random.number({ min: 0, max: 6 });
  while (randNum) {
    tagsArr.push(faker.random.arrayElement([
      'Late-night Find',
      'Waterfront',
      'Great for Lunch',
      'Happy Hour',
      'Bar Seating',
      'Worth the Drive',
      'Creative Cuisine',
      'Hot Spot',
      'Paleo Friendly',
      'Afternoon Tea',
      'Sunday Lunch',
      'Gluten Free Options',
      'Spicy',
      'Good for Birthdays',
      'Afternoon Coffee',
      'Good for Groups',
      'Notable Wine List',
      'Fit for Foodies',
      'Good Vegetarian Options',
      'Scenic View',
      'Handcrafted Cocktails',
      'People Watching',
      'Good for Anniversaries',
      'Quiet Conversation',
      'Disabled Access',
      'Local Ingredients',
      'Seasonal',
      'Fun',
      'Pre/post Theatre',
      'Authentic',
      'Live Sports',
      'Vibrant Bar Scene',
      'Great for Outdoor Dining',
      'Comfort Food',
      'Great Beer',
      'Tasting Menu',
      'Tapas',
      'Organic',
      'Vegan',
      'Live Music',
      'Special Occasion',
      'Business Meals',
      'Quick Bite',
      'Healthy',
      'Great for Brunch',
      'Organic',
      'Romantic',
      'Good for a Date',
      'Neighborhood Gem',
      'Cozy',
      'Casual',
    ]));
    randNum -= 1;
  }
  return tagsArr;
};

const createRandomReview = (revId = generateRandomReviewId()) => {
  return {
    reviewer: {
      id: generateRandomReviewerId(),
      nickname: generateNickname(),
      location: generateLocation(),
      review_count: generateReviewCount(),
      date_dined: generateDateDined(),
    },
    review: {
      id: revId,
      ratings: {
        overall: generateRatings(),
        food: generateRatings(),
        service: generateRatings(),
        ambience: generateRatings(),
        value: generateRatings(),
        noise_level: generateNoiseLevel(),
      },
      recommend_to_friend: generateRecommend(),
      text: generateReviewContent(),
      helpful_count: generateHelpfulCount(),
      tags: generateTags(),
    },
  };
};

const createRandRestaurant = (restId) => {
  const insertedReviews = [];
  for (let i = 0; i < generateRestReviewCount(); i += 1) {
    insertedReviews.push(createRandomReview(i));
  }
  return {
    _id: restId,
    name: `restaurant${String(restId)}`,
    reviews: insertedReviews,
  };
};

const createRandRestaurantSQL = (restId) => {
  return `${restId},restaurant${String(restId)}\n`;
};

const createRandomReviewSQL = (restId, revId) => {
  return `${restId},${revId},${generateRatings()},${generateRatings()},${generateRatings()},\
${generateRatings()},${generateRatings()},${generateNoiseLevel()},\
${generateRecommend()},${generateReviewContent()},${generateHelpfulCount()},\
${generateTags().join('|')},${generateRandomReviewerId()},${generateNickname()},\
${generateLocation()},${generateReviewCount()},${generateDateDined().toISOString()}\n`;
};

module.exports = {
  createRandRestaurant,
  createRandRestaurantSQL,
  createRandomReviewSQL,
  generateRestReviewCount,
};
