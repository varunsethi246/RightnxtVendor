import { Session } from 'meteor/session';
// import { Products } from '../../../api/products.js';
// import { Orders } from '../../../api/orderMaster.js';
import { moment } from "meteor/momentjs:moment";
import { Payment } from '../../api/paymentMaster.js';

import './fromToFields.html';

Template.fromToFields.helpers({
	'fromDate':function(){
		var fromDate = new Date();
		var dd = fromDate.getDate();
		var mm = fromDate.getMonth()+1; //January is 0!
		var yyyy = fromDate.getFullYear();
		if(dd<10){
		    dd='0'+dd;
		}
		if(mm<10){
		    mm='0'+mm;
		}
		var today = yyyy+'-'+mm+'-'+dd;

		return today;
	},

  'toDate':function(){
    var toDate = new Date();

    var dd = toDate.getDate();
    var mm = toDate.getMonth()+1; //January is 0!
    var yyyy = toDate.getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    var today = yyyy+'-'+mm+'-'+dd;
    return today;
  },

	'result': function(){

		var fromDate = Session.get('fromDate');
    	var toDate = Session.get('toDate');

    	// console.log('from: ',fromDate);
    	// console.log('to: ',toDate);

		if(fromDate != toDate){
			var fromDt = new Date(fromDate);
      		var toDt = new Date(toDate);
		}else{
			var fromDt = new Date();
      		var toDt = new Date(moment(fromDt).add(1,'d'));
		}
		// console.log('fromDate: ',fromDt);
		// console.log('toDate: ',toDt);

		var ordersData =  Payment.find({"orderType" : "Ads",'invoiceDate':{$gte : fromDt, $lt : toDt }}).fetch();
		// console.log('ordersData :',ordersData);
		// console.log("hi");
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
			var rowSpan = dateCount;
			allOrders[i-rowSpan].rowSpanCount = rowSpan;
			return allOrders;
		} //if
	}

});


Template.fromToFields.events({
	"click .search" : function(event){
		event.preventDefault();
		var fromDate = $("input#fromdate").val();
		var toDate = $("input#todate").val();

		if(fromDate > toDate){
			alert("To Date cannot be less than From Date");
			Bert.alert( 'To Date cannot be less than From Date', 'danger', 'growl-top-right' );
			//Throw Error Alert to to User
			// throw new Meteor.Error("From Date cannot be less than To Date");
		}else{
			Session.set("fromDate",fromDate);
			Session.set("toDate",toDate);
		// console.log(Session.set("fromDate",fromDate));
		// console.log(Session.set("toDate",toDate));
		}
	}

});
