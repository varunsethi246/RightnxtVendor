import { moment } from "meteor/momentjs:moment";
// import { Orders } from '../../../../api/orderMaster.js';
import { Payment } from '../../../api/paymentMaster.js';

import './yearlySalesReport.html';


Template.yearlySalesReport.helpers({

	'currentyear' : function(){
		var yearSession = Session.get('selectedYear');
		if(yearSession){
			var currentYear = yearSession;
		}else{
			var today = new Date();
	    var currentYear = today.getFullYear();
			Session.set("selectedYear",currentYear);
		}

		return currentYear;

	},

	'result' : function(){
    var yearFromSess = Session.get("selectedYear");

    var thisYear = yearFromSess;
    var yearDateStart = new Date("1/1/" + thisYear);
    var yearDateEnd = new Date (yearDateStart.getFullYear(), 11, 31);
    var ordersData = Payment.find({'orderType':'Ads','invoiceDate':{$gte: yearDateStart,$lt: yearDateEnd}}).fetch();
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


Template.yearlySalesReport.events({

	'click #nextYear':function(event){
		event.preventDefault();
		var selectedYear = $("input#yearlyValue").val();
		var newYear = moment(selectedYear).add(1,'years').format('YYYY');
		Session.set('selectedYear', newYear);

	},

	'click #previousYear':function(event){
		event.preventDefault();
		var selectedYear = $("input#yearlyValue").val();
		var newYear = moment(selectedYear).subtract(1,'years').format('YYYY');
		Session.set('selectedYear', newYear);

	}


});
