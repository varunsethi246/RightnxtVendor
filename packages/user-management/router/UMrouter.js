FlowRouter.route('/UMHome', {
    name: 'home',
    action: function() {
        BlazeLayout.render("UMmainLayout", {
            content: "UMhomeLayout"
        });
    }
});

FlowRouter.route('/UMforgotpassword', {
    name: 'forgotpassword',
    action: function() {
        BlazeLayout.render("UMmainLayout", {
            content: "ForgotPassword"
        });
    }
});

FlowRouter.route('/UMsignupconfig', {
    name: 'home',
    action: function() {
        BlazeLayout.render("UMmainLayout", {
            content: "UMChecklistElements"
        });
    }
});

FlowRouter.route('/UMonetimeSignup', {
    name: 'home',
    action: function() {
        BlazeLayout.render("UMmainLayout", {
            content: "UMregister"
        });
    }
});

FlowRouter.route('/UMlogin', {
    name: 'login',
    action: function() {
        BlazeLayout.render("UMmainLayout", {
            content: "UMlogin"
        });
    }
});

FlowRouter.route('/UMsignup', {
    name: 'signup',
    action: function() {
        BlazeLayout.render("UMmainLayout", {
            content: "UMsignup"
        });
    }
});

FlowRouter.route('/UMusers-list', {
    name: 'List of Users',
    action: function() {
        BlazeLayout.render("UMlistOfUsers");
    }
});

FlowRouter.route('/UMeditProfile/:userId', {
    name: 'Edit Profile',
    action: function() {
        BlazeLayout.render("UMeditProfile");
    }
});

FlowRouter.route('/UMeditMyProfile/:userId', {
    name: 'Edit My Profile',
    action: function() {
        BlazeLayout.render("UMeditMyProfile");
    }
});

FlowRouter.route('/UMroles', {
    name: 'Roles',
    action: function() {
        BlazeLayout.render("UMaddRoleList");
    }
});

FlowRouter.route('/UMaddroles', {
    name: 'Add Roles',
    action: function() {
        BlazeLayout.render("UMaddRoles");
    }
});

FlowRouter.route('/UMeditroles/:userId', {
    name: 'Edit Roles',
    action: function() {
        BlazeLayout.render("UMeditRoles");
    }
});

// FlowRouter.route('/UMdeleteUserConfirm/:userId', {
//     name: 'Delete Confirm',
//     action: function() {
//         BlazeLayout.render("UMdeleteUserConfirm");
//     }
// });



FlowRouter.route( '/verify-email/:token', {
  name: 'verify-email',
  action( params ) {
    Accounts.verifyEmail( params.token, ( error ) =>{
      if ( error ) {
        Bert.alert( error.reason, 'danger' );
      } else {
        FlowRouter.go( '/' );
        Bert.alert( 'Email verified! Thanks!', 'success' );
      }
    });
  }
});

FlowRouter.route('/blockedProfile', {
    name: 'resetpassword',
    action: function() {
        BlazeLayout.render("blockedProfile");
    }
});

