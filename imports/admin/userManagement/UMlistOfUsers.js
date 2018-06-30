import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session'
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// import { users } from './imports/api/userMasterAPI.js';
// import { Orders } from '../../../../imports/api/orderMaster.js';
import '../../admin/commonAdmin/commonAdmin.js';
import './UMlistOfUsers.html';
import './UMdeleteUserConfirm.html';
import './listofUser.html';

Template.UMlistOfUsers.onCreated(function(){
	Meteor.subscribe('userfunction');
  Meteor.subscribe('rolefunction');
  Meteor.subscribe('allOrders');
  Session.set('userListLimit',10);

});

Template.UMlistOfUsers.helpers({

  users:function() {
    var userCounts  = Counts.get('noOfUser');
    // userCounts = parseInt(userCounts);
    console.log('userCounts ',userCounts);
      if (userCounts > 10) {
        $('.loadMoreRows50').addClass('showMore50').removeClass('hideMore50');
      }else if(userCounts > 100){
        $('.loadMoreRows100').addClass('loadMoreRows100').removeClass('hideMore50');
      }else if(userCounts > 200){
        $('.loadMoreRows100').addClass('loadMoreRowsRest').removeClass('hideMore50'); 
      }else{
        $('.loadMoreRows50').removeClass('showMore50').addClass('hideMore50');
        $('.loadMoreRows50').removeClass('loadMoreRows100').addClass('hideMore50');
        $('.loadMoreRows50').removeClass('loadMoreRowsRest').addClass('hideMore50');
      }

    var roleSetArray = [];
    var roleSetVar = Session.get('roleSet');
    var listLimit = Session.get('userListLimit');

    // console.log("roleSetget : " + roleSetVar);
    var user       =  Meteor.users.find({},{ limit: listLimit}).fetch();
    if(user){
      // console.log('print1');
      var userCount =  user.length;
      // console.log('userCount ', userCount);
      if(roleSetVar){ 
        // console.log('roleSetVar');
        if(roleSetVar == 'all'){
          // console.log('roleSetVar all');

          for(i=0;i<userCount;i++){
            // console.log('user Data ', i);
            if(user[i].status){
              if(user[i].status.lastLogin){
                // console.log()
                console.log('user[i].status.lastLogin :',user[i].status.lastLogin); 
                roleSetArray.push({
                  'SrNo'                  : i,
                  '_id'                   : user[i]._id,
                  'emails'                : user[i].emails[0].address,
                  'status'                : user[i].profile.status,
                  'roles'                 : user[i].roles,
                  'createdAt'             : user[i].createdAt,
                  'lastLogin'             : user[i].status.lastLogin.date,
                });
                // console.log('true: ',user[i]._id);
              }else{
                roleSetArray.push({
                  'SrNo'                  : i,
                  '_id'                   : user[i]._id,
                  'emails'                : user[i].emails[0].address,
                  'status'                : user[i].profile.status,
                  'roles'                 : user[i].roles,
                  'createdAt'             : user[i].createdAt,
                  'lastLogin'             : '',
                });
                // console.log('false: ',user[i]._id);
              }
            }else{
              roleSetArray.push({
                  'SrNo'                  : i,
                  '_id'                   : user[i]._id,
                  'emails'                : user[i].emails[0].address,
                  'status'                : user[i].profile.status,
                  'roles'                 : user[i].roles,
                  'createdAt'             : user[i].createdAt,
                  'lastLogin'             : '',
                });
            }
            // console.log('roleSetArray ',roleSetArray);
          }//roleSetVar all loop
        }else{
          // console.log('else roleSetVar all'); 
            for(i=0;i<userCount;i++){
            // console.log('user Data d', i);
              
              if ( Roles.userIsInRole( user[i]._id, roleSetVar ) ) {
                if(user[i].status){
                  if(user[i].status.lastLogin){
                console.log('user[i].status.lastLogin :',user[i].status.lastLogin); 
                    
                    roleSetArray.push({
                      'SrNo'                  : i,
                      '_id'                   : user[i]._id,
                      'emails'                : user[i].emails[0].address,
                      'status'                : user[i].profile.status,
                      'roles'                 : user[i].roles,
                      'createdAt'             : user[i].createdAt,
                      'lastLogin'             : user[i].status.lastLogin.date,
                    });
                    // console.log('true: ',user[i]._id);
                  }else{
                    roleSetArray.push({
                      'SrNo'                  : i,
                      '_id'                   : user[i]._id,
                      'emails'                : user[i].emails[0].address,
                      'status'                : user[i].profile.status,
                      'roles'                 : user[i].roles,
                      'createdAt'             : user[i].createdAt,
                      'lastLogin'             : '',
                    });
                    // console.log('false: ',user[i]._id);
                  }
              }else{
                roleSetArray.push({
                    'SrNo'                  : i,
                    '_id'                   : user[i]._id,
                    'emails'                : user[i].emails[0].address,
                    'status'                : user[i].profile.status,
                    'roles'                 : user[i].roles,
                    'createdAt'             : user[i].createdAt,
                    'lastLogin'             : '',
                  });
              }
            }
            // console.log('roleSetArray1 ',roleSetArray);

          }

        }   
      }else{
        // console.log('else roleSetVar');
          for(i=0;i<userCount;i++){
            // console.log('user s ',i);
            if(user[i].status){
              if(user[i].status.lastLogin){
                console.log('user[i].status.lastLogin :',user[i].status.lastLogin); 
                
                roleSetArray.push({
                  'SrNo'                  : i,
                  '_id'                   : user[i]._id,
                  'emails'                : user[i].emails[0].address,
                  'status'                : user[i].profile.status,
                  'roles'                 : user[i].roles,
                  'createdAt'             : user[i].createdAt,
                  'lastLogin'             : user[i].status.lastLogin.date,
                });
                // console.log('roleSetArray1 ',roleSetArray);

                // console.log('true: ',user[i]._id);
              }else{
                roleSetArray.push({
                  'SrNo'                  : i,
                  '_id'                   : user[i]._id,
                  'emails'                : user[i].emails[0].address,
                  'status'                : user[i].profile.status,
                  'roles'                 : user[i].roles,
                  'createdAt'             : user[i].createdAt,
                  'lastLogin'             : '',
                });
                // console.log('false: ',user[i]._id);
              }
            }else{
              roleSetArray.push({
                  'SrNo'                  : i,
                  '_id'                   : user[i]._id,
                  'emails'                : user[i].emails[0].address,
                  'status'                : user[i].profile.status,
                  'roles'                 : user[i].roles,
                  'createdAt'             : user[i].createdAt,
                  'lastLogin'             : '',
                });
            }
            // console.log('roleSetArray1 ',roleSetArray);
            
          }
      }
      // console.log('roleSetArray 1',roleSetArray);
      return roleSetArray;
    } 
    
  },

  roles() {
    return Meteor.roles.find({});
  },
  // usersCounts(){
   
  // }
});

// Template.deleteUserConfirm.onCreated(function(){
//   Meteor.subscribe('userfunction');
// });

// Template.deleteUserConfirm.helpers({
//   users() {
//     return Meteor.users.find({});
//   },
// });
// Template.UMlistOfUsers.onRendered(function(){
//   var userCounts  = Counts.get('noOfUser');
//     console.log('userCounts:',userCounts);
//     userCounts = parseInt(userCounts);
//       if (userCounts > 9) {
//         $('.loadMoreRows50').addClass('showMore50').removeClass('hideMore50');

//       }
//   });


Template.UMdeleteUserConfirm.events({
  'click .deleteUserConfirm': function(event){
    event.preventDefault();
    var uid = FlowRouter.getParam('userId');
    console.log('uid:',uid);
    // console.log('uid : ' + uid);
    
    Meteor.call('deleteUser', uid,
                (err, res) => {
                if (err) {
                    Bert.alert('Some error occured while deleting this record. Please contact System Admin!');
                } else {
                    $('.modal-backdrop').hide(); 
                    Bert.alert('User deleted..');

                }
        });
    FlowRouter.go('/listOfUsers');
  },
});
Template.UMuser.events({
  'click .deleteUserConfirmOne': function(event){
    event.preventDefault();
    var uid = event.target.id;
    console.log('uidone :',uid);
    Meteor.call('deleteUser', uid,
                (err, res) => {
                if (err) {
                    alert('hello');
                } else {
                    $('.modal-backdrop').hide(); 
                    Bert.alert('User deleted..');

                }
        });
    }
});

Template.UMlistOfUsers.events({

  'click .deleteUserConfirm': function(event){
    event.preventDefault();
    var uid = event.target.id;
    console.log('uidone :',uid);
    Meteor.call('deleteUser', uid,
                (err, res) => {
                if (err) {
                    alert('Some error occured while deleting this record. Please contact System Admin!');
                } else {
                    $('.modal-backdrop').hide(); 
                    Bert.alert('User deleted..');

                }
        });

  },

  'click .allSelector': function (event) {
      // event.preventDefault();
      if(event.target.checked){
        $('.userCheckbox').prop('checked',true);
      }else{
        $('.userCheckbox').prop('checked',false);
      }
  },

  'change .actionSelect': function (event, template) {
    event.preventDefault();
    var target = event.target; 
    var selectedValue = event.target.value;
    var keywordSelectedValue = selectedValue.split('$')[0];
    var role = selectedValue.split('$')[1];

    // console.log('keywordSelectedValue : ' + keywordSelectedValue);
    // console.log('role : ' + role);

    var selectedUsers = template.findAll( "input[type=checkbox]:checked");
    // console.log(selectedUsers );
    // $('#myCheckbox').prop('checked', false);
    var checkedUsersList = _.map(selectedUsers, function(item) {
      return item.defaultValue;
    });
    $(selectedUsers).prop('checked', false);
    // console.log("checkedUsersList : " + checkedUsersList);

  	switch(keywordSelectedValue){
  		case '-':
  		  // console.log('selectedValue:' + selectedValue);
  			break;

  		case 'block_selected':
		  	Meteor.call('blockSelectedUser', checkedUsersList, function(error, result){
          if(result){
            Bert.alert('User Blocked Successfully','success','growl-top-right');
          }
        });
  			break;

  		case 'active_selected':
		  	Meteor.call('activeSelectedUser', checkedUsersList, function(error, result){
          if(result){
            Bert.alert('User Activated Successfully','success','growl-top-right');
          }
        });
  			break;

  		case 'cancel_selected':
        var confirmDelete = window.confirm("Are you sure you want to remove this record?"+ Meteor.users.find({'_id' : checkedUsersList}));
		  	if(confirmDelete) {
		  		Meteor.call('deleteSelectedUser', checkedUsersList, function(error, result){
          if(error){
            // nothing
          } else{
            Bert.alert('User Account Canceled Successfully','success','growl-top-right');
          }
        });
		  	}
  			break;

  		case 'add':
        Meteor.call('addRoleToUser', role, checkedUsersList, function(error, result){
          if(error){
            // nothing
          } else{
            Bert.alert('Role Added Successfully','success','growl-top-right');
          }
        });

  			break;

  		case 'remove':
        Meteor.call('removeRoleFromUser', role, checkedUsersList, function(error, result){
          if(error){
            // nothing
          } else{
            Bert.alert('Role Removed Successfully','success','growl-top-right');
          }
        });
  			break;

  	}
    
  },

  'change .roleFilter': function (event, template) {
    event.preventDefault();
    var target        = event.target; 
    var selectedValue = event.target.value;
    // console.log('selectedValue : ' + selectedValue);
    Session.set("roleSet", selectedValue);
  },

  // 'click .userDel': function (event, template){
  //   event.preventDefault();
  //   FlowRouter.go('/UMdeleteUserConfirm/:userId', {'userId' : this._id});
  // },

  'click .loadMoreRows50': function(event){
    event.preventDefault();
    

        $('.spinner').hide();
        $('.loadMoreRows50 .spinner').show();
        var nextLimitBus50 = Session.get('userListLimit');
        if(nextLimitBus50 != 0){
          var nextLimit = Session.get('userListLimit') + 50;
          Session.set('userListLimit',nextLimit);
        }
    
  },

  'click .loadMoreRows100': function(event){
     event.preventDefault();
    $('.spinner').hide();
    $('.loadMoreRows100 .spinner').show();
    var nextLimitBus100 = Session.get('userListLimit');
    if(nextLimitBus100 != 0){
      var nextLimit = Session.get('userListLimit') + 100;
      Session.set('userListLimit',nextLimit);
    }
  },

  'click .loadMoreRowsRest': function(event){
     event.preventDefault();
    $('.spinner').hide();
    $('.loadMoreRowsRest .spinner').show();
    var nextLimit = 0;
    Session.set('userListLimit',nextLimit);
  },

  'keyup #searchUser': _.throttle(function(event) {
     event.preventDefault();
    Session.set('userListLimit',0);
    var searchText = event.currentTarget.value;
    var filter = searchText.toUpperCase();
    var table = document.getElementById("userListTable");
    var tr = table.getElementsByTagName("tr");

      // Loop through all table rows, and hide those who don't match the search query
      for (var i=0; i<tr.length; i++) {
        var td = tr[i].getElementsByTagName("td")[1];
        if(td) {
          if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        } 
      }
  }, 200),

});


UI.registerHelper('timeAgo', function(datetime) {
  if(datetime == ''){
    return 'Never Logged In';
  }else{
    Session.get('time');
    return moment(datetime).fromNow();
  }
});

setInterval(function() {
    Session.set("time", new Date())
}, 60); //Every minute




listOfUsersForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'listofUser'});
}

export { listOfUsersForm };

UMdeleteUserConfirmForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'UMdeleteUserConfirm'});
}

export { UMdeleteUserConfirmForm };