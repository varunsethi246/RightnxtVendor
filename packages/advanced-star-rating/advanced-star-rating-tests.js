// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by advanced-star-rating.js.
import { name as packageName } from "meteor/iassureit:advanced-star-rating";

// Write your tests here!
// Here is an example.
Tinytest.add('advanced-star-rating - example', function (test) {
  test.equal(packageName, "advanced-star-rating");
});
