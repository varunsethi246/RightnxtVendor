import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '../../api/businessMaster.js';
import { Payment } from '../../api/paymentMaster.js';
import { Position } from '/imports/api/discountMaster.js';
import { CompanySettings } from '/imports/api/companysettingsAPI.js';
import { BusinessBanner } from '/imports/api/businessBannerMaster.js';
import { BusinessAds } from '/imports/api/businessAdsMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './VendorPayments.js';
import './VendorPayments.html';
import './vendorBannerInvoice.html';
import '../vendor.js';
import './VendorPayments.html';
import './vendorAdsInvoice.html';
import './paymentSuccess.html';
import '/imports/admin/businessBanner/businessBanner.js';
import '/imports/admin/businessAds/businessAds.js';
import '/imports/admin/businessAds/adsInvoice.html';



Template.paymentSuccessAdsBanners.helpers({
	paymentSuccessfull(){
		var status      = FlowRouter.getQueryParam('status');
	    var id          = FlowRouter.getQueryParam('id');
	    var billnumbers = FlowRouter.getQueryParam('billnumbers');
	    var checksum    = FlowRouter.getQueryParam('checksum');
		var userId      = Meteor.userId();
		var payId    	= FlowRouter.getQueryParam('payId');
		var businessLink = FlowRouter.getQueryParam('BusLink');
		var getPayData = Payment.findOne({"_id":payId});
		var checkAdspayment = Payment.find({'_id':payId,'orderType':'Ads'}).fetch();

		// if(getPayData && getPayData.paymentStatus != "paid"){
		// 	if(status == 'paid'){
		// 		Meteor.call("updateAdsBannerInvoiceforPayment",id, billnumbers, payId, businessLink, function(err,result){
		// 		  if(result){
  
		// 		  }
		// 	  });
		//   }
		// }
		if(checkAdspayment){
			console.log('in updateAdsInvoiceforPayment');
			if(getPayData && getPayData.paymentStatus != "paid"){
			console.log('in updateAdsInvoiceforPayment 2');

				if(status == 'paid'){
					console.log('in updateAdsInvoiceforPayment 3');

					Meteor.call("updateAdsInvoiceforPayment",id, billnumbers, payId, businessLink, function(err,result){
					  if(result){
	  
					  }
				  });
			  }
			}
		}else{
			console.log('in updateAdsInvoiceforPayment');
			if(getPayData && getPayData.paymentStatus != "paid"){
				if(status == 'paid'){
					Meteor.call("updateAdsBannerInvoiceforPayment",id, billnumbers, payId, businessLink, function(err,result){
					  if(result){
	  
					  }
				  });
			  }
			}
		}
	},
	bannerInvoiceDataFinal(){
		var businessLink = FlowRouter.getQueryParam('BusLink');
		var payId    		= FlowRouter.getQueryParam('payId');
		var businessDetails = Business.findOne({"businessLink":businessLink, "status":"active"});
		var paymentCheck = Payment.findOne({"_id":payId});
		  businessDetails.invoiceNumber 	= paymentCheck.invoiceNumber;
		  businessDetails.discountPercent = paymentCheck.discountPercent;
		  businessDetails.totalDiscount 	= paymentCheck.totalDiscount;
		  businessDetails.discountedPrice = paymentCheck.discountedPrice;
	  var companyDetails 	= CompanySettings.findOne({'companyId':101});

	  businessDetails.invoiceDate = moment(new Date()).format('DD/MM/YYYY');
	  if(companyDetails){
		  businessDetails.companyName = companyDetails.companyName;
		  businessDetails.companyAddress = companyDetails.companyLocationsInfo[0].companyAddress;
		  businessDetails.companyCity = companyDetails.companyLocationsInfo[0].companyCity;
		  businessDetails.companyState = companyDetails.companyLocationsInfo[0].companyState;
		  businessDetails.companyPincode = companyDetails.companyLocationsInfo[0].companyPincode;
	  }

	  var totalPrice = 0;
	  var businessBanner = BusinessBanner.find({"businessLink":businessLink,"status":"active"}).fetch();
	  console.log("businessBanner: ",businessBanner);
	  if(businessBanner){
		  for(i=0;i<businessBanner.length;i++){
			  if(businessBanner[i].areas){
				  businessBanner[i].numOfAreas=businessBanner[i].areas.length;
			  }else{
				  businessBanner[i].numOfAreas=0;
			  }
			  var monthlyRate = Position.findOne({'position':businessBanner[i].position});
			  businessBanner[i].monthlyRate 	= monthlyRate.rate;
			  businessBanner[i].totalAmount 	= parseInt(monthlyRate.rate) * parseInt(businessBanner[i].areas.length) * parseInt(businessBanner[i].noOfMonths);
			  totalPrice= totalPrice + businessBanner[i].totalAmount;
		  }
	  }

	  console.log("businessBanner: ",businessBanner);



	  businessDetails.businessLink = businessLink;
	  businessDetails.totalPrice = totalPrice;
	  businessDetails.businessBanner = businessBanner;
	  return businessDetails;
	}
});
// Template.paymentSuccessAdsBanners.helpers({
// 	paymentSuccessfull(){
// 		var status      	= FlowRouter.getQueryParam('status');
// 	    var id          	= FlowRouter.getQueryParam('id');
// 	    var billnumbers 	= FlowRouter.getQueryParam('billnumbers');
// 	    var checksum    	= FlowRouter.getQueryParam('checksum');
// 		var userId      	= Meteor.userId();
// 		var payId    		= FlowRouter.getQueryParam('payId');
// 		var checkAdspayment = Payment.find({'_id':payId,'orderType':'Ads'}).fetch();
// 		var businessLink 	= FlowRouter.getQueryParam('BusLink');
// 		var getPayData 		= Payment.findOne({"_id":payId});
// 		if(checkAdspayment){
// 			if(getPayData && getPayData.paymentStatus != "paid"){
// 				if(status == 'paid'){
// 					Meteor.call("updateAdsInvoiceforPayment",id, billnumbers, payId, businessLink, function(err,result){
// 					  if(result){
	  
// 					  }
// 				  });
// 			  }
// 			}
// 		}else{
// 			if(getPayData && getPayData.paymentStatus != "paid"){
// 				if(status == 'paid'){
// 					Meteor.call("updateAdsBannerInvoiceforPayment",id, billnumbers, payId, businessLink, function(err,result){
// 					  if(result){
	  
// 					  }
// 				  });
// 			  }
// 			}
// 		}
// 	},
// 	bannerInvoiceDataFinal(){
// 		var businessLink 	= FlowRouter.getQueryParam('BusLink');
// 		var payID 			= FlowRouter.getQueryParam('payId');
// 		var businessDetails = [];
// 		var paymentCheckAds = Payment.findOne({"_id":payID});
// 		console.log('paymentCheckAds:',paymentCheckAds);
// 		// var paymentCheck 	= Payment.find({"businessLink":businessLink,"orderType":"Banner"}).fetch();
// 		// if(paymentCheck){

// 		// 	if(paymentCheck.length>0) { 
// 		// 	  businessDetails.invoiceNumber 	= paymentCheck[0].invoiceNumber;
// 		// 	  businessDetails.discountPercent = paymentCheck[0].discountPercent;
// 		// 	  businessDetails.totalDiscount 	= paymentCheck[0].totalDiscount;
// 		// 	  businessDetails.discountedPrice = paymentCheck[0].discountedPrice;
// 		// 	}else{
// 		// 	  businessDetails.invoiceNumber = 'None';
// 		// 	}
// 		// 	var companyDetails 	= CompanySettings.findOne({'companyId':101});

// 		// 	businessDetails.invoiceDate = moment(new Date()).format('DD/MM/YYYY');
// 		// 	if(companyDetails){
// 		// 	  businessDetails.companyName = companyDetails.companyName;
// 		// 	  businessDetails.companyAddress = companyDetails.companyLocationsInfo[0].companyAddress;
// 		// 	  businessDetails.companyCity = companyDetails.companyLocationsInfo[0].companyCity;
// 		// 	  businessDetails.companyState = companyDetails.companyLocationsInfo[0].companyState;
// 		// 	  businessDetails.companyPincode = companyDetails.companyLocationsInfo[0].companyPincode;
// 		// 	}

// 		//   	var totalPrice = 0;
// 		//   	var businessBanner = BusinessBanner.find({"businessLink":businessLink,"status":"active"}).fetch();
// 		// 	console.log("businessBanner: ",businessBanner);
// 		// 	if(businessBanner){
// 		// 	  for(i=0;i<businessBanner.length;i++){
// 		// 		  if(businessBanner[i].areas){
// 		// 			  businessBanner[i].numOfAreas=businessBanner[i].areas.length;
// 		// 		  }else{
// 		// 			  businessBanner[i].numOfAreas=0;
// 		// 		  }
// 		// 		  var monthlyRate = Position.findOne({'position':businessBanner[i].position});
// 		// 		  businessBanner[i].monthlyRate 	= monthlyRate.rate;
// 		// 		  businessBanner[i].totalAmount 	= parseInt(monthlyRate.rate) * parseInt(businessBanner[i].areas.length) * parseInt(businessBanner[i].noOfMonths);
// 		// 		  totalPrice= totalPrice + businessBanner[i].totalAmount;
// 		// 	  }
// 		// 	}

// 		// 	console.log("businessBanner: ",businessBanner);



// 		// 	businessDetails.businessLink = businessLink;
// 		// 	businessDetails.totalPrice = totalPrice;
// 		// 	businessDetails.businessBanner = businessBanner;
// 		// 	return businessDetails;
// 		// }
// 		if(paymentCheckAds){
// 			var orderType = paymentCheckAds.orderType;
// 			var businessId = paymentCheckAds.businessId;
// 			  businessDetails.invoiceNumber 	= paymentCheckAds.invoiceNumber;
// 			  businessDetails.discountPercent 	= paymentCheckAds.discountPercent;
// 			  businessDetails.totalDiscount 	= paymentCheckAds.totalDiscount;
// 			  businessDetails.discountedPrice 	= paymentCheckAds.discountedPrice;
// 			var companyDetails 	= CompanySettings.findOne({'companyId':101});

// 			businessDetails.invoiceDate = moment(new Date()).format('DD/MM/YYYY');
// 			if(companyDetails){
// 			  businessDetails.companyName = companyDetails.companyName;
// 			  businessDetails.companyAddress = companyDetails.companyLocationsInfo[0].companyAddress;
// 			  businessDetails.companyCity = companyDetails.companyLocationsInfo[0].companyCity;
// 			  businessDetails.companyState = companyDetails.companyLocationsInfo[0].companyState;
// 			  businessDetails.companyPincode = companyDetails.companyLocationsInfo[0].companyPincode;
// 			}

// 		  	var totalPrice = 0;
// 		  	var businessAds = BusinessAds.find({"businessLink":businessLink,"status":"active"}).fetch();
// 			console.log("businessAds: ",businessAds);
// 			// if(businessAds){
// 			//   for(i=0;i<businessAds.length;i++){
// 			// 	  if(businessAds[i].areas){
// 			// 		  businessAds[i].numOfAreas=businessAds[i].areas.length;
// 			// 	  }else{
// 			// 		  businessAds[i].numOfAreas=0;
// 			// 	  }
// 			// 	  var monthlyRate = Position.findOne({'position':businessAds[i].position});
// 			// 	  businessAds[i].monthlyRate 	= monthlyRate.rate;
// 			// 	  businessAds[i].totalAmount 	= parseInt(monthlyRate.rate) * parseInt(businessAds[i].areas.length) * parseInt(businessAds[i].noOfMonths);
// 			// 	  totalPrice= totalPrice + businessAds[i].totalAmount;
// 			//   }
// 			// }

// 			// console.log("businessAds: ",businessAds);



// 			// businessDetails.businessLink = businessLink;
// 			// businessDetails.totalPrice = totalPrice;
// 			// businessDetails.businessAds = businessAds;
// 			console.log(businessDetails);
// 		}	
// 			return businessDetails;
	  	
// 	}
// });

Template.vendorPayments.helpers({
	paymentDetails(){
		var paymentDetails 	= Payment.find({"vendorId":Meteor.userId()},{sort:{invoiceNumber:-1}}).fetch();
		if(paymentDetails){
			for(i=0; i<paymentDetails.length; i++){
				var businessObj = Business.findOne({"_id":paymentDetails[i].businessId});
				paymentDetails[i].businessTitle = businessObj.businessTitle;
				paymentDetails[i].invoiceDate = moment(paymentDetails[i].invoiceDate).format('DD/MM/YYYY');
				var receiptLink = '';
				if(paymentDetails[i].orderType=="Banner"){
					paymentDetails[i].totalAmount = paymentDetails[i].discountedPrice;
					paymentDetails[i].receiptLink = "/bannerInvoice/" + paymentDetails[i].businessLink;
				} else if(paymentDetails[i].orderType=="Ads"){
					paymentDetails[i].totalAmount = paymentDetails[i].discountedPrice;
					paymentDetails[i].receiptLink = "/adsInvoice/" + paymentDetails[i].businessLink;
				} else {
					paymentDetails[i].receiptLink = "/" + paymentDetails[i].businessLink + "/receipt/" + paymentDetails[i].invoiceNumber+'-i';
				}
			}
			return paymentDetails;
		}

	},
});

vendorPaymentsForm = function () {  
 	BlazeLayout.render("vendorLayout",{main: 'vendorPayments'});
}

export { vendorPaymentsForm };

vendorBannerInvoiceForm = function () {  
	// console.log('in function banner');
  	BlazeLayout.render("vendorLayout",{main: 'vendorBannerInvoice'});
}

export { vendorBannerInvoiceForm };

vendorAdsInvoiceForm = function () {  
	// console.log('in function of invoice');
  	BlazeLayout.render("vendorLayout",{main: 'vendorAdsInvoice'});
}

export { vendorAdsInvoiceForm };

paymentSuccessAdsBannersForm = function () {  
  	BlazeLayout.render("vendorLayout",{main: 'paymentSuccessAdsBanners'});
}

export { paymentSuccessAdsBannersForm };