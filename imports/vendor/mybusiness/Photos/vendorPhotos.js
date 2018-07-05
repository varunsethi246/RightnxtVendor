import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '../../../api/businessMaster.js';
import { Review } from '../../../api/reviewMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BusinessImage } from '/imports/videoUploadClient/businessImageClient.js';
import ImageCompressor from 'image-compressor.js';
import { ReviewImage } from '/imports/videoUploadClient/reviewImageClient.js';

import '../../vendor.js';
import './vendorPhotos.html';

var files = [];
var counterImg = 0;
var checked = [];
var sortOrderUser = -1;

function sortAscImgUploadAt(a,b) {
  if (a.uploadedAt < b.uploadedAt){
    return -1;
  }
  else if (a.uploadedAt > b.uploadedAt){
    return 1;
  }
  else{
  	return 0;
  }
}

function sortDescImgUploadAt(a,b) {
  if (a.uploadedAt > b.uploadedAt){
    return -1;
  }
  else if (a.uploadedAt < b.uploadedAt){
    return 1;
  }
  else{
	return 0;
 }
}

Array.prototype.multiIndexOf = function (el) { 
    var idxs = [];
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i].img == el) {
            idxs.unshift(i);
        }
    }
    return idxs;
};

Template.vendorPhotos.onCreated(function(){
    this.subscribe('businessImage');
});

Template.vendorPhotos.helpers({
	businessName(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessDetails = Business.findOne({'businessLink':businessLink});
		return businessDetails;
	},
	vendorPhotosData: function(){
		var businessLink = FlowRouter.getParam('businessLink');
		// console.log('businessLink: '+businessLink);
		var data = Business.findOne({'businessLink':businessLink});
		if(data){
			if(data.businessImages){
				var imgListCount = data.businessImages.length;
				var imgList = [];
				for(i = 0 ; i < imgListCount ; i++)
				{

					var imgId =  data.businessImages[i];
					var imgData = BusinessImage.findOne({"_id":imgId.img});
					// console.log(imgData);
					if(imgData){
						if(imgData.type == 'image/png'){
							imgData.businessId = data._id;
							imgData.checkpngImg = 'bkgImgNone';
						}else{
							imgData.businessId = data._id;
							imgData.checkpngImg = '';
						}
						imgList[i] = imgData;
					}
				}
				imgList.sort(sortDescImgUploadAt);
				if(Session.get("sortedOld")){
					// Ascending Order
					imgList.sort(sortAscImgUploadAt);
				}
				if(Session.get("sortedNew")){
					//Descending Order
					imgList.sort(sortDescImgUploadAt);
				}		
				return imgList;
			}
		}
	},
	vendorPhotosUserData: function(){
		if(Session.get("sortedOldest")){
		}
		if(Session.get("sortedNewest")){
		}

		var businessLink = FlowRouter.getParam('businessLink');
		var data = Review.find({'businessLink':businessLink},{sort: { reviewDate: sortOrderUser } }).fetch();
		var finalImgList = [];
		if(data){
			for(var i=0; i<data.length; i++){
				if(data[i].reviewImages){
					var imgListCount = data[i].reviewImages.length;
					for(var j = 0 ; j < imgListCount ; j++)
					{
						var imgId =  data[i].reviewImages[j];
						var imgData = ReviewImage.findOne({"_id":imgId.img});
						if(imgData){
							// if(imgData.copies){
								if(imgData.type == 'image/png'){
									imgData.checkpngImg = 'bkgImgNone';
								}else{
									imgData.checkpngImg = '';
								}
							// }
							finalImgList.push(imgData);
						}
					}
				}
			}
			// console.log('finalImgList:',finalImgList);
			return finalImgList;
		}
	},
	alreadyChecked(){
		var businessLink = FlowRouter.getParam('businessLink');
		var data = Business.findOne({'businessLink':businessLink});
		if(data){
			if(data.businessImages){
				var imgListCount = data.businessImages.length;
				for(i = 0 ; i < imgListCount ; i++)
				{
					var imgId =  data.businessImages[i];
					var imgData = ReviewImage.findOne({"_id":imgId.img});
					if(imgData){
						if(imgId.img == this._id){
							return true;
						}		
					}
				}
			}
		}
	},
	photoByYou(){
		var businessLink = FlowRouter.getParam('businessLink');
		var data = Business.findOne({'businessLink':businessLink});
		var count = 0;
		if(data){
			if(data.businessImages){
				var imgListCount = data.businessImages.length;
				for(i = 0 ; i < imgListCount ; i++)
				{
					var imgId =  data.businessImages[i];
					var imgData = BusinessImage.findOne({"_id":imgId.img});
					if(imgData){
						count++;  					 
					}
				}
			}	
			return count;
		}
	},
	photoByUser(){
		var businessLink = FlowRouter.getParam('businessLink');
		var data = Review.find({'businessLink':businessLink}).fetch();
		if(data){
			var sum = 0;
			for (var i = 0; i < data.length; i++) {
				if(data[i].reviewImages){
					var imgListCount = data[i].reviewImages.length;
					sum = sum + imgListCount;
				}
			}
			return sum;
		}
	},
});

Template.vendorPhotos.events({
	'click .submitImageForBusiness': function(event){
		var imgId = $(event.currentTarget).attr('data-imgId');
		var busId = $(event.currentTarget).attr('data-busId');
		if(imgId&&busId){
			Meteor.call("publishBusinessImage",busId,imgId, function(error,result){
				if(error){
              		Bert.alert('There is some error in setting Business Image','danger','growl-top-right');
				}else{
              		Bert.alert('Business Image Set Successfully.','success','growl-top-right');
				}
			});
		}
	},

	'click .newestFirst' : function(){
		Session.set("sortedOld",'');
		Session.set("sortedNew",-1);
	},
	'click .oldestFirst' : function(){
		Session.set("sortedNew",'');
		Session.set("sortedOld",1);
	},
	'click .newestFirstUser' : function(){
		sortOrderUser = -1;
		Session.set("sortedOldest",'');
		Session.set("sortedNewest",sortOrderUser);
	},
	'click .oldestFirstUser' : function(){
		sortOrderUser = 1;
		Session.set("sortedNewest",'');
		Session.set("sortedOldest",sortOrderUser);
	}, 
	'click input[type="checkbox"]': function(event){
		var $this = $(event.target);
		
		if($($this).prop( "checked" )){
			var imgObj = {"img":event.currentTarget.id};
		    checked.push(imgObj);
		    // console.log("checked push: ",checked);
		}
		else{
			var index = checked.multiIndexOf(event.currentTarget.id);
			if(checked.length == 0 || typeof checked[index] === 'undefined'){
				checked1 = [];
				var businessLink = FlowRouter.getParam('businessLink');
				var imgObj = {"img":event.currentTarget.id};
			    var delPic = checked1.push(imgObj);
			    if(delPic){
			    	Meteor.call('deleteVendorPhotos',businessLink, Meteor.userId(),checked1,
						function(error,result){
							if(error){
								Bert.alert('There is some error while deleting this image!','danger','growl-top-right');
							}
							else{
								Bert.alert('This image is removed from  main page.','success','growl-top-right');
								checked1 = [];
							}
						}
					);
			    }
			}else{
				for (var i = index.length -1; i >= 0; i--){
				   	checked.splice(index[i],1);
				}
		    	// console.log("checked splice: ",checked);
			}	    
		}
	},

	'click .publishUserPic': function(event){
		event.preventDefault();
		var businessLink = FlowRouter.getParam("businessLink");
			if(checked.length == 0){
				Bert.alert("Please select images to publish on  main page.",'danger','growl-top-right');
			}else{
				Meteor.call('updateVendorPhotos',businessLink, Meteor.userId(),checked,
					function(error,result){
						if(error){
							Bert.alert('There is some error while publishing images!','danger','growl-top-right');
						}
						else{
							Bert.alert('Selected images published on  main page.','success','growl-top-right');
							checked = [];
						}
					}
				);
			}
					
	},
	'click #saveBusinessphoto' : function(event,template){
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

			files=[];
			counterImg = 0;
			$('#businessPhotolist').empty();
			$('.drag').show();
			$('.displayDiv').css("display","none");	
			$('.displayBtn').removeClass('marginBtnV');
		}
	},

	'change #businessPhotofiles' : function(event){
		event.preventDefault();
		$('.displayDiv').css("display","block");
		$('.drag').hide();
		$('.displayBtn').addClass('marginBtnV');
		var file = event.target.files; // FileList object\
		for(var j = 0 , f1;f1 = file[j]; j++){
			files[counterImg] = file[j];
			counterImg = counterImg + 1;
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
		        span.innerHTML = ['<img class="draggedImgPhotos" src="', e.target.result,
		                          '" title="', escape(theFile.name), '"/>'].join('');
		        document.getElementById('businessPhotolist').insertBefore(span, null);
		        
		      };
		    })(f); //end of onload


		    // Read in the image file as a data URL.
		    reader.readAsDataURL(f);
		    
		}// end of for loop

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

	'click .nav-tabsAct1':function(){
		$('.nav-tabsAct1').addClass('nav-tabsAct');
		$('.nav-tabsAct2').removeClass('nav-tabsAct');
	},
	'click .nav-tabsAct2':function(){
		$('.nav-tabsAct1').removeClass('nav-tabsAct');
		$('.nav-tabsAct2').addClass('nav-tabsAct');
	},
	'click .nav-tabsAct11':function(){
		$('.nav-tabsAct11').addClass('nav-tabsAct');
		$('.nav-tabsAct22').removeClass('nav-tabsAct');
	},
	'click .nav-tabsAct22':function(){
		$('.nav-tabsAct11').removeClass('nav-tabsAct');
		$('.nav-tabsAct22').addClass('nav-tabsAct');
	},
});

Template.vendorPhotos.onRendered(function(){
	$('.nav-tabsAct1').addClass('nav-tabsAct');
	$('.nav-tabsAct11').addClass('nav-tabsAct');
	Session.set("sortedOld",'');
	Session.set("sortedNew",'');
	Session.set("sortedOldest",'');
	Session.set("sortedNewest",'');
	counterImg = 0;
	files=[];
});


vendorPhotosForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'vendorPhotos'});
}

export { vendorPhotosForm };