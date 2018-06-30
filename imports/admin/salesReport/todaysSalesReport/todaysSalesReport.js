import { Session } from 'meteor/session';
// import { Orders } from '../../../../api/orderMaster.js';
import { moment } from "meteor/momentjs:moment";
import { Payment } from '../../../api/paymentMaster.js';

import './todaysSalesReport.html';



Template.todaysSalesReport.helpers({
	'currentDate':function(){
		var setDate = Session.get('newDate');

		if(setDate){
			var today = new Date(setDate);
		}else{
			var today = new Date();
		}
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
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

		var selectedDate = Session.get('newDate');
		if(selectedDate){
			var newDate  = selectedDate;
		}else{
			var newDate  = new Date();
		}
		// console.log('newDate: ',newDate);
		var newDate1 = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0); //current day at 0:0:0
		var newDate2 = new Date(newDate1.getTime() + (24*60*60*1000) ); // next day at 0:0:0
		
		var paymentAds =  Payment.find({'orderType':'Ads','invoiceDate':{$gte : newDate1, $lt : newDate2 }}).fetch();
		// console.log("orderData: ",paymentAds);
	 	var totalRec = paymentAds.length;
	 	if(paymentAds){
        var allOrders = [];
        var dateCount = 0;
        var tempdate = '1/1/1';

        for(i=0; i < totalRec; i++){
          var quantityTotal = 0;
          var d = paymentAds[i].invoiceDate;
          var t = d.toLocaleDateString('en-IN');
          // console.log('d :',d);
          // console.log('t :',t);
          if (t == tempdate) {
                dateCount++;
          }

            allOrders[i] = {
              "orderId"       	: paymentAds[i]._id ,
              "businessLink"   	: paymentAds[i].businessLink ,
              "orderNo"       	: paymentAds[i].invoiceNumber,
              "discountPercent" : paymentAds[i].discountPercent,
              "date"          	: t ,
              "discountedPrice" : paymentAds[i].discountedPrice,
              "totalAmount" 	: paymentAds[i].totalAmount,
              "totalDiscount" 	: paymentAds[i].totalDiscount,
              "orderType" 		: paymentAds[i].orderType,
              "totalQuantity" 	: 0,
              "rowSpanCount"  	: 0,
            }

          var totalProdQty = totalRec;
          for(j=0 ; j<totalProdQty; j++){
            quantityTotal += parseInt(paymentAds[i]);

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
        // console.log('allOrders:',allOrders);
        return allOrders;
      } //if
	}


});


Template.todaysSalesReport.events({
	'click #nextDate':function(event){
		event.preventDefault();
		var selectedDate1 = $("input#reportDate").val();
		var selectedDate = selectedDate1.replace(/-/g, '\/');

		var newDate1 = new Date(selectedDate);
		var newDate2 = new Date(newDate1.getTime() + (24*60*60*1000) );
		Session.set('newDate', newDate2);
	},

	'click #previousDate':function(event){
		event.preventDefault();
		var selectedDate1 = $("input#reportDate").val();
		var selectedDate = selectedDate1.replace(/-/g, '\/');

		var newDate1 = new Date(selectedDate);
		var newDate2 = new Date(newDate1.getTime() - (24*60*60*1000) );
		Session.set('newDate', newDate2);
	},

	'click .fapdf': function() {
		// var docDefinition = { content: 'My Text' };

		// pdfMake.createPdf(docDefinition).open();

		var doc = new jsPDF();

	    doc.fromHTML($('.todaysSalesReportForpdf').html(), 15, 15, {
	        'width': 170,
	            // 'elementHandlers': specialElementHandlers
	    });
	    doc.save('todaysSalesReport.pdf');

	}


});

