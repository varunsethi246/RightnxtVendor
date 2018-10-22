import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

export const ThumbnailVideo = new Mongo.Collection('thumbnailVideo');

if (Meteor.isServer) {
	
  // This code only runs on the server
  Meteor.publish('thumbnailVideo', function thumbnailVideo() {
    return ThumbnailVideo.find({});
  });
}


Meteor.methods({
	'createVideoThumbnail' : function(imgUrl,filePath){	
		ThumbnailVideo.insert({ 
		 	"posterImage"	: imgUrl,
			"fileObjId" 	: filePath,
		}, function(error,result){
			if(error){
				// console.log(error);
				return error;
			}
			if(result){
				return result;
			}
		});		
	},
	'removeThumbnail':function(imgId){
	    ThumbnailVideo.remove({'fileObjId':imgId});
	},
});