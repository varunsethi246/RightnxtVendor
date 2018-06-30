import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '../../api/businessMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { BusinessImgUploadS3 } from '/client/businessImage.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../userLayout.js';
import './userRatings.html';
import '../../common/starRating2.html';

Template.userRatings.helpers({
	checnRatingLoading(count){
		if(count<= 0){
			return true;
		}else{
			return false;
		}
	},
	ratingsData: function(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		var data = {};
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
		}else{
			id = Meteor.userId();
		}
		var userID  = id;
		var useridArr = [];
		var businessRatings = Review.find({"userId":userID}).fetch();
		if(businessRatings){
			// console.log(businessRatings);
			for(i=0; i<businessRatings.length; i++){
				var businessLink = businessRatings[i].businessLink;
				var businessObj = Business.findOne({"businessLink":businessLink, "status":'active'});
				
				if(businessObj){
					businessRatings[i].businessName = businessObj.businessTitle;
					businessRatings[i].businessArea = businessObj.businessArea;
					businessRatings[i].businessCity = businessObj.businessCity;
					businessRatings[i].businessLink = businessObj.businessLink;

					if(businessObj.businessImages){
						if(businessObj.businessImages.length>0){
							var pic = BusinessImgUploadS3.findOne({"_id":businessObj.businessImages[0].img});
							if(pic){
								businessRatings[i].businessImages = pic.url();
							}else{
								businessRatings[i].businessImages = '/images/rightnxt_image_nocontent.jpg';
							}
						}else{
							businessRatings[i].businessImages = '/images/rightnxt_image_nocontent.jpg';
						}
					}else{
						businessRatings[i].businessImages = '/images/rightnxt_image_nocontent.jpg';
					}
					useridArr.push(businessRatings[i]);
				}// businessRatings
			}// i
			
			return useridArr;	
		}
	},

	showRating(userId,businessLink){
		var ratingInt = Review.findOne({"userId" : userId,"businessLink":businessLink});
		var latestRating = ratingInt.rating;
		// console.log("latestRating: ",latestRating);			

		var intRating = parseInt(latestRating);
		var balRating = latestRating - intRating;
		var finalRating = intRating + balRating;
		if(balRating > 0 && balRating < 0.5){
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
		// console.log("ratingObj: ",ratingObj);

		return ratingObj;
	},
	ratingsDataCount(){
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			console.log('url:',url);
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var count = 0;
			var RatingData = Review.find({"userId":id}).fetch();	
			if(RatingData){
				for(i=0;i<RatingData.length;i++){
					var bussdata = Business.findOne({'businessLink':RatingData[i].businessLink,"status":'active'});
						if(bussdata){
							count++;
						}
					}
				var RatingDataReturn = {
					noofRatingData		: count,
				}
				console.log(RatingDataReturn)
				return RatingDataReturn;
			}
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			console.log('url:',url);

			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var count = 0;
			var RatingData = Review.find({"userId":id}).fetch();
			console.log(RatingData);	
			if(RatingData){
				for(i=0;i<RatingData.length;i++){
					var bussdata = Business.findOne({'businessLink':RatingData[i].businessLink,"status":'active'});
						if(bussdata){
							count++;
						}
					}
				var RatingDataReturn = {
					noofRatingData		: count,
				}
				console.log(RatingDataReturn)
		
				return RatingDataReturn;
			}
		}

	}
});


userRatingsForm = function () {  
  BlazeLayout.render("userLayout",{content: 'userRatings'});
  // Blaze.render(Template.userLayout,document.body);
}
export { userRatingsForm }
