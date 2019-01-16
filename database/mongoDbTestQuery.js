const database = require('./index.js');

const randomReview = { 
  reviewer:
    { id: 32455221,
      nickname: 'KristoferO',
      location: 'Collinsshire',
      review_count: 25,
      date_dined: '2016-10-26T01:57:03.421Z',
    },
  review:
    { id: 10,
      ratings:
      { overall: 2,
        food: 4,
        service: 3,
        ambience: 2,
        value: 4,
        noise_level: 'energetic' },
      recommend_to_friend: false,
      text:
      'Quasi dolor exercitationem vitae. Magni exercitationem nisi. Odit voluptate praesentium eum explicabo architecto similique vel.',
      helpful_count: 1,
      tags:
      [ 'Disabled Access',
        'Spicy',
        'Comfort Food',
        'Good Vegetarian Options',
        'Scenic View',
        'Quiet Conversation' ] 
    } 
};

console.time('Add review runtime:');
database.addReviewWithId(10000000, randomReview, () => {
  console.timeEnd('Add review runtime:');
});

console.time('Get reviews runtime:');
database.retrieveReviews(9999999, () => {
  console.timeEnd('Get reviews runtime:');
});

console.time('Delete review runtime:');
database.deleteOneReview(10000000, 10, () => {
  console.timeEnd('Delete review runtime:');
});
