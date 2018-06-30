Template.UMverifyEmail.onCreated(function() {
  var token = FlowRouter.getParam("token");
  // console.log('token : ' + token);
    Accounts.verifyEmail(token, function(err) {
      if (err != null) {
        if (err.message = 'Verify email link expired [403]') {
          Bert.alert( 'Sorry this verification link has expired.', 'danger' );
          // console.log('Sorry this verification link has expired.');
        }
      } else {
        console.log('Thank you! Your email address has been confirmed.');
        FlowRouter.go('/');
      }
    });
});