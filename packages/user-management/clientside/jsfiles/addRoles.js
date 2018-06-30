import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Template.addRoles.events({

    'submit #addroles' : function(event) {
      event.preventDefault();
      var roleName   = event.target.roleName.value;

      Meteor.call('addrole', roleName,
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