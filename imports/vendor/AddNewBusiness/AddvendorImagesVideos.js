import { Session } from 'meteor/session';
import { Business } from '/imports/api/businessMaster.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { BizVideo } from '/imports/videoUploadClient/videoUpload.js';
import { Categories } from '/imports/api/masterData/categoriesMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BusinessMenu } from '/imports/videoUploadClient/businessMenuClient.js';
import { BusinessImage } from '/imports/videoUploadClient/businessImageClient.js';
import ImageCompressor from 'image-compressor.js';
import { ReviewImage } from '/imports/videoUploadClient/reviewImageClient.js';

import '../vendor.js';
import './AddvendorImagesVideos.html'

var videoListCount = 0;
var files = [];
var filesM = [];
var filesV = [];
var counterImg = 0;
var counterMenu = 0;
var uploader = new ReactiveVar();
var businessID = '';
var publishImgId = '';
Template.addvendorImagesVideos.onRendered(function () {
	var businessLink = FlowRouter.getParam('businessLink');
	Session.set('SessionBusinessLink',businessLink);
	// var files = [];
	// var filesM = [];
	// var filesV = [];
	// var counterImg = 0;
	// var counterMenu = 0;
	// var videoListCount = 0;
});

Template.addvendorImagesVideos.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
    this.imageUpload = new ReactiveVar(false);
    this.menuUpload = new ReactiveVar(false);
    // this.subscribe('getBizVideo');
});

Template.addvendorImagesVideos.helpers({
	imageUpload: function() {
		// console.log(Template.instance().imageUpload.get());
        return Template.instance().imageUpload.get();
    },
    menuUpload: function() {
		// console.log(Template.instance().menuUpload.get());
        return Template.instance().menuUpload.get();
    },
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
	    			for(var i=0;i<busCatArr.length;i++){
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
		    		for(var i=0;i<statusArr.length;i++){
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
			publishImgId = data.publishedImage;
			businessID = data._id;
			if(data.businessImages){
				var imgListCount = data.businessImages.length;
				var imgList = [];
				for(var i = 0 ; i < imgListCount ; i++)
				{
					var imgId =  data.businessImages[i];
					var imgData = BusinessImage.findOne({"_id":imgId.img});
					if(imgData){
						// if (imgData.copies) {
							if(imgData.type == 'image/png'){
								imgData.checkpngImg = 'bkgImgNone';
								imgData.businessImg = true;
							}else{
								imgData.checkpngImg = '';
								imgData.businessImg = true;
							}
							imgList[i] = imgData;
						// }
					}else{
						var imgObj = ReviewImage.findOne({"_id":imgId.img});
						if(imgObj){
							if(imgObj.type == 'image/png'){
								imgObj.checkpngImg = 'bkgImgNone';
								imgObj.businessImg = false;
							}else{
								imgObj.checkpngImg = '';
								imgObj.businessImg = false;
							}
							imgList[i] = imgObj;
						}
					}
				}
				// console.log('imgList ' , imgList);
				return imgList;
			}
		}
	},

	isCheckboxChecked: function(){
		// console.log(publishImgId,this._id);
		if(publishImgId == this._id){
			return true;
		}else{
			return false;
		}
	},

	vendorMenuOwnerManagerData: function(){
			
		var businessLink = FlowRouter.getParam('businessLink');
		
		var data = Business.findOne({'businessLink':businessLink});
		if(data){
			if(data.businessMenu){
				var menuListCount = data.businessMenu.length;
				var menuList = [];
				for(var i = 0 ; i < menuListCount ; i++)
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
	'click input[type="checkbox"]': function(event){
		var $this = $(event.target);
		
		if($($this).prop( "checked" )){
			$('input[type="checkbox"]').not($this).prop('checked','');
		}
	},
	'click .publishBusinessImg': function(event){
		event.preventDefault();
		var checked = $('input[type="checkbox"]:checked').val();
		// console.log(businessID,checked);

		if(!checked||checked=='selectAll'){
			Bert.alert("Please select image to set as a business profile image.",'danger','growl-top-right');
		}else{
			Meteor.call('publishBusinessImage',businessID,checked,
				function(error,result){
					if(error){
						Bert.alert('There is some error while publishing images!','danger','growl-top-right');
					}
					else{
						Bert.alert('Selected image is set as a business profile image.','success','growl-top-right');
					}
				}
			);
		}
					
	},
	'click #closeStartVideo' : function (event) {
		video.pause();
	},

	'click #saveBusinessImg' : function(event,template){
		
		var businessLink = FlowRouter.getParam('businessLink');
		if(files.length > 0){
			$('#uploadImgDivHide').show();
			for(var i = 0 ; i < files.length; i++){
				if(i==files.length-1){
					$('#uploadImgDivHide').find('.progress-bar').css('width','40%');
	        		$('#uploadImgDivHide').find('b').html('40%');
				}
				const imageCompressor = new ImageCompressor();
			      imageCompressor.compress(files[i])
			        .then((result) => {
			          // console.log(result);

			          if(i == files.length){
			          	$('#uploadImgDivHide').find('.progress-bar').css('width','55%');
			          	$('#uploadImgDivHide').find('b').html('55%');
			          }

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
			          // template.imageUpload.set(this);
			          if(i == files.length){
			          	$('#uploadImgDivHide').find('.progress-bar').css('width','70%');
			          	$('#uploadImgDivHide').find('b').html('70%');
			          }
			        });

			        upload.on('end', function (error, fileObj) {
			          if (error) {
			            // alert('Error during upload: ' + error);
			            console.log('Error during upload 1: ' + error);
			            console.log('Error during upload 1: ' + error.reason);
			          } else {
			            // Bert.alert('Business Image uploaded.','success','growl-top-right');
			            // console.log(fileObj._id);
			            // Session.set("vendorImgFilePath",fileObj._id);
			            Meteor.call('updateVendorBulkImg', businessLink, fileObj._id, 
			              function(error,result){
			                if(error){
			                  // Bert.alert('There is some error in submitting this form!','danger','growl-top-right');
			                  return;
			                }else{
					          // template.imageUpload.set(false);
					          if(i == files.length){
					          	if(files.length == 1){
									$('#uploadImgDivHide').find('.progress-bar').css('width','100%');
			          				$('#uploadImgDivHide').find('b').html('100%');
									$('#uploadImgDivHide').hide();					          	
						          	// $('#uploadImgDivHide').addClass('hideMe');
					          	}else{
					          		$('#uploadImgDivHide').find('.progress-bar').css('width','100%');
			          				$('#uploadImgDivHide').find('b').html('100%');
					          	}
					   			counterImg = 0;
								files=[];
								$('#businessImglist').empty();
								$('#drag1').show();
								$('#businessImgfiles').val('');
					            Bert.alert('Business Image uploaded.','success','growl-top-right');
					          }else{
								$('#uploadImgDivHide').hide();					          	
					          }
			                }
			              }
			            );
			          }
			        });

			        upload.start();
			        })
			        .catch((err) => {
			          // Handle the error
			    })    
			}
		}
	},

	'click #saveBusinessMenu' : function(event){
		var businessLink = FlowRouter.getParam('businessLink');
		if(filesM.length > 0){
			$('#uploadMenuDivHide').show();
			for(var i = 0 ; i < filesM.length; i++){
				if(i == filesM.length-1){
		          	$('#uploadMenuDivHide').find('.progress-bar').css('width','40%');
		          	$('#uploadMenuDivHide').find('b').html('40%');
		        }
				const imageCompressor = new ImageCompressor();
				    imageCompressor.compress(filesM[i])
				    .then((result) => {
				          // console.log(result);

				          if(i == filesM.length){
				          	$('#uploadMenuDivHide').find('.progress-bar').css('width','55%');
				          	$('#uploadMenuDivHide').find('b').html('55%');
				          }
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
				          // template.menuUpload.set(this);
				          if(i == filesM.length){
				          	$('#uploadMenuDivHide').find('.progress-bar').css('width','70%');
				          	$('#uploadMenuDivHide').find('b').html('70%');
				          }
				        });

				        upload.on('end', function (error, fileObj) {
				          if (error) {
				            // alert('Error during upload: ' + error);
				            console.log('Error during upload 1: ' + error);
				            console.log('Error during upload 1: ' + error.reason);
				          } else {
				            // Bert.alert('Business Menu Image uploaded.','success','growl-top-right');
				            // console.log(fileObj._id);
				            // Session.set("vendorImgFilePath",fileObj._id);
				            var businessLink = FlowRouter.getParam('businessLink');
				        	// console.log('key : ' , fileObj.key);
				        	var menuId =  fileObj._id ;
					        Meteor.call("updateVendorBulkMenu", businessLink,menuId,
					          function(error, result) { 
					              if(error) {
					                  console.log ('Error Message: ' +error ); 
					              }else{
										  // process.exit();
									  if(i == filesM.length){
									  	if(filesM.length == 1){
									  		$('#uploadMenuDivHide').find('.progress-bar').css('width','100%');
								          	$('#uploadMenuDivHide').find('b').html('100%');
											$('#uploadMenuDivHide').hide();
							          		// $('#uploadMenuDivHide').addClass('hideMe');
									  	}else{
									  		$('#uploadMenuDivHide').find('.progress-bar').css('width','100%');
								          	$('#uploadMenuDivHide').find('b').html('100%');
									  	}						          	
										counterMenu = 0;
										filesM=[];
							   			$('#businessMenulist').empty();
										$('#drag3').show();
										$('#businessMenulist').val('');
					            		Bert.alert('Business Menu Image uploaded.','success','growl-top-right');
							          }else{
										$('#uploadMenuDivHide').hide();
							          }
							          // template.menuUpload.set(false);
					              }
					        });
				          }
				        });

				        upload.start();
				    })
			        .catch((err) => {
			          // Handle the error
			    }) 
			}
		}
	},

	'change #fileInputOne': function(e, template) {
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
					        template.currentUpload.set(false);
			              }
			        });

			        var file = e.target.files[0];
					var fileReader = new FileReader();
					if (file.type.match('image')) {
					fileReader.onload = function() {
					  var img = document.createElement('img');
					  img.src = fileReader.result;
					  document.getElementsByTagName('div')[0].appendChild(img);
					};
					fileReader.readAsDataURL(file);
					} else {
					fileReader.onload = function() {
					  var blob = new Blob([fileReader.result], {type: file.type});
					  var url = URL.createObjectURL(blob);
					  var video = document.createElement('video');
					  var timeupdate = function() {
					    if (snapImage()) {
					      video.removeEventListener('timeupdate', timeupdate);
					      video.pause();
					    }
					  };
					  video.addEventListener('loadeddata', function() {
					    if (snapImage()) {
					      video.removeEventListener('timeupdate', timeupdate);
					    }
					  });
					  var snapImage = function() {
					    var canvas = document.createElement('canvas');
					    canvas.width = video.videoWidth;
					    canvas.height = video.videoHeight;
					    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
					    var image = canvas.toDataURL();
					    var success = image.length > 100000;
					    if (success) {
					      var img = document.createElement('img');
					      img.src = image;
					      // console.log(img.src)
					      Meteor.call("createVideoThumbnail",img.src,fileObj._id,
					        function(error, result) { 
				              if(error) {
				                console.log ('Error Message: ' +error ); 
				              }else{
					        }
					      });
					      // document.getElementById('uniqueVid').appendChild(img);
					      URL.revokeObjectURL(url);
					    }
					    return success;
					  };
					  video.addEventListener('timeupdate', timeupdate);
					  video.preload = 'metadata';
					  video.src = url;
					  // Load video in Safari / IE11
					  video.muted = true;
					  video.playsInline = true;
					  video.play();
					};
					fileReader.readAsArrayBuffer(file);
					}
		        }
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
			// console.log('file[i].businessLink:',file[i].businessLink);
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
		 // console.log('filesV ', filesV.length);
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
		// console.log(delId);
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
		// console.log('delId ', delId);
		Meteor.call('deleteVendorVideo',businessLink,delId[1],
          function(error, result) { 
              if(error) {
                  console.log ('Error Message: ' +error ); 
              }else{
					BizVideo.remove(delId[1]);
					videoListCount = 0;
					Meteor.call('removeThumbnail',delId[1],
			            function(error, result) { 
			            if(error) {
			                console.log ('Error Message: ' +error ); 
		                }else{
		                }
					});
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