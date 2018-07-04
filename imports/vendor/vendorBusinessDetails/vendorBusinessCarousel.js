import './vendorBusinessCarousel.html';
import './imageCarouselItems.js';
 
import { BusinessImgUploadS3 } from '/client/cfsjs/businessImage.js';
import { Business } from '/imports/api/businessMaster.js';
import { BussImgLikes } from '/imports/api/businessImageLikesMaster.js';
import { BusinessVideoUpload } from '/client/cfsjs/businessVideo.js';
import { UserReviewStoreS3New } from '/client/cfsjs/UserReviewS3.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { BizVideo } from '/imports/videoUploadClient/videoUpload.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
 

Template.vendorBusinessCarousel.helpers({
	'showImage' : function(id){
		var businessDetails = BusinessImgUploadS3.findOne({"_id":id});
		return businessDetails; 
	},

	'imageCarouselSlide' : function(){
		
		var businessLink = FlowRouter.getParam('businessurl');
		var business = Business.findOne({"businessLink":businessLink});
		var arrayBusiness = [];
		var newObj = {};
		if(business){
			if(business.businessImages){
				for (var i = 0 ; i <  business.businessImages.length; i++) {					
					var pic = BusinessImgUploadS3.findOne({"_id":business.businessImages[i].img});
					if(pic){
						if(pic.copies){
							if(pic.copies.businessImgS3.type == 'image/png'){
								business.businessImages[i].checkpngImges = 'bkgImgNone';
							}else{
								business.businessImages[i].checkpngImges = '';
							}
						}
						newObj = {
									'_id'			 : business.businessImages[i].img,
									'img'			 : pic.url(), 
									'checkImgPng'	 : business.businessImages[i].checkpngImges,
								 };
					}else{
						var picreview = UserReviewStoreS3New.findOne({"_id":business.businessImages[i].img});
						if(picreview){
							if(picreview.copies){
								if(picreview.copies.userReviewS3.type == 'image/png'){
									business.businessImages[i].checkpngImges = 'bkgImgNone';
								}else{
									business.businessImages[i].checkpngImges = '';
								}
							}
							newObj = {
										'_id'			 : business.businessImages[i].img,
										'img'			 : picreview.url(), 
										'checkImgPng'	 : business.businessImages[i].checkpngImges,
									 };
						}
					}
					arrayBusiness.push(newObj);

				}
				// console.log('arrayBusiness = ',arrayBusiness);
			}
			
			for (var j = arrayBusiness.length ; j < 6 ; j++){
				arrayBusiness.push({
					'_id'			 : j,
					'img'			 : '/images/rightnxt_image_nocontent.jpg', 
				});
			}
			
			return arrayBusiness;
		}
	},
	'showImageModal' : function(){
		if(this.img == '/images/rightnxt_image_nocontent.jpg'){
			return false;
		}else{
			return true;
		}
	},
	'videoPresent' : function(){
		var businessLink = FlowRouter.getParam('businessurl');
    	var bussData = Business.findOne({"businessLink":businessLink});
    	if(bussData){
    		if(bussData.businessVideo){
	    		if(bussData.businessVideo == '0')
	    		{
	    			return false;
	    		}else{
		    		var data = BizVideo.find({"_id":bussData.businessVideo}).fetch();
		    		// console.log('data :',data);
		    		if(data){
		    			// console.log('video present');
			    		return true;
		    		}else{
		    			// console.log('video false');
		    			return false;
		    		}
		    	}
		    }else{
    			// console.log('1video false');
		    	return false;
		    }
    	}
    	else{
		    			// console.log('2video false');

    		return false;
    	}
	}
});

Template.vendorBusinessCarousel.events({
	'click .closeVideo' : function(event){
		var busVideo = $('#bussVideo').attr('src');
		$('#bussVideo').attr('src',"");
		var newbusVideo = $('#bussCarouselVideo').attr('src');
		$('#bussVideo').attr('src',newbusVideo);
		
	},
	'click .video':function(event){
		console.log('click');
		$('.video').parent().click(function () {
		console.log('click this: ',$(this).attr('class'));

		  if($(this).children(".video").get(0).paused)
		  	{        
		  		$(this).children(".video").get(0).play();   
		  		$(this).children(".playpause").fadeOut();
		    }else{       
		    	$(this).children(".video").get(0).pause();
		  		$(this).children(".playpause").fadeIn();
		    }
		});
	}
});

