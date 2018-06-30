import { Template } from 'meteor/templating' ;

import { Business } from '/imports/api/businessMaster.js';
import { Likes } from '/imports/api/likesMaster.js';
import { BusinessImgUploadS3 } from '/client/businessImage.js';
import { emptyReviewTemplate } from '../../common/emptyReviewTemplate.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../userLayout.js'
import './userLike.html'
import '../../common/emptyReviewTemplate.html'


Template.userLike.helpers({
	'checkLikeLoading': function(count){
		// var id = '';
		// var url = FlowRouter.current().path;
		// var checkIdExists = url.split('/');
		// if(checkIdExists[2] != '' && checkIdExists[2]){
		// 	id = produceURLid(checkIdExists[2]);
		// }else{
		// 	id = Meteor.userId();
		// }
		// var likesData = Likes.find({"userid":id}).count();
		if(parseInt(count) <= 0){
			return true;
		}else{
			return false;
		}

	},
	'businessName':function(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		var data = {}; 
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
		}else{
			id = Meteor.userId();
		}
		var count =0;
		var dataArray = [];
		var bussDataArray =[];
		var likesData = Likes.find({"userid":id}).fetch();
		if(likesData){

			
			for(i=0;i<likesData.length;i++){
			var bussdata = Business.findOne({'_id':likesData[i].businessId,"status":'active'});
				if(bussdata){
					count++;
					// console.log('bussdata ', bussdata);
					var businessName	 = bussdata.ownerFullName;
					var businessArea	 = bussdata.businessArea;
					var businessLink	 = bussdata.businessLink;
					var businessCity	 = bussdata.businessCity;
					var businessTitle	 = bussdata.businessTitle;
					var businessImages ='';

					
					if(bussdata.businessImages){
						if(bussdata.businessImages.length>0){
							var pic = BusinessImgUploadS3.findOne({"_id":bussdata.businessImages[0].img});
							if(pic){
								businessImages = pic.url();
							}else{
								businessImages = '/images/rightnxt_image_nocontent.jpg';
							}
						}else{
							businessImages = '/images/rightnxt_image_nocontent.jpg';
						}
					}else{
						businessImages = '/images/rightnxt_image_nocontent.jpg';
					}
						var reviewDateAgo = moment(likesData[i].createdAt).fromNow();

					bussDataArray.push({
							ownerFullName	: businessName,
							businessArea	: businessArea,
							businessLink	: businessLink,
							businessTitle	: businessTitle,
							businessCity	: businessCity,	
							createdAt		  : likesData[i].createdAt,
							businessImg   : businessImages,
					});
					// returnLikeData.push(bussDataArray[i]);
				}

			}// i


			var likedDataReturn = {
				noofLikes		: count,
				bussDataArray	: bussDataArray,
			}
			return likedDataReturn;
		}
		

	},
    'timeAgo': function(datetime) {

		console.log('datetime: ',datetime);
	  // if(datetime == ''){
	  //   return 'Never Logged In';
	  // }else{
	  //   // Session.get('time');
	    return moment(datetime).fromNow();
	  // }
	},
});
userLikeForm = function () {  
  BlazeLayout.render("userLayout",{content: 'userLike'});
  // Blaze.render(Template.userLayout,document.body);
}
export { userLikeForm }

UI.registerHelper('timeAgo', function(datetime) {
  if(datetime == ''){
    return 'Never Logged In';
  }else{
    Session.get('time');
    return moment(datetime).fromNow();
  }
});

setInterval(function() {
    Session.set("time", new Date())
}, 60); //Every minute