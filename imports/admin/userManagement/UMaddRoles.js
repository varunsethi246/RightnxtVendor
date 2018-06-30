import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import './UMaddRoles.html'
Template.UMaddRoles.onCreated(function(){
  Meteor.subscribe('rolefunction');

});

Template.UMaddRoles.events({

    'click .submit' : function(event) {
      event.preventDefault();
      var roleName   = $("input[name=roleName]").val();
      var inputId    = $("input[name=roleName]").attr("id");
      console.log('roleName : ' + roleName);
      console.log('inputId : ' + inputId);
      if (roleName != '') {
        Meteor.call('addrole', roleName,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                         // FlowRouter.go("/UMroles");
                      Bert.alert('Role added successfully','success', 'growl-top-right');

                    }//the _id of new object if successful
                }


        );
        $("input[name=roleName]").val('');
      }else{
          Bert.alert('Please Add Role..');
      }
      
      // event.target.roleName.value = '';
    },



});