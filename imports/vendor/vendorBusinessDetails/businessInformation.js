import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '/imports/api/businessMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.registerHelper('or',(a,b)=>{
  return a || b;
});

Template.registerHelper('and',(a,b)=>{
  return a && b;
});

Template.registerHelper('not',(a,b)=>{
  return !a;
});

Template.businessInformation.helpers({
	statusMenu(businessMenu){
		if(businessMenu && businessMenu.length>0){
			if(businessMenu[0].menu){
				return true;
			}else{
				return false;
			}
		}else{
			return false
		}
	},
	statusImg(businessImages){
		if(businessImages.length>0){
			if(businessImages[0].img){
				return true;
			}else{
				return false;
			}
		}else{
			return false
		}
	},
});

Template.businessInformation.events({
	'click .photoPicTab':function(event){
		var currentId = event.currentTarget.id; 
		Session.set('ModalimageID',currentId);
		// $('#bigImageCarousel').modal('show');
	},

	'click .menuPicTab':function(event){
		var currentId = event.currentTarget.id; 
		Session.set('ModalimageID',currentId);
		// $('#bigImageCarousel').modal('show');
	},
	
	'click .od-read-more': function(event){
		$('.ownerDesc2').show();
		$('.od-read-less').show();
		$('.od-read-more').hide();
	},

	'click .od-read-less': function(event){
		$('.ownerDesc2').hide();
		$('.od-read-less').hide();
		$('.od-read-more').show();
	},

	'click .busAbutod-read-more':function(event){
		$('.aboutOwnerDesc2').show();
		$('.busAbutod-read-less').show();
		$('.busAbutod-read-more').hide();

	},

	'click .busAbutod-read-less': function(event){
		$('.aboutOwnerDesc2').hide();
		$('.busAbutod-read-less').hide();
		$('.busAbutod-read-more').show();
	},

	'click .closeMenu' : function(event){
		event.preventDefault();
		$('.closeMenu').css("display","none");
		$('#photosBusi').children().next().removeClass('businessRepeat');
		$('.picMoreImage:eq(5)').show();
		$('.photoPicTab').addClass('hideOffer');
		$('.photoPicTab:eq(0)').removeClass('hideOffer');
		$('.photoPicTab:eq(1)').removeClass('hideOffer');
		$('.photoPicTab:eq(2)').removeClass('hideOffer');
		$('.photoPicTab:eq(3)').removeClass('hideOffer');
		$('.photoPicTab:eq(4)').removeClass('hideOffer');
		$('.photoPicTab:eq(5)').removeClass('hideOffer');
		$('.photoPicTab').children().children().addClass('uploadPicSize');
		$('.photoPicTab').children().children().removeClass('businessPicSize');
		$('.photoPicTab').removeClass('col-lg-3');
		$('.photoPicTab').addClass('col-lg-2');
		$('.photoPicTab').removeClass('col-md-4');
		$('.photoPicTab').addClass('col-md-2');
		$('.photoPicTab').removeClass('col-xs-4');
		$('.photoPicTab').addClass('col-xs-2');
		$('.photoPicTab').removeClass('col-sm-3');
		$('.photoPicTab').addClass('col-sm-2');
	},
	'click .closePhotoMenu' : function(event){
		event.preventDefault();
		$('.closePhotoMenu').css("display","none");
		$('#menuBuss').children().next().removeClass('businessRepeat');
		$('.menuMoreImage:eq(5)').show();
		$('.menuPicTab').addClass('hideOffer');
		$('.menuPicTab:eq(0)').removeClass('hideOffer');
		$('.menuPicTab:eq(1)').removeClass('hideOffer');
		$('.menuPicTab:eq(2)').removeClass('hideOffer');
		$('.menuPicTab:eq(3)').removeClass('hideOffer');
		$('.menuPicTab:eq(4)').removeClass('hideOffer');
		$('.menuPicTab:eq(5)').removeClass('hideOffer');
		$('.menuPicTab').children().children().addClass('uploadPicSize');
		$('.menuPicTab').children().children().removeClass('businessPicSize');
		$('.menuPicTab').removeClass('col-lg-3');
		$('.menuPicTab').addClass('col-lg-2');
		$('.menuPicTab').removeClass('col-md-4');
		$('.menuPicTab').addClass('col-md-2');
		$('.menuPicTab').removeClass('col-xs-4');
		$('.menuPicTab').addClass('col-xs-2');
		$('.menuPicTab').removeClass('col-sm-3');
		$('.menuPicTab').addClass('col-sm-2');
	},
	'click .picMoreImage' : function(event){
		event.preventDefault();
		$('.photoPicTab').removeClass('col-lg-2');
		$('.photoPicTab').addClass('col-lg-3');
		$('.photoPicTab').removeClass('col-md-2');
		$('.photoPicTab').addClass('col-md-4');
		$('.photoPicTab').removeClass('col-xs-2');
		$('.photoPicTab').addClass('col-xs-4');
		$('.photoPicTab').removeClass('col-sm-2');
		$('.photoPicTab').addClass('col-sm-3');
		$('.photoPicTab').find('.uploadPicSize').removeClass('uploadPicSize');
		$('.photoPicTab').children().children().addClass('businessPicSize');
		$('#photosBusi').children().next().addClass('businessRepeat');
		$('.closeMenu').css("display","block");
		$('.picMoreImage:eq(5)').hide();
		$('.photoPicTab').removeClass('hideOffer');
		// $('#bigImageCarousel').modal('hide');
	},
	'click .menuMoreImage' : function(event){
		event.preventDefault();
		$('.menuPicTab').removeClass('col-lg-2');
		$('.menuPicTab').addClass('col-lg-3');
		$('.menuPicTab').removeClass('col-md-2');
		$('.menuPicTab').addClass('col-md-4');
		$('.menuPicTab').removeClass('col-xs-2');
		$('.menuPicTab').addClass('col-xs-4');
		$('.menuPicTab').removeClass('col-sm-2');
		$('.menuPicTab').addClass('col-sm-3');
		$('.menuPicTab').find('.uploadPicSize').removeClass('uploadPicSize');
		$('.menuPicTab').children().children().addClass('businessPicSize');
		$('#menuBuss').children().next().addClass('businessRepeat');
		$('.closePhotoMenu').css("display","block");
		$('.menuMoreImage:eq(5)').hide();
		$('.menuPicTab').removeClass('hideOffer');
		// $('#bigImageCarousel').modal('hide');
	},
	'click .photosInfoBuss' : function(event){
		event.preventDefault();
		$('#menuBuss').children().next().removeClass('businessRepeat');
		$('.menuMoreImage:eq(5)').show();
		$('.menuPicTab').addClass('hideOffer');
		$('.menuPicTab:eq(0)').removeClass('hideOffer');
		$('.menuPicTab:eq(1)').removeClass('hideOffer');
		$('.menuPicTab:eq(2)').removeClass('hideOffer');
		$('.menuPicTab:eq(3)').removeClass('hideOffer');
		$('.menuPicTab:eq(4)').removeClass('hideOffer');
		$('.menuPicTab:eq(5)').removeClass('hideOffer');
		$('.tabGallry').css('margin-bottom','15px');

		$('.businessHeight').css("display","none");
		$('.closePhotoMenu').css("display","none");
		$('.businessPhotos').css("display","block");
		$('.photoPicTab').removeClass('col-lg-3');
		$('.photoPicTab').addClass('col-lg-2');
		$('.photoPicTab').removeClass('col-md-4');
		$('.photoPicTab').addClass('col-md-2');
		$('.photoPicTab').removeClass('col-xs-4');
		$('.photoPicTab').addClass('col-xs-2');
		$('.photoPicTab').removeClass('col-sm-3');
		$('.photoPicTab').addClass('col-sm-2');
		$('.photoPicTab').children().children().addClass('uploadPicSize');
		$('.photoPicTab').children().children().removeClass('businessPicSize');
	},
	'click .menuActive' : function(event){
		event.preventDefault();
		$('.businessHeight').css("display","none");
		$('.closeMenu').css("display","none");
		$('.menuPhotos').css("display","block");
		$('.menuPicTab').removeClass('col-lg-3');
		$('.menuPicTab').addClass('col-lg-2');
		$('.menuPicTab').removeClass('col-md-4');
		$('.menuPicTab').addClass('col-md-2');
		$('.menuPicTab').removeClass('col-xs-4');
		$('.menuPicTab').addClass('col-xs-2');
		$('.menuPicTab').removeClass('col-sm-3');
		$('.menuPicTab').addClass('col-sm-2');
		$('.menuPicTab').children().children().addClass('uploadPicSize');
		$('.menuPicTab').children().children().removeClass('businessPicSize');

		$('#photosBusi').children().next().removeClass('businessRepeat');
		$('.picMoreImage:eq(5)').show();
		$('.photoPicTab').addClass('hideOffer');
		$('.photoPicTab:eq(0)').removeClass('hideOffer');
		$('.photoPicTab:eq(1)').removeClass('hideOffer');
		$('.photoPicTab:eq(2)').removeClass('hideOffer');
		$('.photoPicTab:eq(3)').removeClass('hideOffer');
		$('.photoPicTab:eq(4)').removeClass('hideOffer');
		$('.photoPicTab:eq(5)').removeClass('hideOffer');
		$('.tabGallry').css('margin-bottom','15px');
	},

});