import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { moment } from "meteor/momentjs:moment";

export const MapViewStats = new Mongo.Collection('mapViewStatistics');
export const CallStatistics = new Mongo.Collection('callStatistics');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('allMapViewStatistics', function() {
    return MapViewStats.find({});
  });
  Meteor.publish('allCallStatistics', function() {
    return CallStatistics.find({});
  });
}

Meteor.methods({
	'insertMapViewStats':function(date,count,businessLink){
		var now = moment();
		var today = moment(now).format('DD/MM/YYYY');
		var userStatisticData = MapViewStats.findOne({'businessLink':businessLink , 'date': today});
    if(userStatisticData){
    	var countVar = userStatisticData.count;
    	count = countVar+1;
    	var id = userStatisticData._id;
    	MapViewStats.update(
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
       MapViewStats.insert({
          'businessLink': businessLink,
          'count'       : count,
          'date'        : today,
          'createdAt'   : new Date()
          
      });
    }        
	},
  'insertCallStatistics':function(date,count,businessLink){
    var now = moment();
    var today = moment(now).format('DD/MM/YYYY');
    var userStatisticData = CallStatistics.findOne({'businessLink':businessLink , 'date': today});
    if(userStatisticData){
      var countVar = userStatisticData.count;
      count = countVar+1;
      var id = userStatisticData._id;
      CallStatistics.update(
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
       CallStatistics.insert({
          'businessLink': businessLink,
          'count'       : count,
          'date'        : today,
          'createdAt'   : new Date()
          
      });
    }        
  }
});