import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '/imports/api/businessMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BusinessImage } from '/imports/videoUploadClient/businessImageClient.js';

Template.nearbyBusiness.onCreated(function(){
  this.subscribe('businessImage');
});
Template.nearbyBusiness.helpers({
	nearBusiness(){
		var businessLink = FlowRouter.getParam('businessurl');
		var data  = Business.findOne({"businessLink":businessLink});
		if(data){
			if(data.businesscategories.length > 0){
				var nearByBusinesses	= Business.find({
													"businessCountry"	: data.businessCountry , 
												 	"businessState"		: data.businessState ,
												 	"businessCity" 		: data.businessCity,
												 	"businessArea" 		: data.businessArea,
												}).fetch();
				if(nearByBusinesses){
					var actualBusiness = [];
					var count = 0;
					for(var i = 0 ; i < data.businesscategories.length ; i++){
						var businesscategoryObj = data.businesscategories[i];
						var businesscategory    = String(businesscategoryObj);
						var catgs = businesscategory.split(' > ');
						for(var j = 0 ; j < nearByBusinesses.length; j++){
							if(data._id !== nearByBusinesses[j]._id){
								if(nearByBusinesses[j].businesscategories){
									for(var k = 0 ; k < nearByBusinesses[j].businesscategories.length; k++){
										 // console.log("nearBusiness category",nearByBusinesses[j].businesscategories[k]);
										 var nearBycategoryObj = nearByBusinesses[j].businesscategories[k];
										 var nearBycategory    = String(nearBycategoryObj);
										 var nearByCatgs = nearBycategory.split(' > ');
										// var nearByCatgs = nearByBusinesses[j].businesscategories[k].split(' > ');

										if(catgs[1] == nearByCatgs[1]){
											actualBusiness[count] = nearByBusinesses[j];
											count++;
											break;
										}
									}								
								}								
							}
						}
					}

					actualBusiness = _.uniq(actualBusiness);
					if(actualBusiness.length > 5){
						actualBusiness =  actualBusiness.slice(0,4);
					}
					for(i=0; i<actualBusiness.length;i++){
						if(actualBusiness[i].businessImages && actualBusiness[i].businessImages.length>0){								
							var pic = BusinessImage.findOne({"_id":actualBusiness[i].businessImages[0].img});
							if(pic){
								actualBusiness[i].imgUrl = pic.link(); 
							}else{
								actualBusiness[i].imgUrl = "images/search/nearby-testaurants1.jpg";
							}
						}else{
							actualBusiness[i].imgUrl = "images/search/nearby-testaurants1.jpg";
						}
					}

					return actualBusiness;
				}
			}
		}
	},


	showRating(){

		var businessLink = $().parent().attr('class');
		// console.log('businessLink: ',businessLink);

		var allReviews = Review.find({"businessLink" : businessLink}).fetch();
		var totalRating = 0;
		for(i=0; i<allReviews.length; i++){
			totalRating = totalRating + allReviews[i].rating;
		}
		totalRating = totalRating / allReviews.length ;
		var intRating = parseInt(totalRating);
		var balRating = totalRating - intRating;
		var finalRating = intRating + balRating;
		if(balRating < 0.5){
			var finalRating = intRating + 0.5;
		}
		if(balRating > 0.5){
			var finalRating = intRating + 1;
		}

		ratingObj = {};

		for(i=1; i<=10; i++){
			var x = "star" + i;
			if(i <= finalRating*2){
				if( i%2 == 0){
					ratingObj[x] = "fixStar2";
				}else{
					ratingObj[x] = "fixStar1";
				}				
			}else{
				ratingObj[x]  = "";
			}
		
		}
		return ratingObj;
	},


});