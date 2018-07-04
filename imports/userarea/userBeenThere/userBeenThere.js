import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '../../api/businessMaster.js';
import { BusinessImgUploadS3 } from '/client/cfsjs/businessImage.js';
import { BeenThere } from '../../api/beenThereMaster.js';
import { UserReviewStoreS3New } from '/client/cfsjs/UserReviewS3.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../userLayout.js';
import '../../vendor/vendorBusinessDetails/businessEventIcons.html';
import './userBeenThere.html';

Template.userBeenThere.helpers({
	checkBeenThereLoading(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		var data = {};
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
		}else{
			id = Meteor.userId();
		}
		var userBeenThere = BeenThere.find({"userId":id}).count();
		
		if(userBeenThere <= 0){
			return true;
		}else{
			return false;
		}
	},
	beenThereData: function(){
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
		var beenThereArr = [];
		var userBeenThere = BeenThere.find({"userId":userID}).fetch();
		if(userBeenThere.length > 0)
		{
			for(i=0; i<userBeenThere.length; i++){
				var businessId = userBeenThere[i].businessId;
				var businessObj = Business.findOne({"_id":businessId, "status":'active'});
				
				if(businessObj){
					userBeenThere[i].businessName = businessObj.businessTitle;
					userBeenThere[i].businessArea = businessObj.businessArea;
					userBeenThere[i].businessCity = businessObj.businessCity;
					userBeenThere[i].businessLink = businessObj.businessLink;

					if(businessObj.businessImages && businessObj.businessImages.length>0){
						var pic = BusinessImgUploadS3.findOne({"_id":businessObj.businessImages[0].img});
						var pic1 = UserReviewStoreS3New.findOne({"_id":businessObj.businessImages[0].img});
						if(pic){
							userBeenThere[i].ownerPhoto = pic.url();
						}else if(pic1){
							userBeenThere[i].ownerPhoto = pic1.url();
						}else{
							userBeenThere[i].ownerPhoto = '../images/rightnxt_image_nocontent.jpg'
						}	
					}
					else{
						userBeenThere[i].ownerPhoto = '../images/rightnxt_image_nocontent.jpg'
					}

					beenThereArr.push(userBeenThere[i]);
				}//businessObj
			}// loop i

			console.log(beenThereArr);
			return beenThereArr;	
		}
	},
	
});


userBeenThereForm = function () {  
  BlazeLayout.render("userLayout",{content: 'userBeenThere'});
  // Blaze.render(Template.userLayout,document.body);
}
export { userBeenThereForm }