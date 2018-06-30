import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.addRoleList.onCreated(function(){
	Meteor.subscribe('rolefunction');

});

Template.addRoleList.helpers({
  addrole() {
    return Meteor.roles.find({});
  },

});

Template.addRoleList.events({
	
  'click .addrole': function (event) {
  	event.preventDefault();
        FlowRouter.go("/um-addroles");
  },

  'click .deleteRole': function (event) {
  	event.preventDefault();
  	var confirm = window.confirm("Delete this Role?");
  	if(confirm) {
    	Meteor.call('deleteRole', this._id);
    }
  },

});