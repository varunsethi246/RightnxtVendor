import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Enquiry } from '/imports/api/enquiryMaster.js';
import { Business } from '/imports/api/businessMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { EnquiryImage } from '/imports/videoUploadClient/enquiryImageClient.js';

import './businessEnquiry.html'

var filesM = [];

Template.businessEnquiry.onCreated(function(){
  this.subscribe('businessEnquiryImage');
});
Template.businessEnquiry.helpers({
   'getuserData':function(){
      var getloginId = Meteor.userId();
      if (getloginId) {
        var getUser    = Meteor.users.findOne({"_id" : getloginId});
        return getUser;
      }     
   },
   'curretUser':function(){
      return Meteor.userId();
   },
});

Template.businessEnquiry.events({
    // 'click .SendEnqToAll2' : function(event){
    //     console.log('true');
    // },
    // 'click .SendEnqToAll1' : function(event){
    //     console.log('true');
    // },
    'change .enquiryPhoto' : function(event){
        filesM = event.target.files; // FileList object
        $('.showEnquiryImg').empty(); 
        // Loop through the FileList and render image files as thumbnails.
    
        for (var i = 0, f; f = filesM[i]; i++) {
            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();
      
            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    // Render thumbnail.
                    var span = document.createElement('span');
                    span.innerHTML = ['<img class="draggedImgenq img-responsive" src="', e.target.result,
                                  '" title="', escape(theFile.name), '"/>'].join('');
                    document.getElementById('showEnquiryImgId').insertBefore(span, null);
                };
            })(f); //end of onload

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }// end of for loop
    },

    'click .SendEnqTo': function(event){
        event.preventDefault();

        var id = FlowRouter.getParam('businessurl');
        if(id){
            var businessLink = id;
        }else{
            var businessLink = $(event.currentTarget).attr('data-link');
        }
        var enquiryPhoto = '';

        $('#businessMenulist').empty();

        var enquirySentBy = Meteor.userId();
        var enquiryName = $('.enquiryName').val();
        // console.log(enquiryName);
        var enquiryEmail = $('.enquiryEmail').val();
        var enquiryPhone = $('.enquiryPhone').val();
        var enquiryDesc = $('.enquiryDesc').val();
        if (!enquiryDesc) {
            $(".spanEnqDesc").addClass("ErrorRedText");
            $(".enquiryDesc").addClass("SpanLandLineRedBorder");
            $( ".spanEnqDesc" ).text("Please enter the description of the product you are looking for." );
        }else{
            $(".spanEnqDesc").removeClass("ErrorRedText");
            $(".enquiryDesc").removeClass("SpanLandLineRedBorder");
            $( ".spanEnqDesc" ).text("");
        }
        
        var enquiryPhoneTwo = '';
        if(enquiryPhone){
            enquiryPhoneTwo = '+91' + enquiryPhone;
        }

        var businessObject = Business.findOne({"businessLink":businessLink});
        var businessid = businessObject._id;
        var businessTitle = businessObject.businessTitle;
        //Save image on S3

        var errorIn = '';
        if ($(".ErrorRedText").length > 0) {
            errorIn = "true";
        }

        if(enquiryName && enquiryEmail && enquiryPhoneTwo && enquiryDesc) {
            if(filesM.length > 0){
                for(i = 0 ; i < filesM.length; i++){
                    const imageCompressor = new ImageCompressor();
                    imageCompressor.compress(filesM[i])
                        .then((result) => {
                          // console.log(result);

                          // Handle the compressed image file.
                          // We upload only one file, in case
                        // multiple files were selected
                        const upload = EnquiryImage.insert({
                          file: result,
                          streams: 'dynamic',
                          chunkSize: 'dynamic',
                          // imagetype: 'profile',
                        }, false);

                        upload.on('start', function () {
                          // template.currentUpload.set(this);
                        });

                        upload.on('end', function (error, fileObj) {
                          if (error) {
                            // alert('Error during upload: ' + error);
                            console.log('Error during upload 1: ' + error);
                            console.log('Error during upload 1: ' + error.reason);
                          } else {
                            // alert('File "' + fileObj._id + '" successfully uploaded');
                            Bert.alert('Enquiry Image uploaded.','success','growl-top-right');
                            // console.log(fileObj._id);
                            enquiryPhoto = fileObj._id;
                            var formValues = {
                                "businessid"        : businessid,
                                "businessTitle"     : businessTitle,
                                "businessLink"      : id,
                                "enquirySentBy"     : enquirySentBy,
                                "enquiryName"       : enquiryName,
                                "enquiryEmail"      : enquiryEmail,
                                "enquiryPhone"      : enquiryPhoneTwo,
                                "enquiryDesc"       : enquiryDesc,
                                "enquiryPhoto"      : enquiryPhoto,
                                "enquiryType"       : "User"
                            }

                            Meteor.call('insertBusEnquiry', formValues, function(error,result){
                                if(error){
                                    Bert.alert('There is some error in sending Enquiry','danger','growl-top-right');
                                    
                                }else{
                                    $('#vEnqModal').modal( "hide" );
                                    $('#vEnqModal').modal({show: false});

                                    var newBusinessId = result;
                                    Bert.alert('Vendor will soon get back you. Thank you.','success','growl-top-right');
                                    // $('.enquiryName').val('');
                                    // $('.enquiryEmail').val('');
                                    // $('.enquiryPhone').val('');
                                    $('.enquiryDesc').val('');
                                    $('.enquiryPhoto').val('');

                                    //Reset the upload image div to default after sending enquiry
                                    $('.showEnquiryImg>span').hide();
                                    $( '<i class="fa fa-camera fa-5x" aria-hidden="true"></i>').appendTo( ".showEnquiryImg" );

                                    //============================================================
                                    //          Notification Email / SMS / InApp
                                    //============================================================
                                    var userData    = Meteor.users.findOne({'roles':'admin'});
                                    if(userData){
                                        var adminID = userData._id;
                                    }
                                    var enquiryData = Enquiry.findOne({"_id":newBusinessId});

                                    if(enquiryData){
                                        //Send Notification, Mail and SMS to Vendor
                                        var businessid = enquiryData.businessid;
                                        var businessData = Business.findOne({"_id":businessid});
                                        if(businessData){
                                            var vendormailId    = businessData.businessOwnerId;
                                            var vendorname      = businessData.ownerFullName;
                                            var userDetail =    Meteor.users.findOne({'_id':vendormailId});
                                            if(userDetail){
                                                // var notifConf = userDetail.notificationConfiguration.enquiry;
                                                // if(notifConf == "true"){
                                                    var msgvariable = {
                                                        '[username]'            : vendorname,
                                                        '[businessTitle]'       : businessTitle,
                                                        '[enquiryName]'         : userDetail.profile.name,
                                                        '[enquiryEmail]'        : enquiryEmail,
                                                        '[enquiryPhoneTwo]'     : enquiryPhoneTwo,
                                                        '[enquiryDesc]'         : enquiryDesc,

                                                    };
                                                    // console.log('msgvariable :', msgvariable);

                                                    var inputObj = {
                                                        notifPath    : id,
                                                        to           : vendormailId,
                                                        templateName : 'Vendor Business Enquiry',
                                                        variables    : msgvariable,
                                                    }
                                                    sendInAppNotification(inputObj); 

                                                    var inputObj = {
                                                        notifPath    : id,
                                                        from         : adminID,
                                                        to           : vendormailId,
                                                        templateName : 'Vendor Business Enquiry',
                                                        variables    : msgvariable,
                                                    }

                                                    sendMailNotification(inputObj);

                                                    if(businessData.ownerMobile){
                                                        var userId        = enquiryData.enquirySentBy;
                                                        var userVar       = Meteor.users.findOne({'_id':userId});
                                                        
                                                        var msgvariable = {
                                                                    '[username]'            : vendorname,
                                                                    '[businessTitle]'       : businessData.businessTitle,
                                                                    '[enquiryName]'         : userDetail.profile.name,
                                                                    '[enquiryEmail]'        : enquiryEmail,
                                                                    '[enquiryPhoneTwo]'     : enquiryPhoneTwo,
                                                                    '[enquiryDesc]'         : enquiryDesc,
                                                                    '[enquiryUserName]'     : userVar.profile.name,
                                                                    };
                                                        var inputObj = {
                                                            to           : userDetail._id,
                                                            templateName : 'Vendor Business Enquiry',
                                                            number       : businessData.businessMobile,
                                                            variables    : msgvariable,
                                                        }
                                                        sendSMS(inputObj);
                                                    }
                                                    
                                            }//userDetail
                                        }//businessData 

                                        //Send Notification, Mail and SMS to User
                                        var userId        = enquiryData.enquirySentBy;
                                        var userVar       = Meteor.users.findOne({'_id':userId});
                                        if(userVar){
                                            // var notifConfig = userVar.notificationConfiguration.enquiry;
                                            // if(notifConfig == "true"){
                                                var msgvariable = {
                                                        '[businessTitle]'       : businessTitle,
                                                        '[enquiryName]'         : userVar.profile.name,
                                                        '[enquiryEmail]'        : enquiryEmail,
                                                        '[enquiryPhoneTwo]'     : enquiryPhoneTwo,
                                                        '[enquiryDesc]'         : enquiryDesc,

                                                    };
                                                    var inputObj = {
                                                        from         : adminID,
                                                        to           : userId,
                                                        templateName : 'User Business Enquiry',
                                                        variables    : msgvariable,
                                                    }

                                                sendMailNotification(inputObj); 
                                                
                                            // }
                                        }//uservar 
                                    }
                                    //============================================================
                                    //          Notification Email / SMS / InApp
                                    //============================================================
                                }
                            });
                          }
                          // template.currentUpload.set(false);
                        });

                        upload.start();
                        })
                        .catch((err) => {
                          // Handle the error
                    })
                }

                filesM = '';

            }else {
                enquiryPhoto = '';

                var formValues = {
                    "businessid"        : businessid,
                    "businessLink"      : id,
                    "businessTitle"     : businessTitle,
                    "enquirySentBy"     : enquirySentBy,
                    "enquiryName"       : enquiryName,
                    "enquiryEmail"      : enquiryEmail,
                    "enquiryPhone"      : enquiryPhoneTwo,
                    "enquiryDesc"       : enquiryDesc,
                    "enquiryPhoto"      : enquiryPhoto,
                    "enquiryType"       : "User"
                }
                Meteor.call('insertBusEnquiry', formValues, function(error,result){
                    if(error){
                        Bert.alert('There is some error in sending Enquiry','danger','growl-top-right');
                        return;
                    }else{
                        $('#vEnqModal').modal( "hide" );
                        $('#vEnqModal').modal({show: false});

                        var newBusinessId = result;
                        Bert.alert('Vendor will soon get back you. Thank you.','success','growl-top-right');
                        // $('.enquiryName').val('');
                        // $('.enquiryEmail').val('');
                        // $('.enquiryPhone').val('');
                        $('.enquiryDesc').val('');
                        $('.enquiryPhoto').val('');

                        //Reset the upload image div to default after sending enquiry
                        $('.showEnquiryImg>span').hide();
                        // send mail to admin //
                        var userData    = Meteor.users.findOne({'roles':'admin'});
                        if(userData){
                            var adminID = userData._id;
                        }//userData

                        
                        var enquiryData = Enquiry.findOne({"_id":newBusinessId});
                        if(enquiryData){
                            //Send Notification, Mail and SMS to Vendor
                            var businessid = enquiryData.businessid;
                            var businessData = Business.findOne({"_id":businessid});
                            if(businessData){
                                var vendormailId = businessData.businessOwnerId;
                                var vendorname      = businessData.ownerFullName;

                                var userDetail = Meteor.users.findOne({'_id':vendormailId});
                                if(userDetail){
                                    //Send Notification, Mail and SMS to Vendor
                                    var msgvariable = {
                                        // '[username]'            : vendorname,
                                        '[businessTitle]'       : businessTitle,
                                        '[enquiryName]'         : userDetail.profile.name,
                                        '[enquiryEmail]'        : enquiryEmail,
                                        '[enquiryPhoneTwo]'     : enquiryPhoneTwo,
                                        '[enquiryDesc]'         : enquiryDesc,

                                    };

                                    var inputObj = {
                                        to           : vendormailId,
                                        templateName : 'Vendor Business Enquiry',
                                        variables    : msgvariable,
                                    }
                                    sendInAppNotification(inputObj); 

                                    var inputObj = {
                                        from         : adminID,
                                        to           : vendormailId,
                                        templateName : 'Vendor Business Enquiry',
                                        variables    : msgvariable,
                                    }
                                    sendMailNotification(inputObj); 

                                    if(businessData.ownerMobile){
                                        var userId        = enquiryData.enquirySentBy;
                                        var userVar       = Meteor.users.findOne({'_id':userId});
                                        
                                        var msgvariable = {
                                                    '[username]'            : vendorname,
                                                    '[businessTitle]'       : businessData.businessTitle,
                                                    '[enquiryName]'         : userDetail.profile.name,
                                                    '[enquiryEmail]'        : enquiryEmail,
                                                    '[enquiryPhoneTwo]'     : enquiryPhoneTwo,
                                                    '[enquiryDesc]'         : enquiryDesc,
                                                    '[enquiryUserName]'     : userVar.profile.name,
                                                    };
                                        var inputObj = {
                                            to           : userDetail._id,
                                            templateName : 'Vendor Business Enquiry',
                                            number       : businessData.businessMobile,
                                            variables    : msgvariable,
                                        }
                                        sendSMS(inputObj);
                                    } 
                                }//userDetail
                            }//businessData 

                            //Send Notification, Mail and SMS to User
                            var userId  = enquiryData.enquirySentBy;
                            var userVar = Meteor.users.findOne({'_id':userId});
                            if(userVar){
                                var msgvariable = {
                                    '[businessTitle]'       : businessTitle,
                                    '[enquiryName]'         : userVar.profile.name,
                                    '[enquiryEmail]'        : enquiryEmail,
                                    '[enquiryPhoneTwo]'     : enquiryPhoneTwo,
                                    '[enquiryDesc]'         : enquiryDesc,
                                };

                                var inputObj = {
                                    from         : adminID,
                                    to           : userId,
                                    templateName : 'User Business Enquiry',
                                    variables    : msgvariable,
                                }

                                sendMailNotification(inputObj); 
                            }//uservar
                        }//enquiryVar 
                    }
                });
            }
        }else {
            // Bert.alert('Fill all fields before sending enquiry','danger','growl-top-right');
            console.log('hello');
            if (!enquiryName) {
                $(".spanEnqName").addClass("ErrorRedText");
                $(".enquiryName").addClass("SpanLandLineRedBorder");
                $(".spanEnqName").text("Please Enter Valid Name" );
            }else{
            $(".spanEnqDesc").removeClass("ErrorRedText");
            $(".enquiryDesc").removeClass("SpanLandLineRedBorder");
            $( ".spanEnqDesc" ).text("");
        }
            if (!enquiryEmail) {
                $(".spanEnqEmail").addClass("ErrorRedText");
                $(".enquiryEmail").addClass("SpanLandLineRedBorder");
                $( ".spanEnqEmail" ).text("Please Enter Valid Business Email Id" );
            }else{
            $(".spanEnqDesc").removeClass("ErrorRedText");
            $(".enquiryDesc").removeClass("SpanLandLineRedBorder");
            $( ".spanEnqDesc" ).text("");
        }
            if (!enquiryPhoneTwo) {
                $(".spanEnqPhone").addClass("ErrorRedText");
                $(".enquiryPhone").addClass("SpanLandLineRedBorder");
                $(".spanEnqPhone").text("Please Enter Valid 10 digit Mobile Number" );
            }else{
            $(".spanEnqDesc").removeClass("ErrorRedText");
            $(".enquiryDesc").removeClass("SpanLandLineRedBorder");
            $( ".spanEnqDesc" ).text("");
        }
            
            $('.SpanLandLineRedBorder:visible:first').focus();
        }

    },
        
    'click .vCmtEnqPage': function(event){
        if(!(Meteor.userId())){
            $('#loginModal').modal('hide');
            $('.loginScreen').hide();
            $('.signupScreen').hide();
            $('.thankyouscreen').hide();
            $('.genLoginSignup').show();
            $('.thankyouscreen').hide();
            $('.signUpBox').hide();
            $('#vEnqModal').show();
        } 
        // if ((Meteor.userId())) {
        //     var getId = Meteor.userId();
        //     var getuser = Meteor.users.findOne({"_id": getId});
        //     console.log("getuser",getuser);
        //     if (getuser) {
        //        var getRole = getuser.roles.length;


        //        console.log("getRole",getRole);
        //        if (getRole == "Vendor" && getRole == "admin") {
        //         console.log("in if");
        //         $('#loginModal').modal('hide');
        //         $('.loginScreen').hide();
        //         $('.signupScreen').hide();
        //         $('.thankyouscreen').hide();
        //         $('.genLoginSignup').show();
        //         $('.thankyouscreen').hide();
        //         $('.signUpBox').hide();
        //         $('#vEnqModal').hide();
        //        }
        //     }
        // }
                
    },
});
