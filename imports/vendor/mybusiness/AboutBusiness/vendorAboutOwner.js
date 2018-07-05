import { Business } from '/imports/api/businessMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { OwnerImage } from '/imports/videoUploadClient/ownerImageClient.js';
import ImageCompressor from 'image-compressor.js';

import './VendorAboutOwner.html'

Template.vendorAboutOwner.onCreated(function() {
  this.currentUpload = new ReactiveVar(false);
  this.subscribe('ownerImage');
});
Template.vendorAboutOwner.helpers({
  currentUpload: function() {
    return Template.instance().currentUpload.get();
  },
});
Template.vendorAboutOwner.onRendered(function(){
  // $('#asearch  Categories').val(catList);
  $('#venFileUpldval').text('');
});
Template.vendorAboutOwner.events({
  'keydown #businessYourDesc':function(event){
      setTimeout(function() {
         var aboutBus = $('#businessYourDesc').val();
         if(aboutBus){
            var aboutBuslen = aboutBus.length;
            var remainText = 1000 - aboutBuslen;
            $('.textRemain').text(remainText + ' Characters Remaining');
         }else{
            $('.textRemain').text('1000 Characters Remaining');
         }
      }, 1);
   },
  'click #venFileUpldbutton': function(){
    $(".vendorImg").trigger('click');
  },
  'change .vendorImg' : function(event,template){
    // event.preventDefault();
    file = event.target.files[0]; // FileList object\
    var businessLink = FlowRouter.getParam('businessLink');
    
    if(file){
      // Only process image files.
      var reader = new FileReader();    
      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['<img class="draggedImg businessOwnerImg" id="changeOwnerProfilePic" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
          document.getElementById('changeOwnerProfilePic').replaceWith(span);

          if(file){
            if(file.type=="image/png"){
              $('#changeOwnerProfilePic').addClass('bkgImgNone');
            }
          }
          
        };
      })(file); //end of onload

      // Read in the image file as a data URL.
      reader.readAsDataURL(file);

      const imageCompressor = new ImageCompressor();
      imageCompressor.compress(file)
        .then((result) => {
          // console.log(result);

          // Handle the compressed image file.
          // We upload only one file, in case
        // multiple files were selected
        const upload = OwnerImage.insert({
          file: result,
          streams: 'dynamic',
          chunkSize: 'dynamic',
          // imagetype: 'profile',
        }, false);

        upload.on('start', function () {
          template.currentUpload.set(this);
        });

        upload.on('end', function (error, fileObj) {
          if (error) {
            // alert('Error during upload: ' + error);
            console.log('Error during upload 1: ' + error);
            console.log('Error during upload 1: ' + error.reason);
          } else {
            // alert('File "' + fileObj._id + '" successfully uploaded');
            Bert.alert('Owner Image uploaded.','success','growl-top-right');
            // console.log(fileObj._id);
            // Session.set("vendorImgFilePath",fileObj._id);
            Meteor.call('updateBusinessAboutOwnerImage', businessLink, fileObj._id, 
              function(error,result){
                if(error){
                  // Bert.alert('There is some error in submitting this form!','danger','growl-top-right');
                  return;
                }else{
                  
                }
              }
            );
          }
          template.currentUpload.set(false);
        });

        upload.start();
        })
        .catch((err) => {
          // Handle the error
      })    
    }    
  },
  'submit .vendorBusAbOwnerAC': function(event){
    event.preventDefault();
    // var filePath = Session.get("vendorImgFilePath");
    var bizLink = FlowRouter.getParam('businessLink');
    var data = Business.findOne({'businessLink':bizLink}); 
    var id = data._id;

    var errorIn = '';
    if ($(".ErrorRedText").length > 0) {
        errorIn = "true";
    }

    var ownerMob = $('.businessMobileCC').val();
    if(ownerMob){
      ownerMob = '+91' + ownerMob;
    }

     var ownerDescription = $('#businessYourDesc').val();
      if(ownerDescription){
        ownerDescription = ownerDescription.trim();
      }
   
    var formValues = {
      "ownerFullName"    : event.target.ownerFullName.value,
      "ownerRole"        : event.target.ownerRole.value,
      "ownerMobile"      : ownerMob,
      "ownerEmail"       : event.target.ownerEmail.value,
      "ownerDesc"        : ownerDescription,
    }
    

    if(errorIn!="true") {
      Meteor.call('updateBusAbOwnerAcc', id, formValues, 
        function(error,result){
          if(error){
            // Bert.alert('There is some error in submitting this form!','danger','growl-top-right');
            return;
          }else{
            var newBusinessId = result;
            Bert.alert('Business Owner information saved successfully!','success','growl-top-right');
          }

        }
      );
    } else {
        // Bert.alert('Please fill correct fields in form!','danger','growl-top-right');
        $('.SpanLandLineRedBorder:visible:first').focus();
    }
  },
});