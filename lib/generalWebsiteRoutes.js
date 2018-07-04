
// import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// FlowRouter.route('/about', {
//     action: function() {
//         // BlazeLayout.render("generalLayoutWithImage", {generalcontent: "aboutUs"} );
//         aboutUsFunc();
//     }
// });
// // vendorBusinessLayout
// FlowRouter.route('/career', {

//     name: 'career',

//     action: function() {
//         // BlazeLayout.render("generalLayoutWithImage", {generalcontent: "career"});
//         careerFunc();
//     }
// });



// FlowRouter.route('/contactUs', {
//     name: 'contactUs',

//     action: function() {
//         // BlazeLayout.render("generalLayoutWithImage", {generalcontent: "contactUs"});
//         contactUsFunc();
//     }
// });


// FlowRouter.route('/join-us/:id', {
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('businessImgS3'),  
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('newjob'),  
//                     Meteor.subscribe('resumeS3'),
//                     Meteor.subscribe('userProfileS3'),   
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,   
//                ];   
//     },
//     action: function() {
//         console.log('in join us -id-city')
//         // BlazeLayout.render("generalLayout", {generalcontent: "joinUs"});
//         joinUsFunc();
//     }
// });

// FlowRouter.route('/code-of-conduct', {
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('businessImgS3'),  
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('generalContent'),
//                     Meteor.subscribe('userProfileS3'),   
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,               
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("generalLayout", {generalcontent: "codeOfConduct"});
//         console.log('in code of code-of-conduct');
//         codeOfConductFunc();
//     }
// });



// FlowRouter.route('/faqs/:tabName', {
//     waitOn(params) {  
//         var name = 'faqs';      
//         return [ 
//                     // Meteor.subscribe('businessImgS3'),  
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('generalContentFaq',name,params.tabName), 
//                     Meteor.subscribe('userProfileS3'),  
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('notificationTemplate') ,              
//                     // Meteor.subscribe('userfunction'),
//                 ];   
//     },  
//     action: function() {
//         // BlazeLayout.render("generalLayoutWithImage", {generalcontent: "faq"});
//         faqFunc();
//     }
// });

// FlowRouter.route('/webpage/:url', {
//     waitOn(params) { 
//         return [ 
//                     // Meteor.subscribe('businessImgS3'),  
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('generalContentUrl',params.url), 
//                     Meteor.subscribe('userProfileS3'),  
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('notificationTemplate') ,      
//                     // Meteor.subscribe('userfunction'),
//                 ];   
//     },  
//     action: function() {
//         // BlazeLayout.render("generalLayout", {generalcontent: "merchantGuidelines"});
//         merchantGuidelinesFunc();
//     }
// });


// FlowRouter.route('/jobList', {
//     name: 'Job Lists',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('businessImgS3'),  
//                     Meteor.subscribe('newjob'),  
//                     Meteor.subscribe('allCity'),  
//                     Meteor.subscribe('allCity'),
//                     Meteor.subscribe('allStates'), 
//                     Meteor.subscribe('allStates'),
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,    
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main: "jobList"});
//         jobListFunc();
//     }
// });



