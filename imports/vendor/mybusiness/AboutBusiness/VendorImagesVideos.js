import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';
import { Business } from '/imports/api/businessMaster.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { Template } from 'meteor/templating';
import { BizVideo } from '/imports/videoUploadClient/videoUpload.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BusinessImage } from '/imports/videoUploadClient/businessImageClient.js';
import { BusinessMenu } from '/imports/videoUploadClient/businessMenuClient.js';
import ImageCompressor from 'image-compressor.js';

import './VendorImagesVideos.html'

var videoListCountEdit = 0;
var uploader = new ReactiveVar();
Template.vendorImagesVideos.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
    this.subscribe('businessImage');
    this.subscribe('businessMenuImage');
    this.subscribe('getBizVideo');
});

Template.vendorImagesVideos.helpers({
	currentUpload: function() {
        return Template.instance().currentUpload.get();
    },

    files: function() {
		var businessLink = FlowRouter.getParam('businessLink');
    	var bussData = Business.findOne({"businessLink":businessLink});
    	if(bussData){
	        var data = BizVideo.find({"_id":bussData.businessVideo}).fetch();
	        return data;
	    }
    },	

	vendorPhotosOwnerManagerDataEdit: function(){
		
		var businessLink = FlowRouter.getParam('businessLink');
		
		var data = Business.findOne({'businessLink':businessLink});
		if(data){
			if(data.businessImages){
				var imgListCount = data.businessImages.length;
				var imgList = [];
				for(i = 0 ; i < imgListCount ; i++)
				{
					var imgId =  data.businessImages[i];
					var imgData = BusinessImage.findOne({"_id":imgId.img});
					if(imgData){
						imgList[i] = imgData;
						
						if(imgData.type == 'image/png'){
							imgData.checkpngImg = 'bkgImgNone';
							$('.uPhotoYouRow').children('.vPhotosUserRowSec:nth-child('+i+') > .noworkDiv > .uploadPhotoSize > img').css('background-image','');
						}else{
							imgData.checkpngImg = '';
						}	
					}
				}
				// console.log("photos");
				// console.log(imgList);
				return imgList;
			}
		}
	},

	vendorMenuOwnerManagerDataEdit: function(){
			
		var businessLink = FlowRouter.getParam('businessLink');
		
		var data = Business.findOne({'businessLink':businessLink});
		if(data){
			if(data.businessMenu){
				var menuListCount = data.businessMenu.length;
				var menuList = [];
				for(i = 0 ; i < menuListCount ; i++)
				{
					var menuId =  data.businessMenu[i];
					var menuData = BusinessMenu.findOne({"_id":menuId.menu});
					// console.log(menuData);
					if(menuData){
						if(menuData.type == 'image/png'){
							menuData.checkpngImg = 'bkgImgNone';
						}else{
							menuData.checkpngImg = '';
						}
						menuList[i] = menuData;
					}
				}
				// console.log("menu");
				// console.log("menuList: ",menuList);
				return menuList;
			}
		}

	},

	
});

var files = [];
var filesM = [];
var filesV = [];
var counterImg = 0;
var counterMenu = 0;
Template.vendorImagesVideos.onRendered(function () {
	var businessLink = FlowRouter.getParam('businessLink');
	Session.set('SessionBusinessLink',businessLink);
	files = [];
	filesM = [];
	counterImg = 0;
	counterMenu = 0;
	videoListCountExit = 0;

	// filesV = [];
});
Template.vendorImagesVideos.events({ 
	
	'click #editcloseStartVideo' : function (event) {
		event.pause();
	},

	'click #editsaveBusinessImg' : function(event,template){
		var businessLink = FlowRouter.getParam('businessLink');
		if(files.length > 0){
			for(i = 0 ; i < files.length; i++){
			  const imageCompressor = new ImageCompressor();
		      imageCompressor.compress(files[i])
		        .then((result) => {
		          // console.log(result);

		          // Handle the compressed image file.
		          // We upload only one file, in case
		        // multiple files were selected
		        const upload = BusinessImage.insert({
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
		            Bert.alert('Business Image uploaded.','success','growl-top-right');
		            // console.log(fileObj._id);
		            // Session.set("vendorImgFilePath",fileObj._id);
		            Meteor.call('updateVendorBulkImg', businessLink, fileObj._id, 
		              function(error,result){
		                if(error){
		                  // Bert.alert('There is some error in submitting this form!','danger','growl-top-right');
		                  return;
		                }else{

		                }
		              }
		            );
		          }
		          // template.currentUpload.set(false);
		        });

		        upload.start();
		        })
		        .catch((err) => {
		          // Handle the error
		      })    
			}//end of for loop

			$('#editbusinessImglist').empty();
			$('#dragEdit1').show();
			counterImg = 0;
			files=[];
			$('#editbusinessImgfiles').val('');
		}
	},

	'click #editsaveBusinessMenu' : function(event,template){
		var businessLink = FlowRouter.getParam('businessLink');
		if(filesM.length > 0){
			for(i = 0 ; i < filesM.length; i++){
				const imageCompressor = new ImageCompressor();
			      imageCompressor.compress(filesM[i])
			        .then((result) => {
			          // console.log(result);

			          // Handle the compressed image file.
			          // We upload only one file, in case
			        // multiple files were selected
			        const upload = BusinessMenu.insert({
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
			            Bert.alert('Business Menu Image uploaded.','success','growl-top-right');
			            // console.log(fileObj._id);
			            // Session.set("vendorImgFilePath",fileObj._id);
			            Meteor.call('updateVendorBulkMenu', businessLink, fileObj._id, 
			              function(error,result){
			                if(error){
			                  // Bert.alert('There is some error in submitting this form!','danger','growl-top-right');
			                  return;
			                }else{

			                }
			              }
			            );
			          }
			          // template.currentUpload.set(false);
			        });

			        upload.start();
			        })
			        .catch((err) => {
			          // Handle the error
			    })    
			}//end of for loop

			$('#editbusinessMenulist').empty();
			$('#dragEdit3').show();
			counterMenu = 0;
			filesM=[];
			$('#editbusinessMenulist').val('');
		}
	},

	'change #fileInput': function(e, template) {
	    if (e.currentTarget.files && e.currentTarget.files[0]) {
			var businessLink = FlowRouter.getParam('businessLink');
			var bussData = Business.findOne({"businessLink":businessLink});
	    	if(bussData.businessVideo && bussData.businessVideo != 0){
			 	Bert.alert('Only One can be upload','danger','growl-top-right');
		    }else{

		      // We upload only one file, in case
		      // multiple files were selected
		      const upload = BizVideo.insert({
		        file: e.currentTarget.files[0],
		        streams: 'dynamic',
		        chunkSize: 'dynamic',
		        type: 'video'
		      }, false);

		      upload.on('start', function () {
		        template.currentUpload.set(this);
		      });

		      upload.on('end', function (error, fileObj) {
		        if (error) {
		          alert('Error during upload: ' + error);
		        } else {
		          // alert('File "' + fileObj._id + '" successfully uploaded');
		          Bert.alert('Business Video uploaded','success','growl-top-right');
		          
		          	Meteor.call("updateVendorBulkVideo", businessLink,fileObj._id,
			          function(error, result) { 
			              if(error) {
			                  console.log ('Error Message: ' +error ); 
			              }else{
								  // process.exit();
			              }
			        });
		        }
		        template.currentUpload.set(false);
		      });

		      upload.start();
		    }
	    }
	},

	'change #editbusinessImgfiles' : function(event){
		$('#dragEdit1').hide();
		var file = event.target.files; // FileList object\
		// Loop through the FileList and render image files as thumbnails.
		
		if(file.length > 6){
			$('#div1').css("height","300px");
		}
		for(var j = 0 , f1;f1 = file[j]; j++){
			files[counterImg] = file[j];
			counterImg = counterImg + 1;
		}
		for (var i = 0, f; f = file[i]; i++) {
			file[i].businessLink = Session.get('SessionBusinessLink');
			
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
		        span.innerHTML = ['<img class="draggedImg tempUploadImg" src="', e.target.result,
		                          '" title="', escape(theFile.name), '"/>'].join('');
		        document.getElementById('editbusinessImglist').insertBefore(span, null);
		        
		      };
		    })(f); //end of onload


		    // Read in the image file as a data URL.
		    reader.readAsDataURL(f);
		    
		}// end of for loop

	},	

	'change #editbusinessMenufiles' : function(event){
		$('#dragEdit3').hide();
		 var fileM = event.target.files; // FileList object
		// Loop through the FileList and render image files as thumbnails.

		if(fileM.length > 6){
			$('.businessDivOpen').css("height","300px");
		}

		for(var j = 0 , f1;f1 = fileM[j]; j++){
			filesM[counterMenu] = fileM[j];
			counterMenu = counterMenu + 1;
		}
		
		for (var i = 0, f; f = fileM[i]; i++) {
			
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
		        span.innerHTML = ['<img class="draggedImg" src="', e.target.result,
		                          '" title="', escape(theFile.name), '"/>'].join('');
		        document.getElementById('editbusinessMenulist').insertBefore(span, null);
		        
		      };
		    })(f); //end of onload

		    // Read in the image file as a data URL.
		    reader.readAsDataURL(f);
		}// end of for loop
	},

	'change #editbusinessVideofiles' : function(event){
		$('#dragEdit2').hide();
		filesV = event.target.files; // FileList object
				
		if(filesV.length > 1 || videoListCountEdit == 1){
			Bert.alert('Only One can be upload','danger','growl-top-right');
			$('#editbusinessVideofiles').val('');
				return;
		}
		// Loop through the FileList and render image files as thumbnails.
		var f = filesV[0];
		
		var reader = new FileReader();
		
		// Closure to capture the file information.
	    reader.onload = (function(theFile) {
	      return function(e) {
	        // Render thumbnail.
	        var span = document.createElement('span');
	        span.innerHTML = ['<video id="video" class="draggedVid" width="320px" height="240px" controls autoplay="">' +
	        				 	'<source src="'+ e.target.result + '" type="video/mp4" title="'+escape(theFile.name)+'">' +
	        				 	'<source src="'+ e.target.result + '" type="video/ogv" title="'+escape(theFile.name)+'">' +
	        				 	'<source src="'+ e.target.result + '" type="video/webm" title="'+escape(theFile.name)+'">' +
	        				 	'Browser not supporting' + 
	        				  '</video>'
	        				 ].join('');
	        document.getElementById('editbusinessVideolist').insertBefore(span, null);
	        
	      };
	    })(f); //end of onload

	    // Read in the image file as a data URL.
	    reader.readAsDataURL(f);
		
	},

	'click .delBusiImg' : function(event){
		var businessLink = FlowRouter.getParam('businessLink');
		var delId = ($(event.target).attr('id')).split('-');
		
		Meteor.call('deleteVendorImg',businessLink,delId[1],
            function(error, result) { 
                if(error) {
                  console.log ('Error Message: ' +error ); 
                }else{
					Meteor.call('removeBusinessImage',delId[1],
			            function(error, result) { 
			            if(error) {
			                console.log ('Error Message: ' +error ); 
		                }else{
		                }
					}
				);
            }
		});
	},

	'click .deleteVideo' : function(event){
		var businessLink = FlowRouter.getParam('businessLink');
		var delId = ($(event.target).attr('id')).split('-');
		Meteor.call('deleteVendorVideo',businessLink,delId[1],
          function(error, result) { 
            if(error) {
                console.log ('Error Message: ' +error ); 
            }else{
				  BizVideo.remove({_id: delId[1]});
            }
		});
	},
	'click .delBusiMenu' : function(event){
		var businessLink = FlowRouter.getParam('businessLink');
		var delId = ($(event.target).attr('id')).split('-');
		
		Meteor.call('deleteVendorMenu',businessLink,delId[1],
          function(error, result) { 
              if(error) {
                  console.log ('Error Message: ' +error ); 
              }else{
            	Meteor.call('removeBusinessMenuImage',delId[1],
			            function(error, result) { 
			            if(error) {
			                console.log ('Error Message: ' +error ); 
		                }else{
		                }
					}
				);
					
              }
	});
	},

	'click #editsaveImgAndVideos':function () {
		  var businessLink = FlowRouter.getParam('businessLink');
		  var currentVendorURL = "/aboutBusiness/"+businessLink;
	      var currentPathURL = FlowRouter.current().path;
	      
	      Bert.alert('Business Images and Videos saved successfully!','success','growl-top-right');


	      if (currentPathURL == currentVendorURL) {
	          FlowRouter.go('/:businessurl',{'businessurl':businessLink});
	      }
	      else{
	          FlowRouter.go('/listOfBusiness');
	      }
	}
});