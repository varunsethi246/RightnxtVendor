// import './login.html';
// import './signup.js';
// import './signup.html';

if (Meteor.isClient) {

  Template.login.events({
  'submit form': function(event) {
    event.preventDefault();
    var emailVar = event.target.loginEmail.value;
    var passwordVar = event.target.loginPassword.value;
    Meteor.loginWithPassword(emailVar, passwordVar, function(error) {
            if (error) {
                return swal({
                    title: "Email or password Incorect",
                    text: "Please try again or create an account",
                    timer: 1700,
                    showConfirmButton: false,
                    type: "error"
                });
            } else {
                FlowRouter.go('/um-Home');
            }
        });
    return false;
  }
});

}
