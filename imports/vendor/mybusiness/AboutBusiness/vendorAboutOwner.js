import { Business } from '/imports/api/businessMaster.js';
import { BusinessImgUploadS3 } from '/client/businessImage';

import './VendorAboutOwner.html'

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
  'change .vendorImg' : function(event,Template){
     event.preventDefault();
     files = event.target.files; // FileList object\
     // $('#venFileUpldval').text("Picture Chosen");
    
      // Loop through the FileList and render image files as thumbnails.
      
      for (var i = 0, f; f = files[i]; i++) {
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
              span.innerHTML = ['<img class="draggedImg businessOwnerImg" id="changeOwnerProfilePic" src="', e.target.result,
                                '" title="', escape(theFile.name), '"/>'].join('');
              document.getElementById('changeOwnerProfilePic').replaceWith(span);

              if(files){
                if(files[0].type=="image/png"){
                  $('#changeOwnerProfilePic').addClass('bkgImgNone');
                }
              }
              
            };
          })(f); //end of onload


          // Read in the image file as a data URL.
          reader.readAsDataURL(f);
          
      }

     FS.Utility.eachFile(event, function(file) {
        Resizer.resize(file, {width: 300, height: 300, cropSquare: false}, function(err, file) {
          if(err){
            console.log('err ' , err.message);
          }else{

           BusinessImgUploadS3.insert(file, function (err, fileObj) {
             if (err){
                console.log("Error : " + err.message);
             } else {
              
                var filePath = fileObj._id;
                Session.set("vendorImgFilePath",filePath);

              }
           });
         }
       });
     });

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
    if(Session.get("vendorImgFilePath")){
      var formValues = {
        "ownerFullName"    : event.target.ownerFullName.value,
        "ownerRole"        : event.target.ownerRole.value,
        "ownerMobile"      : ownerMob,
        "ownerEmail"       : event.target.ownerEmail.value,
        "ownerDesc"        : ownerDescription,
        "ownerPhoto"       : Session.get("vendorImgFilePath"),
      }
    }else{
      var formValues = {
        "ownerFullName"    : event.target.ownerFullName.value,
        "ownerRole"        : event.target.ownerRole.value,
        "ownerMobile"      : ownerMob,
        "ownerEmail"       : event.target.ownerEmail.value,
        "ownerDesc"        : ownerDescription,
      }
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