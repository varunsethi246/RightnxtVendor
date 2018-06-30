import { moment } from "meteor/momentjs:moment";
// import { Orders } from '../../../../api/orderMaster.js';
import { Payment } from '../../../api/paymentMaster.js';

import './weeklySalesReport.html';

Template.weeklySalesReport.helpers({

	'currentweek' : function(){
		var sessionWeek = Session.get('selectedWeek');//Expecting "2017-W01" type of format

		if(sessionWeek){

			var weekVal = sessionWeek;

		}else{
			var today = moment().format("MM-DD-YYYY");
		    var weeknumber = moment(today).week();
			if(weeknumber<=9){
				weeknumber="0"+weeknumber;
			}
			var yyyy = moment(today).format("YYYY");
			var weekVal = yyyy+"-W"+weeknumber;
			Session.set("selectedWeek",weekVal);
		}

		return weekVal;

	},

	'result' : function(){
		var weekNumFromSess = Session.get("selectedWeek");

		// Like 2017-W01 for Week #1 of 2017
		// First / Get monday of date using the Week#
		var mondayInWeek = moment(weekNumFromSess).day("Monday").week(weekNumFromSess).format();

		var mondayInWeekDt = new Date(mondayInWeek);
		var sundayOfWeek = moment(mondayInWeek).add(7,"days").format();
		var sundayOfWeekDt = new Date(sundayOfWeek);

		var ordersData = Payment.find({'orderType':'Ads','invoiceDate':{$gte: mondayInWeekDt, $lt: sundayOfWeekDt}}).fetch();
		var totalRec = ordersData.length;
	 	if(ordersData){
        var allOrders = [];
        var dateCount = 0;
        var tempdate = '1/1/1';

        for(i=0; i < totalRec; i++){
		 			var quantityTotal = 0;
		 			var d = ordersData[i].invoiceDate;
	                var t = d.toLocaleDateString('en-IN');
	                if (t == tempdate) {
	                	dateCount++;
	                }
	 		 			allOrders[i] = {
			              "orderId"       	: ordersData[i]._id ,
			              "businessLink"   	: ordersData[i].businessLink ,
			              "orderNo"       	: ordersData[i].invoiceNumber,
			              "discountPercent" : ordersData[i].discountPercent,
			              "date"          	: t ,
			              "discountedPrice" : ordersData[i].discountedPrice,
			              "totalAmount" 	: ordersData[i].totalAmount,
			              "totalDiscount" 	: ordersData[i].totalDiscount,
			              "orderType" 		: ordersData[i].orderType,
			              "totalQuantity" 	: 0,
			              "rowSpanCount"  	: 0,
			            }

					var totalProdQty = totalRec;
					for(j=0 ; j<totalProdQty; j++){
						quantityTotal += parseInt(ordersData[i]);
					}
					allOrders[i].totalQuantity = parseInt(quantityTotal);

	                if(t != tempdate){
	                	var rowSpan = dateCount;
						allOrders[i-rowSpan].rowSpanCount = rowSpan;
	                	tempdate = t;
	                	dateCount = 1;
	                }


		 		}//for Loop

		 		//for last element
        		var rowSpan = dateCount;
				allOrders[i-rowSpan].rowSpanCount = rowSpan;

		 		return allOrders;
		 	} //if

	}


});

Template.weeklySalesReport.events({
	'change #weekpicker':function(event){
		event.preventDefault();
		var selectedWeek = $("input#weekpicker").val();
		Session.set('selectedWeek',selectedWeek);
	},

	'click #nextWeek':function(event){
		event.preventDefault();
		var selectedWeek = $("input#weekpicker").val();
		var newWeekDt = moment(selectedWeek).add(1, 'weeks').format("YYYY-MM-DD");
		var newWeekNumber = moment(newWeekDt).week();
		//Construct the WeekNumber string as '2017-W01'
		if(newWeekNumber <= 9){
			newWeekNumber = '0'+newWeekNumber;
		}
		var yearNum=moment(newWeekDt).format("YYYY");
		var newWeek = yearNum+"-W"+newWeekNumber;

		Session.set('selectedWeek', newWeek);
	},

	'click #previousWeek':function(event){
		event.preventDefault();
		var selectedWeek = $("input#weekpicker").val();
		var newWeekDt = moment(selectedWeek).subtract(1, 'weeks').format("YYYY-MM-DD");
		var newWeekNumber = moment(newWeekDt).week();
		//Construct the WeekNumber string as '2017-W01'
		if(newWeekNumber <= 9){
			newWeekNumber = '0'+newWeekNumber;
		}else if(newWeekNumber == 53){
			newWeekNumber = 52;
		}
		var yearNum=moment(newWeekDt).format("YYYY");
		var newWeek = yearNum+"-W"+newWeekNumber;

		Session.set('selectedWeek', newWeek);
	}
});

