import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 100,
  rps: 1000,
  duration: '5m',
};

// Initial setup for randomized ids
// export default function() {
//   const mostViewedId = Math.ceil(Math.random() * 1000);
//   const lessViewedId = Math.floor(Math.random() * (10000000 - 8000000 + 1)) + 8000000;

//   // Probabilities: 70% chance to select the most popular restaurants, 30% chance for the other restaurants
//   const randomIds = [mostViewedId, mostViewedId, mostViewedId, mostViewedId, mostViewedId, mostViewedId, mostViewedId, lessViewedId, lessViewedId, lessViewedId];
//   const randomIdx = Math.floor(Math.random() * 10);
//   const response = http.get(`http://localhost:3004/api/restaurants/${randomIds[randomIdx]}/reviews`);    // reviews service
//   check(response, {
//     'status was 200': (r) => r.status == 200,    // for GET requests
//     'transaction time OK': (r) => r.timings.duration < 2000
//   });
// };

// Modified setup for randomized ids
export default function() {
  let randomId;
  const probability = Math.floor(Math.random() * 10);
  if (probability < 7) {
    randomId = Math.ceil(Math.random() * 1000);
  } else {
    randomId = Math.floor(Math.random() * (10000000 - 1000 + 1)) + 1000;
  }

  const response = http.get(`http://localhost:3004/api/restaurants/${randomId}/reviews`);    // reviews service
  check(response, {
    'status was 200': (r) => r.status == 200,    // for GET requests
    'transaction time OK': (r) => r.timings.duration < 2000
  });
};
