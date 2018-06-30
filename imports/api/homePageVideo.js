import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

export const HomeBannerVideo = new Mongo.Collection('homeBannerVideo');

if (Meteor.isServer) {
	
  // This code only runs on the server
  Meteor.publish('homeBannerVideo', function vendorBusiness() {
    return HomeBannerVideo.find({});
  });
}


Meteor.methods({
	'updateBannerVideo' : function(bannerLink){	
			HomeBannerVideo.update(
				{"homeBanner": "homeBanner"},
				{$set: { 
						"bannerLink" 		: bannerLink,
						}
				}, 	
				{ upsert: true },
				function(error,result){
					if(error){
						// console.log(error);
						return error;
					}
				}
			);
	},
});