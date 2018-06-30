import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const NotificationTemplate = new Mongo.Collection('notificationTemplate');

if(Meteor.isServer){

	Meteor.startup(() => {
		NotificationTemplate._ensureIndex({ "templateCategory": 1});
	});
	
	Meteor.publish('notificationTemplate',function(){
		this.unblock();
	    return NotificationTemplate.find({});
	});
	
} 

Meteor.methods({
	'insertNewTemplate':function(templateType,templateName,subject,emailContent){
		
		NotificationTemplate.insert({			

			'templateType'  : templateType,	
			'templateName'  : templateName,
			'subject'       : subject,
			'content'       : emailContent,	
			'createdAt'     : new Date(),
		});
	},

	'updateTemplate':function(id,templateName,emailContent){
		NotificationTemplate.update(
			{ '_id': id },
	        {
	          $set:{
	              "templateName"   : templateName,
	              "content"        : emailContent,
	        } //End of set
	      }
		)
	},

	'updateNewTemplate':function(id,templateName,subject,emailContent){
		NotificationTemplate.update(
			{ '_id': id },
	        {
	          $set:{
	              "templateName"   : templateName,
	              "subject"        : subject,
	              "content"        : emailContent,
	        } //End of set
	      }
		)
	},

	'insertTemplate':function(templateType,templateName,emailContent){
		
		NotificationTemplate.insert({			

			'templateType'  : templateType,	
			'templateName'  : templateName,
			'content'       : emailContent,	
			'createdAt'     : new Date(),
		});
	},

	'removeTemplate':function(id){
 		 NotificationTemplate.remove({'_id': id});
  
	},
	
	
});
