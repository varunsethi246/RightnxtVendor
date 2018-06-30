
// import './login.html';
// import './signup.js';
// import './signup.html';

if (Meteor.isClient) {

  Template.UMlogin.events({
  'submit form#login': function(event) {
    event.preventDefault();
    // var emailVar = event.target.loginEmail.value;
    var usernameVar = event.target.loginusername.value;
    var passwordVar = event.target.loginPassword.value;
    Meteor.loginWithPassword(usernameVar, passwordVar, function(error) {
            if (error) {
                return swal({
                    title: "Username or password Incorect",
                    text: "Please try again or create an account",
                    timer: 1700,
                    showConfirmButton: false,
                    type: "error"
                });
            } else {
                var loggedInUser = Meteor.userId();
                  var user = Meteor.users.findOne({'_id' : loggedInUser });
                  if(user){
                    if(user.profile.status == 'Active'){
                      if (Roles.userIsInRole(loggedInUser, ['admin','Staff'])) {
                            FlowRouter.go('/adminDashboard');
                      }else if (Roles.userIsInRole(loggedInUser, ['Supplier'])) {
                            FlowRouter.go('/supplierDashboard');
                      }else{
                            FlowRouter.go('/');
                      }                      
                    }else{
                      FlowRouter.go('/blockedProfile');
                    }
                  
                  }

            }
        });
    return false;
  },

});

}
