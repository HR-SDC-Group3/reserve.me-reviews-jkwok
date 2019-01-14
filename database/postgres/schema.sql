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
  reommend_to_friend BOOLEAN NOT NULL,
  review_text TEXT NOT NULL,
  helpful_count INTEGER NOT NULL, 
  tags TEXT NOT NULL,
  reviewer_id INTEGER NOT NULL,
  nickname TEXT NOT NULL,
  location TEXT NOT NULL,
  review_count INTEGER NOT NULL,
  date_dined TIMESTAMPTZ NOT NULL
);
