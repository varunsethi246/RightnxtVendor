import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// vendorBusinessLayout

FlowRouter.route('/join-us/:id', {
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notificationTemplate') ,   
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('currentuser'),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('onenewjob',params.id),  
                    // Meteor.subscribe('vendorImage'),  
                    // Meteor.subscribe('resumeImage'),  
                    // Meteor.subscribe('businessImgS3'),  
                    // Meteor.subscribe('resumeS3'),
                    // Meteor.subscribe('userProfileS3'),   
               ];   
    },
    action: function() {
        // console.log('in join us -id-city')
        // BlazeLayout.render("generalLayout", {generalcontent: "joinUs"});
        joinUsFunc();
    }
});

FlowRouter.route('/faqs/:tabName', {
    waitOn(params) {  
        var name = 'faqs'; 
        var tabName = params.tabName.split('-').join(' ');     
        return [ 
                    Meteor.subscribe('notificationTemplate') ,              
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('currentuser'),
                    Meteor.subscribe('area'),
                    // Meteor.subscribe('vendorImage'),
                    Meteor.subscribe('generalContentFaq',name,tabName), 
                    // Meteor.subscribe('userProfileS3'),  
                    // Meteor.subscribe('businessImgS3'),  
                ];   
    },  
    action: function() {
        // BlazeLayout.render("generalLayoutWithImage", {generalcontent: "faq"});
        faqFunc();
    }
});

FlowRouter.route('/webpage/:url', {
    waitOn(params) { 
        return [ 
                    Meteor.subscribe('notificationTemplate') ,      
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('currentuser'),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('generalContentUrl',params.url), 
                    // Meteor.subscribe('vendorImage'),
                    // Meteor.subscribe('userProfileS3'),  
                    // Meteor.subscribe('userfunction'),
                    // Meteor.subscribe('businessImgS3'),  
                ];   
    },  
    action: function() {
        // BlazeLayout.render("generalLayout", {generalcontent: "merchantGuidelines"});
        merchantGuidelinesFunc();
    }
});