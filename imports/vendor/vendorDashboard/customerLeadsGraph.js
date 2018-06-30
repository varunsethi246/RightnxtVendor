import './customerLeadsGraph.html';

import { Session } from 'meteor/session';
import { UserLatLng } from '../../api/userViewMaster.js';
import { UserStatistics } from '../../api/userViewMaster.js';
import { Business } from '../../api/businessMaster.js';
import { Review } from '../../api/reviewMaster.js';
import { Bookmark } from '../../api/bookmarkMaster.js';

Template.customerLeadsGraph.onCreated(function() {
  chart1 = this.subscribe('allBookmark');
  chart2 = this.subscribe('allreviews');
  chart3 = this.subscribe('allStatistics');
});

Template.customerLeadsGraph.onRendered(function(){

    // ---customer 24month Chart--- //
    Tracker.autorun(function () {
      	if (chart1.ready() && chart2.ready() && chart3.ready()) {
	      	var date = new Date();
		  	var first = new Date(date.getFullYear(), date.getMonth(), 1);
		  	var twoYear  = date.setYear(date.getFullYear() + 2);
		  	var last = new Date(date.getFullYear() , date.getMonth() + 1, 0);

		  	var year = first.getFullYear();
		  	var month = first.getMonth();
		  	var day = first.getDate();
		  	var nextYrDate = new Date(year + 1, month, day)
		  	var currentYr = moment(first).format('YYYY');
		  	var nextYr = moment(nextYrDate).format('YYYY');

		  	var yearArray = [currentYr,nextYr];
		 
		  	var dateArray      = [];
	      	var dataWithLabels = [];
	      	var datavalues     = [];
	      	var datalabels     = [];

		  	var Id    = Meteor.userId();

		  	var businessVar      = Business.find({'businessOwnerId':Id}).fetch();
		  	if(businessVar){
		  		for(var i=0 ; i<businessVar.length ; i++){
					var businessUrl   = businessVar[i].businessLink;
					var bookmarkData  = Bookmark.find({'businessLink':businessUrl, 'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
					if(bookmarkData){
		      			if(yearArray.length>0){
		        			for(var j=0 ; j<yearArray.length ; j++){ //number of instances of the date '23'
		          				var dateValue      = yearArray[j];
		          				var totalCount = 0;
		          				for(k=0;k<bookmarkData.length;k++){ //number of instances of Orders
		            				var x = bookmarkData[k].date;
		            				var splitd = x.split("/")
			      					var formattedM = moment(splitd[2], 'YYYY').format('YYYY');
		            				if(yearArray[j] == formattedM){
		            					totalCount ++ ;
		            				}
		          				} //k
		          				var statisticData = UserStatistics.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
								if(statisticData){
					  				var Count = 0;
			          				for(m=0;m<statisticData.length;m++){ //number of instances 
			          					var y = statisticData[m].date;
			            				var splitStatDate = y.split("/")
				      					var formattedStatMonth = moment(splitStatDate[2], 'YYYY').format('YYYY');
			          					if(yearArray[j] == formattedStatMonth){
		           							Count += parseInt  (statisticData[m].count) ;
		           						} //yearArray[j] == formattedStatMonth
			          				} //m
									var reviewData = Review.find({'businessLink':businessUrl,'reviewDate':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
									if(reviewData){
										var count = 0;
										for(var l=0 ; l<reviewData.length ; l++){
											var reviewdate = reviewData[l].reviewDate;
											var formattedReviewDate = moment(reviewdate).format('YYYY');
											if(yearArray[j] == formattedReviewDate){
												if(reviewData[l].reviewImages){
													var reviewLength = reviewData[l].reviewImages.length;
													if(reviewLength > 0){
														count ++;
													}//reviewLength > 0
												}//reviewImages
											}//yearArray[j] == formattedReviewDate
										}//l
										var totalCustLeads = totalCount+Count+count;
				          				datalabels.push(dateValue);
				          				datavalues.push(totalCustLeads);
				          				dataWithLabels.push({'label':dateValue,'value':totalCustLeads});
				        			}//reviewData
		            			}//statisticData
		        			}// j
		      			}// if uniquecreatedDate
					}//bookmarkData
		  		}//i
		  		drawchart3(datalabels,datavalues);
		  	}//businessVar
        }//if(chart1.ready)
    }); //tracker.autorun
    // ---End customer 24months Chart--- //

    // ---customer year Chart--- //
    Tracker.autorun(function () {
      	if (chart1.ready() && chart2.ready() && chart3.ready()) {
	      	var date  = new Date();
		  	var first = new Date(date.getFullYear(), 0, 1);
		  	var last  = new Date(date.getFullYear(), 11, 31);
		  	var firstDay = moment(first).format("DD/MM/YYYY");
		  	var lastDay = moment(last).format("DD/MM/YYYY");
		 
		  	var dateArray      = [];
	      	var dataWithLabels = [];
	      	var datavalues     = [];
	      	var datalabels     = [];

		  	var Id    = Meteor.userId();
		  	var businessVar      = Business.findOne({'businessOwnerId':Id});
		  	if(businessVar){
				var businessUrl   = businessVar.businessLink;
				var bookmarkData  = Bookmark.find({'businessLink':businessUrl, 'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
				if(bookmarkData){
					for(var i=0 ; i<bookmarkData.length ; i++){
						var date = bookmarkData[i].date;
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
		          			for(k=0;k<bookmarkData.length;k++){ //number of instances of Orders
		            			var x = bookmarkData[k].date;
		            			var splitd = x.split("/")
			      				var formattedM = moment(splitd[1], 'MM').format('MMMM');
		            			if(uniquecreatedDate[j] == formattedM){
		            				totalCount ++ ;
		            			}//uniquecreatedDate[j] == formattedM
		          			} //k
		          			var statisticData = UserStatistics.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
							if(statisticData){
					  			var Count = 0;
			          			for(k=0;k<statisticData.length;k++){ //number of instances 
			          				var y = statisticData[k].date;
			            			var splitStatDate = y.split("/")
				      				var formattedStatMonth = moment(splitStatDate[1], 'MM').format('MMMM');
			          				if(uniquecreatedDate[j] == formattedStatMonth){
		           						Count += parseInt  (statisticData[k].count) ;
		           					}
			          			} //k
								var reviewData = Review.find({'businessLink':businessUrl,'reviewDate':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
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
									}//i	
									var totalCustLeads = totalCount+Count+count;
				          			datalabels.push(dateValue);
				          			datavalues.push(totalCustLeads);
				          			dataWithLabels.push({'label':dateValue,'value':totalCustLeads});
				        		}//reviewData
		            		}//statisticData
		        		}// j
		      		}// if uniquecreatedDate
				}//bookmarkData
				drawchart4(datalabels,datavalues);
		  	}//businessVar
        }//if(chart1.ready)
    }); //tracker.autorun
    // ---End customer year Chart--- //

     // ---customer month Chart--- //
    Tracker.autorun(function () {
      	if (chart1.ready() && chart2.ready() && chart3.ready()) {
	      	var date = new Date();
		  
		  	var first = new Date(date.getFullYear(), date.getMonth(), 1);
		  	var last = new Date(date.getFullYear() , date.getMonth() + 1, 0);
		  
		  	var firstDay = moment(first).format("DD/MM/YYYY");
		  	var lastDay = moment(last).format("DD/MM/YYYY");
		  		 
		  	var dateArray      = [];
	      	var dataWithLabels = [];
	      	var datalabels     = [];
	      	var custLeadArray  = [];

		  	var Id    = Meteor.userId();
		  	var businessVar      = Business.findOne({'businessOwnerId':Id});
		  	if(businessVar){
				var businessUrl   = businessVar.businessLink;
				var bookmarkData  = Bookmark.find({'businessLink':businessUrl, 'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
				if(bookmarkData){
					dateArray = [{"date":"1-5"} , {"date":"6-10"} , {"date":"11-15"} , {"date":"16-20"}, {"date":"21-25"} , {"date":"26-31"}]

					var createdDate        = _.pluck(dateArray,"date");
		        	var uniquecreatedDate  = _.uniq(createdDate);
		        	for(var j=0 ; j<uniquecreatedDate.length ; j++){ //number of instances of the date '23'
		          		var dateValue      = uniquecreatedDate[j];
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
		          		var statisticData = UserStatistics.find({'businessLink':businessUrl,'createdAt':{$gte: new Date(first.toISOString()),$lt: new Date(last.toISOString())}}).fetch();
						if(statisticData){
					  		var firstCount = 0;
			          		var secondCount = 0;
			          		var thirdCount = 0;
			          		var forthCount = 0;
			          		var fifthCount = 0;
			          		var sixthCount = 0;
			          		for(k=0;k<statisticData.length;k++){ //number of instances 
			          			var y = statisticData[k].date;
			            		var d = moment(x,'DD').format('DD');
			          			if(d<=5){
		            				firstCount ++ ;
			            		}else if(d>5 && d<=10){
			            			secondCount ++ ;
			            		}else if(d>10 && d<=15){
			            			thirdCount ++ ;
			            		}else if(d>15 && d<=20){
			            			forthCount ++ ;
			            		}else if(d>20 && d<=25){
			            			fifthCount ++ ;
			            		}else if(d>25 && d<=31){
			            			sixthCount ++ ;
			            		}
			          		} //k
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
						
								var firsttotalCustLeads = firsttotalCount+firstCount+firstcount;
								var secondtotalCustLeads = secondtotalCount+secondCount+secondcount;
								var thirdtotalCustLeads = thirdtotalCount+thirdCount+thirdcount;
								var forthtotalCustLeads = forthtotalCount+forthCount+forthcount;
								var fifthtotalCustLeads = fifthtotalCount+fifthCount+fifthcount;
								var sixthtotalCustLeads = sixthtotalCount+sixthCount+sixthcount;
								custLeadArray = [{"value":firsttotalCustLeads} , {"value":secondtotalCustLeads} , {"value":thirdtotalCustLeads} , {"value":forthtotalCustLeads}, {"value":fifthtotalCustLeads} , {"value":sixthtotalCustLeads}]
								var custLead        = _.pluck(custLeadArray,"value");
					        	var uniquecustLead  = _.uniq(custLead);
				          		datalabels.push(dateValue);
				          		dataWithLabels.push({'label':dateValue,'value':custLead});
				        	}//reviewData
		            	}//statisticData
		        	}// j
				}//bookmarkData
				drawchart5(datalabels,custLead);
		  	}//businessVar
        }//if(chart1.ready)
    }); //tracker.autorun
    // ---End customer month Chart--- //


});

drawchart3 = function(datalabels,datavalues){
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
    var ctx = document.getElementById("custtwoYearChart").getContext("2d");
    var options = { };
    var lineChart = new Chart(ctx).Bar(data, options);

}

drawchart4 = function(datalabels,datavalues){
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
    var ctx = document.getElementById("custyearChart").getContext("2d");
    var options = { };
    var lineChart = new Chart(ctx).Bar(data, options);

}

drawchart5 = function(datalabels,datavalues){
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
    var ctx = document.getElementById("custmonthChart").getContext("2d");
    var options = { };
    var lineChart = new Chart(ctx).Bar(data, options);

}



Template.customerLeadsGraph.helpers({
	'totalUpload':function(){
		var userId    = Meteor.userId();
		var businessData = Business.find({'businessOwnerId':userId}).fetch();
		if(businessData){
			var total = 0;
			for(var j=0 ; j<businessData.length ; j++){
				var businessUrl   = businessData[j].businessLink;
				var reviewData = Review.find({'businessLink':businessUrl}).fetch();
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
				}//reviewData
			}//j
		}//businessData
		return total;
	},

	'bookmarks':function(){
		var Id    = Meteor.userId();
		var businessVar      = Business.find({'businessOwnerId':Id}).fetch();
		if(businessVar){
			var totalUpload = 0;
			for(var i=0 ; i<businessVar.length ; i++){
				var businessUrl   = businessVar[i].businessLink;
				var bookmarkData  = Bookmark.find({'businessLink':businessUrl}).fetch();
				if(bookmarkData){
					var BookmarkLength = bookmarkData.length;
				}//bookmarkData
				totalUpload = totalUpload + BookmarkLength;
			}//i
		}//businessVar
		return totalUpload;
	}
});



