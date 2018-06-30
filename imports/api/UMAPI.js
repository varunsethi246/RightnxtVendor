import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';


  // Meteor.publish('signUpConfig', function() {
  //     // this.unblock();
  //     return CheckedField.find({});
  // });

if(Meteor.isServer){


  Meteor.publish('userfunction', function userfunction(){
      // this.unblock();
      // console.log('userfunction testing');
      return Meteor.users.find({});
  });

  Meteor.publish('adminfunction', function(){
      // this.unblock();
      return Meteor.users.find({'roles':'admin'});
  });

  Meteor.publish('currentuser', function(){
      // this.unblock();
      return Meteor.users.find({'_id':this.userId});
  });

  Meteor.publish('userData', function(userId){
      // this.unblock();
      return Meteor.users.find({'_id':userId});
  });


  Meteor.publish('rolefunction', function(){
      // this.unblock();
      return Meteor.roles.find({});
  });

}



Meteor.methods({

'userSignUp' : function(formValues) {
    // console.log('formValues ',formValues);
    newUserId = Accounts.createUser({
                                email       : formValues.email,
                                password    : formValues.pwd,
                                profile     : {   
                                          name            : formValues.name,
                                          mobile          : formValues.mobile,
                                          reverse         : formValues.reverse,
                                          status          : 'Active',
                                          createdOn       : new Date(),
                                        }
                                
                                    });
    return newUserId;
  },

  'addNotifConfig':function(newID){
    Meteor.users.update(
          {"_id": newID},
          {
            $set: { notificationConfiguration : 
                {
                  enquiry : "true",
                  invoice : "true",
                  rating  : "true",
                  payment : "true",
                  follow  : "true",
                  unfollow: "true",
                  like    : "true",
                  unlike  : "true",
                  comment : "true",
                }
              }
          },function(error,result){
            if(error){
              return error;
            }else{
              return result;
            }
          });
  },

  checkcurrentPassword: function(digest, urlUID) {
    check(digest, String);

    if (urlUID) {
      var user = Meteor.user();
      var password = {digest: digest, algorithm: 'sha-256'};
      var result = Accounts._checkPassword(user, password);
      return result.error == null;
    } else {
      return false;
    }
  },


  updateUserByAdmin: function (urlUID, doc , passwordVar1) {
    	Meteor.users.update(
    		{'_id': urlUID },
    		{
    			$set:{
              "emails.0.address"     : doc.emailVar1,
   						"profile.firstName"    : doc.firstNameVar1 ,
   						"username"             : doc.userNameVar1,
   						"profile.signGender"   : doc.signGenderVar1,
   						"profile.homeAdd"      : doc.homeAddVar1,
   						"profile.city"         : doc.cityVar1,
   						"profile.state"        : doc.stateVar1,
   						"profile.zip"          : doc.zipVar1,
   						"profile.country"      : doc.countryVar1, 
   						"profile.mobNumber"    : doc.mobNumberVar1,
   						"profile.alterNumber"  : doc.alterNumberVar1,
   						"profile.salutation"   : doc.salutationVar1,
   						"profile.lastName"     : doc.lastNameVar1,
   						"profile.displayPicture":  doc.displayPicture1,
              "profile.status"       :  'Active',
              "profile.createdOn"    :  new Date(),

    		} //End of set
    	}
    	);

    Accounts.setPassword(urlUID, passwordVar1);
  },

  updateUserByUser: function (urlUID, doc) {

      Meteor.users.update(
        {'_id': urlUID },
        {
          $set:{
              // "emails.0.address" : doc.emailVar1,
              "profile.firstName": doc.firstNameVar1 ,
              // "profile.userName": doc.userNameVar1,
              "profile.signGender": doc.signGenderVar1,
              "profile.homeAdd": doc.homeAddVar1,
              "profile.city": doc.cityVar1,
              "profile.state": doc.stateVar1,
              "profile.zip": doc.zipVar1,
              "profile.country": doc.countryVar1, 
              "profile.mobNumber": doc.mobNumberVar1,
              "profile.alterNumber": doc.alterNumberVar1,
              "profile.salutation": doc.salutationVar1,
              "profile.lastName": doc.lastNameVar1,
              "profile.displayPicture":  doc.displayPicture1,
              // "profile.signupConfirmPassword":  doc.signupConfirmPasswordVar1,
                      "profile.status"      :  'Active',
                      "profile.createdOn" :  new Date(),

        } //End of set
      }
      );

    if(doc.passwordVar1 != ''){
      Accounts.setPassword(urlUID, doc.passwordVar1);
    }
  },

  updaterole: function (roleId, roleName) {
    // console.log(roleId);
    // console.log(roleName);
      Meteor.roles.update({'_id': roleId },
                          {
                            $set:{
                                    "name": roleName,
                          } //End of set
                        });
  },

  addrole: function (roleName) {
      Roles.createRole(roleName);
  },

  deleteUser: function(uid){
      // console.log('userId:',userId);
      // var businessName  =  Business.find({'businessOwnerId':userId}).fetch();
      // console.log('businessName:',businessName);
        Meteor.users.remove({'_id': uid});
  },

    deleteRole: function(roleID){
      // Roles.deleteRole('super-admin');
        Meteor.roles.remove({'_id': roleID});
  },

    addRoles: function(newID , defaultRoleconfig){
    console.log('newID-server'+ newID);
    Roles.addUsersToRoles(newID, defaultRoleconfig);

  },

    'addRoleToUser': function(role, checkedUsersList){
    // console.log('role : ' + role);
    var addRoles = [role];
    // console.log(checkedUsersList.length);
    for (var i=0; i<checkedUsersList.length; i++) {
      // console.log(checkedUsersList[i]);
      var userId = checkedUsersList[i];
      if(checkedUsersList[i] != null){
        Roles.addUsersToRoles(userId, addRoles);
      }
      
    }
  },

    removeRoleFromUser: function(role, checkedUsersList){
    var rmRoles = [role];
    for (var i=0; i<checkedUsersList.length; i++) {
      Roles.removeUsersFromRoles(checkedUsersList[i], rmRoles);
    }

  },

    blockSelectedUser: function(checkedUsersList){
    // console.log('Serverside-Checked checkboxes:'+ array);
    for (var i=0; i<checkedUsersList.length; i++) {
        console.log('value: ' + checkedUsersList[i]);

      Meteor.users.update(
        {'_id': checkedUsersList[i] },
        {
          $set:{
              "profile.status": 'Blocked' ,
        } //End of set
      },
        function(error, result){
          if(error){
            return error;
          }else{
            return result;
          }
        }
      ); //end of update
      return checkedUsersList;
    } //End of for loop

  }, //end of blockuser function

    activeSelectedUser: function(checkedUsersList){
    // console.log('Serverside-Checked checkboxes:'+ array);
    for (var i=0; i<checkedUsersList.length; i++) {
        // console.log('value: ' + checkedUsersList[i]);

      Meteor.users.update(
        {'_id': checkedUsersList[i] },
        {
          $set:{
              "profile.status": 'Active' ,
        } //End of set
      },
        function(error, result){
          if(error){
            return error;
          }else{
            return result;
          }
        }
      ); //end of update
      return checkedUsersList;

    } //End of for loop

  }, //end of Active function

    deleteSelectedUser: function(checkedUsersList){
    // console.log('Serverside-Checked checkboxes:'+ array);
    for (var i=0; i<checkedUsersList.length; i++) {
        // console.log('value: ' + array[i]);
      Meteor.users.remove(
      {'_id': checkedUsersList[i]},
      function(error, result){
        if(error){
          return error;
        }else{
          return result;
        }
      }
      ); //end of update
    } //End of for loop
    return checkedUsersList;

  }, //end of Deleteuser function


  sendEmail1: function (to , from, subject ,body) {
    check([to, from, subject, body], [String]);
    console.log('to : '+ to);
    console.log('from : ' + from);
    console.log('subject : ' + subject);
    console.log('body : ' + body);
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: body
    });
  }, //End of Send Email Function


  'createUserByAdminSetEmailToTrue' : function(newID) {
      Meteor.users.update(
        {'_id': newID },
        {
          $set:{
              "emails.0.verified" : true,
        } //End of set
      }
      ); //end of update
  },

  'createUserByAdmin' : function(formValues) {
    // console.log(formValues.email);
    var users = Meteor.users.findOne({'emails.0.address' : formValues.email});
    // console.log(users);
    if(users){
      console.log( "Email Address already taken");
      return 'emailIdExist';
    }else{
      console.log('in else');
      var newUser = Accounts.createUser(formValues);
      return newUser;
    }
     
  },

 'sendVerificationLink' : function(newID) {
    
     this.unblock();
     let userId = newID;

    if ( userId ) {
      var user = Meteor.users.findOne({'_id' : userId});
      if(user){
        return Accounts.sendVerificationEmail( userId ,user.emails[0].address);
      }   
    }else{
      throw new Meteor.Error(402, 'no user login');
    }
  },

 checkEmailVerification: function(email) {
    found_user = Meteor.users.findOne({ 'emails.address' : email })
    if(found_user){
        if(found_user.emails[0].verified == true && found_user.profile.status == 'Active'){
            return "verified";
        }else if(found_user.emails[0].verified == false){
            return "unverified";
        }else if(found_user.emails[0].verified == true && found_user.profile.status == 'Blocked'){
          return "Blocked";
        }else{
          return 'Issue';
        }
    }else{
        return "notfound";
    }
  },

});

Meteor.startup(() => {
  process.env.MAIL_URL="smtp://rightnxt123:Rightnxt@123@smtp.gmail.com:587";
  Accounts.emailTemplates.resetPassword.from = () => 'rightnxt <rightnxt123@gmail.com>';
  Accounts.emailTemplates.siteName = "qa.rightnxt.com";
  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
  }

    // Configures "verify email" email link
    Accounts.urls.verifyEmail = function(token){
        return Meteor.absoluteUrl("verify-email/" + token);
    };

 // Welcome and Email Verification

  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Verify Account with RightNxt';
  };

   Accounts.emailTemplates.verifyEmail.html = function(user, url) {
    var newurl = url.split('verify-email');
    // console.log('user : ',user.profile.emailotp);
    // return 'Hello,<br><br>Thank You for Signing up on Rightnxt. Please verify your email address to continue.<br><br>To verify your account email, simply click the link below:<br>'+'\n' + 'http://qa.rightnxt.com/verify-email' + newurl[1] + '<br><br>Regards,<br>Team Rightnxt.';
    return 'Hello,<br><br>Thank You for Signing up on Rightnxt. Please verify your email address to continue.<br><br>To verify your account email, simply enter OTP <b> ' + user.profile.emailotp + '</b><br><br>Regards,<br>Team Rightnxt.';
  };

});
