import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.homeLayout.onCreated(function(){
	Meteor.subscribe('userfunction');

});

Template.homeLayout.helpers({
  usersData() {
    return Meteor.users.find({});
  },


});