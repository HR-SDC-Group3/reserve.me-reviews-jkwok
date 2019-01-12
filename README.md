# Reserve.me

> An implementation of a restaurant reviews app.

## Related Projects

  - https://github.com/HR-SDC-Group3/menu-cards-service
  - https://github.com/HR-SDC-Group3/photo-carousel-service
  - https://github.com/HR-SDC-Group3/Service-Mike
  - https://github.com/HR-SDC-Group3/proxy-johnson-kwok

## Usage

* Run `npm install` within the root directory.
* Ensure Mongoose and Mongo are running. 
* In order to seed the database with 3,015 entries of review data, run `npm run seed`. 
* To start webpack, run `npm run react-dev`. 
* To start the Express server on port 3004, run `npm run server-dev`. 
* To run the test suite using Jest, run `npm run test`.


## CRUD OPERATIONS

### CREATE
* HTTP request method: POST
* Endpoint: `/api/restaurants/:id/reviews/`
* Required Parameters: restaurant id
* Description: Adds one review to a restaurant with pre-existing reviews (cannot add to a restaurant that didn't already have a record in the db)

### READ
* HTTP request method: GET
* Endpoint: `/api/restaurants/:id/reviews`
* Required Parameters: restaurant id
* Description: Retrieves an array of all the reviews for the specified restaurant

### UPDATE
* HTTP request method: PUT
* Endpoint: `/api/restaurants/:id/reviews/:qty`
* Required Parameters: restaurant id
* Description: Replaces all of the reviews for the specified restaurant with a random number of new reviews (including 0 reviews)

### DELETE
* HTTP request method: DELETE
* Endpoint: `/api/restaurants/:id/reviews`
* Required Parameters: restaurant id
* Description: Removes all the reviews for the specified restaurant
