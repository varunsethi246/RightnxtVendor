
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


// FlowRouter.route('/userLike',{
//  name:'userLike',
//  waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('userProfile',params.userId),
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('vendorBusiness'),  
//                     Meteor.subscribe('userBusinessLikes'),
//                     Meteor.subscribe('userBookmark'),
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('userBeenThere'),   
//                     Meteor.subscribe('followUser'), 
//                     Meteor.subscribe('businessImgS3'),
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('userReviewS3',params.businessurl),  
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),    
//                 ];   
//     }, 
//  action(){
//   // BlazeLayout.render('userLayout', { content: 'userLike'});
//   userLikeFunc();
//  }
// });

// FlowRouter.route('/userLike/:userName',{
//  name:'userLike',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('vendorBusiness'),  
//                     Meteor.subscribe('businessLikesCount'),
//                     Meteor.subscribe('allBookmark'),
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('alluserBeenThere'),  
//                     Meteor.subscribe('followUser'), 
//                     Meteor.subscribe('businessImgS3'),
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('allreviews'),
//                     Meteor.subscribe('userReviewS3',params.businessurl),    
//                 ];   
//     }, 

//  //    subscriptions: function(params, queryParams) {
//  //        // using Fast Render
         
//  // },
//  action(){
//   // BlazeLayout.render('userLayout', { content: 'userLike'});
//   userLikeFunc();
//  }
// });


// FlowRouter.route('/userReview', {
//     name:'User Review',
//     waitOn(params) {        
//         return [ 
//                      Meteor.subscribe('area'),
//                      Meteor.subscribe('vendorBusiness'),
//                     Meteor.subscribe('userBusinessLikes'),
//                     Meteor.subscribe('reviewUser'),  
//                     Meteor.subscribe('userfunction'), 
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('userBookmark'),
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('businessImgS3'),
//                     Meteor.subscribe('categories'), 
//                     Meteor.subscribe('userReviewS3'),
//                     Meteor.subscribe('userBeenThere'),
//                     Meteor.subscribe('followUser'),  
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('reviewCommLikes'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,    
//                 ];   
//     },
//     // subscriptions: function(params, queryParams) {
       
//     //  },
//     action: function() {
//         // BlazeLayout.render("userLayout", {content:"userReviewPage"} );
//         userReviewPageFunc();
//     }
// });

// FlowRouter.route('/userReview/:userName', {
//     name:'User Review',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('vendorBusiness'), 
//                     Meteor.subscribe('businessLikesCount'),
//                     Meteor.subscribe('allBookmark'),
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('alluserBeenThere'),
//                     Meteor.subscribe('userProfile',params.userId),  
//                     Meteor.subscribe('userfunction'),  
//                     Meteor.subscribe('followUser'),  
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('allreviews'), 
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('userReviewS3',params.businessurl), 
//                     Meteor.subscribe('businessImgS3'),  
//                     Meteor.subscribe('reviewCommLikes'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,    
//                 ];   
//     },
//     // subscriptions: function(params, queryParams) {
          
//     //  },
//     action: function() {
//         // BlazeLayout.render("userLayout", {content:"userReviewPage"} );
//         userReviewPageFunc();
//     }
// });


// FlowRouter.route('/userPhotos', {
//     name:'User Photos',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('userBusinessLikes'),
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('userBookmark'),
//                     Meteor.subscribe('userBeenThere'),
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('vendorBusiness'),
//                     Meteor.subscribe('followUser'), 
//                     Meteor.subscribe('businessImgS3'), 
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('userReviewS3',params.businessurl),  
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('userImgLikes'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("userLayout", {content:"userPhotos"} );
//         userPhotosFunc();
//     }
// });
// FlowRouter.route('/userPhotos/:userName', {
//     name:'User Photos',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('businessLikesCount'),
//                     Meteor.subscribe('vendorBusiness'), 
//                     Meteor.subscribe('allBookmark'),
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('alluserBeenThere'),
//                     Meteor.subscribe('userProfile',params.userId),  
//                     Meteor.subscribe('userfunction'),  
//                     Meteor.subscribe('followUser'),  
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('allreviews'), 
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('userReviewS3',params.businessurl), 
//                     Meteor.subscribe('userImgLikes'), 
//                     Meteor.subscribe('businessImgS3'),  
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("userLayout", {content:"userPhotos"} );
//         userPhotosFunc();
//     }
// });

// FlowRouter.route('/userFollowers', {
//     name:'User Followers',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('userBusinessLikes'),
//                     Meteor.subscribe('userBookmark'),
//                     Meteor.subscribe('vendorBusiness'), 
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('userBeenThere'),
//                     Meteor.subscribe('userProfile',params.userId),  
//                     Meteor.subscribe('userfunction'),  
//                     Meteor.subscribe('followUser'),  
//                     Meteor.subscribe('notification'), 
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('allreviews'), 
//                     Meteor.subscribe('notificationTemplate') , 
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('userReviewS3',params.businessurl),
//                     Meteor.subscribe('businessImgS3'), 
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("userLayout", {content:"userFollowers"} );
//         userFollowersFunc();
//     }
// });

// FlowRouter.route('/userFollowers/:userName', {
//     name:'User Followers',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('vendorBusiness'), 
//                     Meteor.subscribe('businessLikesCount'),
//                     Meteor.subscribe('allBookmark'),
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('alluserBeenThere'),
//                     Meteor.subscribe('userProfile',params.userId),  
//                     Meteor.subscribe('userfunction'),  
//                     Meteor.subscribe('followUser'),  
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('notification'), 
//                     Meteor.subscribe('allreviews'), 
//                     Meteor.subscribe('notificationTemplate') , 
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('userReviewS3',params.businessurl), 
//                     Meteor.subscribe('businessImgS3'),   
//                 ];   
//     },
    
//     action: function() {
//         // BlazeLayout.render("userLayout", {content:"userFollowers"} );
//         userFollowersFunc();
//     }
// });

// FlowRouter.route('/userBookmarks', {
//     name:'User Bookmarks',
//     waitOn(params) {        
//         return [ 
//                      Meteor.subscribe('area'),
//                     Meteor.subscribe('userBusinessLikes'),
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('userBookmark'),
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('categories'), 
//                     Meteor.subscribe('followUser'), 
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('vendorBusiness'),
//                     Meteor.subscribe('userBeenThere'),
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('businessImgS3'), 
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('userReviewS3'),  
//                 ];   
//     },
//     // subscriptions: function(params, queryParams) {
       
//     //  },
//     action: function() {
//         // BlazeLayout.render("userLayout", {content:"userBookmarks"} );
//         userBookmarksFunc();
//     }
// });

// FlowRouter.route('/userBookmarks/:userName', {
//     name:'User Bookmarks',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('vendorBusiness'), 
//                     Meteor.subscribe('businessLikesCount'),
//                     Meteor.subscribe('allBookmark'),
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('alluserBeenThere'),
//                     Meteor.subscribe('userProfile',params.userId),  
//                     Meteor.subscribe('userfunction'),  
//                     Meteor.subscribe('followUser'),  
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('allreviews'),
//                     Meteor.subscribe('notification'),  
//                     Meteor.subscribe('notificationTemplate') , 
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('userReviewS3',params.businessurl), 
//                     Meteor.subscribe('businessImgS3'),  
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("userLayout", {content:"userBookmarks"} );
//         userBookmarksFunc();
//     }
// });

// FlowRouter.route('/userBeenThere', {
//     name:'User Been There',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('userBusinessLikes'),
//                     Meteor.subscribe('userBookmark'),
//                     Meteor.subscribe('userBeenThere'),
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('followUser'), 
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('vendorBusiness'),
//                     Meteor.subscribe('businessImgS3'), 
//                     Meteor.subscribe('userReviewS3',params.businessurl), 
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("userLayout", {content:"userBeenThere"} );
//         userBeenThereFunc();

//     }
// });

// FlowRouter.route('/userBeenThere/:userName', {
//     name:'User Been There',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('vendorBusiness'), 
//                     Meteor.subscribe('businessLikesCount'),
//                     Meteor.subscribe('allBookmark'),
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('notification'), 
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('alluserBeenThere'),
//                     Meteor.subscribe('userProfile',params.userId),  
//                     Meteor.subscribe('userfunction'),  
//                     Meteor.subscribe('followUser'),  
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('allreviews'), 
//                     Meteor.subscribe('notificationTemplate') , 
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('userReviewS3',params.businessurl),
//                     Meteor.subscribe('businessImgS3'),  
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("userLayout", {content:"userBeenThere"} );
//         userBeenThereFunc();

//     }
// });

// FlowRouter.route('/userRatings', {
//     name:'User Ratings',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('userBookmark'),
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('userBeenThere'),
//                     Meteor.subscribe('followUser'), 
//                     Meteor.subscribe('businessImgS3'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('userBusinessLikes'),
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('userReviewS3',params.businessurl), 
//                     Meteor.subscribe('businessLikesCount'),
//                     Meteor.subscribe('allBookmark'),
//                     Meteor.subscribe('alluserBeenThere'),
//                     Meteor.subscribe('userProfile',params.userId),   
//                     Meteor.subscribe('allreviews'),
//                     Meteor.subscribe('vendorBusiness'),     
//                 ];   
//     },
//     action: function() {
//         console.log('hey in rating');
//         // BlazeLayout.render("userLayout", {content:"userRatings"} );
//         userRatingsFunc();
//     }
// });
// FlowRouter.route('/userRatings/:userName', {
//     name:'User Ratings',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('businessLikesCount'),
//                     Meteor.subscribe('allBookmark'),
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('alluserBeenThere'),
//                     Meteor.subscribe('userProfile',params.userId),  
//                     Meteor.subscribe('userfunction'),  
//                     Meteor.subscribe('followUser'),  
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('notification'), 
//                     Meteor.subscribe('allreviews'), 
//                     Meteor.subscribe('notificationTemplate') , 
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('userReviewS3',params.businessurl),
//                     Meteor.subscribe('businessImgS3'), 
//                     Meteor.subscribe('vendorBusiness'),   
//                 ];   
//     },
    
//     action: function() {
//         console.log('hello');
//         // BlazeLayout.render("userLayout", {content:"userRatings"} );
//         userRatingsFunc();
//     }
// });

// FlowRouter.route('/userOffers', {
//     name:'User Offers',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('userBookmark'),
//                     Meteor.subscribe('userBeenThere'),
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('followUser'), 
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('categories'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') , 
//                     Meteor.subscribe('userBusinessLikes'),
//                     Meteor.subscribe('userReviewS3',params.businessurl),
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('offers'),
//                     // Meteor.subscribe('userOffers'),  
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('offerImagesS3'),
//                     Meteor.subscribe('businessImgS3'),
//                     Meteor.subscribe('vendorBusiness'),      
//                 ];   
//     },
//     // subscriptions: function(params, queryParams) {
       
//     //  },
//     action: function() {
//         // BlazeLayout.render("userLayout", {content:"userOffers"} );
//         userOffersFunc();
//     }
// });

// FlowRouter.route('/userOffers/:userName', {
//     name:'User Offers',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('businessLikesCount'),
//                     Meteor.subscribe('allBookmark'),
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('alluserBeenThere'),
//                     Meteor.subscribe('userProfile',params.userId),  
//                     Meteor.subscribe('followUser'),  
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('allreviews'), 
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('userReviewS3',params.businessurl),     
//                     Meteor.subscribe('offerImagesS3'),
//                     Meteor.subscribe('offers'),
//                     Meteor.subscribe('businessImgS3'),
//                     Meteor.subscribe('vendorBusiness'),      
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("userLayout", {content:"userOffers"} );
//         userOffersFunc();
//     }
// });

// FlowRouter.route('/userEnquiry', {
//     name:'User Enquiry',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('userBusinessLikes'),
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('userBookmark'),
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('userBeenThere'),
//                     Meteor.subscribe('followUser'), 
//                     Meteor.subscribe('vendorBusiness'), 
//                     Meteor.subscribe('notification'),  
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('enquiryImgS3'),
//                     Meteor.subscribe('userReviewS3',params.businessurl), 
//                     Meteor.subscribe('businessImgS3'),  
//                     Meteor.subscribe('notification'), 
//                     Meteor.subscribe('userfunction'),  
//                     Meteor.subscribe('notificationTemplate') , 
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("userLayout", {content:"userEnquiryPage"} );
//         userEnquiryPageFunc();
//     }
// });


// function activateSidebarLink(){
//     var currentURL = FlowRouter.current().path;
//     var actualURL = currentURL.substring(1);
//     $('.sidebarlink').removeClass('active');
//     $('.'+actualURL).addClass('active');
// }


// FlowRouter.route('/findYourFriends',{
//  name:'findYourFriends',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('userProfile',params.userId),  
//                     Meteor.subscribe('userfunction'),  
//                     Meteor.subscribe('followUser'),  
//                     Meteor.subscribe('allreviews'), 
//                     Meteor.subscribe('userProfileS3'),
//                     Meteor.subscribe('notification'), 
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('businessImgS3'),  
//                     Meteor.subscribe('configSettings'), 
//                     Meteor.subscribe('reviewCommLikes'),
//                     Meteor.subscribe('userBusinessLikes'),
//                     Meteor.subscribe('followUser'),  
//                     Meteor.subscribe('userBookmark'),
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('userBeenThere'),  
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('vendorBusiness'),  
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('userReviewS3',params.businessurl), 
//                ];   
//     }, 
    
//     action(){
//         // BlazeLayout.render('userLayout', { content: 'findYourFriends'});
//         findYourFriendsFunc();
//     }
// });



/*
FlowRouter.route('/vendorBusinessDetails', {
    // subscriptions: function(params, queryParams) {
      
    //     this.register('userProfileS3', Meteor.subscribe('userProfileS3'));  
     
    //  },
    action: function() {
        BlazeLayout.render("vendorBusinessLayout");

    }
});*/

