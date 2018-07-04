import { Session } from 'meteor/session';
import { UserLatLng } from '../../api/userViewMaster.js';
import { UserStatistics } from '../../api/userViewMaster.js';
import { Business } from '../../api/businessMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './vendorDashboard.html';
import './userViewGraph.html';
import './customerLeadsGraph.js';
import './customerLeadsGraph.html';
import '../vendor.js';

Template.vendorDashboard.onCreated(function() {
  chart = this.subscribe('allStatistics');
  chart1 = this.subscribe('chartBusiness');
});

Template.vendorDashboard.onRendered(function(){
	$(".twoYr").addClass('addYearClass');

    // // ---User two year Chart--- //
    Tracker.autorun(function () {
    	if (chart.ready()) {
	    	var date = new Date();
		    var first = new Date(date.getFullYear(), date.getMonth(), 1);
		    var twoYear  = date.setYear(date.getFullYear() + 2);
		    var last = new Date(date.getFullYear() , date.getMonth() + 1, 0);
		    var user = Meteor.userId();

	        var dateArray      = [];
	        var dataWithLabels = [];
	        var datavalues     = [];
	        var datalabels     = [];
	        var businessDetails = Business.find({'businessOwnerId':user}).fetch();
	        if(businessDetails){
	      		for(var k=0 ; k<businessDetails.length ; k++){
	      	  		var businessLink = businessDetails[k].businessLink;
		      		var statisticData  = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte:new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
		        	if(statisticData){
		          		for(var i= 0 ; i<statisticData.length ; i++){
		           			var date = statisticData[i].date;
		           			var splitdate      = date.split("/")
			       			var formattedMonth = moment(splitdate[2], 'YYYY').format('YYYY');
		           			dateArray.push({
		              			'date' : formattedMonth,
		           			});
		          		}//i
				        var createdDate        = _.pluck(dateArray,"date");
				        var uniquecreatedDate  = _.uniq(createdDate);

				        if(uniquecreatedDate.length>0){

				        	for(var j=0 ; j<uniquecreatedDate.length ; j++){ //number of instances of the date '23'
				          		var dateValue      = uniquecreatedDate[j];
				          		var totalCount = 0;
				          		for(l=0;l<statisticData.length;l++){ //number of instances of Orders
				            		var x = statisticData[l].date;
				            		var splitd = x.split("/")
				      	    		var formattedM = moment(splitd[2], 'YYYY').format('YYYY');
					            	if(dateValue == formattedM){
					            		totalCount += parseInt  (statisticData[l].count) ;
					            	}
				          		} //l

				          		datalabels.push(dateValue);
				          		datavalues.push(totalCount);
				          		dataWithLabels.push({'label':dateValue,'value':totalCount});
				        	}// j
				      	}// if uniquecreatedDate
			        }//if statisticData
			    }//k
	        }//businessDetails
	        drawchart1(datalabels,datavalues);
        }//if(chart.ready)
      }); //tracker.autorun
    // ---End User two year Chart--- //

    // // ---User Month Chart--- //
    Tracker.autorun(function () {
    	if (chart.ready()) {
	      	var date = new Date();
		  	var first = new Date(date.getFullYear(), date.getMonth(), 1);
		  	var last = new Date(date.getFullYear() , date.getMonth() + 1, 0);
	      	var dateArray      = [];
	      	var dataWithLabels = [];
	      	var datavalues     = [];
	      	var datalabels     = [];
	      	var user = Meteor.userId();
	      	var businessDetails = Business.find({'businessOwnerId':user}).fetch();
	      	if(businessDetails){
	      		for(var k=0 ; k<businessDetails.length ; k++){
	      			var businessLink = businessDetails[k].businessLink;
	      			var statisticData  = UserStatistics.find({'businessLink':businessLink , 'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
	        		if(statisticData){
	          			for(var i= 0 ; i<statisticData.length ; i++){
	           				var date = statisticData[i].date;
	           				dateArray.push({
	              				'date' : date,
	           				});
	          			}//i
		      			var createdDate        = _.pluck(dateArray,"date");
				      	var uniquecreatedDate  = _.uniq(createdDate);

		      			if(uniquecreatedDate.length>0){
		        			for(var j=0 ; j<uniquecreatedDate.length ; j++){ //number of instances of the date '23'
		          				var dateValue      = uniquecreatedDate[j];
		          				var totalCount = 0;
		          				for(l=0;l<statisticData.length;l++){ //number of instances of Orders
		            				var x = statisticData[l].date;
		            				if(dateValue == x){
		            					totalCount += parseInt  (statisticData[l].count) ;
		            				}
		          				} //l

		          				datalabels.push(dateValue);
		          				datavalues.push(totalCount);
		          				dataWithLabels.push({'label':dateValue,'value':totalCount});
		        			}// j
		      			}// if uniquecreatedDate
	        		}//if statisticData
	        	}//k
		    }//businessDetails
	        drawchart(datalabels,datavalues);
        }//if(chart.ready)
    }); //tracker.autorun
    // ---End User Month Chart--- //

    // // ---User year Chart--- //
    Tracker.autorun(function () {
      	if (chart.ready() && chart1.ready()) {
	      	var date  = new Date();
		  	var first = new Date(date.getFullYear(), 0, 1);
		  	var last  = new Date(date.getFullYear(), 11, 31);
	      	var dateArray      = [];
	      	var dataWithLabels = [];
	      	var datavalues     = [];
	      	var datalabels     = [];
	      	var user = Meteor.userId();
	      	var businessDetails = Business.find({'businessOwnerId':user}).fetch();
	      	if(businessDetails){
	      		for(var k=0 ; k<businessDetails.length ; k++){
		      		var businessLink = businessDetails[k].businessLink;
		      		var statisticData  = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
		        	if(statisticData){
			        	for(var i= 0 ; i<statisticData.length ; i++){
				        	var date = statisticData[i].date;
				        	var splitdate      = date.split("/")
					    	var formattedMonth = moment(splitdate[1], 'MM').format('MMMM');
				        	dateArray.push({
				            	'date' : formattedMonth,
				        	});
	          			}//i
		      			var createdDate        = _.pluck(dateArray,"date");
			        	var uniquecreatedDate  = _.uniq(createdDate);
		      			if(uniquecreatedDate.length>0){
	        
			        		for(var j=0 ; j<uniquecreatedDate.length ; j++){ //number of instances of the date '23'
			          			var dateValue      = uniquecreatedDate[j];
						        var totalCount = 0;
			          			for(l=0;l<statisticData.length;l++){ //number of instances of Orders
			            			var x = statisticData[l].date;
	                    			var splitd = x.split("/")
			      	    			var formattedM = moment(splitd[1], 'MM').format('MMMM');
			            			if(dateValue == formattedM){
			            				totalCount += parseInt  (statisticData[l].count) ;
			            			}
			          			} //l
			          			datalabels.push(dateValue);
			          			datavalues.push(totalCount);
			          			dataWithLabels.push({'label':dateValue,'value':totalCount});
			        		}// j
		      			}// if uniquecreatedDate
	        		}//if setatisticData
	        	}//k
	      	}//businessDetails
	      	drawchart2(datalabels,datavalues);
        }//if(chart.ready)
    }); //tracker.autorun
    // ---End User year Chart--- //

})

Template.vendorDashboard.events({
	'click .monthDate':function(event){
		event.preventDefault();
		$(".twoYr").removeClass('addYearClass');
		$(".monthChart").show();
		$(".custmonthChart").show();
		$(".yearChart").hide();
		$(".custyearChart").hide();
		$(".twoYearChart").hide();
		$(".custtwoYearChart").hide();
		Session.set('year', null);
		Session.set('twoYear', null);
		var date = new Date();
		var y    = date.getFullYear();
		var m    = date.getMonth();
		var firstDay = new Date(y, m, 1);
		var lastDay = new Date(y, m + 1, 0);

		firstDay = moment(firstDay).format("Do MMM YYYY");
		lastDay = moment(lastDay).format("Do MMM YYYY");
		var monthVar = firstDay +'-'+ lastDay;
		Session.set("month",monthVar);
	},

	'click .yearDate':function(event){
		event.preventDefault();
		$(".twoYr").removeClass('addYearClass');
		$(".yearChart").show();
		$(".custyearChart").show();
		$(".monthChart").hide();
		$(".custmonthChart").hide();
		$(".twoYearChart").hide();
		$(".custtwoYearChart").hide();
		Session.set('month', null);
		Session.set('twoYear', null);
		var now = new Date();
		var oneYr = new Date();
		oneYr.setYear(now.getFullYear() + 1);
		var currMonth = moment().format("MMMM YYYY");
		var nextMonth = moment(oneYr).format("MMMM YYYY");
		var yearVar   = currMonth +'-'+ nextMonth;
		Session.set("year",yearVar);
	},

	'click .twoYr':function(event){
		event.preventDefault();
		$(".twoYearChart").show();
		$(".custtwoYearChart").show();
		$(".yearChart").hide();
		$(".custyearChart").hide();
		$(".monthChart").hide();
		$(".custmonthChart").hide();
		Session.set('month', null);
		Session.set('year', null);
		var today = new Date();
		var nowD = new Date();
		nowD.setYear(today.getFullYear() + 2);
		var currentM   = moment().format("MMMM YYYY");
		var twoYrMonth = moment(nowD).format("MMMM YYYY");
		var TwoyearVar = currentM +'-'+ twoYrMonth;
		Session.set("twoYear",TwoyearVar);
	}
});

Template.vendorDashboard.helpers({
	'date':function(){
		var month    = Session.get("month");
		var year     = Session.get("year");
		var Twoyear  = Session.get("twoYear");
		if(month){
			return month;
		}else if(year){
			return year;
		}else if(Twoyear){
			return Twoyear;
		}else{
			var today = new Date();
			var nowD = new Date();
			nowD.setYear(today.getFullYear() + 2);
			var currentM   = moment().format("MMMM YYYY");
			var twoYrMonth = moment(nowD).format("MMMM YYYY");
			var TwoyearVar = currentM +'-'+ twoYrMonth;
			return TwoyearVar;
		}
	},
});



drawchart1 = function(datalabels,datavalues){
  var data = {
        labels: datalabels,
        datasets: [
            
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: datavalues
            }
        ]
    };
    var ctx = document.getElementById("twoYearChart").getContext("2d");
    var options = { };
    var lineChart = new Chart(ctx).Bar(data, options);

}

drawchart = function(datalabels,datavalues){
  var data = {
        labels: datalabels,
        datasets: [
            
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: datavalues
            }
        ]
    };
    var ctx = document.getElementById("monthChart").getContext("2d");
    var options = { };
    var lineChart = new Chart(ctx).Bar(data, options);

}


drawchart2 = function(datalabels,datavalues){
  var data = {
        labels: datalabels,
        datasets: [
            
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: datavalues
            }
        ]
    };
    var ctx = document.getElementById("yearChart").getContext("2d");
    var options = { };
    var lineChart = new Chart(ctx).Bar(data, options);

}


Template.userViewGraph.helpers({
	// 'customerActivity':function(){
	// 	var userId            = Meteor.userId();
	// 	var custActivityArray = [];
	// 	var businessData      = Business.findOne({'businessOwnerId':userId});
	// 	if(businessData){
	// 		var businessUrl = businessData.businessLink;
	// 		var userData    = UserLatLng.find({'businessLink':businessUrl}, {sort: {createdAt: -1}, limit: 10}).fetch();
	// 		if(userData){
	// 			for(var i=0 ; i<userData.length ; i++){
	// 				var city     = userData[i].city;
	// 				var date     = userData[i].createdAt;
	// 				var dateTime = moment(date).format('MMMM Do YYYY, h:mm:ss a');
	// 				custActivityArray.push({
	// 					'city' : city,
	// 					'date' : dateTime,
	// 				});
	// 			}//i
	// 		}//userData
	// 	}//businessData	
	// 	return custActivityArray;
	// }
	'customerActivity':function(){
		var userId            = Meteor.userId();
		var custActivityArray = [];
		var businessData      = Business.find({'businessOwnerId':userId}).fetch();
		if(businessData){
			for(j = 0 ; j < businessData.length; j++){
				var businessUrl = businessData[j].businessLink;
				var userData    = UserLatLng.find({'businessLink':businessUrl}, {sort: {createdAt: -1}, limit: 10}).fetch();
				if(userData){
					for(var i=0 ; i<userData.length ; i++){
						var city     = userData[i].city;
						var date     = userData[i].createdAt;
						var dateTime = moment(date).format('MMMM Do YYYY, h:mm:ss a');
						custActivityArray.push({
							'city' : city,
							'date' : dateTime,
						});
					}//i
				}//userData
			}//j
		}//businessData	
		return custActivityArray;
	}
});

Template.customerLeadsGraph.helpers({
	'dateVal':function(){
		var month    = Session.get("month");
		var year     = Session.get("year");
		var Twoyear  = Session.get("twoYear");
		if(month){
			return month;
		}else if(year){
			return year;
		}else if(Twoyear){
			return Twoyear;
		}else{
			var today = new Date();
			var nowD = new Date();
			nowD.setYear(today.getFullYear() + 2);
			var currentM   = moment().format("MMMM YYYY");
			var twoYrMonth = moment(nowD).format("MMMM YYYY");
			var TwoyearVar = currentM +'-'+ twoYrMonth;
			return TwoyearVar;
		}
	},

	'totalClicks':function(){
		
		var userId    = Meteor.userId();
		var dateArray = [];
		var businessData      = Business.findOne({'businessOwnerId':userId});
		if(businessData){
			var businessUrl   = businessData.businessLink;
			var statisticData = UserStatistics.find({'businessLink':businessUrl}).fetch();
			if(statisticData){
			  var totalCount = 0;
	          for(k=0;k<statisticData.length;k++){ //number of instances 
	            totalCount += parseInt  (statisticData[k].count) ;
	          } //k
			}//statisticData
		}//businessData
		return totalCount;
	},
});


vendorDashboardForm = function () {
  BlazeLayout.render("vendorLayout",{main: 'vendorDashboard'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { vendorDashboardForm };



