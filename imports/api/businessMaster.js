import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';
import { BusinessBanner } from '/imports/api/businessBannerMaster.js';
import { BusinessAds } from '/imports/api/businessAdsMaster.js';
import { BeenThere } from '/imports/api/beenThereMaster.js';
import { BussImgLikes } from '/imports/api/businessImageLikesMaster.js';
// import { BussVideo } from '/imports/videoUploadClient/videoUpload.js';

import { Enquiry } from '/imports/api/enquiryMaster.js';
import { ImageComment } from '/imports/api/imageCommentMaster.js';
import { ImageCommentLike } from '/imports/api/imageCommentLikeMaster.js';
import { Likes } from '/imports/api/likesMaster.js';
import { Offers } from '/imports/api/offersMaster.js';
import { Payment } from '/imports/api/paymentMaster.js';
import { Reports } from '/imports/api/reportMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { ReviewCommentLikes } from '/imports/api/reviewCommentLikesMaster.js';



export const Business = new Mongo.Collection('business');

if (Meteor.isServer) {
	Business._ensureIndex({ "businessTitle": 1, "businessTag":1});
	Business._ensureIndex({ "businesscategories":1});
  // This code only runs on the server
  Meteor.publish('vendorBusiness', function vendorBusiness() {
    return Business.find({"businessOwnerId" : this.userId});
  });
  //  Meteor.publish('vendorBusiness', function vendorBusiness() {
  //   return Business.find({});
  // });

  Meteor.publish('oneBusiness', function oneBusiness(businessurl) {
    return Business.find({"businessLink": businessurl});
  });

  Meteor.publish('businessListSearch', function() {
    return Business.find({},{fields:{"businessTitle" 	:1,"businessLink":1,
                             "businessAddress" 	:1,"businessLandline" 	:1,
                             "businessMobile" 	:1,"businessLatitude"	:1,
                             "businessLongitude":1,"businessImages[0]"	:1, "status":1, "publishedImage":1}});
  });
	Meteor.publish('noOfBusinessActive', function() {
		Counts.publish(this, 'noOfBusinessActive', Business.find({"status":"active"}));
	})
	;Meteor.publish('noOfBusinessInactive', function() {
		Counts.publish(this, 'noOfBusinessInactive', Business.find({"status":"inactive"}));
	});
	Meteor.publish('noOfBusiness', function() {
		Counts.publish(this, 'noOfBusiness', Meteor.users.find({}));
	});

	Meteor.publish('chartBusiness', function() {
		return Business.find({"businessOwnerId": this.userId});	
	});
}


Meteor.methods({
	'removeBusinessPermanent' : function(formValues){

		var busId = Business.findOne({"_id":formValues});
		var busLink = busId.businessLink;
		
		
		BusinessBanner.update(
			{"businessLink":busLink}, 
			{$set:	{
					"status":"inactive",
					}
			},
			{multi: true}
		);
		BusinessAds.update(
			{"businessLink":busLink}, 
			{$set:	{
					"status":"inactive",
					}
			},
			{multi: true}
		);
		BeenThere.remove(
			{"businessLink":busLink},
		);

		BussImgLikes.remove(
			{"businessLink":busLink},
		);
		// BussVideo.remove(
		// 	{"businessLink":busLink},
		// );
		Enquiry.remove(
			{"businessLink":busLink},
		);
		ImageComment.remove(
			{"businessLink":busLink},
		);
		ImageCommentLike.remove(
			{"businessLink":busLink},
		);
		Likes.remove(
			{"businessLink":busLink},
		);
		Offers.remove(
			{"businessLink":busLink},
		);
		Payment.remove(
			{"businessLink":busLink},
		);
		Reports.remove(
			{"businessLink":busLink},
		);
		Review.remove(
			{"businessLink":busLink},
		);
		ReviewCommentLikes.remove(
			{"businessLink":busLink},
		);
		Business.remove(formValues);

		console.log("formValues: ",formValues);

	},
	'insertBusinessInfo':function(formValues){
		var loggedInUser = Meteor.user();
		if (Roles.userIsInRole(loggedInUser, 'admin')) {
			var businessOwnerId = 'null';
		}else{
			var businessOwnerId = Meteor.userId();
		}
		
		return Business.insert({ 
		 	"businessOwnerId"	: businessOwnerId,
			"businessTitle" 	: formValues.businessTitle,
			"businessLink" 		: formValues.businessLink,
         	"businessAboutBus"  : formValues.businessAboutBus,
			"businessEmailId" 	: formValues.businessEmailId,
			"businessAddress" 	: formValues.businessAddress,
			"businessCountry" 	: formValues.businessCountry,
			"businessState" 	: formValues.businessState,
			"businessCity" 		: formValues.businessCity,
			"businessArea" 		: formValues.businessArea,
			"businessZipCode" 	: formValues.businessZipCode,
			"businessLatitude" 	: formValues.businessLatitude,
			"businessLongitude"	: formValues.businessLongitude,
			"businessTimings"	: [],
			"status"			: "active",
			"blockedUsers"		: [],
			"createdAt"			: new Date(),
			"createdBy"			: Meteor.userId(),
			"adminReviewComment": '',
			"publishedImage"    : "",
		}, function(error,result){
			if(error){
				// console.log(error);
				return error;
			}
			if(result){
				return result;
			}
		}

		);		
	},
	'updateBusinessInfo':function(businessLink,formValues){
		var loggedInUser = Meteor.user();
		if (Roles.userIsInRole(loggedInUser, 'admin')) {
			var businessOwnerId = 'null';
		}else{
			var businessOwnerId = Meteor.userId();
		}

		var oldData = Business.findOne({businessLink: businessLink});
		if(oldData){
			var bustimeArr = oldData.businessTimings;
		}else {
			var bustimeArr = [];
		}
		
		Business.update( 
			{businessLink: businessLink},
			{$set : {
			 	"businessOwnerId"	: businessOwnerId,
				"businessTitle" 	: formValues.businessTitle,
				"businessLink" 		: formValues.businessLink,
         		"businessAboutBus"  : formValues.businessAboutBus,
				"businessEmailId" 	: formValues.businessEmailId,
				"businessAddress" 	: formValues.businessAddress,
				"businessCountry" 	: formValues.businessCountry,
				"businessState" 	: formValues.businessState,
				"businessCity" 		: formValues.businessCity,
				"businessArea" 		: formValues.businessArea,
				"businessZipCode" 	: formValues.businessZipCode,
				"businessLatitude" 	: formValues.businessLatitude,
				"businessLongitude"	: formValues.businessLongitude,
				"businessTimings"	: bustimeArr,
				"status"			: "active",
				"blockedUsers"		: [],
				}
			}, 
			function(error,result){
				if(error){
					// console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			}
		);
		return businessLink;

	},
	'updateBusinessOpenAndClose':function(businessLink,formValues){
		Business.update(
			{businessLink: businessLink},
			{$set : { 
				"businesscategories" 	: formValues.businesscategories,
				"businessAnythingElse" 	: formValues.businessAnythingElse,
				"businessLandline" 		: formValues.businessLandline,
				"businessMobile" 		: formValues.businessMobile,
				"businessAltMobile" 	: formValues.businessAltMobile,
				"businessWebAdress" 	: formValues.businessWebAdress,
				"businessTag" 			: formValues.businessTag,
				"businessModeOfPay" 	: formValues.businessModeOfPay,
		        "allCategories"         : formValues.allCategories,
		        "alltags"        		: formValues.alltags,
				}
			}, 
			function(error,result){
				if(error){
					// console.log(error);
					return error;
				}
			}
		);

		return businessLink;
	},

	'updateBusinessAboutOwner':function(businessLink,formValues){
		Business.update(
			{businessLink: businessLink},
			{$set: { 
					"ownerFullName" 	: formValues.ownerFullName,
					"ownerRole" 		: formValues.ownerRole,
					"ownerMobile" 		: formValues.ownerMobile,
					"ownerEmail" 		: formValues.ownerEmail,
					"ownerDesc" 		: formValues.ownerDesc,
					"ownerPhoto" 		: formValues.ownerPhoto,
					"businessTermNCon" 	: formValues.businessTermNCon,
					}
			}, 	
			function(error,result){
				if(error){
					// console.log(error);
					return error;
				}
			}
		);
		return businessLink;
	},
	'updateBusinessAboutOwnerImage':function(businessLink,filePath){
		Business.update(
			{businessLink: businessLink},
			{$set: { 
					"ownerPhoto" 		: filePath,
					}
			}, 	
			function(error,result){
				if(error){
					// console.log(error);
					return error;
				}
			}
		);
		return businessLink;
	},
	'insertOpenCloseTiming':function(docId, formValues){
		// console.log('id = ', docId);
		Business.update(
			{"_id": docId},
			{$push : {"businessTimings": {$each: formValues }}}, 
			function(error,result){
				if(error){
					// console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			}
		);
	},
	'updateVendorBulkImg' : function(businessLink,filePath){
		var imgData = {
			img : filePath,
		}
		Business.update(
			{"businessLink": businessLink},  
			{$push : {"businessImages": imgData}},
		);	
	},

	'deleteVendorImg' : function(businessLink,imgId){
		Business.update(
			{"businessLink": businessLink},
			{$pull : {"businessImages" : {"img": imgId}}},
			function(error, result) { 
			              if(error) {
			                  console.log ('Error Message: ' +error ); 
			              }else{
								  
			              }
			});	
	},

	'deleteVendorVideo' : function(businessLink,imgId){
		Business.update(
			{"businessLink": businessLink},
			{$set : {"businessVideo" : '0'}},
			function(error, result) { 
              if(error) {
                  console.log ('Error Message: ' +error ); 
              }else{
					  // BizVideo.remove(imgId);  
              }
		});		
	},

	'deleteVendorMenu' : function(businessLink,imgId){
		Business.update(
			{"businessLink": businessLink},
			{$pull : {"businessMenu" : {"menu": imgId}}},
			function(error, result) { 
                if(error) {
                  console.log ('Error Message: ' +error ); 
                }else{
					  
                }
		});		
	},

	'updateVendorBulkMenu' : function(businessLink,filePath){
		var menuData = {
			menu : filePath,
		}
		Business.update(
			{"businessLink": businessLink},
			{$push : {"businessMenu": menuData}},
		);	
	},

	'updateVendorBulkVideo' : function(businessLink,filePath){
		// var videoData = {
		// 	video : filePath,
		// }
		// Business.update(
		// 	{"businessLink": businessLink},
		// 	{$Set: {"businessVideo": videoData}},
		// );	
		Business.update(
			{businessLink: businessLink},
			{$set: { 
					"businessVideo" 		: filePath,
					}
			}, 	
			function(error,result){
				if(error){
					// console.log(error);
					return error;
				}
			}
		);
	},
	
	'deleteBusinessTime' : function(btId, docId){
		var id = btId.split('-');
		var day = id[1];
		
		var busId = Business.findOne({"_id":docId});
		var busLink = busId.businessLink;
		
		Business.update(
				{"_id": docId},
				{$pull: {"businessTimings" : {"day":day } }}
		);

		
		
		BusinessBanner.update(
			{"businessLink":busLink}, 
			{$set:	{
					"status":"inactive",
					}
			},
			{multi: true}
		);
		BusinessAds.update(
			{"businessLink":busLink}, 
			{$set:	{
					"status":"inactive",
					}
			},
			{multi: true}
		);

	},
	'updateBusInfoAcc':function(id,formValues){
		Business.update(
			{_id: id},
			{$set : { 
				"businessTitle"     : formValues.businessTitle,
		        "businessLink"      : formValues.businessLink,
         		"businessAboutBus"  : formValues.businessAboutBus,
		        "businessEmailId"   : formValues.businessEmailId,
		        "businessAddress"   : formValues.businessAddress,
		        "businessCountry"   : formValues.businessCountry,
		        "businessState"     : formValues.businessState,
		        "businessCity"      : formValues.businessCity,
		        "businessArea"      : formValues.businessArea,
		        "businessZipCode"   : formValues.businessZipCode,
		        "businessLatitude"  : formValues.businessLatitude,
		        "businessLongitude" : formValues.businessLongitude,
				}
			}, 
			function(error,result){
				if(error){
					// console.log(error);
					return error;
				}
			}
		);
		return id;
	},
	'updateBusOpClAcc':function(id,formValues){
		// console.log('alltags ', formValues.alltags);
		Business.update(
			{_id: id},
			{$set : { 
				"businesscategories"      : formValues.businesscategories,
			    "businessAnythingElse"    : formValues.businessAnythingElse,
			    "businessLandline"        : formValues.businessLandline,
			    "businessMobile"          : formValues.businessMobile,
			    "businessAltMobile"       : formValues.businessAltMobile,
			    "businessWebAdress"       : formValues.businessWebAdress,
			    "businessTag"             : formValues.businessTag,
			    "businessModeOfPay"       : formValues.businessModeOfPay,
			    "allCategories"           : formValues.allCategories,
		        "alltags"        		  : formValues.alltags,
				}
			}, 
			function(error,result){
				if(error){
					// console.log(error);
					return error;
				}
			}
		);
		return id;
	},
	'updateBusAbOwnerAcc':function(id,formValues){
		if(formValues.ownerPhoto){
			Business.update(
				{_id: id},
				{$set : { 
					"ownerFullName"  : formValues.ownerFullName,
				    "ownerRole" 	 : formValues.ownerRole,
				    "ownerMobile"    : formValues.ownerMobile,
				    "ownerEmail"     : formValues.ownerEmail,
				    "ownerDesc"  	 : formValues.ownerDesc,
				    "ownerPhoto"     : formValues.ownerPhoto,
					}
				}, 
				function(error,result){
					if(error){
						// console.log(error);
						return error;
					}
				}
			);
		}else{
			Business.update(
				{_id: id},
				{$set : { 
					"ownerFullName"  : formValues.ownerFullName,
				    "ownerRole" 	 : formValues.ownerRole,
				    "ownerMobile"    : formValues.ownerMobile,
				    "ownerEmail"     : formValues.ownerEmail,
				    "ownerDesc"  	 : formValues.ownerDesc,
				    // "ownerPhoto"     : formValues.ownerPhoto,
					}
				}, 
				function(error,result){
					if(error){
						// console.log(error);
						return error;
					}
				}
			);
		}
			return id;
	},
	'deleteBusiness':function(id,formValues){
		var busId = Business.findOne({"_id":id});
		var busLink = busId.businessLink;
		
		
		BusinessBanner.update(
			{"businessLink":busLink}, 
			{$set:	{
					"status":"inactive",
					}
			},
			{multi: true}
		);
		BusinessAds.update(
			{"businessLink":busLink}, 
			{$set:	{
					"status":"inactive",
					}
			},
			{multi: true}
		);


		Business.update(
			{_id: id},
			{$set : { 
				"status"  : "inactive",
				}
			}, 
			function(error,result){
				if(error){
					// console.log(error);
					return error;
				}
			}
		);
		return id;
	},
	
	'removeSelectedCategories':function (busLink,category) {
			
		var formedName = "businesscategories."+category;
		
		Business.update(
			{businessLink:busLink},
			{$unset: { [formedName]: 1}}, 
			function(error,result){
				if(error){
					console.log('unset : ',error);
					// return error;
				}else{
					
				}
			}
		);
		Business.update(
			{businessLink:busLink},
			{$pull: {"businesscategories" : null}}, 
			function(error,result){
				if(error){
					console.log('pull : ',error);
					// return error;
				}else{
					
				}
			}
		);		
	},
	'removeSelectedtags':function (busLink,tag) {	
		var formedName = "businessTag."+tag;
		Business.update(
			{businessLink:busLink},
			{$unset: { [formedName]: 1}}, 
			function(error,result){
				if(error){
					console.log('unset : ',error);
					// return error;
				}else{
					
				}
			}
		);
		Business.update(
			{businessLink:busLink},
			{$pull: {"businessTag" : null}}, 
			function(error,result){
				if(error){
					console.log('pull : ',error);
					// return error;
				}else{
					
				}
			}
		);
	},
	'updateBlockUser':function(formValues){
		Business.update(
			{_id: formValues.currentBusiness},
			{$push : { 
				"blockedUsers"  : formValues.currentUser,
				}
			}, 
			function(error,result){
				if(error){
					return error;
				}
			}
		);
		return id;
	},
	'updateVendorPhotos':function(businessLink,vendorId,formValues){
		for(var i = 0; i<formValues.length; i++){
			Business.update(
				{"businessLink":businessLink},
				{$push: 
					{'businessImages': formValues[i]
					}
				}
			);
		}
	},
	'deleteVendorPhotos':function(businessLink,vendorId,formValues){
		for(var i = 0; i<formValues.length; i++){
			Business.update(
				{"businessLink":businessLink},
				{$pull: 
					{'businessImages': formValues[i]
					}
				}
			);
		}
	},
	BussCSVUpload( data ){
		check( data, Array);

		var errorbusinessList = [];
		for ( let a = 0; a < data.length; a++ ) {
			// console.log("data: ",data[a]);

			var bussMgmt = data[a];
			// console.log('bussMgmt :',bussMgmt);
			var BusinessTitle  		= bussMgmt["Business Title"];
				
			var BusinessLink	 	= bussMgmt["Business Link (www.rightnxt.com/)"];
			if(BusinessLink){
				var linkExits = Business.findOne({"businessLink":BusinessLink});
				if(linkExits){
					errorbusinessList.push(BusinessTitle);
					// console.log('given exits BusinessLink ',BusinessLink);

					continue;
				}else{
					BusinessLink = BusinessTitle.replace(/ /g,'').substring(0,50);
					var linkExits = Business.findOne({"businessLink":BusinessLink});
					if(linkExits){
						errorbusinessList.push(BusinessTitle);
						// console.log('notgiven exits BusinessLink ',BusinessLink);

						continue;
					}
				}
			
				
				// console.log('BusinessLink ',BusinessLink);
				var AboutyourBusiness 	= bussMgmt["About your Business"];
					
				var BusinessEmailId 	= bussMgmt["Business Email Id"];
			
				var Address    			= bussMgmt["Business Address"];

				var businessCountry		= bussMgmt["Business Country"]

				var businessState		= bussMgmt["Business State"]
				
				var businessCity		= bussMgmt["Business City"]
				
				var businessArea		= bussMgmt["Business Area"]
	 
				var Latitude    		= bussMgmt["Business Latitude"];

				var Longitude    		= bussMgmt["Business Longitude"];
				
				var PinCode    			= bussMgmt["Business Pin code"];

				var AboutBusiness 		= bussMgmt["About Your Business"]
				
				var catg1 = [];
				var catg2 = [];
				var catg3 = [];
				var catg4 = [];
				if(bussMgmt["Business Categories 1"]){
					var textCategory1   = bussMgmt["Business Categories 1"];
					 catg1 = textCategory1.split("|");
				}else{
					var textCategory1   = '--';
				}
				
				if (bussMgmt["Business Categories 2"]) {
					var textCategory2   = bussMgmt["Business Categories 2"];
					 catg2 = textCategory2.split("|");

				}else
				{
					var textCategory2	= '--';
				}
				
				if (bussMgmt["Business Categories 2"]) {
					var textCategory3   = bussMgmt["Business Categories 3"];
					 catg3 = textCategory3.split("|");				
				}else
				{
					var textCategory3	= '--';
				}
				
				if (bussMgmt["Business Categories 2"]) {
					var textCategory4   = bussMgmt["Business Categories 4"];
					 catg4 = textCategory4.split("|");
				}else
				{
					var textCategory4	= '--';
				}
				var category = [];
				for(var j = 0 ; j < catg1.length; j++){
					var catgData = [ catg1[j] + ' > ' + catg2[j] + ' > ' + catg3[j] + ' > ' + catg4[j] ];	
					category.push(catgData);
				}

				// var categoryL1Tags1 		= bussMgmt["Business Categories Tags 1"];
				// var categoryL1Tags2 		= bussMgmt["Business Categories Tags 2"];
				// var categoryL1Tags3 		= bussMgmt["Business Categories Tags 3"];
				// var categoryL1Tags4 		= bussMgmt["Business Categories Tags 4"];
			    var allCategories           = category.toString();
			    var allCategories           = category.toString();

				
				
					// ===timing===

				var timeSlotArray = [];
				
				var Monday 		= bussMgmt["Monday"];
				// console.log('Monday ',Monday);
				if(Monday){
					var monday 		= Monday.replace(/(\r\n|\n|\r)/gm,"");
				}else{
					var monday      = Monday;
				}
				// console.log('monday ',monday);

				if(monday){
					var tempMonday 	= monday.split(',');
					if(tempMonday != ""){
						for(var  i = 0 ; i < tempMonday.length; i++){
							var slotMon = tempMonday[i].split('-');
							// console.log('slotMon ',slotMon);
							var dataMon = {
								day 		: "Monday",
								fromTime 	: (slotMon[0]).trim(),
								toTime 		: (slotMon[1]).trim(),
							}
							timeSlotArray.push(dataMon);
						}
					}else{
						var dataMon ={
							day 		: "Monday",
							fromTime 	: "--",
							toTime 		: "--",
						}
						timeSlotArray.push(dataMon);
					}
				}
				// console.log('timeSlotArray ',timeSlotArray);

				var Tuesday 	= bussMgmt["Tuesday"];
				if(Tuesday){
					var tuesday 	= Tuesday.replace(/(\r\n|\n|\r)/gm,"");
				}else{
					var tuesday     = Tuesday;
				}
				if(tuesday){
					var tempTuesday = tuesday.split(',');
					if(tempTuesday != ""){
						for(var  i = 0 ; i < tempTuesday.length; i++){
							var slotTues = tempTuesday[i].split('-');
							var dataTues = {
								day 		: "Tuesday",
								fromTime 	: (slotTues[0]).trim(),
								toTime 		: (slotTues[1]).trim(),
							}
							timeSlotArray.push(dataTues);
						}
					}else{
						var dataTues ={
							day 		: "Tuesday",
							fromTime 	: "--",
							toTime 		: "--",
						}
						timeSlotArray.push(dataTues);
					}
				}

				var Wednesday 		= bussMgmt["Wednesday"];
				if(Wednesday){
					var wednesday 		= Wednesday.replace(/(\r\n|\n|\r)/gm,"");
				}else{
					var wednesday       = Wednesday;
				}
				if(wednesday){
					var tempWednesday	= wednesday.split(',');

					if(tempWednesday != ""){
						for(var  i = 0 ; i < tempWednesday.length; i++){
							var slotWed = tempWednesday[i].split('-');
							var dataWed = {
								day 		: "Wednesday",
								fromTime 	: (slotWed[0]).trim(),
								toTime 		: (slotWed[1]).trim(),
							}
							timeSlotArray.push(dataWed);
						}
					}else{
						var dataTues ={
							day 		: "Wednesday",
							fromTime	: "--",
							toTime 		: "--",
						}
						timeSlotArray.push(dataWed);
					}
				}

				var Thursday 		= bussMgmt["Thursday"];
				if(Thursday){
					var thursday 		= Thursday.replace(/(\r\n|\n|\r)/gm,"");
				}else{
					var thursday        = Thursday;
				}
				if(thursday){
					var tempThursday 	= thursday.split(',');
					if(tempThursday != ""){
						for(var  i = 0 ; i < tempThursday.length; i++){
							var slotThur = tempThursday[i].split('-');
							var dataThur = {
								day 		: "Thursday",
								fromTime 	: (slotThur[0]).trim(),
								toTime 		: (slotThur[1]).trim(),
							}
							timeSlotArray.push(dataThur);
						}
					}else{
						var dataTues ={
							day 		: "Thursday",
							fromTime 	: "--",
							toTime 		: "--",
						}
						timeSlotArray.push(dataThur);
					}
				}

				var Friday 		= bussMgmt["Friday "];
				if(Friday){
					var friday 		= Friday.replace(/(\r\n|\n|\r)/gm,"");
				}else{
					var friday 		= Friday;
				}
				if(friday){
					var tempFriday 	= friday.split(',');
					if(tempFriday != ""){
						for(var  i = 0 ; i < tempFriday.length; i++){
							var slotFri = tempFriday[i].split('-');
							var dataFri = {
								day 		: "Friday",
								fromTime	: (slotFri[0]).trim(),
								toTime 		: (slotFri[1]).trim(),
							}
							timeSlotArray.push(dataFri);
						}
					}else{
						var dataTues ={
							day 		: "Friday",
							fromTime 	: "--",
							toTime 		: "--",
						}
						timeSlotArray.push(dataFri);
					}
				}

				var Saturday 		= bussMgmt["Saturday "];
				if(Saturday){
					var saturday 		= Saturday.replace(/(\r\n|\n|\r)/gm,"");
				}else{
					var saturday 		= Saturday;
				}
				if(saturday){
					var tempSaturday 	= saturday.split(',');
					if(tempSaturday != ""){
						for(var  i = 0 ; i < tempSaturday.length; i++){
							var slotSat = tempSaturday[i].split('-');
							var dataSat = {
								day 		: "Saturday",
								fromTime 	: (slotSat[0]).trim(),
								toTime 		: (slotSat[1]).trim(),
							}
							timeSlotArray.push(dataSat);
						}
					}else{
						var dataTues =	{
							day 		: "Saturday",
							fromTime 	: "--",
							toTime 		: "--",
						}
						timeSlotArray.push(dataSat);
					}
				}
				var Sunday 		= bussMgmt["Sunday "];
				if(Sunday){
					var sunday 		= Sunday.replace(/(\r\n|\n|\r)/gm,"");
				}else{
					var sunday 		= Sunday;
				}
				if(sunday){
					var tempSunday 	= sunday.split(',');
					if(tempSunday != ""){
						for(var  i = 0 ; i < tempSunday.length; i++){
							var slotSun = tempSunday[i].split('-');
							var dataSun = {
								day 		: "Sunday",
								fromTime 	: (slotSun[0]).trim(),
								toTime 		: (slotSun[1]).trim(),
							}
							timeSlotArray.push(dataSun);
						}
					}else{
						var dataTues =	{
							day 		: "Sunday",
							fromTime 	: "--",
							toTime 		: "--",
						}
						timeSlotArray.push(dataSun);
					}
				}

				var  AnythingElse  			= bussMgmt["Business Anything Else"];
				
				// var Timings    = bussMgmt["Timings"];

				var Landline   				= bussMgmt["Business Landline"];

				var MobileNumber   			= bussMgmt["Business Mobile"];
				
				var Othernumber   			= bussMgmt["Business Alternate Mobile"];
				
				var Website 				= bussMgmt["Business Web Address"];
				
				var Tags   					= bussMgmt["Business Tag"];
				// Tags = categoryL1Tags1 + ',' + categoryL1Tags2 + ',' + categoryL1Tags3 + ',' + categoryL1Tags4;
				
				var ModesofPayment   		= bussMgmt["Business Mode of Payment"];
							
				var BusinessPics    		= bussMgmt["Business Images"];

				var BusinessVideos   		= bussMgmt["Business Video"];
							
				var OwnerName    			= bussMgmt["Owner Full Name"];
							
				var OwnerMbNumber   		= bussMgmt["Owner Mobile"];
							
				var OwnerEmail  			= bussMgmt["Owner Email"];
										
				var Description    			= bussMgmt["Owner Description"];
										
				var OwnerPicture   			= bussMgmt["Owner Photo"];
										
				var OwnerRole   			= bussMgmt["Role"];
							
				var addMobileNumber, addOthernumber, addOwnerMbNumber;	
				if(MobileNumber){
					addMobileNumber = "+91" + MobileNumber;
				}
				if(Othernumber){
					addOthernumber = "+91" + Othernumber; 
				}
				if(OwnerMbNumber){
					addOwnerMbNumber = "+91" + OwnerMbNumber; 
				}

				Business.insert({ 
					// "categoryIndex"			: categoryIndexSrno,
					
				 	"businessOwnerId"		: null,
					"businessTitle" 		: BusinessTitle,
					"businessLink" 			: BusinessLink,
					"businessAboutBus"		: AboutBusiness,
					"businessEmailId" 		: BusinessEmailId,
					"businessAddress" 		: Address,
					"businessCountry" 		: businessCountry,
					"businessState" 		: businessState,
					"businessCity" 			: businessCity,
					"businessArea" 			: businessArea,
					"businessZipCode" 		: PinCode,
					"businessLatitude" 		: Latitude,
					"businessLongitude"		: Longitude,
					"businessTimings"		: timeSlotArray,
					"status"				: "inactive",
					"blockedUsers"			: [],
					"businesscategories" 	: category,
					"allCategories" 		: allCategories,
					"businessAnythingElse" 	: AnythingElse,
					"businessLandline" 		: Landline,
					"businessMobile" 		: addMobileNumber,
					"businessAltMobile" 	: addOthernumber,
					"businessWebAdress" 	: Website,
					"businessTag" 			: Tags,
					"businessModeOfPay" 	: ModesofPayment,
					"ownerFullName" 		: OwnerName,
					"ownerRole" 			: OwnerRole,
					"ownerMobile" 			: addOwnerMbNumber,
					"ownerEmail" 			: OwnerEmail,
					"ownerDesc" 			: Description,
					"ownerPhoto" 			: OwnerPicture,
					"businessTermNCon" 		: "checked",
					"createdAt"				: new Date(),
				},function(error,result){
					if(error){
						console.log(error);
						return error;
					}
					if(result){
						// console.log('result ', result);
						return result;
					}
				}); 			
				// categoryIndexSrno++;
			}
		} //end of i loop
		// console.log('errorbusinessList ',errorbusinessList);
	}, //End of CSVUpload

	// ============== Update Status business list==================

	'updateBusinessStatusActive':function(recId,status){
		return Business.update({'_id':recId},{$set:{'status':status}});
	},
	'updateBusinessStatusInactive':function(recId,status){

		var busId = Business.findOne({"_id":recId});
		var busLink = busId.businessLink;
		

		BusinessBanner.update(
			{"businessLink":busLink}, 
			{$set:	{
					"status":"inactive",
					}
			},
			{multi: true}
		);
		BusinessAds.update(
			{"businessLink":busLink}, 
			{$set:	{
					"status":"inactive",
					}
			},
			{multi: true}
		);

		return Business.update({'_id':recId},{$set:{'status':status}});
	},
	'updateOtp':function(id,otp){
		Business.update(
			{"_id":id},
			{$set: 
				{"otp": 
					{'otp': otp,
				 	 'createdAt' : new Date(),
				  	 'verified' : 'false'
					}
				}
			}
		);
	},

	'updateOwnerID':function(id,otp){
		Business.update(
			{"_id":id},
			{$set: 
				{"businessOwnerId": Meteor.userId(),
				 "otp": {'otp': otp,
				 	 	'createdAt' : new Date(),
				  	 	'verified' : 'true'
					}
				}
			}
		);	
	},


	'updateBusinessForRating': function(id,latestRating,totalVote){
		// console.log('latestRating: '+latestRating+' | totalVote: ' + totalVote);

		Business.update(
			{"_id":id},
			{$set: 
				{ 	"latestRating"	: 	latestRating,
					"totalVote"		: 	totalVote
				}
			}
		);			
	},

	'updateBusReviewComment':function(busId,busComment){
		Business.update(
			{"_id":busId},
			{$set: 
				{ 	"status"				: 	"active",
					"adminReviewComment"	: 	busComment,
				}
			}
		);
	},

	'updateBusInactivate':function(busId, busComment){
		var busId = Business.findOne({"_id":busId});
		var busLink = busId.businessLink;
		console.log('busid :',busId);
		Business.update(
			{"businessLink":busLink},
			{$set: 
				{ 	
					"status"				: 	"inactive",
					"adminReviewComment"	: 	busComment,
				}
			},
			function(error,result){
				if(error){
					// console.log(error);
					return error;
				}
			},
			{multi: true}
		);
		BusinessBanner.update(
			{"businessLink":busLink}, 
			{$set:	{
					"status":"inactive",
					}
			},
			{multi: true}
		);
		BusinessAds.update(
			{"businessLink":busLink}, 
			{$set:	{
					"status":"inactive",
					}
			},
			{multi: true}
		);

	},

	'publishBusinessImage':function(busid, busImgId){
		Business.update(
			{"_id":busid},
			{$set: 
				{ 	
					"publishedImage" : busImgId,
				}
			}
		);
	}



});
