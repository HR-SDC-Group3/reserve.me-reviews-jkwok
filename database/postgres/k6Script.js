import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 100,
  rps: 1000,
  duration: '5m',
};

export default function() {
  const randomId = Math.floor(Math.random() * (10000000 - 9000000 + 1)) + 9000000;
  // const response = http.get(`http://localhost:3004/api/restaurants/${randomId}/reviews`);    // reviews service
  const response = http.post(`http://localhost:3004/api/restaurants/${randomId}/reviews`);      // reviews service
  check(response, {
    // "status was 200": (r) => r.status == 200,    // for GET requests
    "status was 201": (r) => r.status == 201,       // for POST requests
    "transaction time OK": (r) => r.timings.duration < 2000
  });
  // sleep(0.05);
};
