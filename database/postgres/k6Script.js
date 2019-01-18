import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  // vus: 15,
  rps: 1000,
  // duration: '10s',
  stages: [
    { duration: "5m", target: 1 },
    { duration: "5m", target: 10 },
    { duration: "5m", target: 50 },
    { duration: "5m", target: 100 },
  ],
};

export default function() {
  const randomId = Math.floor(Math.random() * (10000000 - 9000000 + 1)) + 9000000;
  const response = http.get(`http://localhost:3004/api/restaurants/${randomId}/reviews`);
  check(response, {
    "status was 200": (r) => r.status == 200,
    "transaction time OK": (r) => r.timings.duration < 2000
  });
  sleep(0.1);
};
