// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by initialinject.js.
import { name as packageName } from "meteor/initialinject";

// Write your tests here!
// Here is an example.
Tinytest.add('initialinject - example', function (test) {
  test.equal(packageName, "initialinject");
});
