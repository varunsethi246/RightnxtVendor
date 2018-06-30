import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '/imports/admin/commonAdmin/commonAdmin.js';
import './UMaddRoleList.html';
import './adminAddRolesList.html';
import './UMaddRoles.js';
import './UMeditRoles.js';


Template.UMaddRoleList.onCreated(function(){
	Meteor.subscribe('rolefunction');

});

Template.UMaddRoleList.helpers({
  'addrole':function() {
    var userRoles = Meteor.roles.find({}).fetch();
    var rolesArray = [];
    if(userRoles){
      for(i=0;i<userRoles.length;i++){
        var name = userRoles[i].name.split(' ').join('-');
        // console.log(userRoles[i].name);
        rolesArray.push({
          '_id'  : userRoles[i]._id,
          'name' : userRoles[i].name,
          'idForModal' : name,
        });
      }
    }
    // return Meteor.roles.find({});
    return rolesArray;
  },

});

Template.UMadd_role.events({

  'click .deleteRole': function (event) {
  	event.preventDefault();
    // console.log(event.target.id);
    var roleID = event.target.id ;
    Meteor.call('deleteRole', roleID,
                    function(error, result) { 
                        if (error) {
                            console.log ( error ); 
                        } //info about what went wrong 
                        else {$('.modal-backdrop').hide();}
                    });
  },

});


adminAddRolesListForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'adminAddRolesList'});
}

export { adminAddRolesListForm }