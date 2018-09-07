import './customerLeadsGraph.html';

import { Session } from 'meteor/session';
import { UserLatLng } from '../../api/userViewMaster.js';
import { UserStatistics } from '../../api/userViewMaster.js';
import { Business } from '../../api/businessMaster.js';
import { Review } from '../../api/reviewMaster.js';
import { Bookmark } from '../../api/bookmarkMaster.js';
import { BeenThere } from '../../api/beenThereMaster.js';
import { Likes } from '../../api/likesMaster.js';
import { SavedOffer } from '../../api/savedOffersMaster.js';
import { MapViewStats } from '../../api/mapViewMaster.js';
import { CallStatistics } from '../../api/mapViewMaster.js';
import Chart from 'chart.js';

Template.customerLeadsGraph.onCreated(function() {
  chart1 = this.subscribe('allBookmark');
  chart2 = this.subscribe('allreviews');
  chart3 = this.subscribe('allStatistics');
});

Template.customerLeadsGraph.onRendered(function(){

    // ---customer 24month Chart--- //
    Tracker.autorun(function () {
      	if (chart1.ready() && chart2.ready() && chart3.ready()) {
	      	$('#custtwoYearChart').empty();
	      	var businessUrl = Session.get('busLink');
	      	var date = new Date();
		  	var dateArray      = [];
			var datasetsArray  = [];
			var dataArray      = [];
	      	var bgcolorArray   = [];
		    var uniquecreatedDate = [date.getFullYear()-1,date.getFullYear()];
	          		
        	for(var j=0 ; j<uniquecreatedDate.length ; j++){ //number of instances of the date '23'
		        var totalCount = 0;
				var y = uniquecreatedDate[j];
				var statFirstDate = new Date(y, 0, 1);  
				var statLastDate = new Date(y, 12, 0);
          		
          		var bookmarkData  = Bookmark.find({'businessLink':businessUrl,'businessStatus':'active','createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(bookmarkData){
      				for(var k=0;k<bookmarkData.length;k++){ //number of instances of Orders
        				totalCount ++ ;
      				} //k
				}//bookmarkData

				var beenThereData  = BeenThere.find({'businessLink':businessUrl,'businessStatus':'active','createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(beenThereData){
      				for(var k=0;k<beenThereData.length;k++){ //number of instances of Orders
        				totalCount ++ ;
      				} //k
				}//beenThereData

				var likesData  = Likes.find({'businessLink':businessUrl,'businessStatus':'active', 'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(likesData){
      				for(var k=0;k<likesData.length;k++){ //number of instances of Orders
        				totalCount ++ ;
      				} //k
				}//likesData

				var savedOfferData  = SavedOffer.find({'businessLink':businessUrl,'businessStatus':'active', 'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(savedOfferData){
      				for(var k=0;k<savedOfferData.length;k++){ //number of instances of Orders
        				totalCount ++ ;
      				} //k
				}//likesData

          		var statisticData = UserStatistics.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(statisticData){
      				for(var m=0;m<statisticData.length;m++){ //number of instances 
   						totalCount += parseInt(statisticData[m].count);
      				} //m
            	}//statisticData

            	var mapStatisticData = MapViewStats.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(mapStatisticData){
      				for(var m=0;m<mapStatisticData.length;m++){ //number of instances 
   						totalCount += parseInt(mapStatisticData[m].count);
      				} //m
            	}//mapStatisticData

            	var mobileStatisticData = CallStatistics.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(mobileStatisticData){
      				for(var m=0;m<mobileStatisticData.length;m++){ //number of instances 
   						totalCount += parseInt(mobileStatisticData[m].count);
      				} //m
            	}//mobileStatisticData

				var reviewData = Review.find({'businessLink':businessUrl,'businessStatus':'active' , 'reviewDate': {$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(reviewData){
					for(var l=0 ; l<reviewData.length ; l++){
						if(reviewData[l].reviewImages){
							var reviewLength = reviewData[l].reviewImages.length;
							if(reviewLength > 0){
								totalCount ++;
							}//reviewLength > 0
						}//reviewImages
					}//l
		       	}//reviewData
				
				if(bookmarkData.length>0 || statisticData.length>0 || reviewData.length>0 ||
					beenThereData.length>0 || likesData.length>0 || savedOfferData.length>0 ||
					mapStatisticData.length>0 || mobileStatisticData.length>0){
					$('.legendCustVws').show();
					dateArray.push(uniquecreatedDate[j]);
					dataArray.push(totalCount);
					bgcolorArray.push("rgba(54, 162, 235, 0.8)");
				}
        	}// j

        	datasetsArray.push({
		      // label: 'User Views',
		      data: dataArray,
		      backgroundColor: bgcolorArray,
		      borderWidth: 1
		    });

			$("#custtwoYearChart").append(
        		"<div class='noPaddingGeneral col-lg-10 col-md-10 col-sm-12 col-xs-12'><canvas id='"+businessUrl+"-custyearly' style='max-height: 100%;'></canvas></div>"
        	);

	      	var ctx = document.getElementById(businessUrl+"-custyearly").getContext("2d");
		    var myChart = new Chart(ctx, {
			  type: 'bar',
			  data: {
			    labels: dateArray,
			    datasets: datasetsArray
		   	  },
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }]
			        },
			        legend: {
			            display: false,
			        }
			    }
			});
        }//if(chart1.ready)
    }); //tracker.autorun
    // ---End customer 24months Chart--- //

    // ---customer year Chart--- //
    Tracker.autorun(function () {
      	if (chart1.ready() && chart2.ready() && chart3.ready()) {
    		$("#custyearChart").empty();
    		var businessUrl = Session.get('busLink');
		  	var dateArray      = [];
			var datasetsArray  = [];
			var dataArray      = [];
	      	var bgcolorArray   = [];
		    
		    for (var i = 0; i < 12; i++) {
		        var totalCount = 0;
				var date  = new Date();
			  	var statFirstDate = new Date(date.getFullYear(), i, 1);
			  	var statLastDate  = new Date(date.getFullYear(), i, 31);    			
		      	
		      	var bookmarkData  = Bookmark.find({'businessLink':businessUrl,'businessStatus':'active','createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(bookmarkData){
      				for(var k=0;k<bookmarkData.length;k++){ //number of instances of Orders
        				totalCount ++ ;
      				} //k
				}//bookmarkData

				var beenThereData  = BeenThere.find({'businessLink':businessUrl,'businessStatus':'active','createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(beenThereData){
      				for(var k=0;k<beenThereData.length;k++){ //number of instances of Orders
        				totalCount ++ ;
      				} //k
				}//beenThereData

				var likesData  = Likes.find({'businessLink':businessUrl,'businessStatus':'active', 'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(likesData){
      				for(var k=0;k<likesData.length;k++){ //number of instances of Orders
        				totalCount ++ ;
      				} //k
				}//likesData

				var savedOfferData  = SavedOffer.find({'businessLink':businessUrl,'businessStatus':'active', 'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(savedOfferData){
      				for(var k=0;k<savedOfferData.length;k++){ //number of instances of Orders
        				totalCount ++ ;
      				} //k
				}//likesData

          		var statisticData = UserStatistics.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(statisticData){
      				for(var m=0;m<statisticData.length;m++){ //number of instances 
   						totalCount += parseInt(statisticData[m].count);
      				} //m
            	}//statisticData

            	var mapStatisticData = MapViewStats.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(mapStatisticData){
      				for(var m=0;m<mapStatisticData.length;m++){ //number of instances 
   						totalCount += parseInt(mapStatisticData[m].count);
      				} //m
            	}//mapStatisticData

            	var mobileStatisticData = CallStatistics.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(mobileStatisticData){
      				for(var m=0;m<mobileStatisticData.length;m++){ //number of instances 
   						totalCount += parseInt(mobileStatisticData[m].count);
      				} //m
            	}//mobileStatisticData

				var reviewData = Review.find({'businessLink':businessUrl,'businessStatus':'active' , 'reviewDate': {$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(reviewData){
					for(var l=0 ; l<reviewData.length ; l++){
						if(reviewData[l].reviewImages){
							var reviewLength = reviewData[l].reviewImages.length;
							if(reviewLength > 0){
								totalCount ++;
							}//reviewLength > 0
						}//reviewImages
					}//l
		       	}//reviewData
				
				if(bookmarkData.length>0 || statisticData.length>0 || reviewData.length>0 ||
					beenThereData.length>0 || likesData.length>0 || savedOfferData.length>0 ||
					mapStatisticData.length>0 || mobileStatisticData.length>0){
					$('.legendCustVws').show();
					dateArray.push(moment(statFirstDate).format('MMMM'));
					dataArray.push(totalCount);
					bgcolorArray.push("rgba(54, 162, 235, 0.8)");
				}
    		}

    		datasetsArray.push({
		      // label: 'User Views',
		      data: dataArray,
		      backgroundColor: bgcolorArray,
		      borderWidth: 1
		    });

			$("#custyearChart").append(
        		"<div class='noPaddingGeneral col-lg-12 col-md-12 col-sm-12 col-xs-12'><canvas id='"+businessUrl+"-custmonthly' style='max-height: 100%;'></canvas></div>"
        	);

	      	var ctx = document.getElementById(businessUrl+"-custmonthly").getContext("2d");
		    var myChart = new Chart(ctx, {
			  type: 'bar',
			  data: {
			    labels: dateArray,
			    datasets: datasetsArray
		   	  },
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }]
			        },
			        legend: {
			            display: false,
			        }
			    }
			});
        }//if(chart1.ready)
    }); //tracker.autorun
    // ---End customer year Chart--- //

     // ---customer month Chart--- //
    Tracker.autorun(function () {
      	if (chart1.ready() && chart2.ready() && chart3.ready()) {
    		$("#custmonthChart").empty();
	      	var businessUrl = Session.get('busLink');
	      	var date = new Date();
	      	var firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    		var days = [];
		    while (firstDate.getMonth() === date.getMonth()) {
		        days.push(new Date(firstDate.toISOString()));
		        firstDate.setDate(firstDate.getDate() + 1);
		    }
		  	var dateArray      = [];
			var datasetsArray  = [];
			var dataArray      = [];
	      	var bgcolorArray   = [];

	      	for (var j = 0; j < days.length; j++) {
	      		var totalCount = 0;
	      		var statFirstDate = days[j];
	      		var statLastDate = moment(days[j]).add(1,'days');
	      		
	      		var bookmarkData  = Bookmark.find({'businessLink':businessUrl,'businessStatus':'active','createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(bookmarkData){
      				for(var k=0;k<bookmarkData.length;k++){ //number of instances of Orders
        				totalCount ++ ;
      				} //k
				}//bookmarkData

				var beenThereData  = BeenThere.find({'businessLink':businessUrl,'businessStatus':'active','createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(beenThereData){
      				for(var k=0;k<beenThereData.length;k++){ //number of instances of Orders
        				totalCount ++ ;
      				} //k
				}//beenThereData

				var likesData  = Likes.find({'businessLink':businessUrl,'businessStatus':'active', 'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(likesData){
      				for(var k=0;k<likesData.length;k++){ //number of instances of Orders
        				totalCount ++ ;
      				} //k
				}//likesData

				var savedOfferData  = SavedOffer.find({'businessLink':businessUrl,'businessStatus':'active', 'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(savedOfferData){
      				for(var k=0;k<savedOfferData.length;k++){ //number of instances of Orders
        				totalCount ++ ;
      				} //k
				}//likesData

          		var statisticData = UserStatistics.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(statisticData){
      				for(var m=0;m<statisticData.length;m++){ //number of instances 
   						totalCount += parseInt(statisticData[m].count);
      				} //m
            	}//statisticData

            	var mapStatisticData = MapViewStats.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(mapStatisticData){
      				for(var m=0;m<mapStatisticData.length;m++){ //number of instances 
   						totalCount += parseInt(mapStatisticData[m].count);
      				} //m
            	}//mapStatisticData

            	var mobileStatisticData = CallStatistics.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(mobileStatisticData){
      				for(var m=0;m<mobileStatisticData.length;m++){ //number of instances 
   						totalCount += parseInt(mobileStatisticData[m].count);
      				} //m
            	}//mobileStatisticData

				var reviewData = Review.find({'businessLink':businessUrl,'businessStatus':'active' , 'reviewDate': {$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
				if(reviewData){
					for(var l=0 ; l<reviewData.length ; l++){
						if(reviewData[l].reviewImages){
							var reviewLength = reviewData[l].reviewImages.length;
							if(reviewLength > 0){
								totalCount ++;
							}//reviewLength > 0
						}//reviewImages
					}//l
		       	}//reviewData
				
				if(bookmarkData.length>0 || statisticData.length>0 || reviewData.length>0 ||
					beenThereData.length>0 || likesData.length>0 || savedOfferData.length>0 ||
					mapStatisticData.length>0 || mobileStatisticData.length>0){
					$('.legendCustVws').show();
					dateArray.push(moment(days[j]).format('DD/MM/YYYY'));
					dataArray.push(totalCount);
					bgcolorArray.push("rgba(54, 162, 235, 0.8)");
				}
	      	}
		  
        	datasetsArray.push({
		      // label: 'User Views',
		      data: dataArray,
		      backgroundColor: bgcolorArray,
		      borderWidth: 1
		    });

			$("#custmonthChart").append(
        		"<div class='noPaddingGeneral col-lg-12 col-md-12 col-sm-12 col-xs-12'><canvas id='"+businessUrl+"-custdaily' style='max-height: 100%;'></canvas></div>"
        	);

	      	var ctx = document.getElementById(businessUrl+"-custdaily").getContext("2d");
		    var myChart = new Chart(ctx, {
			  type: 'bar',
			  data: {
			    labels: dateArray,
			    datasets: datasetsArray
		   	  },
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }]
			        },
			        legend: {
			            display: false,
			        }
			    }
			});

		  	
        }//if(chart1.ready)
    }); //tracker.autorun
    // ---End customer month Chart--- //
});

Template.customerLeadsGraph.helpers({
	'customerLeadsData':function(){
		var month    = Session.get("month");
		var year     = Session.get("year");
		var twoyear  = Session.get("twoYear");
	    var businessUrl = Session.get('busLink');

		if(month){
			var date = month;
			var y = moment().year();
			var m = moment().month();
			var statFirstDate = new Date(y, m, 1);
			var statLastDate = new Date(y, m+1, 0);
		}else if(year){
			var date = year;
			var y = moment().year();
			var statFirstDate = new Date(y, 0, 1);
			var statLastDate = new Date(y, 12, 0);			
		}else{
			var date = twoyear;
			var y = moment().year();
			var statFirstDate = new Date(y-1, 0, 1);
			var statLastDate = new Date(y, 12, 0);
		}

		var bookmarkData  = Bookmark.find({'businessLink':businessUrl,'businessStatus':'active','createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
		var beenThereData  = BeenThere.find({'businessLink':businessUrl,'businessStatus':'active','createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
		var likesData  = Likes.find({'businessLink':businessUrl,'businessStatus':'active', 'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
		var savedOfferData  = SavedOffer.find({'businessLink':businessUrl,'businessStatus':'active', 'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
  		var statisticData = UserStatistics.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
    	var mapStatisticData = MapViewStats.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
    	var mobileStatisticData = CallStatistics.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
		var reviewData = Review.find({'businessLink':businessUrl,'businessStatus':'active' , 'reviewDate': {$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();

		if(bookmarkData){
			if(bookmarkData.length>0){
				var bookmarkCount = 0;
				for (var i = 0; i < bookmarkData.length; i++) {
					bookmarkCount++;
				}
			}else{
				var bookmarkCount = 0;
			}			
		}

		if(beenThereData){
			if(beenThereData.length>0){
				var beenThereCount = 0;
				for (var i = 0; i < beenThereData.length; i++) {
					beenThereCount++;
				}
			}else{
				var beenThereCount = 0;
			}			
		}

		if(likesData){
			if(likesData.length>0){
				var likesCount = 0;
				for (var i = 0; i < likesData.length; i++) {
					likesCount++;
				}
			}else{
				var likesCount = 0;
			}			
		}

		if(savedOfferData){
			if(savedOfferData.length>0){
				var saveOfferCount = 0;
				for (var i = 0; i < savedOfferData.length; i++) {
					saveOfferCount++;
				}
			}else{
				var saveOfferCount = 0;
			}			
		}

		if(statisticData){
			if(statisticData.length>0){
				var userStatisticCount = 0;
				for (var i = 0; i < statisticData.length; i++) {
					userStatisticCount += parseInt(statisticData[i].count);
				}
			}else{
				var userStatisticCount = 0;
			}			
		}

		if(mapStatisticData){
			if(mapStatisticData.length>0){
				var mapStatisticCount = 0;
				for (var i = 0; i < mapStatisticData.length; i++) {
					mapStatisticCount += parseInt(mapStatisticData[i].count);
				}
			}else{
				var mapStatisticCount = 0;
			}			
		}

		if(mobileStatisticData){
			if(mobileStatisticData.length>0){
				var mobileStatisticCount = 0;
				for (var i = 0; i < mobileStatisticData.length; i++) {
					mobileStatisticCount += parseInt(mobileStatisticData[i].count);
				}
			}else{
				var mobileStatisticCount = 0;
			}			
		}

		if(reviewData){
			if(reviewData.length > 0){
				var reviewImagesCount = 0;
				for(var i=0 ; i<reviewData.length ; i++){
					if(reviewData[i].reviewImages){
						var reviewLength = reviewData[i].reviewImages.length;
						if(reviewLength > 0){
							reviewImagesCount++;
						}else{
							var reviewImagesCount = 0;
						}
					}//reviewImages
				}//i
			}else{
				var reviewImagesCount = 0;
			}
		}

		if(bookmarkData.length>0 || statisticData.length>0 || reviewData.length>0 ||
		beenThereData.length>0 || likesData.length>0 || savedOfferData.length>0 ||
		mapStatisticData.length>0 || mobileStatisticData.length>0){
			var data = {
				"bookmarkCount"  : bookmarkCount,
				"beenThereCount" : beenThereCount,
				"likesCount" 	 : likesCount,
				"saveOfferCount" : saveOfferCount,
				"userStatisticCount"   : userStatisticCount,
				"mapStatisticCount"    : mapStatisticCount,
				"mobileStatisticCount" : mobileStatisticCount,
				"reviewImagesCount" : reviewImagesCount,
				"date" : date,
			};
		}else{
			var data = {};
		}

		return data;		
	}
});