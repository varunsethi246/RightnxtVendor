import { Session } from 'meteor/session';
import { UserLatLng } from '../../api/userViewMaster.js';
import { UserStatistics } from '../../api/userViewMaster.js';
import { Business } from '../../api/businessMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Chart from 'chart.js';
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
    		$("#twoYearChart").empty();
	    	var date = new Date();
		    var first = new Date(date.getFullYear()-1, 0, 1);
		    var last = new Date(date.getFullYear() , 12, 0);
		    var user = Meteor.userId();

	        var dateArray     = [];
	        var colorval1     = 0;
	        var colorval2     = 0;
	        var businessDetails = Business.find({'businessOwnerId':user,'status':'active'}).fetch();
	        if(businessDetails){
	      		for(var k=0 ; k<businessDetails.length ; k++){
	      	  		var businessLink = businessDetails[k].businessLink;
	      	  		var businessName = businessDetails[k].businessTitle;
		      		var statisticData  = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte:new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();

		      		if(colorval1 >= 255){
			           	colorval2 += 50;
			           	var finalColorVal = "rgba(255,0,"+colorval2+",0.8)";
		           	}else{
		           		colorval1 += 50;
			           	var finalColorVal = "rgba(255,"+colorval1+",0,0.8)";
		           	}

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
		          			var dataVals   = [];
		        			for(var j=0 ; j<uniquecreatedDate.length ; j++){ //number of instances of the date '23'
		        				var y = uniquecreatedDate[j];
		        				var statFirstDate = new Date(y, 0, 1);  
		        				var statLastDate = new Date(y, 12, 0);
		          				var monthStat = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
		          				if(monthStat.length > 0){
						    		var totalCount = 0;
		          					for (var l = 0; l < monthStat.length; l++) {
										totalCount += parseInt(monthStat[l].count) ;
		          					}
		          				}
		          				dataVals.push(totalCount);
		        			}// j
		      			}// if uniquecreatedDate

						$("#twoYearChart").append(
			        		"<div class='noPaddingGeneral col-lg-6 col-md-6 col-sm-12 col-xs-12'><canvas id='"+businessLink+"-yearly' style='max-height: 100%;'></canvas></div>"
			        	);

				      	var ctx = document.getElementById(businessLink+"-yearly").getContext("2d");
					    var myChart = new Chart(ctx, {
						  type: 'bar',
						  data: {
						    labels: uniquecreatedDate,
						    datasets: [{
						      label: businessName,
						      data: dataVals,
						      backgroundColor: finalColorVal,
						      borderWidth: 1
						    }]
					   	  },
						    options: {
						        scales: {
						            yAxes: [{
						                ticks: {
						                    beginAtZero:true
						                }
						            }]
						        }
						    }
						});
			        }//if statisticData
			    }//k
	        }//businessDetails
        }//if(chart.ready)
      }); //tracker.autorun
    // ---End User two year Chart--- //

    // // ---User Month Chart--- //
    Tracker.autorun(function () {
    	if (chart.ready()) {
    		$("#monthChart").empty();
	      	var date = new Date();
		  	var first = new Date(date.getFullYear(), date.getMonth(), 1);
		  	var last = new Date(date.getFullYear() , date.getMonth() + 1, 0);
	      	var dateArray      = [];
			var colorval1      = 0;
			var colorval2      = 0;
	      	var user = Meteor.userId();
	      	var businessDetails = Business.find({'businessOwnerId':user,'status':'active'}).fetch();
	      	if(businessDetails){
	      		for(var k=0 ; k<businessDetails.length ; k++){
	      			var businessName = businessDetails[k].businessTitle;
	      			var businessLink = businessDetails[k].businessLink;
	      			var statisticData  = UserStatistics.find({'businessLink':businessLink , 'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
		           	
		           	if(colorval1 >= 255){
			           	colorval2 += 50;
			           	var finalColorVal = "rgba(255,0,"+colorval2+",0.8)";
		           	}else{
		           		colorval1 += 50;
			           	var finalColorVal = "rgba(255,"+colorval1+",0,0.8)";
		           	}

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
	      					var dataVals 	   = [];
		        			for(var j=0 ; j<uniquecreatedDate.length ; j++){ //number of instances of the date '23'
		          				var totalCount = UserStatistics.findOne({'businessLink':businessLink , 'date':uniquecreatedDate[j]});
		          				if(totalCount){
		          					dataVals.push(totalCount.count);
		          				}else{
		          					dataVals.push(0);
		          				}
		        			}// j
		      			}// if uniquecreatedDate
		      			if(uniquecreatedDate.length < 7){
							$("#monthChart").append(
				        		"<div class='noPaddingGeneral col-lg-6 col-md-6 col-sm-12 col-xs-12'><canvas id='"+businessLink+"-daily' style='max-height: 100%;'></canvas></div>"
				        	);
		      			}else{
							$("#monthChart").append(
				        		"<div class='noPaddingGeneral col-lg-12 col-md-12 col-sm-12 col-xs-12'><canvas id='"+businessLink+"-daily' style='max-height: 100%;'></canvas></div>"
				        	);
		      			}

				      	var ctx = document.getElementById(businessLink+"-daily").getContext("2d");
					    var myChart = new Chart(ctx, {
						  type: 'bar',
						  data: {
						    labels: uniquecreatedDate,
						    datasets: [{
						      label: businessName,
						      data: dataVals,
						      backgroundColor: finalColorVal,
						      borderWidth: 1
						    }]
					   	  },
						    options: {
						        scales: {
						            yAxes: [{
						                ticks: {
						                    beginAtZero:true
						                }
						            }]
						        }
						    }
						});
	        		}//if statisticData
	        	}//k
		    }//businessDetails
        }//if(chart.ready)
    }); //tracker.autorun
    // ---End User Month Chart--- //

    // // ---User year Chart--- //
    Tracker.autorun(function () {
      	if (chart.ready() && chart1.ready()) {
    		$("#yearChart").empty();
	      	var date  = new Date();
		  	var first = new Date(date.getFullYear(), 0, 1);
		  	var last  = new Date(date.getFullYear(), 11, 31);
	      	var monthArray      = [];
	      	var colorval1      = 0;
			var colorval2      = 0;
	      	var user = Meteor.userId();
	      	var businessDetails = Business.find({'businessOwnerId':user,'status':'active'}).fetch();
	      	if(businessDetails){
	      		for(var k=0 ; k<businessDetails.length ; k++){
		      		var businessLink = businessDetails[k].businessLink;
		      		var businessName = businessDetails[k].businessTitle;
		      		var statisticData  = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();

		      		if(colorval1 >= 255){
			           	colorval2 += 50;
			           	var finalColorVal = "rgba(255,0,"+colorval2+",0.8)";
		           	}else{
		           		colorval1 += 50;
			           	var finalColorVal = "rgba(255,"+colorval1+",0,0.8)";
		           	}

		        	if(statisticData){
			        	for(var i= 0 ; i<statisticData.length ; i++){
				        	var date = statisticData[i].date;
				        	var splitdate      = date.split("/");
					    	var formattedMonth = moment(splitdate[1], 'MM').format('MMMM');
				        	monthArray.push({
				            	'month' : formattedMonth,
				        	});
	          			}//i

			        	var createdMonth        = _.pluck(monthArray,"month");
			        	var uniquecreatedMonth  = _.uniq(createdMonth);

		      			if(uniquecreatedMonth.length>0){
						    var y = new Date().getFullYear();
		          			var dataVals   = [];
		        			for(var j=0 ; j<uniquecreatedMonth.length ; j++){ //number of instances of the date '23'
		        				var m = moment().month(uniquecreatedMonth[j]).format("M");
		        				var statFirstDate = new Date(y, m-1, 1);  
		        				var statLastDate = new Date(y, m, 0);
		          				var monthStat = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
		          				if(monthStat.length > 0){
						    		var totalCount = 0;
		          					for (var l = 0; l < monthStat.length; l++) {
										totalCount += parseInt(monthStat[l].count) ;
		          					}
		          				}
		          				dataVals.push(totalCount);
		        			}// j
		      			}// if uniquecreatedDate

		      			if(uniquecreatedMonth.length < 7){
							$("#yearChart").append(
				        		"<div class='noPaddingGeneral col-lg-6 col-md-6 col-sm-12 col-xs-12'><canvas id='"+businessLink+"-monthly' style='max-height: 100%;'></canvas></div>"
				        	);
		      			}else{
							$("#yearChart").append(
				        		"<div class='noPaddingGeneral col-lg-12 col-md-12 col-sm-12 col-xs-12'><canvas id='"+businessLink+"-monthly' style='max-height: 100%;'></canvas></div>"
				        	);
		      			}

				      	var ctx = document.getElementById(businessLink+"-monthly").getContext("2d");
					    var myChart = new Chart(ctx, {
						  type: 'bar',
						  data: {
						    labels: uniquecreatedMonth,
						    datasets: [{
						      label: businessName,
						      data: dataVals,
						      backgroundColor: finalColorVal,
						      borderWidth: 1
						    }]
					   	  },
						    options: {
						        scales: {
						            yAxes: [{
						                ticks: {
						                    beginAtZero:true
						                }
						            }]
						        }
						    }
						});
	        		}//if setatisticData
	        	}//k
	      	}//businessDetails
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

		firstDay = moment(firstDay).format("Do MMMM YYYY");
		lastDay = moment(lastDay).format("Do MMMM YYYY");
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
		var firstDate = new Date(now.getFullYear(), 0, 1);
		var lastDate = new Date(now.getFullYear(), 12, 0);
		var currMonth = moment(firstDate).format("MMMM YYYY");
		var nextMonth = moment(lastDate).format("MMMM YYYY");
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
		var firstDate = new Date(today.getFullYear()-1, 0, 1);
		var lastDate = new Date(today.getFullYear(), 12, 0);
		var currentM   = moment(firstDate).format("MMMM YYYY");
		var twoYrMonth = moment(lastDate).format("MMMM YYYY");
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
			var firstDate = new Date(today.getFullYear()-1, 0, 1);
			var lastDate = new Date(today.getFullYear(), 12, 0);
			var currentM   = moment(firstDate).format("MMMM YYYY");
			var twoYrMonth = moment(lastDate).format("MMMM YYYY");
			var TwoyearVar = currentM +'-'+ twoYrMonth;
			return TwoyearVar;
		}
	},
});

Template.userViewGraph.helpers({
	'customerActivity':function(){
		var userId            = Meteor.userId();
		var custActivityArray = [];
		var businessData      = Business.find({'businessOwnerId':userId,'status':'active'}).fetch();
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
			var firstDate = new Date(today.getFullYear()-1, 0, 1);
			var lastDate = new Date(today.getFullYear(), 12, 0);
			var currentM   = moment(firstDate).format("MMMM YYYY");
			var twoYrMonth = moment(lastDate).format("MMMM YYYY");
			var TwoyearVar = currentM +'-'+ twoYrMonth;
			return TwoyearVar;
		}
	},

	'totalClicks':function(){
		var month    = Session.get("month");
		var year     = Session.get("year");
		var Twoyear  = Session.get("twoYear");	
		var userId    = Meteor.userId();
		var totalCount = 0;
		var businessData      = Business.find({'businessOwnerId':userId,'status':'active'}).fetch();
		if(businessData){
			for (var i = 0; i < businessData.length; i++) {
				var businessUrl   = businessData[i].businessLink;
				if(month){
					var splitDate = month.split(' ');
					var y = splitDate[4];
		        	var m = moment().month(splitDate[1]).format("M");
					var first = new Date(y, m-1, 1);
					var last = new Date(y, m, 0);
					var statisticData  = UserStatistics.find({'businessLink':businessUrl, 'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
				}else if(year){
					var splitDate1 = year.split('-')[0].split(' ')[0];
					var splitDate2 = year.split('-')[1].split(' ')[0];
					var y = year.split(' ')[2];
		        	var m1 = moment().month(splitDate1).format("M");
		        	var m2 = moment().month(splitDate2).format("M");
					var first = new Date(y, m1-1, 1);
					var last = new Date(y, m2, 0);
					var statisticData  = UserStatistics.find({'businessLink':businessUrl, 'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
				}else{
					var y = moment().year();
					var first = new Date(y-1, 0, 1);
					var last = new Date(y, 12, 0);
					var statisticData = UserStatistics.find({'businessLink':businessUrl, 'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
				}
				if(statisticData){
		          for(k=0;k<statisticData.length;k++){ //number of instances 
		            totalCount += parseInt(statisticData[k].count) ;
		          } //k
				}else{
					totalCount = 0;
				}//statisticData
			}
		}//businessData
		return totalCount;
	},
});


vendorDashboardForm = function () {
  BlazeLayout.render("vendorLayout",{main: 'vendorDashboard'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { vendorDashboardForm };