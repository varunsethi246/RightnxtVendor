import { Session } from 'meteor/session';
import { Business } from '/imports/api/businessMaster.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { BizVideo } from '/imports/videoUploadClient/videoUpload.js';
import { BusinessImgUploadS3 } from '/client/cfsjs/businessImage.js';
import { BusinessMenuUpload } from '/client/cfsjs/businessMenu.js';
import { Categories } from '/imports/api/masterData/categoriesMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../vendor.js';
import './AddvendorImagesVideos.html'

var videoListCount = 0;
var files = [];
var filesM = [];
var filesV = [];
var counterImg = 0;
var counterMenu = 0;
Template.addvendorImagesVideos.onRendered(function () {
	var businessLink = FlowRouter.getParam('businessLink');
	Session.set('SessionBusinessLink',businessLink);
	files = [];
	filesM = [];
	counterImg = 0;
	counterMenu = 0;
	videoListCount = 0;
});

Template.addvendorImagesVideos.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
    this.subscribe('getBizVideo');
});

Template.addvendorImagesVideos.helpers({
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
	vendorBusImgAndVidRetrive() {
		var BusLink = FlowRouter.getParam('businessLink');
	    var busData = Business.findOne({"businessLink":BusLink});
	    // if(busData)
	    var currentPathURL = FlowRouter.current().path;
	    var splitPath = currentPathURL.split('/');

	    if(splitPath[1] == "imagesAndVideosAdmin") {
	      busData.currentPath = '/aboutOwnerAdmin/'+splitPath[2]; 
	    }
	    if(splitPath[1] == "addNewBusiness") {
	      busData.currentPath = '/addNewBusiness/aboutOwner/'+splitPath[3]; 
	    }

	    if(busData) {

		    // Show Hide Add Images and Videos Form Menu Options
	    	var statusArr = [];
	    	var statusEnable = '';
	    	if(busData.allCategories){
	    		var busCatArr = (busData.allCategories).split(',');

	    		if(busCatArr){
	    			for(i=0;i<busCatArr.length;i++){
	    				var catStringSplit = busCatArr[i].split('>');
	    				if(catStringSplit.length==1){
	    					var obj = {
	    						"level":"level0",
	    						"category": (catStringSplit[0]).trim(),
	    					}
	    					statusArr.push(obj);
	    				} else if(catStringSplit.length==2){
	    					var obj = {
	    						"level":"level1",
	    						"category": (catStringSplit[1]).trim(),
	    					}
	    					statusArr.push(obj);
	    				} else if(catStringSplit.length==3){
	    					var obj = {
	    						"level":"level2",
	    						"category": (catStringSplit[2]).trim(),
	    					}
	    					statusArr.push(obj);
	    				} else if(catStringSplit.length==4){
	    					var obj = {
	    						"level":"level3",
	    						"category": (catStringSplit[3]).trim(),
	    					}
	    					statusArr.push(obj);
	    				} else if(catStringSplit.length==5){
	    					var obj = {
	    						"level":"level4",
	    						"category": (catStringSplit[4]).trim(),
	    					}
	    					statusArr.push(obj);
	    				}
	    				
	    			}
	    		}

	    		if(statusArr.length>0){
		    		for(i=0;i<statusArr.length;i++){
		    			var name = statusArr[i].level;
						var value = statusArr[i].category;
						var query = {};
						query[name] = value;

		    			var catVal = Categories.findOne(query);
		    			
		    			if(catVal){
		    				if(catVal.menuStatus=="Disable"){

		    					statusEnable = "disabledCatMenu";
		    				} else {
		    					statusEnable = "enabledCatMenu";
		    					break;
		    				}
		    			}
		    		}
		    	}
	    	} else{
				statusEnable = "disabledCatMenu";
	    	}

	    	
	    	busData.statusEnable = statusEnable;
	    	busData.completedPercent = 100;

	    	return busData;
	    } 
	    else {
			var busData = {};
	    	busData.completedPercent = 75;

	    	return busData;
	    }
	},

	vendorPhotosOwnerManagerData: function(){
		
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
						if (imgData.copies) {
							if(imgData.copies.businessImgS3.type == 'image/png'){
								imgData.checkpngImg = 'bkgImgNone';
							}else{
								imgData.checkpngImg = '';
							}
							imgList[i] = imgData;
						}
					}
				}
				console.log('imgList ' , imgList);
				return imgList;
			}
		}
	},

	vendorMenuOwnerManagerData: function(){
			
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
					if (menuData) {
						if(menuData.copies){
							if(menuData.copies.businessMenu.type == 'image/png'){
								menuData.checkpngImg = 'bkgImgNone';
							}else{
								menuData.checkpngImg = '';
							}
							menuList[i] = menuData;
						}
					}	
				}
				return menuList;
			}
		}

	},

	vendorVideoOwnerManagerData: function(){
			
		var businessLink = FlowRouter.getParam('businessLink');
		
		var data = Business.findOne({'businessLink':businessLink});
		if(data){
			if(data.businessVideo){
				if(data.businessVideo[0]){
					if(data.businessVideo[0].video){
						videoListCount = 1;
										
						var videoData = BusinessVideoUpload.findOne({"_id":data.businessVideo[0].video});
						if(videoData){
							// videoList[0] = videoData;
							return videoData;
						}
					}
				}
			}
		}
	},	
});




Template.addvendorImagesVideos.events({ 
	
	'click #closeStartVideo' : function (event) {
		video.pause();
	},

	'click #saveBusinessImg' : function(event){
		
		var businessLink = FlowRouter.getParam('businessLink');
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
					                  console.log ('Error Message: ' + error ); 
					              }else{
									// console.log('img upload ', fileObj._id);	
					              }

					        });

				        }
				    });
				}
			});
		}
		$('#businessImglist').empty();
		$('#drag1').show();
		counterImg = 0;
		files=[];
		$('#businessImgfiles').val('');
	},

	'click #saveBusinessMenu' : function(event){
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
				        	// console.log('key : ' , fileObj.key);
				        	var menuId =  fileObj._id ;
					        Meteor.call("updateVendorBulkMenu", businessLink,menuId,
					          function(error, result) { 
					              if(error) {
					                  console.log ('Error Message: ' +error ); 
					              }else{
										  // process.exit();
					              }

					        });
				        }
				    });
				}
			});
		}
		$('#businessMenulist').empty();
		$('#drag3').show();
		counterMenu = 0;
		filesM=[];
		$('#businessMenulist').val('');
	},

	'change #fileInputOne'(e, template) {
	    if (e.currentTarget.files && e.currentTarget.files[0]) {
			var businessLink = FlowRouter.getParam('businessLink');
			var bussData = Business.findOne({"businessLink":businessLink});
	    	if(bussData.businessVideo){
			 	Bert.alert('Only One can be upload','danger','growl-top-right');
		    }else{

		      // We upload only one file, in case
		      // multiple files were selected
		      const upload = BizVideo.insert({
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

	'change #businessImgfiles' : function(event){
		$('#drag1').hide();
		var file = event.target.files; // FileList object\
		if(file.length > 6){
			$('#div1').css("height","300px");
		}
		for(var j = 0 , f1;f1 = file[j]; j++){
			files[counterImg] = file[j];
			counterImg = counterImg + 1;
		}
		// Loop through the FileList and render image files as thumbnails.
		
		for (var i = 0, f; f = file[i]; i++) {
			file[i].businessLink = Session.get('SessionBusinessLink');
			console.log('file[i].businessLink:',file[i].businessLink);
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
		        document.getElementById('businessImglist').insertBefore(span, null);
		        
		      };
		    })(f); //end of onload


		    // Read in the image file as a data URL.
		    reader.readAsDataURL(f);
		    
		}// end of for loop

	},	

	'change #businessMenufiles' : function(event){
		$('#drag3').hide();
		var file = event.target.files; // FileList object

		if(file.length > 6){
			$('.businessDivOpen').css("height","300px");
		}

		for(var j = 0 , f1;f1 = file[j]; j++){
			filesM[counterMenu] = file[j];
			counterMenu = counterMenu + 1;
		}
		// Loop through the FileList and render image files as thumbnails.
		
		for (var i = 0, f; f = file[i]; i++) {
			
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
		        document.getElementById('businessMenulist').insertBefore(span, null);
		        
		      };
		    })(f); //end of onload

		    // Read in the image file as a data URL.
		    reader.readAsDataURL(f);
		}// end of for loop
	},

	'change #businessVideofiles' : function(event){
		$('#drag2').hide();
		 filesV = event.target.files; // FileList object
		 console.log('filesV ', filesV.length);
		 if(filesV.length > 1 || videoListCount == 1){
		 	Bert.alert('Only One can be upload','danger','growl-top-right');
			$('#businessVideofiles').val('');
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
		        span.innerHTML = ['<video class="draggedImg">' +
		        				 	'<source src="'+ e.target.result + '" title="'+escape(theFile.name)+'">' +
		        				 	'Browser not supporting' + 
		        				  '</video>'
		        				 ].join('');
		        document.getElementById('businessVideolist').insertBefore(span, null);
		        
		      };
		    })(f); //end of onload

		    // Read in the image file as a data URL.
		    reader.readAsDataURL(f);
		$('#editbusinessVideolist').empty();
		    
		// }// end of for loop
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
		console.log('delId ', delId);
		Meteor.call('deleteVendorVideo',businessLink,delId[1],
          function(error, result) { 
              if(error) {
                  console.log ('Error Message: ' +error ); 
              }else{
					  BizVideo.remove(delId[1]);
					  videoListCount = 0;
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

	'click #saveImgAndVideos':function () {
		  var businessLink = FlowRouter.getParam('businessLink');
		  var currentVendorURL = "/addNewBusiness/imagesAndVideos/"+businessLink;
	      var currentPathURL = FlowRouter.current().path;
		  Bert.alert('Business Images and Videos uploaded successfully!','success','growl-top-right');


	      if (currentPathURL == currentVendorURL) {
	          FlowRouter.go('/:businessurl',{'businessurl':businessLink});
	      }else{
	          FlowRouter.go('/listOfBusiness');
	      }
	}
});

addvendorImagesVideosForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'addvendorImagesVideos'});
}

export { addvendorImagesVideosForm };