import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// import './editProfile.html';

Template.editRoles.onCreated(function(){
	Meteor.subscribe('rolefunction');

});

Template.editRoles.helpers({
	editroles: ()=> {
		var userId = FlowRouter.getParam('userId');
		return Meteor.roles.findOne({'_id': userId}) ;
	},

});

Template.editRoles.events({
 'submit #editroles': function (event) {
      event.preventDefault();
      var userId     = FlowRouter.getParam('userId');
      var roleName   = event.target.roleName.value;

      Meteor.call('updaterole', userId, roleName,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                         FlowRouter.go("/um-roles");
                    }//the _id of new object if successful
                }


      	);
 },

});