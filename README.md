# Reserve.me

> An implementation of a restaurant reviews app.

## Related Projects

  - https://github.com/reserveMe/menu-cards-service
  - https://github.com/reserveMe/photo-carousel-server
  - https://github.com/reserveMe/reservation-calendar-service
  - https://github.com/reserveMe/reviews-proxy

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
* Endpoint: `/api/restaurants/:id/reviews/:qty`
* Required Parameters: id and qty
* Expected Output: An array of the reviews that were added to the db

### READ
* HTTP request method: GET
* Endpoint: `/api/restaurants/:id/reviews`
* Required Parameters: id
* Expected Output: An array of all the reviews for the specified restaurant

### UPDATE
* HTTP request method: PUT
* Endpoint: `/api/restaurants/:id/reviews/:qty`
* Required Parameters: id and qty
* Expected Output: An array of the reviews that replaced the original reviews for the specified restaurant. This method updates all of the reviews for a restaurant by removing all the current reviews and a adding a specified quantity of new reviews.

### DELETE
* HTTP request method: DELETE
* Endpoint: `/api/restaurants/:id/reviews`
* Required Parameters: id
* Expected Output: An object with a property "n" that has a value indicating the number of reviews that were deleted from the db. This method removes all the reviews for the specified restaurant.
