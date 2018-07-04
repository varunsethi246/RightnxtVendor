import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '/imports/api/businessMaster.js';
import { Offers } from '/imports/api/offersMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { OfferImagesS3 } from '/client/cfsjs/offersImagesS3.js';
import { BusinessImgUploadS3 } from '/client/cfsjs/businessImage.js';

import './offersTabContent.html';

// Template.offersTabContent.helpers({
// 	vendorOffersData: function(){
// 		var vendorOffersListArray = [

// 			{'vendorOfferImg':'images/page-banner/offer-img.jpg','vendorOfferCashBack':'10% Cash Back on minimum','vendorOfferPurchase':'purchase Rs. 500','vendorKnowMore':'Know More'},
// 			{'vendorOfferImg':'images/page-banner/offer-img.jpg','vendorOfferCashBack':'10% Cash Back on minimum','vendorOfferPurchase':'purchase Rs. 500','vendorKnowMore':'Know More'},
// 			{'vendorOfferImg':'images/page-banner/offer-img.jpg','vendorOfferCashBack':'10% Cash Back on minimum','vendorOfferPurchase':'purchase Rs. 500','vendorKnowMore':'Know More'},
// 			{'vendorOfferImg':'images/page-banner/offer-img.jpg','vendorOfferCashBack':'10% Cash Back on minimum','vendorOfferPurchase':'purchase Rs. 500','vendorKnowMore':'Know More'},
// 		];
// 		return vendorOffersListArray;
// 	},

// });


Template.offersTabContent.events({
	'click .offerContentfb':function(event){
		var id = event.currentTarget.id;
		var url = window.location.href;
		var offerData = Offers.findOne({'_id':id});
		if(offerData){
			var busId       = offerData.businessId;
			var title       = offerData.dealHeadline;
			var description = offerData.dealDescription;

			var businessData = Business.findOne({'_id':busId});
			if(businessData){
				if(businessData.businessImages){
					var pic = BusinessImgUploadS3.findOne({"_id":businessData.businessImages[0].img});
					if(pic){
						businessData.businessImages = pic.copies.businessImgS3.key;
					}else{
						businessData.businessImages = '/images/rightnxt_image_nocontent.jpg';
					}

				}else{
					businessData.businessImages = '/images/rightnxt_image_nocontent.jpg';
				}

				var img = businessData.businessImages;
				var image = 'https://rightnxt.s3.amazonaws.com/BusinessImages/'+img;
				
				fBshare(url,title,description,image);
			}//businessData
		}//offerData
		
	},

	'click .offerContentgp ':function(){
		var url = window.location.href;
		// googleplusshare(url);

		var id = $('.offerContentgp').attr('id');
		var offerData = Offers.findOne({'_id':id});
		if(offerData){
			var busId       = offerData.businessId;
			var title       = offerData.dealHeadline;
			var description = offerData.dealDescription;

			var businessData = Business.findOne({'_id':busId});
			if(businessData){
				if(businessData.businessImages){
					var pic = BusinessImgUploadS3.findOne({"_id":businessData.businessImages[0].img});
					if(pic){
						businessData.businessImages = pic.copies.businessImgS3.key;
					}else{
						businessData.businessImages = '/images/rightnxt_image_nocontent.jpg';
					}

				}else{
					businessData.businessImages = '/images/rightnxt_image_nocontent.jpg';
				}

				var img = businessData.businessImages;
				var image = 'https://rightnxt.s3.amazonaws.com/BusinessImages/'+img;

				
				shareToGooglePlus(url,title,description,image);
			}//businessData
		}//offerData
	},

	'click .vmodalFormButton' : function(event){
		var fromEmail = Meteor.users.findOne({roles:'admin'}).emails[0].address;
		var id = event.currentTarget.id;
		var offerData = Offers.findOne({'_id': id});
		// console.log('offerData: ',offerData);
		if(offerData){
			var subj = offerData.dealHeadline;
			var dealDesc = offerData.dealDescription;
			var from = moment(offerData.expirationFromDate).format("DD MMM");
			// console.log(from);
			var to = moment(offerData.expirationToDate).format("DD MMM YYYY");
			// console.log(to);	
		}
		
		var toEmail = $('#toVEmail-'+id).val();		
		var imgUri = "images/logo.png";
	    var image  = Meteor.absoluteUrl(imgUri)
	    var name = Meteor.users.findOne({_id:Meteor.userId()}).profile.name;
	    var addText = $('#toVAddNote-'+id).val();
		console.log("addText ",addText);	

	    var msg = 'Hi there, <br/><br/>'+name+ ' has share offer with you. Check it out.<p>'+addText+'</p><br/><div style="border: 1px solid #ccc; width: 800px;"><img src='+image+' alt="" style="height: 60px; width: 60px; padding-left: 15px; padding-top: 15px;" /><SPAN style= "font-size: 16px; font-weight: 700; position:absolute; top: 40%; padding-left: 2%;">'+subj+'</SPAN><span style=""><h5 style="padding-right: 15px; padding-left: 15px;">Expiration Date: From '+from+' To '+to+' </h5><hr style="margin-right: 15px; margin-left: 15px;"><p style="font-size: 14px; padding-right: 15px; padding-left: 15px; text-align: justify; font-weight: 400; color: #555;">'+dealDesc+'</p></span></div>';

		Meteor.call('sendEmailRightNxt', toEmail, fromEmail, subj, msg,function(error,result){
			if(error){
				Bert.alert(error.reason, 'danger', 'growl-top-right' );
				return;
			}else{
				$('#shareOfferPage-'+id).modal('hide');
				Bert.alert('Offer successfully shared with your friend.','success','growl-top-right');
			}
		});
	}

});

fBshare = function(URL,title,description,image){

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1441873185871088',
      xfbml      : true,
      version    : 'v2.10'
    });

    FB.ui({
        method: 'share_open_graph',
        action_type: 'og.shares',
        action_properties: JSON.stringify({
            object : {
               'og:url'        : URL, 
               'og:title'      : title,
               'og:description': description,
               'og:image'      : image 
            }
        })
        },
      function(response) {});


  };
}

shareToGooglePlus =function(destination,title,description,imageurl){
    var go = "https://plus.google.com/share?";
    var url = "url="+encodeURIComponent(destination);
    var title = "title="+encodeURIComponent(title);
    var description = "content="+encodeURIComponent(description);
    var images = "image="+encodeURIComponent(imageurl);
    // newwindow=window.open(go+url+"&"+title+"&"+description+"&"+images,'name','height=400,width=600');
		sharelink = "https://plus.google.com/share?url="+url;
  	newwindow=window.open(sharelink,'name','height=400,width=600');
  	if (window.focus) {newwindow.focus()}                                                                                                                                
  	return false;
}



