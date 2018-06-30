import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';

export const Discount = new Mongo.Collection('discount');
export const Position = new Mongo.Collection('position');
export const AdsDiscount = new Mongo.Collection('adsdiscount');
export const AdsPosition = new Mongo.Collection('adsposition');

if (Meteor.isServer) {
  // This code only runs on the server
  
  Meteor.publish('discounts', function() {
    return Discount.find({});
  });

  Meteor.publish('position', function() {
    return Position.find({});
  });

  Meteor.publish('adsDiscount', function() {
    return AdsDiscount.find({});
  });

  Meteor.publish('adsPosition', function() {
    return AdsPosition.find({});
  });

}

Meteor.methods({
	// Banner Discount Methods
	'insertDiscount':function(rate,discount){
		var DiscountData = Discount.findOne({}, {sort: {date: -1}});

		var id = Discount.insert({  
			"price"		  : rate,
			"discount"	  : discount,
			"date"        : new Date()
			
		}, 
        
		function(error,result){
			if(error){
				console.log(error);
				return error;
			}
			if(result){
				return result;
			}
		});	
		return id;

			
	},

	'removeDiscount':function(id){
		Discount.remove({"_id": id});
	},

	'updateDiscount':function(id,rate,discount){
		Discount.update({'_id':id},
			{$set:{
				'price':rate,
				'discount':discount
				}
			}
		)
	},


	// Banner Position Methods
	'insertPosition':function(position,rate){
		var positionData = Position.findOne({}, {sort: {date: -1}});

		var id = Position.insert({  
			"position"	  : position,
			"rate"		  : rate,
			"date"        : new Date()			
		}, 
        
		function(error,result){
			if(error){
				console.log(error);
				return error;
			}
			if(result){
				return result;
			}
		});	
		return id;

			
	},

	'removePosition':function(id){
		Position.remove({"_id": id});
	},

	'updatePosition':function(id,position,rate){
		Position.update({'_id':id},
			{$set:{
				"position"	  : position,
			    "rate"		  : rate,
				}
			}
		)
	},

	// Ads Discount Methods
	'insertAdsDiscount':function(rate,discount){
		var DiscountData = AdsDiscount.findOne({}, {sort: {date: -1}});

		var id = AdsDiscount.insert({  
			"price"		  : rate,
			"discount"	  : discount,
			"date"        : new Date()
			
		}, 
        
		function(error,result){
			if(error){
				console.log(error);
				return error;
			}
			if(result){
				return result;
			}
		});	
		return id;

			
	},

	'removeAdsDiscount':function(id){
		AdsDiscount.remove({"_id": id});
	},

	'updateAdsDiscount':function(id,rate,discount){
		AdsDiscount.update({'_id':id},
			{$set:{
				'price':rate,
				'discount':discount
				}
			}
		)
	},


	// Ads Position Methods
	'insertAdsPosition':function(position,rate){
		var positionData = AdsPosition.findOne({}, {sort: {date: -1}});

		var id = AdsPosition.insert({  
			"position"	  : position,
			"rate"		  : rate,
			"date"        : new Date()			
		}, 
        
		function(error,result){
			if(error){
				console.log(error);
				return error;
			}
			if(result){
				return result;
			}
		});	
		return id;

			
	},

	'removeAdsPosition':function(id){
		AdsPosition.remove({"_id": id});
	},

	'updateAdsPosition':function(id,position,rate){
		AdsPosition.update({'_id':id},
			{$set:{
				"position"	  : position,
			    "rate"		  : rate,
				}
			}
		)
	},

	
	
});
