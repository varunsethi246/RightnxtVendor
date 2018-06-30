import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';
import { Business } from '/imports/api/businessMaster.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { Template } from 'meteor/templating';
import { BizVideo } from '/imports/videoUploadClient/videoUpload.js';
import { BusinessImgUploadS3 } from '/client/businessImage';
import { BusinessMenuUpload } from '/client/businessMenu.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


import './VendorImagesVideos.html'

var videoListCountEdit = 0;
var uploader = new ReactiveVar();
Template.vendorImagesVideos.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
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
					var imgData = BusinessImgUploadS3.findOne({"_id":imgId.img});
					if(imgData){
						imgList[i] = imgData;
						
						if(imgData.original.type == 'image/png'){
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
					var menuData = BusinessMenuUpload.findOne({"_id":menuId.menu});
					if(menuData){
						if(menuData.copies.businessMenu.type == 'image/png'){
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

	'click #editsaveBusinessImg' : function(event){
		for(i = 0 ; i < files.length; i++){
			Resizer.resize(files[i], {width: 300, height: 300, cropSquare: false}, function(err, file) {
				if(err){
					console.log('err ' , err.message);
				}else{
					BusinessImgUploadS3.insert(file, function (err, fileObj) {
				        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
				        if(err){
				        	console.log('Error : ' + err.message);
				        }else{
				        	var businessLink = FlowRouter.getParam('businessLink');
				        	var imgId =  fileObj._id ;
					        Meteor.call("updateVendorBulkImg", businessLink,imgId,
					          function(error, result) { 
					              if(error) {
					                  console.log ('Error Message: ' +error ); 
					              }else{
										
					              }
					        });
				        }
				    });//end of BusinessImgUploadS3
				}//end of if else of resizer
			});//end of resizer
		}//end of for loop
		$('#editbusinessImglist').empty();
		$('#dragEdit1').show();
		counterImg = 0;
		files=[];
		$('#editbusinessImgfiles').val('');
	},

	'click #editsaveBusinessMenu' : function(event){
		var businessLink = FlowRouter.getParam('businessLink');
		
		for(i = 0 ; i < filesM.length; i++){
			Resizer.resize(filesM[i], {width: 300, height: 300, cropSquare: false}, function(err, file) {
				if(err){
					console.log('err ' , err.message);
				}else{
					BusinessMenuUpload.insert(file, function (err, fileObj) {
				        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
				        if(err){
				        	console.log('Error : ' + err.message);
				        }else{
				        	var businessLink = FlowRouter.getParam('businessLink');
				        	var imgId =  fileObj._id ;
					        Meteor.call("updateVendorBulkMenu", businessLink,imgId,
					          function(error, result) { 
					              if(error) {
					                  console.log ('Error Message: ' +error ); 
					              }else{
										
					              }
					        });
				        }
				    });//end of updateVendorBulkMenu
				}//end of if else of resizer
			});//end of resizer
		}//end of for loop

		$('#editbusinessMenulist').empty();
		$('#dragEdit3').show();
		counterMenu = 0;
		filesM=[];
		$('#editbusinessMenulist').val('');
	},

	'change #fileInput'(e, template) {
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
					  BusinessImgUploadS3.remove(delId[1]);
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
					  BusinessMenuUpload.remove(delId[1]);
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