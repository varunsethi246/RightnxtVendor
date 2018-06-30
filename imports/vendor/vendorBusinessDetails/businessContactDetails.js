import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Review } from '/imports/api/reviewMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../../common/starRating2.html'

Template.businessContactDetails.helpers({
	showRating(){
		var businessLink = FlowRouter.getParam('businessurl');
		var allReviews = Review.find({"businessLink" : businessLink}).fetch();
		var totalRating = 0;
		for(i=0; i<allReviews.length; i++){
			totalRating = totalRating + allReviews[i].rating;
		}
		// console.log('totalRating: '+totalRating+' | number: '+allReviews.length );
		totalRating = totalRating / allReviews.length ;
		// console.log('totalRating2: '+totalRating);
		var intRating = parseInt(totalRating);
		var balRating = totalRating - intRating;
		var finalRating = intRating + balRating;
		if(balRating < 0.5 && balRating > 0){
			var finalRating = intRating + 0.5;
		}
		if(balRating > 0.5){
			var finalRating = intRating + 1;
		}

		ratingObj = {
			// "star1" : "",
			// "star2" : "",
			// "star3" : "",
			// "star4" : "",
			// "star5" : "",
			// "star6" : "",
			// "star7" : "",
			// "star8" : "",
			// "star9" : "",
			// "star10": "",
		};

		for(i=1; i<=10; i++){

			var x = "star" + i;
			// console.log('x = ', x);
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

		// console.log(ratingObj);
		return ratingObj;
	},
});
