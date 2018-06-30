import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';


Template.listOfUsers.onCreated(function(){
	Meteor.subscribe('userfunction');
  Meteor.subscribe('rolefunction');
});

Template.listOfUsers.helpers({
  users() {
    return Meteor.users.find({});
  },
  roles() {
    return Meteor.roles.find({});
  },
});


Template.deleteUserConfirm.events({
  'click .deleteUserConfirm': function(event){
    event.preventDefault();
    var uid = FlowRouter.getParam('userId');
    console.log('uid : ' + uid);
    Meteor.call('deleteUser', uid);
    FlowRouter.go('/um-users-list');
  },
});

Template.listOfUsers.events({

  'click .deleteUserConfirm': function(event){
    event.preventDefault();
    FlowRouter.go('/um-deleteUserConfirm/:userId', {'userId' : this._id});
  },

  'click .allSelector': function (event) {
      // event.preventDefault();
      if(event.target.checked){
        $('.userCheckbox').prop('checked',true);
      }else{
        $('.userCheckbox').prop('checked',false);
      }
  },


  'change select': function (event, template) {
    event.preventDefault();
    var target = event.target; 
    var selectedValue = event.target.value;
    var keywordSelectedValue = selectedValue.split('$')[0];
    var role = selectedValue.split('$')[1];

    console.log('keywordSelectedValue : ' + keywordSelectedValue);
    console.log('role : ' + role);

    var selectedUsers = template.findAll( "input[type=checkbox]:checked");
    var checkedUsersList = _.map(selectedUsers, function(item) {
      return item.defaultValue;
    });

  	switch(keywordSelectedValue){
  		case '-':
  		  console.log('selectedValue:' + selectedValue);
  			break;

  		case 'block_selected':
		  	Meteor.call('blockSelectedUser', checkedUsersList);
  			break;

  		case 'active_selected':
		  	Meteor.call('activeSelectedUser', checkedUsersList);
  			break;

  		case 'cancel_selected':
        var confirmDelete = window.confirm("Are you sure you want to remove this record?"+ Meteor.users.find({'_id' : checkedUsersList}));
		  	if(confirmDelete) {
		  		Meteor.call('deleteSelectedUser', checkedUsersList);
		  	}
  			break;

  		case 'add':
        Meteor.call('addRoleToUser', role, checkedUsersList);
  			break;

  		case 'remove':
        Meteor.call('removeRoleFromUser', role, checkedUsersList);
  			break;

  	}
    
  },

});


UI.registerHelper('timeAgo', function(datetime) {
    Session.get('time');
    return moment(datetime).fromNow();
});

setInterval(function() {
    Session.set("time", new Date())
}, 60); //Every minute




