import './customerLeadsGraph.html';

import { Session } from 'meteor/session';
import { UserLatLng } from '../../api/userViewMaster.js';
import { UserStatistics } from '../../api/userViewMaster.js';
import { Business } from '../../api/businessMaster.js';
import { Review } from '../../api/reviewMaster.js';
import { Bookmark } from '../../api/bookmarkMaster.js';
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
	      	var date = new Date();
			var first = new Date(date.getFullYear()-1, 0, 1);
		    var last = new Date(date.getFullYear() , 12, 0);
		 	
		  	var dateArray      = [];
	      	var dataWithLabels = [];
	      	var datavalues     = [];
	      	var datalabels     = [];
			var colorval1      = 0;
			var colorval2      = 0;
		  	
		  	var Id    = Meteor.userId();

		  	var businessVar      = Business.find({'businessOwnerId':Id,'status':'active'}).fetch();
		  	if(businessVar){
		  		for(var i=0 ; i<businessVar.length ; i++){
					var businessUrl   = businessVar[i].businessLink;
					var businessName  = businessVar[i].businessTitle;
					if(colorval1 >= 255){
			           	colorval2 += 50;
			           	var finalColorVal = "rgba(255,0,"+colorval2+",0.8)";
		           	}else{
		           		colorval1 += 50;
			           	var finalColorVal = "rgba(255,"+colorval1+",0,0.8)";
		           	}

		           	dateArray = [{"date":date.getFullYear()-1} , {"date":date.getFullYear()}];
					var createdDate        = _.pluck(dateArray,"date");
		        	var uniquecreatedDate  = _.uniq(createdDate);
					var dataVals 	   = [];

		        	for(var j=0 ; j<uniquecreatedDate.length ; j++){ //number of instances of the date '23'
						var y = uniquecreatedDate[j];
        				var statFirstDate = new Date(y, 0, 1);  
        				var statLastDate = new Date(y, 12, 0);
		          		var bookmarkData  = Bookmark.find({'businessLink':businessUrl, 'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
						if(bookmarkData){
			          		var totalCount = 0;
	          				for(k=0;k<bookmarkData.length;k++){ //number of instances of Orders
	            				var x = bookmarkData[k].date;
	            				var splitd = x.split("/");
		      					var formattedM = moment(splitd[2], 'YYYY').format('YYYY');
	            				if(uniquecreatedDate[j] == formattedM){
	            					totalCount ++ ;
	            				}
	          				} //k
						}else{
							var totalCount = 0;
						}//bookmarkData

		          		var statisticData = UserStatistics.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
						if(statisticData){
					  		var Count = 0;
	          				for(m=0;m<statisticData.length;m++){ //number of instances 
	          					var y = statisticData[m].date;
	            				var splitStatDate = y.split("/");
		      					var formattedStatMonth = moment(splitStatDate[2], 'YYYY').format('YYYY');
	          					if(uniquecreatedDate[j] == formattedStatMonth){
           							Count += parseInt(statisticData[m].count);
           						} 
	          				} //m
		            	}else{
		            		var Count = 0;
		            	}//statisticData


						var reviewData = Review.find({'businessLink':businessUrl , 'reviewDate': {$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
						if(reviewData){
					  		var count = 0;
							for(var l=0 ; l<reviewData.length ; l++){
								var reviewdate = reviewData[l].reviewDate;
								var formattedReviewDate = moment(reviewdate).format('YYYY');
								if(uniquecreatedDate[j] == formattedReviewDate){
									if(reviewData[l].reviewImages){
										var reviewLength = reviewData[l].reviewImages.length;
										if(reviewLength > 0){
											count ++;
										}//reviewLength > 0
									}//reviewImages
								}
							}//l
				       	}else{
					  		var count = 0;
				       	}//reviewData
						
						var totalCustLeads = totalCount+Count+count;
		          		dataVals.push(totalCustLeads);
		        	}// j

					$("#custtwoYearChart").append(
		        		"<div class='noPaddingGeneral col-lg-6 col-md-6 col-sm-12 col-xs-12'><canvas id='"+businessUrl+"-custyearly' style='max-height: 100%;'></canvas></div>"
		        	);

			      	var ctx = document.getElementById(businessUrl+"-custyearly").getContext("2d");
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
		  		}//i
		  	}//businessVar
        }//if(chart1.ready)
    }); //tracker.autorun
    // ---End customer 24months Chart--- //

    // ---customer year Chart--- //
    Tracker.autorun(function () {
      	if (chart1.ready() && chart2.ready() && chart3.ready()) {
    		$("#custyearChart").empty();
	      	var date  = new Date();
		  	var first = new Date(date.getFullYear(), 0, 1);
		  	var last  = new Date(date.getFullYear(), 11, 31);
		  	var firstDay = moment(first).format("DD/MM/YYYY");
		  	var lastDay = moment(last).format("DD/MM/YYYY");
		 
		  	var dateArray      = [];
	      	var colorval1      = 0;
			var colorval2      = 0;

		  	var Id    = Meteor.userId();
		  	var businessVar      = Business.find({'businessOwnerId':Id,'status':'active'}).fetch();
		  	if(businessVar){
		  		for (var i = 0; i < businessVar.length; i++) {
					var businessUrl   = businessVar[i].businessLink;
					var businessName  = businessVar[i].businessTitle;
					if(colorval1 >= 255){
			           	colorval2 += 50;
			           	var finalColorVal = "rgba(255,0,"+colorval2+",0.8)";
		           	}else{
		           		colorval1 += 50;
			           	var finalColorVal = "rgba(255,"+colorval1+",0,0.8)";
		           	}

					dateArray = [{"date":"January"} , {"date":"February"} , {"date":"March"} , {"date":"April"}, {"date":"May"} , {"date":"June"},{"date":"July"},{"date":"August"},{"date":"September"},{"date":"October"},{"date":"November"},{"date":"December"}];
					var createdDate        = _.pluck(dateArray,"date");
		        	var uniquecreatedDate  = _.uniq(createdDate);
		      		var dataVals 	   = [];
		        	for(var j=0 ; j<uniquecreatedDate.length ; j++){ //number of instances of the date '23'
						var y = new Date().getFullYear();
		      			var m = moment().month(uniquecreatedDate[j]).format("M");
        				var statFirstDate = new Date(y, m-1, 1);  
        				var statLastDate = new Date(y, m, 0);
		          		var bookmarkData  = Bookmark.find({'businessLink':businessUrl, 'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
						if(bookmarkData){
			          		var totalCount = 0;
			          		for(k=0;k<bookmarkData.length;k++){ //number of instances of Orders
		            			var x = bookmarkData[k].date;
		            			var splitd = x.split("/")
			      				var formattedM = moment(splitd[1], 'MM').format('MMMM');
		            			if(uniquecreatedDate[j] == formattedM){
		            				totalCount ++ ;
		            			}//uniquecreatedDate[j] == formattedM
		          			} //k
						}else{
							var totalCount = 0;
						}//bookmarkData

		          		var statisticData = UserStatistics.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
						if(statisticData){
					  		var Count = 0;
		          			for(m=0;m<statisticData.length;m++){ //number of instances 
		          				var y = statisticData[m].date;
		            			var splitStatDate = y.split("/")
			      				var formattedStatMonth = moment(splitStatDate[1], 'MM').format('MMMM');
		          				if(uniquecreatedDate[j] == formattedStatMonth){
	           						Count += parseInt  (statisticData[m].count) ;
	           					}
		          			} //m
		            	}else{
		            		var Count = 0;
		            	}//statisticData


						var reviewData = Review.find({'businessLink':businessUrl , 'reviewDate': {$gte: new Date(statFirstDate.toISOString()),$lt: new Date(statLastDate.toISOString())}}).fetch();
						if(reviewData){
					  		var count = 0;
							for(var l=0 ; l<reviewData.length ; l++){
								var reviewdate = reviewData[l].reviewDate;
								var formattedReviewDate = moment(reviewdate).format('MMMM');
								if(uniquecreatedDate[j] == formattedReviewDate){
									if(reviewData[l].reviewImages){
										var reviewLength = reviewData[l].reviewImages.length;
										if(reviewLength > 0){
											count ++;
										}
									}//reviewImages
								}
							}//l
				       	}else{
					  		var count = 0;
				       	}//reviewData
						
						var totalCustLeads = totalCount+Count+count;
		          		dataVals.push(totalCustLeads);
		        	}// j

					$("#custyearChart").append(
		        		"<div class='noPaddingGeneral col-lg-12 col-md-12 col-sm-12 col-xs-12'><canvas id='"+businessUrl+"-custmonthly' style='max-height: 100%;'></canvas></div>"
		        	);

			      	var ctx = document.getElementById(businessUrl+"-custmonthly").getContext("2d");
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
		  		}//i
		  	}//businessVar
        }//if(chart1.ready)
    }); //tracker.autorun
    // ---End customer year Chart--- //

     // ---customer month Chart--- //
    Tracker.autorun(function () {
      	if (chart1.ready() && chart2.ready() && chart3.ready()) {
    		$("#custmonthChart").empty();
	      	var date = new Date();
		  
		  	var first = new Date(date.getFullYear(), date.getMonth(), 1);
		  	var last = new Date(date.getFullYear() , date.getMonth() + 1, 0);
		  
		  	var firstDay = moment(first).format("DD/MM/YYYY");
		  	var lastDay = moment(last).format("DD/MM/YYYY");
		  		 
		  	var dateArray      = [];
	      	var colorval1      = 0;
			var colorval2      = 0;

		  	var Id    = Meteor.userId();
		  	var businessVar      = Business.find({'businessOwnerId':Id,'status':'active'}).fetch();
		  	if(businessVar){
		  		for (var i = 0; i < businessVar.length; i++) {
					var businessUrl   = businessVar[i].businessLink;
					var businessName  = businessVar[i].businessTitle;

					if(colorval1 >= 255){
			           	colorval2 += 50;
			           	var finalColorVal = "rgba(255,0,"+colorval2+",0.8)";
		           	}else{
		           		colorval1 += 50;
			           	var finalColorVal = "rgba(255,"+colorval1+",0,0.8)";
		           	}

					dateArray = [{"date":"1-5"} , {"date":"6-10"} , {"date":"11-15"} , {"date":"16-20"}, {"date":"21-25"} , {"date":"26-31"}];
					var createdDate        = _.pluck(dateArray,"date");
		        	var uniquecreatedDate  = _.uniq(createdDate);
		        	for(var j=0 ; j<uniquecreatedDate.length ; j++){ //number of instances of the date '23'
		      			var dataVals 	   = [];
		          		var bookmarkData  = Bookmark.find({'businessLink':businessUrl, 'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
						if(bookmarkData){
			          		var firsttotalCount = 0;
			          		var secondtotalCount = 0;
			          		var thirdtotalCount = 0;
			          		var forthtotalCount = 0;
			          		var fifthtotalCount = 0;
			          		var sixthtotalCount = 0;
			          		for(k=0;k<bookmarkData.length;k++){ //number of instances of Orders
			            		var x = bookmarkData[k].date;
			            		var day = moment(x,'DD').format('DD');
			            		if(day<=5){
			            			firsttotalCount ++ ;
			            		}else if(day>5 && day<=10){
			            			secondtotalCount ++ ;
			            		}else if(day>10 && day<=15){
			            			thirdtotalCount ++ ;
			            		}else if(day>15 && day<=20){
			            			forthtotalCount ++ ;
			            		}else if(day>20 && day<=25){
			            			fifthtotalCount ++ ;
			            		}else if(day>25 && day<=31){
			            			sixthtotalCount ++ ;
			            		}
			          		} //k
						}else{
							var firsttotalCount = 0;
			          		var secondtotalCount = 0;
			          		var thirdtotalCount = 0;
			          		var forthtotalCount = 0;
			          		var fifthtotalCount = 0;
			          		var sixthtotalCount = 0;
						}//bookmarkData

		          		var statisticData = UserStatistics.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
						if(statisticData){
					  		var firstCount = 0;
			          		var secondCount = 0;
			          		var thirdCount = 0;
			          		var forthCount = 0;
			          		var fifthCount = 0;
			          		var sixthCount = 0;
			          		for(m=0;m<statisticData.length;m++){ //number of instances 
			          			var y = statisticData[m].date;
			            		var d = moment(y,'DD').format('DD');
			          			if(d<=5){
		            				firstCount += parseInt(statisticData[m].count);
			            		}else if(d>5 && d<=10){
			            			secondCount += parseInt(statisticData[m].count);
			            		}else if(d>10 && d<=15){
			            			thirdCount += parseInt(statisticData[m].count);
			            		}else if(d>15 && d<=20){
			            			forthCount += parseInt(statisticData[m].count);
			            		}else if(d>20 && d<=25){
			            			fifthCount += parseInt(statisticData[m].count);
			            		}else if(d>25 && d<=31){
			            			sixthCount += parseInt(statisticData[m].count);
			            		}
			          		} //m
		            	}else{
		            		var firstCount = 0;
			          		var secondCount = 0;
			          		var thirdCount = 0;
			          		var forthCount = 0;
			          		var fifthCount = 0;
			          		var sixthCount = 0;
		            	}//statisticData


						var reviewData = Review.find({'businessLink':businessUrl , 'reviewDate': {$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
						if(reviewData){
					  		var firstcount = 0;
			          		var secondcount = 0;
			          		var thirdcount = 0;
			          		var forthcount = 0;
			          		var fifthcount = 0;
			          		var sixthcount = 0;
							for(var l=0 ; l<reviewData.length ; l++){
								var reviewdate = reviewData[l].reviewDate;
								var reviewDay = moment(reviewdate,'DD').format('DD');
								if(reviewData[l].reviewImages){
									var reviewLength = reviewData[l].reviewImages.length;
									if(reviewDay<=5 && reviewLength > 0){
					            		firstcount ++ ;
						            }else if(reviewDay>5 && reviewDay<=10 && reviewLength > 0){
						            	secondcount ++ ;
						            }else if(reviewDay>10 && reviewDay<=15 && reviewLength > 0){
						            	thirdcount ++ ;
						            }else if(reviewDay>15 && reviewDay<=20 && reviewLength > 0){
						            	forthcount ++ ;
						            }else if(reviewDay>20 && reviewDay<=25 && reviewLength > 0){
						            	fifthcount ++ ;
						            }else if(reviewDay>25 && reviewDay<=31 && reviewLength > 0){
						            	sixthcount ++ ;
						            }
								}//reviewImages
							}//l
				       	}else{
				       		var firstcount = 0;
			          		var secondcount = 0;
			          		var thirdcount = 0;
			          		var forthcount = 0;
			          		var fifthcount = 0;
			          		var sixthcount = 0;
				       	}//reviewData
						
						var firsttotalCustLeads = firsttotalCount+firstCount+firstcount;
						var secondtotalCustLeads = secondtotalCount+secondCount+secondcount;
						var thirdtotalCustLeads = thirdtotalCount+thirdCount+thirdcount;
						var forthtotalCustLeads = forthtotalCount+forthCount+forthcount;
						var fifthtotalCustLeads = fifthtotalCount+fifthCount+fifthcount;
						var sixthtotalCustLeads = sixthtotalCount+sixthCount+sixthcount;
		          		dataVals.push(firsttotalCustLeads,secondtotalCustLeads,thirdtotalCustLeads,forthtotalCustLeads,fifthtotalCustLeads,sixthtotalCustLeads);
		        	}// j

					$("#custmonthChart").append(
		        		"<div class='noPaddingGeneral col-lg-6 col-md-6 col-sm-12 col-xs-12'><canvas id='"+businessUrl+"-custdaily' style='max-height: 100%;'></canvas></div>"
		        	);

			      	var ctx = document.getElementById(businessUrl+"-custdaily").getContext("2d");
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
		  		}//i
		  	}//businessVar
        }//if(chart1.ready)
    }); //tracker.autorun
    // ---End customer month Chart--- //
});

Template.customerLeadsGraph.helpers({
	'totalUpload':function(){
		var month    = Session.get("month");
		var year     = Session.get("year");
		var Twoyear  = Session.get("twoYear");
		var userId    = Meteor.userId();
		var businessData = Business.find({'businessOwnerId':userId,'status':'active'}).fetch();
		if(businessData){
			var total = 0;
			for(var j=0 ; j<businessData.length ; j++){
				var businessUrl   = businessData[j].businessLink;
				if(month){
					var splitDate = month.split(' ');
					var y = splitDate[4];
		        	var m = moment().month(splitDate[1]).format("M");
					var first = new Date(y, m-1, 1);
					var last = new Date(y, m, 0);
					var reviewData = Review.find({'businessLink':businessUrl,'reviewDate': {$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
				}else if(year){
					var splitDate1 = year.split('-')[0].split(' ')[0];
					var splitDate2 = year.split('-')[1].split(' ')[0];
					var y = year.split(' ')[2];
		        	var m1 = moment().month(splitDate1).format("M");
		        	var m2 = moment().month(splitDate2).format("M");
					var first = new Date(y, m1-1, 1);
					var last = new Date(y, m2, 0);
					var reviewData = Review.find({'businessLink':businessUrl,'reviewDate': {$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
				}else{
					var y = moment().year();
					var first = new Date(y-1, 0, 1);
					var last = new Date(y, 12, 0);
					var reviewData = Review.find({'businessLink':businessUrl,'reviewDate': {$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
				}
				if(reviewData){
					var count = 0;
					for(var i=0 ; i<reviewData.length ; i++){
						if(reviewData[i].reviewImages){
							var reviewLength = reviewData[i].reviewImages.length;
							if(reviewLength > 0){
								count++;
								// console.log('count: '+count);
							}
						}//reviewImages
					}//i
					total = total+count;
					// console.log('total: '+total);
				}else{
					total = 0;
				}//reviewData
			}//j
		}//businessData
		return total;
	},

	'bookmarks':function(){
		var month    = Session.get("month");
		var year     = Session.get("year");
		var Twoyear  = Session.get("twoYear");
		var Id    = Meteor.userId();
		var businessVar      = Business.find({'businessOwnerId':Id,'status':'active'}).fetch();
		if(businessVar){
			var totalUpload = 0;
			for(var i=0 ; i<businessVar.length ; i++){
				var businessUrl   = businessVar[i].businessLink;
				if(month){
					var splitDate = month.split(' ');
					var y = splitDate[4];
		        	var m = moment().month(splitDate[1]).format("M");
					var first = new Date(y, m-1, 1);
					var last = new Date(y, m, 0);
					var bookmarkData  = Bookmark.find({'businessLink':businessUrl, 'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
				}else if(year){
					var splitDate1 = year.split('-')[0].split(' ')[0];
					var splitDate2 = year.split('-')[1].split(' ')[0];
					var y = year.split(' ')[2];
		        	var m1 = moment().month(splitDate1).format("M");
		        	var m2 = moment().month(splitDate2).format("M");
					var first = new Date(y, m1-1, 1);
					var last = new Date(y, m2, 0);
					var bookmarkData  = Bookmark.find({'businessLink':businessUrl, 'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
				}else{
					var y = moment().year();
					var first = new Date(y-1, 0, 1);
					var last = new Date(y, 12, 0);
					var bookmarkData  = Bookmark.find({'businessLink':businessUrl, 'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
				}
				if(bookmarkData){
					var BookmarkLength = bookmarkData.length;
					totalUpload = totalUpload + BookmarkLength;
				}else{
					totalUpload = 0;
				}//bookmarkData
			}//i
		}//businessVar
		return totalUpload;
	}
});