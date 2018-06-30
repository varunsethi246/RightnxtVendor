import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.UMhomeLayout.onCreated(function(){
	Meteor.subscribe('userfunction');

});

Template.UMhomeLayout.helpers({
  usersData() {
    return Meteor.users.find({});
  },


});