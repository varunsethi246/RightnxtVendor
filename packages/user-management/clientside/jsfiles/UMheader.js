import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.UMheader.onCreated(function(){
	Meteor.subscribe('userfunction');

});

Template.UMheader.helpers({
  usersData() {
    return Meteor.users.find({});
  },


});

Template.UMheader.events({
    'click .logout': function(event) {
      event.preventDefault();
      Meteor.logout();
    }
  });