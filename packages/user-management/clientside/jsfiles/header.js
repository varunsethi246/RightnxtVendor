import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.header.onCreated(function(){
	Meteor.subscribe('userfunction');

});

Template.header.helpers({
  usersData() {
    return Meteor.users.find({});
  },


});