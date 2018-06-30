Template.UMregister.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;
        var userNameVar = event.target.registerUserName.value;
        // test
        id = Accounts.createUser({
            username   : userNameVar,
            email      : emailVar,
            password   : passwordVar,
            profile    : {         
                           deliveryAdd : [],    
                           status      :  'Active',
                         },
        }, function(error,result) {
         if (error) {
            console.log('Error: ' + error.reason);
         } else {
            var newID = Meteor.userId();
            var defaultRoleconfig = ['admin'];
            Meteor.call('addRoles', newID , defaultRoleconfig);
            Meteor.call('createUserByAdminSetEmailToTrue', newID);
            Meteor.logout();
            FlowRouter.go("/UMsignupconfig");
         }
      }); //End of create user
    } //End of Submit event
});
