import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from 'meteor/reactive-var';
import { BizVideoBanner } from '/imports/videoUploadClient/videoUploadBanner.js';

import './homePageBanner.html';
import '/imports/admin/commonAdmin/commonAdmin.js';

Template.homePageBanner.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
    this.subscribe('getBizVideoBanner');
});

Template.homePageBanner.events({
	'change #fileInputVideo'(e, template) {
	    if (e.currentTarget.files && e.currentTarget.files[0]) {
		      // We upload only one file, in case
		      // multiple files were selected
		    const upload = BizVideoBanner.insert({
		        file: e.currentTarget.files[0],
		        streams: 'dynamic',
		        chunkSize: 'dynamic'
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
		          Bert.alert('Home Page Video uploaded','success','growl-top-right');
		          
		          	Meteor.call("updateBannerVideo",fileObj._id,
			          function(error, result) { 
			              if(error) {
			                  console.log ('Error Message: ' +error.reason ); 
			              }else{
								console.log ('success'); 
			              }
			        });
		        }
		        template.currentUpload.set(false);
		    });

		    upload.start();
		    
	    }
	},
});



homePageBannerForm = function () {  
	// console.log('infunction');
  BlazeLayout.render("adminLayout",{main: 'homePageBanner'});
}

export { homePageBannerForm }