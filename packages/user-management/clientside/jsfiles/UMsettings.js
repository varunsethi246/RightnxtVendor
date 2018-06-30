// import './settings.html';
// import './listOfUsers.js';


Meteor.subscribe("user");

if (Meteor.isClient) {

Template.UMsettings.events({
    'click .logout': function(event) {
      event.preventDefault();
      Meteor.logout();
    }
  });

}