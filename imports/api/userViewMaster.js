import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { moment } from "meteor/momentjs:moment";

export const UserStatistics = new Mongo.Collection('userStatistics');
export const UserLatLng = new Mongo.Collection('userLatLng');

if (Meteor.isServer) {
  // This code only runs on the server
  
  Meteor.publish('allStatistics', function() {
    return UserStatistics.find({});
  });

  Meteor.publish('allLatLng', function() {
    return UserLatLng.find({});
  });

}

Meteor.methods({
	'insertUserStatistics':function(date,count,businessLink){
		var now = moment();
		var today = moment(now).format('DD/MM/YYYY');

		var userStatisticData = UserStatistics.findOne({'businessLink':businessLink , 'date': today});
        if(userStatisticData){
        	var countVar = userStatisticData.count;
        	count = countVar+1;
        	var id = userStatisticData._id;
        	UserStatistics.update(
        		{"_id": id},
				{$set : 
					{ 'businessLink': businessLink,
		              'count'       : count,
		              'date'        : today,
                  'createdAt'   : new Date()
		          	}
				}
			)
        }else{
           UserStatistics.insert({
              'businessLink': businessLink,
              'count'       : count,
              'date'        : today,
              'createdAt'   : new Date()
              
          });
        }
           
			
	},

  'insertUserCity':function(lat,lng,city,businessLink){
    var now = moment();
    var date = moment(now).format('DD/MM/YYYY');
    var userCityData = UserLatLng.findOne({'businessLink':businessLink , 'lat':lat , 'lng':lng , 'date':date},{sort: {userCityId: -1}});

    if(userCityData){
      userCityId = userCityData.userCityId + 1;
    }else{
      userCityId = 1;
    }

    if(!userCityData){

      UserLatLng.insert({
        'userCityId'   : userCityId,
        'businessLink' : businessLink,
        'lat'          : lat,
        'lng'          : lng,
        'city'         : city,
        'date'         : date,
        'createdAt'    : new Date()
      });
    }
  }

	
});
