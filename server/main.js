import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
//============================================================
//   Meteor Files or OSTRIO Files import for images
//============================================================
import { BusinessOwnerImages } from '/imports/api/ostriofiles/addBusinessOwnerServer.js';

Meteor.publish('allBusinessOwnerImages', function () {
  return BusinessOwnerImages.find().cursor;
});



//============================================================
//   Admin Masters
//============================================================
import '../imports/api/UMAPI.js';
import '../imports/api/companysettingsAPI.js';
import '../imports/api/homePageVideo.js';
// import '../imports/api/dailyOrderAPI.js';




//============================================================
//   Forms Masters
//============================================================
import '../imports/api/businessMaster.js';
import '../imports/api/offersMaster.js';
import '../imports/api/paymentMaster.js';
import '../imports/api/likesMaster.js';
import '../imports/api/enquiryMaster.js';
import '../imports/api/reportMaster.js';
import '../imports/api/bookmarkMaster.js';
import '../imports/api/beenThereMaster.js';
import '../imports/api/savedOffersMaster.js'
import '../imports/api/businessImageLikesMaster.js';
import '../imports/api/UserImgLikesMaster.js';
import '../imports/api/imageCommentMaster.js';
import '../imports/api/imageCommentLikeMaster.js';





//============================================================
//   Webpages Masters
//============================================================
import '../imports/api/webPages/AddNewJobMaster.js';
import '../imports/api/webPages/contactUsMaster.js';
import '../imports/api/webPages/generalContentMaster.js';
import '../imports/api/webPages/joinusMaster.js';


//============================================================
import '../imports/api/userMasterAPI.js';
import '../imports/api/masterData/areaMaster.js';
import '../imports/api/masterData/cityMaster.js';
import '../imports/api/masterData/stateMaster.js';
import '../imports/api/masterData/categoriesMaster.js';
// import '../imports/api/myBusiness/myBusinessAdmin.js';
import '../imports/api/reviewMaster.js';
import '../imports/api/reviewCommentLikesMaster.js';
import '../imports/api/userFollowMaster.js';
import '../imports/api/notification.js';
import '../imports/api/NotificationTemplate.js';
import '../imports/api/userViewMaster.js';
import '../imports/api/discountMaster.js';
import '../imports/api/businessBannerMaster.js';
import '../imports/api/businessAdsMaster.js';



// Signup Setting
import '../imports/api/configSettingsMaster.js';
import '../imports/api/s3Details.js';


import { BizVideo } from '/imports/videoUploadserver/videoUpload.js';
import { BizVideoBanner } from '/imports/videoUploadserver/videoUploadBanner.js';
import { FollowUser } from '/imports/api/userFollowMaster.js';
import { VendorImage } from '/imports/videoUploadserver/vendorImageServer.js';
import { OwnerImage } from '/imports/videoUploadserver/ownerImageServer.js';
import { BusinessImage } from '/imports/videoUploadserver/businessImageServer.js';
import { BusinessMenu } from '/imports/videoUploadserver/businessMenuServer.js';
import { OfferImage } from '/imports/videoUploadserver/offerImageServer.js';
import { EnquiryImage } from '/imports/videoUploadserver/enquiryImageServer.js';
import { ReviewImage } from '/imports/videoUploadserver/reviewImageServer.js';

Meteor.publish('getBizVideo', function() {
    return BizVideo.find({}).cursor;
});
Meteor.publish('getBizVideoBanner', function() {
    return BizVideoBanner.find({}).cursor;
});
Meteor.publish('vendorImage', function() {
    return VendorImage.find({}).cursor;
});
Meteor.publish('ownerImage', function() {
    return OwnerImage.find({}).cursor;
});
Meteor.publish('businessImage', function() {
    return BusinessImage.find({}).cursor;
});
Meteor.publish('businessMenuImage', function() {
    return BusinessMenu.find({}).cursor;
});
Meteor.publish('businessOfferImage', function() {
    return OfferImage.find({}).cursor;
});
Meteor.publish('businessEnquiryImage', function() {
    return EnquiryImage.find({}).cursor;
});
Meteor.publish('reviewImage', function() {
    return ReviewImage.find({}).cursor;
});

 // Meteor.publish('followUser', function() {
 //    return FollowUser.find({});
 //  });

  Meteor.publish('followerCounts', function() {
      Counts.publish(this, 'followerCounts', FollowUser.find({}));
  });

// import '../imports/notifications/notification.js';


Meteor.startup(() => {
  // process.env.S3='{"s3":{"key": "AKIAIEMSTWVHER5QZS3A", "secret": "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", "bucket": "rightnxt", "region": "ap-south-1"}}' ;
// process.env.S3='{"s3":{"key": "AKIAIEMSTWVHER5QZS3A", "secret": "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", "bucket": "rightnxt", "region": "ap-south-1"}}' ;
// process.env.S3='{"s3":{"key": "AKIAI2F7N3DNQ5IAU3SQ", "secret": "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", "bucket": "rightnxt1", "region": "us-east-2"}}' ;
  
  // process.env.MAIL_URL="smtp://rightnxt123:Rightnxt@123@smtp.gmail.com:587";
  process.env.MAIL_URL='smtp://rightnxt123%40gmail.com:' + encodeURIComponent("Rightnxt@123") + '@smtp.gmail.com:587';
  // process.env.MAIL_URL="smtp://rightnxt123:Rightnxt@123@smtp.gmail.com:587";
  Accounts.emailTemplates.resetPassword.from = () => 'rightnxt <rightnxt123@gmail.com>';
  Accounts.emailTemplates.siteName = "RightNxt";
  Accounts.emailTemplates.from = 'RightNxt Admin <rightnxt123@gmail.com>';

  // Meteor.AppCache.config({
  //   chrome: false,
  //   firefox: false
  // });
  // code to run on server at startup
});

Meteor.methods({
  sendEmailRightNxt: function (to , from, subject ,body) {
    check([to, from, subject, body], [String]);
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    // console.log('to ',to,' from ',from,' subject ',subject,' body ',body);
    Email.send({
      to: to,
      from: from,
      subject: subject,
      html: body
    });
  }, //End of Send Email Function

  sendShareEmailRightNxt: function (to , from, subject) {
    check([to, from, subject], [String]);
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    var imgUri = "images/logo.png";
    var image  = Meteor.absoluteUrl(imgUri)
    var name = Meteor.users.findOne({_id:Meteor.userId()}).profile.name;
    var msg = 'Hi there, <br/><br/>'+name+ ' has share offer with you. Check it out.<br/><br/><p></p><br/><br/><div style="border: 1px solid #ccc; width: 800px;"><img src='+image+' alt="" style="height: 60px; width: 60px; padding-left: 15px; padding-top: 15px;" /><SPAN style= "font-size: 16px; font-weight: 700; float: right; margin-top: 4%; margin-right: 73%;">Dominos Offer-4 </SPAN><span style=""><h5 style="padding-right: 15px; padding-left: 15px;">Expiration Date: From 19 Jul To 19 Aug 2017</h5><hr style="margin-right: 15px; margin-left: 15px;"><p style="font-size: 14px; padding-right: 15px; padding-left: 15px; text-align: justify; font-weight: 400; color: #555;">Buy 4 medium pan pizzas @ Rs. 1000/- Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p></span></div>';
    Email.send({
      to: to,
      from: from,
      subject: subject,
      html: msg
    });
  }, //End of Send Email Function

  'sendWelcomeMail': function(body){
    var Id = Meteor.userId();
    var mailReceipant = Meteor.users.findOne({'_id':Id});
    if(mailReceipant){
      var to     = mailReceipant.emails[0].address;
      var imgUri = "images/logo.png";
      var image  = Meteor.absoluteUrl(imgUri)  //for proper image src URLs
      var from    = 'rightnxt123@gmail.com';
      var subject = 'Get started with RightNxt';
      var body    = '<div class="container-fluid"><img src='+image+' class="img-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">Hello,</div><br><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">Welcome to RightNxt!</div><br><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">Thank you for signing up on RightNxt. We appreciate your decision of choosing RightNxt .</div><br><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"></div><br><br><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">Regards,</div><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">Team RightNxt</div></div>';
    }

    Email.send({
      to     : to,
      from   : from,
      subject: subject,
      html   : body
    });
  },

  'sendOtp':function(mobile,otp){
    var plivo = require('plivo');
    var api = plivo.RestAPI({ 
      authId: 'MAM2Y5ZTRKMZAYMTEWOG',
      authToken: 'YTg3Mjg2MDdlZTI1MzYzOWM5Mzc3ZTUyMDY1Njc5'
    });

    var params = {
      'src': '+919096758067', // Sender's phone number with country code
      'dst' : mobile.toString(), // Receiver's phone Number with country code
      'text' : "Enter "+otp.toString()+" to confirm your business on RightNxt.", // Your SMS Text Message - English
    };

    var connectHandler = WebApp.connectHandlers; // get meteor-core's connect-implementation

    // attach connect-style middleware for response header injection
    Meteor.startup(function () {
      connectHandler.use(function (req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
        return next();
      })
    })

    // Prints the complete response
    api.send_message(params, function (status, response) {
      // console.log('Status: ', status);
      // console.log('API Response:\n', response);
    });    
  },

  'sendLoginOtp':function(mobile,otp){
    var plivo = require('plivo');
    var api = plivo.RestAPI({ 
      authId: 'MAM2Y5ZTRKMZAYMTEWOG',
      authToken: 'YTg3Mjg2MDdlZTI1MzYzOWM5Mzc3ZTUyMDY1Njc5'
    });

    var params = {
      'src': '+919096758067', // Sender's phone number with country code
      'dst' : mobile.toString(), // Receiver's phone Number with country code
      'text' : "Your One time Passsword for rightnxt.com is "+otp.toString(), // Your SMS Text Message - English
    };

    var connectHandler = WebApp.connectHandlers; // get meteor-core's connect-implementation

    // attach connect-style middleware for response header injection
    Meteor.startup(function () {
      connectHandler.use(function (req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
        return next();
      })
    })

    // Prints the complete response
    api.send_message(params, function (status, response) {
      // console.log('Status: ', status);
      // console.log('API Response:\n', response);
    });    
  },

  'sendSMS':function(toNumber,smsBody){
    var plivo = require('plivo');
    var api = Plivo.RestAPI({
      authId: 'MAM2Y5ZTRKMZAYMTEWOG',
      authToken: 'YTg3Mjg2MDdlZTI1MzYzOWM5Mzc3ZTUyMDY1Njc5'
    });


  var params = {
      'src': '+919096758067', // Sender's phone number with country code
      'dst' : '+91'+toNumber.toString(), // Receiver's phone Number with country code
      // 'dst' : '+91'.concat(toNumber.toString()), // Receiver's phone Number with country code
      'text' : smsBody ,// Your SMS Text Message - English
      // 'type' : "sms",
    };
    // console.log('api ', api , ' params ',params);
  var connectHandler = WebApp.connectHandlers; // get meteor-core's connect-implementation

    // attach connect-style middleware for response header injection
    Meteor.startup(function () {
      connectHandler.use(function (req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
        return next();
      })
    })

 
    api.send_message(params, function (status, response) {
      // console.log('Status: ', status);
      // console.log('API Response:\n', response);
    });
  },

  'removeOwnerImage':function(imgId){
    var userId = Meteor.userId();
    OwnerImage.remove({'_id': imgId,'userId': userId});
    // var allVendorImages = OwnerImage.find({'_id':imgId,'userId': userId}).fetch();
    // console.log(allVendorImages);
    // if(allVendorImages){
      // for (var i = 0; i < allVendorImages.length-1; i++) {
      //   OwnerImage.remove({'_id': allVendorImages[i]._id,'userId': userId});
      // }
    // }
  },
  'removeBusinessImage':function(imgId){
    BusinessImage.remove({'_id':imgId});
  },
  'removeBusinessMenuImage':function(imgId){
    BusinessMenu.remove({'_id':imgId});
  },
  'removeOfferImage':function(imgId){
    OfferImage.remove({'_id':imgId});
  },
  'removeReviewImage':function(imgId){
    ReviewImage.remove({'_id':imgId});
  },
});

