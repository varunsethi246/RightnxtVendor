import { Session } from 'meteor/session';
import { UserLatLng } from '../../api/userViewMaster.js';
import { UserStatistics } from '../../api/userViewMaster.js';
import { Business } from '../../api/businessMaster.js';
import { BusinessAds } from '../../api/businessAdsMaster.js';
import { BusinessBanner } from '../../api/businessBannerMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Chart from 'chart.js';
import './vendorDashboard.html';
import './userViewGraph.html';
import './customerLeadsGraph.js';
import './customerLeadsGraph.html';
import '../vendor.js';

Template.userViewGraph.onCreated(function() {
  chart = this.subscribe('allStatistics');
  chart1 = this.subscribe('chartBusiness');
});

Template.vendorDashboard.onRendered(function(){
	if(FlowRouter.getParam('businessLink')){
		$('#graphBusinessTitle').val(FlowRouter.getParam('businessLink'));
	}
});

Template.userViewGraph.onRendered(function(){
	Session.set("month","");
	Session.set("year","");
	Session.set("twoYear","");

    // var businessUrl = $('#graphBusinessTitle').val(); 
    // Session.set('busLink',businessUrl);
	$(".twoYr").addClass('addYearClass');

    // // ---User two year Chart--- //
    Tracker.autorun(function () {
    	// if (chart.ready() && chart1.ready()) {
    		var businessLink = FlowRouter.getParam('businessLink');
    		if(businessLink){
	    		$("#twoYearChart").empty();
	   //  		$('.legendUserVwsBannersAds').hide();
				// $('.legendUserVwsBanners').hide();
				// $('.legendUserVwsAds').hide();
				// $('.legendUserVws').hide();

		    	var date = new Date();
			    // var LastYrFD = new Date(date.getFullYear()-1, 0, 1);
			    // var LastYrLD = new Date(date.getFullYear()-1, 12, 0);
			    // var ThisYrFD = new Date(date.getFullYear() , 0, 1);
			    // var ThisYrLD = new Date(date.getFullYear() , 12, 0);
		     	var dateArray 		 = [];
		     	var dataArray    	 = [];
		      	var bgcolorArray     = [];
		      	var datasetsArray    = [];
		      	var yearsArray		 = [date.getFullYear()-1,date.getFullYear()];

		      	var businessAdsDetails = BusinessAds.findOne({'businessLink':businessLink,'status':'active'});
				var businessBannersDetails = BusinessBanner.findOne({'businessLink':businessLink,'status':'active'});
	    		for (var i = 0; i < yearsArray.length; i++) {
					var firstDate = new Date(yearsArray[i], 0, 1);
				  	var lastDate  = new Date(yearsArray[i], 12, 0);	
				  	var dateArrayData = yearsArray[i];
	    			var businessFirstDate = moment(firstDate).format('YYYY-MM-DD');
	    			var businessLastDate = moment(lastDate).format('YYYY-MM-DD');
				
			      	var statisticData  = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte: new Date(firstDate.toISOString()),$lt: new Date(lastDate.toISOString())}}).fetch();
			      	if(statisticData){
			      		if(statisticData.length > 0){
				      		var totalCount = 0;
		  					for (var j = 0; j < statisticData.length; j++) {
								totalCount += parseInt(statisticData[j].count) ;
		  					}

		  					if(businessBannersDetails && businessAdsDetails){
								if(((businessBannersDetails.startDate >= businessFirstDate && businessBannersDetails.startDate <= businessLastDate) || 
								  (businessBannersDetails.endDate >= businessFirstDate && businessBannersDetails.endDate <= businessLastDate)) && 
								  ((businessAdsDetails.startDate >= businessFirstDate && businessAdsDetails.startDate <= businessLastDate) || 
								  (businessAdsDetails.endDate >= businessFirstDate && businessAdsDetails.endDate <= businessLastDate))){
									if(totalCount){
						  				$('.legendUserVwsBannersAds').show();
					  					dateArray.push(dateArrayData);
										dataArray.push(totalCount);
					  					bgcolorArray.push("rgba(192, 255, 51, 0.8)");
					  				}	
								}else{
					  				if(totalCount){
						  				$('.legendUserVws').show();
										dateArray.push(dateArrayData);
										dataArray.push(totalCount);
										bgcolorArray.push("rgba(54, 162, 235, 0.8)");
					  				}
								}
							}else if(businessBannersDetails){
								if((businessBannersDetails.startDate >= businessFirstDate && businessBannersDetails.startDate <= businessLastDate) || 
								  (businessBannersDetails.endDate >= businessFirstDate && businessBannersDetails.endDate <= businessLastDate)){
									if(totalCount){
						  				$('.legendUserVwsBanners').css('display','block');
					  					dateArray.push(dateArrayData);
										dataArray.push(totalCount);
					  					bgcolorArray.push("rgba(255, 159, 64, 0.8)");
					  				}	
								}else{
					  				if(totalCount){
						  				$('.legendUserVws').show();
					  					dateArray.push(dateArrayData);
										dataArray.push(totalCount);
				    					bgcolorArray.push("rgba(54, 162, 235, 0.8)");
					  				}
								}
							}else if(businessAdsDetails){
								if((businessAdsDetails.startDate >= businessFirstDate && businessAdsDetails.startDate <= businessLastDate) || 
								  (businessAdsDetails.endDate >= businessFirstDate && businessAdsDetails.endDate <= businessLastDate)){
									if(totalCount){
						  				$('.legendUserVwsAds').show();
					  					dateArray.push(dateArrayData);
										dataArray.push(totalCount);
					  					bgcolorArray.push("rgba(255, 206, 86, 0.8)");
					  				}	
								}else{
					  				if(totalCount){
						  				$('.legendUserVws').show();
					  					dateArray.push(dateArrayData);
										dataArray.push(totalCount);
				    					bgcolorArray.push("rgba(54, 162, 235, 0.8)");
					  				}
								}
							}else{
								if(totalCount){
					  				$('.legendUserVws').show();
				  					dateArray.push(dateArrayData);
									dataArray.push(totalCount);
			    					bgcolorArray.push("rgba(54, 162, 235, 0.8)");
				  				}
							}
			      		}else{
			      			dateArray.push(dateArrayData);
							dataArray.push(0);
							bgcolorArray.push("rgba(54, 162, 235, 0.8)");
			      		}
			      	}
			      	
	    		}

			    // var lastYrStatisticData  = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte:new Date(LastYrFD.toISOString()),$lt: new Date(LastYrLD.toISOString())}}).fetch();
			  //   if(lastYrStatisticData){
				 //    if(lastYrStatisticData.length > 0){
		   //  			var totalCount = 0;
					// 	for (var i = 0; i < lastYrStatisticData.length; i++) {
					// 		totalCount += parseInt(lastYrStatisticData[i].count) ;
					// 	}
		  	// 			$('.legendUserVws').show();
					// 	dateArray.push(date.getFullYear()-1);
					// 	dataArray.push(totalCount);
					// 	bgcolorArray.push("rgba(54, 162, 235, 0.8)");
					// }
			  //   }

			  //   var thisYrStatisticData  = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte:new Date(ThisYrFD.toISOString()),$lt: new Date(ThisYrLD.toISOString())}}).fetch();
			  //   if(thisYrStatisticData){
				 //    if(thisYrStatisticData.length > 0){
		   //  			var totalCount = 0;
					// 	for (var i = 0; i < thisYrStatisticData.length; i++) {
					// 		totalCount += parseInt(thisYrStatisticData[i].count) ;
					// 	}
		  	// 			$('.legendUserVws').show();
					// 	dateArray.push(date.getFullYear());
					// 	dataArray.push(totalCount);
					// 	bgcolorArray.push("rgba(54, 162, 235, 0.8)");
					// }
			  //   }

			  //   var businessAdsDetails = BusinessAds.findOne({'businessLink':businessLink,'status':'active'});
		   //      if(businessAdsDetails){
		   //      	if(date.getFullYear()-1 == businessAdsDetails.createdAt.getFullYear()){
			  //     	  	var busAdsFirstDate = new Date(businessAdsDetails.startDate);  
					// 	var busAdsLastDate = new Date(businessAdsDetails.endDate);
					// 	var lastYrStatisticData = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte: new Date(busAdsFirstDate.toISOString()),$lt: new Date(busAdsLastDate.toISOString())}}).fetch();
	    //   				if(lastYrStatisticData){
		   //    				if(lastYrStatisticData.length > 0){
					//     		var totalCount = 0;
		   //    					for (var i = 0; i < lastYrStatisticData.length; i++) {
					// 				totalCount += parseInt(lastYrStatisticData[i].count) ;
		   //    					}
		  	// 					$('.legendUserVwsAds').show();
			  //     				dateArray.push(date.getFullYear()-1);
					// 			dataArray.push(totalCount);
					// 			bgcolorArray.push("rgba(255, 206, 86, 0.8)");
		   //    				}
	    //   				}
					// }
		   //     		if(date.getFullYear() == businessAdsDetails.createdAt.getFullYear()){
			  //     	  	var busAdsFirstDate = new Date(businessAdsDetails.startDate);  
					// 	var busAdsLastDate = new Date(businessAdsDetails.endDate);
					// 	var thisYrStatisticData = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte: new Date(busAdsFirstDate.toISOString()),$lt: new Date(busAdsLastDate.toISOString())}}).fetch();
	    //   				if(thisYrStatisticData){
		   //    				if(thisYrStatisticData.length > 0){
					//     		var totalCount = 0;
		   //    					for (var i = 0; i < thisYrStatisticData.length; i++) {
					// 				totalCount += parseInt(thisYrStatisticData[i].count) ;
		   //    					}
		  	// 					$('.legendUserVwsAds').show();
			  //     				dateArray.push(date.getFullYear());
					// 			dataArray.push(totalCount);
					// 			bgcolorArray.push("rgba(255, 206, 86, 0.8)");
		   //    				}
	    //   				}
					// }
		   //    	}

		   //    	var businessBannersDetails = BusinessBanner.findOne({'businessLink':businessLink,'status':'active'});
		   //      if(businessBannersDetails){
		   //      	if(date.getFullYear()-1 == businessBannersDetails.createdAt.getFullYear()){
			  //     	  	var busAdsFirstDate = new Date(businessBannersDetails.startDate);  
					// 	var busAdsLastDate = new Date(businessBannersDetails.endDate);
					// 	var lastYrStatisticData = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte: new Date(busAdsFirstDate.toISOString()),$lt: new Date(busAdsLastDate.toISOString())}}).fetch();
	    //   				if(lastYrStatisticData){
		   //    				if(lastYrStatisticData.length > 0){
					//     		var totalCount = 0;
		   //    					for (var i = 0; i < lastYrStatisticData.length; i++) {
					// 				totalCount += parseInt(lastYrStatisticData[i].count) ;
		   //    					}
		  	// 					$('.legendUserVwsBanners').show();
			  //     				dateArray.push(date.getFullYear()-1);
					// 			dataArray.push(totalCount);
					// 			bgcolorArray.push("rgba(255, 159, 64, 0.8)");
		   //    				}
	    //   				}
					// }
		   //     		if(date.getFullYear() == businessBannersDetails.createdAt.getFullYear()){
			  //     	  	var busAdsFirstDate = new Date(businessBannersDetails.startDate);  
					// 	var busAdsLastDate = new Date(businessBannersDetails.endDate);
					// 	var thisYrStatisticData = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte: new Date(busAdsFirstDate.toISOString()),$lt: new Date(busAdsLastDate.toISOString())}}).fetch();
	    //   				if(thisYrStatisticData){
		   //    				if(thisYrStatisticData.length > 0){
					//     		var totalCount = 0;
		   //    					for (var i = 0; i < thisYrStatisticData.length; i++) {
					// 				totalCount += parseInt(thisYrStatisticData[i].count) ;
		   //    					}
		  	// 					$('.legendUserVwsBanners').show();
			  //     				dateArray.push(date.getFullYear());
					// 			dataArray.push(totalCount);
					// 			bgcolorArray.push("rgba(255, 159, 64, 0.8)");
		   //    				}
	    //   				}
					// }
		   //    	}

		      	datasetsArray.push({
			      // label: 'User Views',
			      data: dataArray,
			      backgroundColor: bgcolorArray,
			      borderWidth: 1
			    });


				$("#twoYearChart").append(
	        		"<div class='noPaddingGeneral col-lg-10 col-md-10 col-sm-12 col-xs-12'><canvas id='"+businessLink+"-yearly' style='max-height: 100%;'></canvas></div>"
	        	);

		      	var ctx = document.getElementById(businessLink+"-yearly").getContext("2d");
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
    		}//if businessLink

        // }//if(chart.ready)
      }); //tracker.autorun
    // ---End User two year Chart--- //

    // // ---User Month Chart--- //
    Tracker.autorun(function () {
    	// if (chart.ready() && chart1.ready()) {
    		var businessLink = FlowRouter.getParam('businessLink');
    		if(businessLink){
	    		$("#monthChart").empty();
	   //  		$('.legendUserVwsBannersAds').hide();
				// $('.legendUserVwsBanners').hide();
				// $('.legendUserVwsAds').hide();
				// $('.legendUserVws').hide();
		      	var date = new Date();
			  	var firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
	    		var days = [];
			    while (firstDate.getMonth() === date.getMonth()) {
			        days.push(new Date(firstDate.toISOString()));
			        firstDate.setDate(firstDate.getDate() + 1);
			    }
		      	var dateArray      = [];
		      	var dataArray      = [];
		      	var datasetsArray  = [];
		      	var bgcolorArray   = [];
		      	
		      	var businessAdsDetails = BusinessAds.findOne({'businessLink':businessLink,'status':'active'});
				var businessBannersDetails = BusinessBanner.findOne({'businessLink':businessLink,'status':'active'});
		      	for (var j = 0; j < days.length; j++) {
	    			var currentDate = moment(days[j]).format('DD/MM/YYYY');
	    			var currentDate1 = moment(days[j]).format('YYYY-MM-DD');
		      		var totalCount = UserStatistics.findOne({'businessLink':businessLink , 'date':currentDate});
					if(businessBannersDetails && businessAdsDetails){
						console.log('totalCount1');
						if((currentDate1 >= businessBannersDetails.startDate && currentDate1 <= businessBannersDetails.endDate) && 
						(currentDate1 >= businessAdsDetails.startDate && currentDate1 <= businessAdsDetails.endDate)){
							if(totalCount){
				  				$('.legendUserVwsBannersAds').show();
			  					dataArray.push(totalCount.count);
			  					dateArray.push(currentDate);
			  					bgcolorArray.push("rgba(192, 255, 51, 0.8)");
			  				}	
						}else{
			  				if(totalCount){
				  				$('.legendUserVws').show();
			  					dataArray.push(totalCount.count);
			  				}else{
			  					dataArray.push(0);
			  				}
			  				dateArray.push(currentDate);
			  				bgcolorArray.push("rgba(54, 162, 235, 0.8)");
						}
					}else if(businessBannersDetails){
						if(currentDate1 >= businessBannersDetails.startDate && currentDate1 <= businessBannersDetails.endDate){
							if(totalCount){
				  				$('.legendUserVwsBanners').show();
			  					dataArray.push(totalCount.count);
			  					dateArray.push(currentDate);
			  					bgcolorArray.push("rgba(255, 159, 64, 0.8)");
			  				}	
						}else{
			  				if(totalCount){
				  				$('.legendUserVws').show();
			  					dataArray.push(totalCount.count);
			  				}else{
			  					dataArray.push(0);	
			  				}
			  				dateArray.push(currentDate);
			  				bgcolorArray.push("rgba(54, 162, 235, 0.8)");
						}
					}else if(businessAdsDetails){
						if(currentDate1 >= businessAdsDetails.startDate && currentDate1 <= businessAdsDetails.endDate){
							if(totalCount){
				  				$('.legendUserVwsAds').show();
			  					dataArray.push(totalCount.count);
			  					dateArray.push(currentDate);
			  					bgcolorArray.push("rgba(255, 206, 86, 0.8)");
			  				}	
						}else{
			  				if(totalCount){
				  				$('.legendUserVws').show();
			  					dataArray.push(totalCount.count);
			  				}else{
			  					dataArray.push(0);
			  				}
			  				dateArray.push(currentDate);
			  				bgcolorArray.push("rgba(54, 162, 235, 0.8)");
						}
					}else{
		  				if(totalCount){
			  				$('.legendUserVws').show();
		  					dataArray.push(totalCount.count);
		  				}else{
		  					dataArray.push(0);
		  				}
		  				dateArray.push(currentDate);
		  				bgcolorArray.push("rgba(54, 162, 235, 0.8)");
					}
		      	}

		  //     	var businessAdsDetails = BusinessAds.findOne({'businessLink':businessLink,'status':'active'});
	   //      	if(businessAdsDetails){
	   //      		if(date.getMonth() == businessAdsDetails.createdAt.getMonth()){
			 //      	  	var busAdsFirstDate = new Date(businessAdsDetails.startDate);  
				// 		var busAdsLastDate = new Date(businessAdsDetails.endDate);
				// 		var thisMnthStatisticData = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte: new Date(busAdsFirstDate.toISOString()),$lt: new Date(busAdsLastDate.toISOString())}}).fetch();
		  // 				if(thisMnthStatisticData){
		  //     				if(thisMnthStatisticData.length > 0){
		  //     					$('.legendUserVwsAds').show();
				// 	    		var totalCount = 0;
		  //     					for (var k = 0; k < thisMnthStatisticData.length; k++) {
				// 					dateArray.push(thisMnthStatisticData[k].date);
				//   					bgcolorArray.push("rgba(255, 206, 86, 0.8)");
				//   					dataArray.push(thisMnthStatisticData[k].count);
		  //     					}
		  //     				}
		  // 				}
		  // 			}
				// }

				// var businessBannersDetails = BusinessBanner.findOne({'businessLink':businessLink,'status':'active'});
	   //      	if(businessBannersDetails){
	   //      		if(date.getMonth() == businessBannersDetails.createdAt.getMonth()){
			 //      	  	var busAdsFirstDate = new Date(businessBannersDetails.startDate);  
				// 		var busAdsLastDate = new Date(businessBannersDetails.endDate);
				// 		var thisMnthStatisticData = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte: new Date(busAdsFirstDate.toISOString()),$lt: new Date(busAdsLastDate.toISOString())}}).fetch();
		  // 				if(thisMnthStatisticData){
		  //     				if(thisMnthStatisticData.length > 0){
			 //      				$('.legendUserVwsBanners').show();
				// 	    		var totalCount = 0;
		  //     					for (var l = 0; l < thisMnthStatisticData.length; l++) {
				// 					dateArray.push(thisMnthStatisticData[l].date);
				//   					bgcolorArray.push("rgba(255, 159, 64, 0.8)");
				//   					dataArray.push(thisMnthStatisticData[l].count);
		  //     					}
		  //     				}
		  // 				}
		  // 			}
				// }
		      	datasetsArray.push({
			      // label: 'User Views',
			      data: dataArray,
			      backgroundColor: bgcolorArray,
			      borderWidth: 1
			    });

		      	$("#monthChart").append(
	        		"<div class='noPaddingGeneral col-lg-12 col-md-12 col-sm-12 col-xs-12'><canvas id='"+businessLink+"-daily' style='max-height: 100%;'></canvas></div>"
	        	);

		      	var ctx = document.getElementById(businessLink+"-daily").getContext("2d");
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
    		}//if businessLink
	      	
        // }//if(chart.ready)
    }); //tracker.autorun
    // ---End User Month Chart--- //

    // // ---User year Chart--- //
    Tracker.autorun(function () {
      	// if (chart.ready() && chart1.ready()) {
    		var businessLink = FlowRouter.getParam('businessLink');
    		if(businessLink){
	
	    		$("#yearChart").empty();
	   //  		$('.legendUserVwsBannersAds').hide();
				// $('.legendUserVwsBanners').hide();
				// $('.legendUserVwsAds').hide();
				// $('.legendUserVws').hide();
		      	var monthsArray      = [];
		      	var dataArray    	 = [];
		      	var bgcolorArray     = [];
		      	var datasetsArray    = [];
			    
			    var businessAdsDetails = BusinessAds.findOne({'businessLink':businessLink,'status':'active'});
				var businessBannersDetails = BusinessBanner.findOne({'businessLink':businessLink,'status':'active'});
	    		
	    		for (var i = 0; i < 12; i++) {
					var date  = new Date();
				  	var firstDate = new Date(date.getFullYear(), i, 1);
				  	var lastDate  = new Date(date.getFullYear(), i, 31);    			
	    			var businessFirstDate = moment(firstDate).format('YYYY-MM-DD');
	    			var businessLastDate = moment(lastDate).format('YYYY-MM-DD');
			      	var statisticData  = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte: new Date(firstDate.toISOString()),$lt: new Date(lastDate.toISOString())}}).fetch();
			      	
			      	if(statisticData){
			      		if(statisticData.length > 0){
				      		var totalCount = 0;
		  					for (var j = 0; j < statisticData.length; j++) {
								totalCount += parseInt(statisticData[j].count) ;
		  					}

		  					// console.log('t',businessBannersDetails.startDate,businessBannersDetails.endDate,businessFirstDate,businessLastDate);
		  					if(businessBannersDetails && businessAdsDetails){
								if(((businessBannersDetails.startDate >= businessFirstDate && businessBannersDetails.startDate <= businessLastDate) || 
								  (businessBannersDetails.endDate >= businessFirstDate && businessBannersDetails.endDate <= businessLastDate)) && 
								  ((businessAdsDetails.startDate >= businessFirstDate && businessAdsDetails.startDate <= businessLastDate) || 
								  (businessAdsDetails.endDate >= businessFirstDate && businessAdsDetails.endDate <= businessLastDate))){
									if(totalCount){
						  				$('.legendUserVwsBannersAds').show();
					  					monthsArray.push(moment(firstDate).format('MMMM'));
										dataArray.push(totalCount);
					  					bgcolorArray.push("rgba(192, 255, 51, 0.8)");
					  				}	
								}else{
					  				if(totalCount){
						  				$('.legendUserVws').show();
					  					monthsArray.push(moment(firstDate).format('MMMM'));
										dataArray.push(totalCount);
					  					bgcolorArray.push("rgba(54, 162, 235, 0.8)");
					  				}
								}
							}else if(businessBannersDetails){
								if((businessBannersDetails.startDate >= businessFirstDate && businessBannersDetails.startDate <= businessLastDate) || 
								  (businessBannersDetails.endDate >= businessFirstDate && businessBannersDetails.endDate <= businessLastDate)){
									if(totalCount){
						  				$('.legendUserVwsBanners').show();
					  					monthsArray.push(moment(firstDate).format('MMMM'));
										dataArray.push(totalCount);
					  					bgcolorArray.push("rgba(255, 159, 64, 0.8)");
					  				}	
								}else{
					  				if(totalCount){
						  				$('.legendUserVws').show();
					  					monthsArray.push(moment(firstDate).format('MMMM'));
										dataArray.push(totalCount);
				    					bgcolorArray.push("rgba(54, 162, 235, 0.8)");
					  				}
								}
							}else if(businessAdsDetails){
								if((businessAdsDetails.startDate >= businessFirstDate && businessAdsDetails.startDate <= businessLastDate) || 
								  (businessAdsDetails.endDate >= businessFirstDate && businessAdsDetails.endDate <= businessLastDate)){
									if(totalCount){
						  				$('.legendUserVwsAds').show();
					  					monthsArray.push(moment(firstDate).format('MMMM'));
										dataArray.push(totalCount);
					  					bgcolorArray.push("rgba(255, 206, 86, 0.8)");
					  				}	
								}else{
					  				if(totalCount){
						  				$('.legendUserVws').show();
					  					monthsArray.push(moment(firstDate).format('MMMM'));
										dataArray.push(totalCount);
				    					bgcolorArray.push("rgba(54, 162, 235, 0.8)");
					  				}
								}
							}else{
								if(totalCount){
					  				$('.legendUserVws').show();
				  					monthsArray.push(moment(firstDate).format('MMMM'));
									dataArray.push(totalCount);
			    					bgcolorArray.push("rgba(54, 162, 235, 0.8)");
				  				}
							}
			      		}else{
			      			monthsArray.push(moment(firstDate).format('MMMM'));
							dataArray.push(0);
		  					bgcolorArray.push("rgba(54, 162, 235, 0.8)");
			      		}
			      	}
			      	
	    		}

			 //    var businessAdsDetails = BusinessAds.findOne({'businessLink':businessLink,'status':'active'});
	   //      	if(businessAdsDetails){
	   //      		if(date.getFullYear() == businessAdsDetails.createdAt.getFullYear()){
			 //      	  	var busAdsFirstDate = new Date(businessAdsDetails.startDate);  
				// 		var busAdsLastDate = new Date(businessAdsDetails.endDate);
						
				// 		var monthValue = date.getMonth();
				// 		for (var k = 0; k < (businessAdsDetails.noOfMonths+1).length; k++) {
				// 			if(k==0){
				// 				var firstDate = busAdsFirstDate;
				// 			}else{
				// 				var firstDate = new Date(date.getFullYear(), monthValue, 1);
				// 			}

				// 			if(k==businessAdsDetails.noOfMonths){
				//   				var lastDate  = busAdsLastDate;
				// 			}else{
			 //  					var lastDate  = new Date(date.getFullYear(), monthValue, 31);
				// 			}

			 //  				var thisMnthStatisticData = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte: new Date(firstDate.toISOString()),$lte: new Date(lastDate.toISOString())}}).fetch();
			 //  				if(thisMnthStatisticData){
			 //      				if(thisMnthStatisticData.length > 0){
				// 		    		var totalCount = 0;
			 //      					for (var j = 0; j < thisMnthStatisticData.length; j++) {
				// 						totalCount += parseInt(thisMnthStatisticData[j].count) ;
			 //      					}
			 //      					$('.legendUserVwsAds').show();
				//       				monthsArray.push(moment(thisMnthStatisticData.date).format('MMMM'));
				// 					dataArray.push(totalCount);
		  //   						bgcolorArray.push("rgba(255, 206, 86, 0.8)");
			 //      				}
			 //  				}
			 //  				monthValue++;
				// 		}
		  // 			}
				// }

				// var businessBannersDetails = BusinessBanner.findOne({'businessLink':businessLink,'status':'active'});
	   //      	if(businessBannersDetails){
	   //      		if(date.getFullYear() == businessBannersDetails.createdAt.getFullYear()){
			 //      	  	var busAdsFirstDate = new Date(businessBannersDetails.startDate);  
				// 		var busAdsLastDate = new Date(businessBannersDetails.endDate);
						
				// 		var monthValue = date.getMonth();
				// 		for (var k = 0; k < (businessBannersDetails.noOfMonths+1).length; k++) {
				// 			if(k==0){
				// 				var firstDate = busAdsFirstDate;
				// 			}else{
				// 				var firstDate = new Date(date.getFullYear(), monthValue, 1);
				// 			}

				// 			if(k==businessBannersDetails.noOfMonths){
				//   				var lastDate  = busAdsLastDate;
				// 			}else{
			 //  					var lastDate  = new Date(date.getFullYear(), monthValue, 31);
				// 			}

			 //  				var thisMnthStatisticData = UserStatistics.find({'businessLink':businessLink ,'createdAt':{$gte: new Date(firstDate.toISOString()),$lte: new Date(lastDate.toISOString())}}).fetch();
			 //  				if(thisMnthStatisticData){
			 //      				if(thisMnthStatisticData.length > 0){
				// 		    		var totalCount = 0;
			 //      					for (var j = 0; j < thisMnthStatisticData.length; j++) {
				// 						totalCount += parseInt(thisMnthStatisticData[j].count) ;
			 //      					}
			 //      					$('.legendUserVwsBanners').show();
				//       				monthsArray.push(moment(thisMnthStatisticData.date).format('MMMM'));
				// 					dataArray.push(totalCount);
		  //   						bgcolorArray.push("rgba(255, 159, 64, 0.8)");
			 //      				}
			 //  				}
			 //  				monthValue++;
			 //  			}
		  // 			}
				// }

				datasetsArray.push({
			      // label: 'User Views',
			      data: dataArray,
			      backgroundColor: bgcolorArray,
			      borderWidth: 1
			    });

				$("#yearChart").append(
	        		"<div class='noPaddingGeneral col-lg-10 col-md-10 col-sm-12 col-xs-12'><canvas id='"+businessLink+"-monthly' style='max-height: 100%;'></canvas></div>"
	        	);

		      	var ctx = document.getElementById(businessLink+"-monthly").getContext("2d");
			    var myChart = new Chart(ctx, {
				  type: 'bar',
				  data: {
				    labels: monthsArray,
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
    		}//if businessLink
        // }//if(chart.ready)
    }); //tracker.autorun
    // ---End User year Chart--- //
});

Template.vendorDashboard.events({
	'change #graphBusinessTitle':function(event){
		event.preventDefault();
		var businessLink = $('#graphBusinessTitle').val(); 
		FlowRouter.go('/vendorDashboard/'+businessLink);
	    // Session.set('busLink',businessLink);
	},
	'click .monthDate':function(event){
		event.preventDefault();
		var currentEvent = $(event.currentTarget);
		$(currentEvent).addClass('addYearClass');
		$(currentEvent).siblings().removeClass('addYearClass');
		// $(".twoYr").removeClass('addYearClass');
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
		var currentEvent = $(event.currentTarget);
		$(currentEvent).addClass('addYearClass');
		$(currentEvent).siblings().removeClass('addYearClass');
		// $(".twoYr").removeClass('addYearClass');
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
		var currentEvent = $(event.currentTarget);
		$(currentEvent).addClass('addYearClass');
		$(currentEvent).siblings().removeClass('addYearClass');
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
	'businessNameData':function(){
		var businessNameArr = [];
		var businessObj = Business.find({'businessOwnerId':Meteor.userId(),'status':'active'}).fetch();
		if(businessObj){
			for (var i = 0; i < businessObj.length; i++) {
				businessNameArr.push({'businessTitle':businessObj[i].businessTitle,'businessLink':businessObj[i].businessLink});
			}
		}
		return businessNameArr;
	}
});

Template.userViewGraph.helpers({
	'customerActivity':function(){
		var userId            = Meteor.userId();
		var custActivityArray = [];
		var businessLink = FlowRouter.getParam('businessLink');
		if(businessLink){
			var businessData      = Business.findOne({'businessLink':businessLink,'status':'active'});
			if(businessData){
				var businessTitle = businessData.businessTitle;
			}
			// var userData    = UserLatLng.find({'businessLink':businessLink}, {sort: {createdAt: -1}, limit: 10}).fetch();
			var userData    = UserLatLng.find({'businessLink':businessLink}, {sort: {createdAt: -1}}).fetch();
			if(userData){
				for(var i=0 ; i<userData.length ; i++){
					var city     = userData[i].city;
					var date     = userData[i].createdAt;
					var dateTime = moment(date).format('MMMM Do YYYY, h:mm:ss a');
					custActivityArray.push({
						'city' : city,
						'date' : dateTime,
						'businessTitle' : businessTitle,
					});
				}//i
			}//userData
		}else{
			var businessData      = Business.find({'businessOwnerId':userId,'status':'active'}).fetch();
			if(businessData){
				for(j = 0 ; j < businessData.length; j++){
					var businessUrl = businessData[j].businessLink;
					var userData    = UserLatLng.find({'businessLink':businessUrl}, {sort: {createdAt: -1}}).fetch();
					if(userData){
						for(var i=0 ; i<userData.length ; i++){
							var city     = userData[i].city;
							var date     = userData[i].createdAt;
							var dateTime = moment(date).format('MMMM Do YYYY, h:mm:ss a');
							custActivityArray.push({
								'city' : city,
								'date' : dateTime,
								'businessTitle' : businessData[j].businessTitle,
							});
						}//i
					}//userData
				}//j
			}//businessData	
		}
		if(custActivityArray.length > 0){
			return custActivityArray;
		}
	},
	'isDataAvail':function(){
		// if (chart.ready() && chart1.ready()) {
			var businessUrl = FlowRouter.getParam('businessLink');
			if(businessUrl){
				var userData    = UserLatLng.findOne({'businessLink':businessUrl});
		  		var statisticData = UserStatistics.findOne({'businessLink':businessUrl});
				if(statisticData || userData){
					return true;	
				}else{
					return false;	
				}
			}
		// }
	}
});


vendorDashboardForm = function () {
  BlazeLayout.render("vendorLayout",{main: 'vendorDashboard'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { vendorDashboardForm };