import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


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
                    Meteor.subscribe('area'),
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
                    Meteor.subscribe('notificationTemplate') ,   
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('currentuser'),
                    Meteor.subscribe('area'),
                    // Meteor.subscribe('vendorImage'),
                    // Meteor.subscribe('businessImgS3'),  
                    // Meteor.subscribe('userProfileS3'), 
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
                    // Meteor.subscribe('adminfunction'),
                    Meteor.subscribe('notificationTemplate'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('currentuser'),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('oneBusiness',params.businessurl), 
                    Meteor.subscribe('review',params.businessurl),
                    Meteor.subscribe('vendorOffer'),
                    Meteor.subscribe('reviewImage'),
                    Meteor.subscribe('ownerImageBusiness',params.businessurl),
                    Meteor.subscribe('oneBusinessImages',params.businessurl),
                    Meteor.subscribe('oneBusiMenuImages',params.businessurl),
                    Meteor.subscribe('oneBusinessVideo',params.businessurl),
                    Meteor.subscribe('oneBusiOffersImages',params.businessurl),
                    Meteor.subscribe('allVendorImages'),
                    Meteor.subscribe('businessOffers',params.businessurl), 
                    Meteor.subscribe('bookmark',params.businessurl),
                    Meteor.subscribe('beenThere',params.businessurl),
                    Meteor.subscribe('savedOffer',params.businessurl),
                    Meteor.subscribe('imageComment',params.businessurl), 
                    Meteor.subscribe('imageCommentLike',params.businessurl),
                    // Meteor.subscribe('businessLikes',params.businessurl), 
                    // Meteor.subscribe('reviewCommentLikes',params.businessurl),
                    // Meteor.subscribe('busImageLikesCount',params.businessurl),
                    // Meteor.subscribe('bussImgLikes'),
                    // Meteor.subscribe('followUser'),
                    // Meteor.subscribe('businessOfferImage'),
                    // Meteor.subscribe('businessImage'),
                    // Meteor.subscribe('businessMenuImage'),
                    // // Meteor.subscribe('vendorImage'),
                    // Meteor.subscribe('ownerImage'),
                    // Meteor.subscribe('getBizVideo'),
                    // Meteor.subscribe('allBusinesses'),
                    // Meteor.subscribe('businessOffers',params.businessurl), 
                    // Meteor.subscribe('bookmark',params.businessurl),
                    // Meteor.subscribe('beenThere',params.businessurl),
                    // Meteor.subscribe('savedOffer',params.businessurl),
                    // Meteor.subscribe('allSavedOffer'),
                    // Meteor.subscribe('businessLikes',params.businessurl), 
                    // Meteor.subscribe('reviewCommentLikes',params.businessurl),
                    // Meteor.subscribe('followUser'),
                    // Meteor.subscribe('vendorBusinessEnquiry'),
                    // Meteor.subscribe('allpayment'),
                    // Meteor.subscribe('allreviews'),
                    // Meteor.subscribe('offers'),
                    // Meteor.subscribe('allStatistics'),
                    // Meteor.subscribe('bussImgLikes'),
                    // Meteor.subscribe('reviewCount'),
                    // Meteor.subscribe('vendorImage'),
                    // Meteor.subscribe('followerCounts'),
                    // Meteor.subscribe('vendorBusiness'),
                    // Meteor.subscribe('userReviewS3',params.businessurl),
                    // Meteor.subscribe('userReviewS3'),
                    // Meteor.subscribe('offerImagesS3'),
                    // Meteor.subscribe('businessImgS3'),
                    // Meteor.subscribe('enquiryImgS3'),
                    // Meteor.subscribe('userReviewS3'),
                    // Meteor.subscribe('userProfileS3'),
                    // Meteor.subscribe('businessMenu'),
                    // Meteor.subscribe('businessVideo'), 
                    // Meteor.subscribe('review'),
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

FlowRouter.route('/reset-password/:token', {
    name: 'resetpassword',
    waitOn(params) {        
        return [ 
                    // Meteor.subscribe('userfunction'),
                    // Meteor.subscribe('notification'),
                    // Meteor.subscribe('notificationTemplate') ,

                ];   
    },

    action: function() {
        // console.log('in resetpassword');

        ResetPasswordFunc();
    }
});



FlowRouter.route('/viewNotification', {
    name: 'ViewAllNotification',
     waitOn(params) {        
        return [ 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('userProfileS3'), 
                    Meteor.subscribe('followUser'),  
                    Meteor.subscribe('userBusinessLikes'),
                    Meteor.subscribe('userBookmark'),
                    Meteor.subscribe('userBeenThere'),  
                    Meteor.subscribe('businessImgS3'),
                    Meteor.subscribe('vendorBusinessEnquiry'),
                    Meteor.subscribe('allSavedOffer'), 
                    Meteor.subscribe('reviewUser'),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('allCity'),
                    Meteor.subscribe('vendorBusiness'),  
                ];   
    },

    action: function() {

        ViewAdminNotifsFunc();

    }
});

FlowRouter.route('/viewNotifications', {
    name: 'ViewAllNotification-admin',
     waitOn(params) {        
        return [ 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('userProfileS3'), 
                    Meteor.subscribe('followUser'),  
                    Meteor.subscribe('userBusinessLikes'),
                    Meteor.subscribe('userBookmark'),
                    Meteor.subscribe('userBeenThere'),  
                    Meteor.subscribe('businessImgS3'),
                    Meteor.subscribe('vendorBusinessEnquiry'),
                    Meteor.subscribe('allSavedOffer'), 
                    Meteor.subscribe('reviewUser'),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('allCity'),
                    Meteor.subscribe('vendorBusiness'),  
                ];   
    },

    action: function() {
        ViewAllNotifFuncs();

    }
});



FlowRouter.route('/userProfile',{
    name:'userProfile',
    waitOn(params) {        
        return [ 
                   Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('configSettings'), 
                    Meteor.subscribe('userProfile',params.userId),
                    Meteor.subscribe('reviewCommLikes'),
                    Meteor.subscribe('userBusinessLikes'),
                    Meteor.subscribe('userProfileS3'),  
                    Meteor.subscribe('followUser'),  
                    Meteor.subscribe('userBookmark'),
                    Meteor.subscribe('allSavedOffer'), 
                    Meteor.subscribe('userBeenThere'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('vendorBusiness'),  
                    Meteor.subscribe('allreviews'), 
                    Meteor.subscribe('businessImgS3'),
                    Meteor.subscribe('reviewUser'),
                    Meteor.subscribe('vendorBusinessEnquiry'),
                    Meteor.subscribe('userReviewS3',params.businessurl),  
                ];   
    }, 
    // subscriptions: function(params, queryParams) {
    //     // using Fast Render
        
    // },
 action(){
    console.log('in user profile');
    userTimelinePageFunc();
    var url = FlowRouter.current().path;
    var checkIdExists = url.split('/');
    if(checkIdExists.length<2){
        Session.set("updateUserTimeline",true);
    }else{
        Session.set("updateUserTimeline",false);
    }
 }
});