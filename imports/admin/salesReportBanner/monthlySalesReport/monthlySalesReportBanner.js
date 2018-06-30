import { moment } from "meteor/momentjs:moment";
// import { Orders } from '../../../../api/orderMaster.js';
import { Template } from 'meteor/templating';
import { Payment } from '../../../api/paymentMaster.js';

import './monthlySalesReportBanner.html';



Template.monthlySalesReportBanner.helpers({

	'currentmonth' : function(){
		var monthSession = Session.get('selectedMonth');
		if(monthSession){
			var currentMonth = monthSession;
		}	else{
			var today = moment().startOf('month');
			var yyyy = moment(today).format("YYYY");
		    var monthNum = moment(today).format("MM");
		    var currentMonth = yyyy+"-"+monthNum;
			Session.set("selectedMonth",currentMonth);
			}
		return currentMonth;
	},

	'result' : function(){
		var monthDateFromSess = Session.get("selectedMonth");
	 
	  	var monthDateStart = new Date(moment(monthDateFromSess).month("YYYY-MM"));//Find out first day of month with selectedMonth
	  	var monthDateToSess = new Date(moment(monthDateFromSess).add(1,"M"));
	  	// console.log(monthDateToSess);
		// var ordersData = Payment.find({'orderType':'Ads','invoiceDate':{$gte: monthDateStart,$lt: monthDateToSess}}).fetch();
		var ordersData = Payment.find({'orderType':'Banner','invoiceDate':{$gte: monthDateStart,$lt: monthDateToSess}}).fetch();
		// console.log("ordersData",ordersData);
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

Template.monthlySalesReportBanner.events({

	'click #nextMonth':function(event){
		event.preventDefault();
		var selectedMonth = $("input#monthlyValue").val();
		var newMonthDt = moment(selectedMonth).add(1, 'months').format("YYYY-MM-DD");
		var newMonthNumber = moment(newMonthDt).format("MM");
		//Construct the WeekNumber string as 'YYYY-MM'
		var yearNum=moment(newMonthDt).format("YYYY");
		var newMonth = yearNum+"-"+newMonthNumber;

		Session.set('selectedMonth', newMonth);
	},

	'click #previousMonth':function(event){
		event.preventDefault();
		var selectedMonth = $("input#monthlyValue").val();

		var newMonthDt = moment(selectedMonth).subtract(1, 'months').format("YYYY-MM-DD");
		var newMonthNumber = moment(newMonthDt).format("MM");
		//Construct the WeekNumber string as 'YYYY-MM'
		var yearNum=moment(newMonthDt).format("YYYY");
		var newMonth = yearNum+"-"+newMonthNumber;

		Session.set('selectedMonth', newMonth);
	},

	'click .fapdf': function() {
		// var docDefinition = { content: 'My Text' };

		// pdfMake.createPdf(docDefinition).open();

		var doc = new jsPDF();

	    doc.fromHTML($('.monthlySalesReportForpdf').html(), 15, 15, {
	        'width': 170,
	            // 'elementHandlers': specialElementHandlers
	    });
	    doc.save('monthlySalesReport.pdf');

	}


});


