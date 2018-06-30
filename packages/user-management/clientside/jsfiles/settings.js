// import './settings.html';
// import './listOfUsers.js';


Meteor.subscribe("user");

if (Meteor.isClient) {

Template.settings.events({
    'click .logout': function(event) {
      event.preventDefault();
      Meteor.logout();
    }
  });

}