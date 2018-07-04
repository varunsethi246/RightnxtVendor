import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '../../api/businessMaster.js';
import { BusinessImgUploadS3 } from '/client/cfsjs/businessImage.js';
import { UserReviewStoreS3New } from '/client/cfsjs/UserReviewS3.js';
import { Review } from '../../api/reviewMaster.js';
import { UserImgLikes } from '/imports/api/UserImgLikesMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../userLayout.js';
import './userPhotos.html';

var files = [];
var checked = [];

Array.prototype.multiIndexOf = function (el) { 
    var idxs = [];
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i].img == el) {
            idxs.unshift(i);
        }
    }
    return idxs;
};

Template.userPhotos.helpers({
	showDeleteAllPic : function(){
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		if(checkIdExists[2] != '' && checkIdExists[2]){
			return 'hide';
		}else{
			return 'show';
		}
	},
	checkPhotoLoading(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
		}else{
			id = Meteor.userId();
		}
		var data = Review.find({'userId':id}).fetch();
		var imgList = 0;
		if(data){
			for (var i = 0; i < data.length; i++) {
				if(data[i].reviewImages && data[i].reviewImages.length>0){
					var imgListCount = data[i].reviewImages.length;
					imgList = imgList + imgListCount;
				}
			}
			// return true;
			
			if(imgList <= 0){
				return true;
			}else{
				return false;
			}
		}
	},
	userPhotosData: function(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
			var showDelete = 'hide';
			var margLike = 'marLike';
		}else{
			var showDelete = 'show';
			var margLike = '';
			id = Meteor.userId();
		}
		var data = Review.find({'userId':id}).fetch();
		var imgList = [];
		if(data){
			for (var i = 0; i < data.length; i++) {
				if(data[i].reviewImages){
					var imgListCount = data[i].reviewImages.length;
					for(j = 0 ; j < imgListCount ; j++)
					{
						var imgId =  data[i].reviewImages[j];
						var imgData = UserReviewStoreS3New.findOne({"_id":imgId.img});
						if(imgData){
							imgData.showDelete = showDelete;
							imgData.margLike = margLike;
							var isLiked1 = UserImgLikes.findOne({"userid":Meteor.userId(),"LikedImage":imgId.img});
							// console.log('isLiked1: ',isLiked1);
							if(isLiked1){
								imgData.isLiked = 'activelike';
							}else{
								imgData.isLiked = 'inactivelike';
							}
							imgList.push(imgData);
						}
					}
				}
			}
			return imgList;
		}
	},
	
});

Template.userPhotos.events({
	'click .deleteBtn': function(event){
		event.preventDefault();
		var $this = $(event.target);
		var clicks = $this.data('clicks');
		if (clicks % 2 == 1) {
			// odd clicks
			$(event.target).removeAttr("style");
			var index = checked.multiIndexOf(event.currentTarget.id);
			for (var i = index.length -1; i >= 0; i--){
			   checked.splice(index[i],1);
			}
		} else {
			// even clicks
			$(event.target).css({
				"border": "1px solid red",
 				"color": "red",
			});
		    var imgObj = {"img":event.currentTarget.id}; 
		    if(imgObj){
		    	if(checked.indexOf(imgObj) === -1) {
					checked.push(imgObj);
				}
		    }
		}
		$this.data("clicks", !clicks);
	},
	'click .photoDeleteBtn' : function(event){
		event.preventDefault();
		if(checked.length == 0){
			$(event.target).removeAttr('data-target');
		}else{
			$(event.target).attr('data-target',"#userModal");
		}
	},
	'click .userYes': function(event){
		event.preventDefault();
		var reviewObj = Review.find({"userId":Meteor.userId()}).fetch();
		if(reviewObj){
			for (var i = 0; i < reviewObj.length; i++) {
				var id = reviewObj[i]._id;
				Meteor.call('removeUserPhotos',id,checked,
					function(error,result){
						if(error){
							Bert.alert('There is some error while deleting images!','danger','growl-top-right');
						}
						else{
							$('.modal').css('display',"none");
							$('.modal-backdrop').hide();
							for(var i = 0; i<checked.length; i++){	
								UserReviewStoreS3New.remove(checked[i].img);
							}
							checked = [];
						}
					}
				);	
			}
		}
	},
	'click .likeIcn': function(event){
		var id = $(event.target).attr("id");
		var imgClass = ($(event.target).parent().attr("class")).split(' ');
		if(id){
			Meteor.call('insertUserImgLikes',id,imgClass[1],
				function(error,result){
					if(error){
						Bert.alert('Some error occured while liking this page!','danger','growl-top-right','fa-remove');
					}else{
						// Bert.alert('Thanks for Liking our business!','success','growl-top-right','fa-check');
					}
				}
			);
		}
	}
});

userPhotosForm = function () {  
  BlazeLayout.render("userLayout",{content: 'userPhotos'});
  // Blaze.render(Template.userLayout,document.body);
}
export { userPhotosForm }