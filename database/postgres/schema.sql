\timing
DROP DATABASE IF EXISTS reserve_me;

CREATE DATABASE reserve_me;

\c reserve_me;

CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY UNIQUE,
  restaurant_id INTEGER REFERENCES restaurants(id),
  review_id INTEGER NOT NULL,
  overall INTEGER NOT NULL,
  food INTEGER NOT NULL,
  service INTEGER NOT NULL,
  ambience INTEGER NOT NULL,
  value INTEGER NOT NULL,
  noise_level TEXT NOT NULL,
  recommend_to_friend BOOLEAN NOT NULL,
  review_text TEXT NOT NULL,
  helpful_count INTEGER NOT NULL, 
  tags TEXT,
  reviewer_id INTEGER NOT NULL,
  nickname TEXT NOT NULL,
  location TEXT NOT NULL,
  review_count INTEGER NOT NULL,
  date_dined DATE NOT NULL
);

COPY restaurants(id, name) FROM '/Users/johnsonkwok/Documents/HR/Week-8/SDC/reviews-service/database/data/sampleDataPostgresRest.csv'
  WITH (FORMAT CSV, HEADER);

COPY reviews(restaurant_id,review_id,overall,food,service,ambience,value,noise_level,recommend_to_friend,review_text,helpful_count,tags,reviewer_id,nickname,location,review_count,date_dined) 
  FROM '/Users/johnsonkwok/Documents/HR/Week-8/SDC/reviews-service/database/data/sampleDataPostgresRev.csv'
  WITH (FORMAT CSV, HEADER);

CREATE INDEX foreign_key on reviews (restaurant_id);

CREATE INDEX name_index on restaurants (name);

\timing