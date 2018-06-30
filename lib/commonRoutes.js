import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/', {
    name: 'Home Page',
    action: function() {
        // console.log('loading');
        VendorHomepageFunc();
    }
});

FlowRouter.route('/UMonetimeSignup', {
    name: 'UMonetimeSignup',
    action: function() {

        UMregisterFunc();
    }
});

FlowRouter.route('/LoginOTP', {
    name: 'Login OTP',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('userfunction'),
               ];   
    }, 
    action: function() {

        LoginOTPFunc();
    }
});


FlowRouter.route('/vendorpage', {
    name: 'vendor Page',
    action: function() {
        BlazeLayout.render("vendorpage");
    }
});

FlowRouter.route('/vendorLoginForm', {
    action: function() {
        VenderLoginFormFunc();
    }
});

FlowRouter.route('/vendorSignUpForm', {
    action: function() {
        vendorSignUpForm();
    }
});

FlowRouter.route( '/verify-email/:token', {
  name: 'verify-email',
  action( params ) {
    Accounts.verifyEmail( params.token, ( error ) =>{
      if ( error ) {
        Bert.alert( error.reason, 'danger' );
      } else {
        var loggedInUser = Meteor.userId();
        if(loggedInUser){
            FlowRouter.go('/');
            Meteor.call('sendWelcomeMail',
             function(error, result){
                if(error){
                    console.log("Error is" +error.reason);
                }else{
                    Bert.alert( 'Welcome to RightNxt!!!!', 'success', 'growl-top-right' );
                }
            });           
        }
      }
    });
  }
});




FlowRouter.route('/comingSoon', {
    name: 'coming soon',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('userProfileS3'), 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,   
               ];   
    },
    action: function() {
        // BlazeLayout.render("generalLayout", {generalcontent: "comingSoon"});
        comingSoonFunc();

    }
});


FlowRouter.route('/privacy-policy', {
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('generalContent'), 
                    Meteor.subscribe('userProfileS3'),  
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,                
                ];   

    },
    action: function() {
        // BlazeLayout.render("generalLayout", {generalcontent: "privacyPolicy"});
        privacyPolicyFunc();
    }
});


FlowRouter.route('/terms-of-service', {
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('generalContent'),
                    Meteor.subscribe('userProfileS3'),   
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,               
                ];   
    },
    action: function() {
        // BlazeLayout.render("generalLayout", {generalcontent: "termsOfService"});
        termsOfServiceFunc();
    }
});


FlowRouter.route('/merchant-guidelines', {
    waitOn(params) { 
        console.log(params);       
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('generalContent'), 
                    Meteor.subscribe('userProfileS3'),  
                    Meteor.subscribe('notification'),
                    // Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,      
                ];   
    },  
    action: function() {
        // BlazeLayout.render("generalLayout", {generalcontent: "merchantGuidelines"});
        merchantGuidelinesFunc();
    }
});


FlowRouter.route('/:businessurl', {
    name: 'Business Page',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('imageCommentLike',params.businessurl),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('oneBusiness',params.businessurl), 
                    Meteor.subscribe('businessOffers',params.businessurl), 
                    Meteor.subscribe('review',params.businessurl),
                    Meteor.subscribe('imageComment',params.businessurl), 
                    Meteor.subscribe('userReviewS3',params.businessurl),
                    Meteor.subscribe('userReviewS3'),
                    Meteor.subscribe('offerImagesS3'),
                    Meteor.subscribe('businessOffers',params.businessurl), 
                    Meteor.subscribe('bookmark',params.businessurl),
                    Meteor.subscribe('beenThere',params.businessurl),
                    Meteor.subscribe('savedOffer',params.businessurl),
                    Meteor.subscribe('allSavedOffer'),
                    Meteor.subscribe('businessLikes',params.businessurl), 
                    Meteor.subscribe('businessImgS3'),
                    Meteor.subscribe('businessMenu'),
                    Meteor.subscribe('businessVideo'), 
                    Meteor.subscribe('review'),
                    Meteor.subscribe('reviewCommentLikes',params.businessurl),
                    Meteor.subscribe('businessVideo'),
                    Meteor.subscribe('followUser'),
                    Meteor.subscribe('vendorBusinessEnquiry'),
                    Meteor.subscribe('enquiryImgS3'),
                    Meteor.subscribe('allpayment'),
                    Meteor.subscribe('allreviews'),
                    Meteor.subscribe('userReviewS3'),
                    Meteor.subscribe('offers'),
                    Meteor.subscribe('userProfileS3'),
                    Meteor.subscribe('allStatistics'),
                    Meteor.subscribe('bussImgLikes'),
                    Meteor.subscribe('reviewCount'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('notificationTemplate'),
                    // Meteor.subscribe('followerCounts'),
               ];   
    }, 
    // subscriptions: function(params, queryParams) {
    //     // using Fast Render
        
    // },
    action: function() {
        // console.log('on business page');
        // BlazeLayout.render("vendorBusinessLayout");
        vendorBusinessLayoutFunc();
    }
});