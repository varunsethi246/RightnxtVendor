import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Offers } from './offersMaster.js';
import { CompanySettings } from './companysettingsAPI.js';
import { BusinessBanner } from '/imports/api/businessBannerMaster.js';
import { BusinessAds } from '/imports/api/businessAdsMaster.js';
import { Business } from '/imports/api/businessMaster.js';
import { QuickwalletDetails } from '/imports/api/quickwalletDetails.js';



export const Payment = new Mongo.Collection('payment');


if (Meteor.isServer) {
  //This code only runs on the server
  Payment._ensureIndex({ invoiceNumber: 1 }, { unique: true });
  addInitialRow();
  function addInitialRow(){
	var totalRecords = Payment.find({}).count();
  	if(totalRecords == 0){
  		Payment.insert({
				"vendorId"  			: 'dummy',  
				"businessId"  			: 'dummy',  
				"businessLink"			: '',
				"invoiceNumber"			: 1,
				"invoiceDate"			: '',  
				"offerPricePerMonth"	: '',  
				"numberOfMonths"		: '',  
				"numberOfOffers"		: '',  
				"totalAmount"			: '',  
				"paymentStatus"			: '',  
				"paymentDate"			: '',  
  		});
  	}  	
  }

	Meteor.publish('payment', function payment() {
		// console.log(Payment.find({"vendorId":this.userId}).fetch() );
		return Payment.find({"vendorId":this.userId});
	});

	Meteor.publish('allpayment', function allpayment() {
		return Payment.find({});
	});

	Meteor.publish('noOfInvoiceCount', function() {
		Counts.publish(this, 'noOfInvoiceCount', Payment.find({}));
	});
}


Meteor.methods({

	'insertPayment':function(formValues){
		//Find all new offers for businessId
		var newOffers = Offers.find({"businessId":formValues.businessId,"offerStatus":"Payment Pending"}).fetch();
		var newOffersArr = [];
		if(newOffers){
			var companyRates = CompanySettings.findOne({'companyId':101},{"rates":1});
			if(companyRates){
				var totalAmount = 0;
				var offers = [];
				for(i=0; i<newOffers.length; i++){
					newOffersArr.push(newOffers[i]._id);
					offers[i] = { "offerId": newOffers[i]._id };
			    	totalAmount += parseInt(newOffers[i].numOfMonths) * parseInt(companyRates.rates.ratePerOffer);
				}

				var maxInvNum = Payment.find({}, {sort: {invoiceNumber:-1, limit:1}}).fetch();
				if(maxInvNum.length > 0){
					var invNum = maxInvNum[0].invoiceNumber + 1;
				}
			
				return Payment.insert({  
					"vendorId"  			: Meteor.userId(),
					"businessId"  			: formValues.businessId,
					"businessLink" 			: formValues.businessLink, 
					"offerId"				: newOffersArr,
					"invoiceNumber"			: invNum,
					"invoiceDate"			: new Date(), 
					"offerPricePerMonth"	: companyRates.rates.ratePerOffer, 
					"numberOfOffers"		: newOffers.length, 
					"totalAmount"			: totalAmount, 
					"paymentStatus"			: 'unpaid',
					"paymentDate"			: '', 
					"orderType"				: 'Offer',				
					"offers" 				: offers,				
				}, function(error,result){
					if(error){
						console.log(error);
						return error;
					}
					if(result){
						return result;
					}
				});
			}
		}//if newOffers
	},//End of Method

	'insertBannerPayment':function(formValues){
		return Payment.insert({  
			"vendorId"  			: formValues.vendorId,
			"businessId"  			: formValues.businessId,
			"businessLink" 			: formValues.businessLink, 
			"invoiceNumber"			: formValues.invoiceNumber,
			"invoiceDate"			: new Date(), 
			"discountPercent"		: formValues.discountPercent, 
			"discountedPrice"		: formValues.discountedPrice, 
			"totalAmount"			: formValues.totalAmount, 
			"totalDiscount"			: formValues.totalDiscount,
			"paymentStatus"			: 'unpaid',
			"paymentDate"			: '', 
			"orderType"				: 'Banner',				
			// "offers" 				: offers,				
		}, function(error,result){
			if(error){
				console.log(error);
				return error;
			}
			if(result){
				return result;
			}
		});
	},
	'updateBannerPayment':function(formValues){
		Payment.update( 
			{"businessLink": formValues.businessLink,"orderType":'Banner'},
			{$set : {
			 	"vendorId"  			: formValues.vendorId,
				"businessId"  			: formValues.businessId,
				"businessLink" 			: formValues.businessLink, 
				"invoiceNumber"			: formValues.invoiceNumber,
				"invoiceDate"			: new Date(), 
				"discountPercent"		: formValues.discountPercent, 
				"discountedPrice"		: formValues.discountedPrice, 
				"totalAmount"			: formValues.totalAmount, 
				"totalDiscount"			: formValues.totalDiscount,
				"paymentStatus"			: 'unpaid',
				"paymentDate"			: '', 
				"orderType"				: 'Banner',				
				// "offers" 				: offers,			
				}
			}, 
			function(error,result){
				if(error){
					// console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			}
		);
		// return businessLink;
	},

	'updateBannerPaymentOnline':function(businessLink){
		var businessBanner = BusinessBanner.find({"businessLink":businessLink,"status":"new"}).fetch();
		var paymentCheck = Payment.findOne({"businessLink":businessLink,"orderType":"Banner","paymentStatus":"unpaid"});
		var businessUser = Business.findOne({"businessLink":businessLink});

		if(!businessUser.ownerMobile){
			businessUser.ownerMobile = "9730190305";
		}else{
			if((businessUser.ownerMobile).indexOf("+") >= 0){
				businessUser.ownerMobile = (businessUser.ownerMobile).substring(3);
			}
		}



		if (process.env.NODE_ENV == 'development') {
			var quickWalletUrl = 'https://uat.quikwallet.com';
		  	var METEOR_URL = 'localhost:3000'; // your production server url
		}else{
			var quickWalletUrl = 'https://uat.quikwallet.com';

			var METEOR_URL = current;
		}



		if(paymentCheck.totalAmount){
			var quickwalletDetail 	= QuickwalletDetails.findOne({'_id':'2'});
			
			var userId       	= Meteor.userId();
			var userObj      	= Meteor.users.findOne({"_id":userId});
			var mobileNumber 	= businessUser.ownerMobile;
			var grandTotal 		= paymentCheck.totalAmount;
			console.log("METEOR_URL: ",METEOR_URL);
			var quickWalletInput = {
				"partnerid"	:   quickwalletDetail.partnerid,
				"mobile"   	:   mobileNumber,
				"secret"   	:   quickwalletDetail.secret,
				"amount"   	:    grandTotal,
				"udf1"		: 	paymentCheck._id,
				"redirecturl" : 'http://'+METEOR_URL+'/paymentAds-response?payId='+paymentCheck._id+"&InvNo="+paymentCheck.invoiceNumber+"&BusLink="+paymentCheck.businessLink,
			};

			try {
				console.log("Im trying");
				if (Meteor.isServer) {
						var result = HTTP.call("POST", quickWalletUrl+"/api/partner/323/requestPayment",
										{params: quickWalletInput});
										console.log("result: ",result);
						if(result.data.status == 'success'){
							var paymentUrl = result.data.data.url;
							console.log("paymentUrl: ",paymentUrl);
				
							return paymentUrl;
						}else{
							return false;
						}
					}
			} catch (err) {
				return false;
			}
		}
	},
	'updateAdsPaymentOnline':function(businessLink,current){
		var businessAds = BusinessAds.find({"businessLink":businessLink,"status":"new"}).fetch();
		console.log("businessAds: ",businessAds);
		var paymentCheck = Payment.findOne({"businessLink":businessLink,"orderType":"Ads","paymentStatus":"unpaid"});
		console.log("paymentCheck: ",paymentCheck);
		var businessUser = Business.findOne({"businessLink":businessLink});
		console.log("businessUser: ",businessUser);

		if(!businessUser.ownerMobile){
			businessUser.ownerMobile = "9730190305";
		}else{
			if((businessUser.ownerMobile).indexOf("+") >= 0){
				businessUser.ownerMobile = (businessUser.ownerMobile).substring(3);
			}
		}

		if (process.env.NODE_ENV == 'development') {
			var quickWalletUrl = 'https://uat.quikwallet.com';
		  	var METEOR_URL = 'localhost:3000'; // your production server url
		}else{
			var quickWalletUrl = 'https://uat.quikwallet.com';

			var METEOR_URL = current;
		}

		if(paymentCheck.totalAmount){
			var quickwalletDetail 	= QuickwalletDetails.findOne({'_id':'2'});

			var userId       	= Meteor.userId();
			var userObj      	= Meteor.users.findOne({"_id":userId});
			var mobileNumber 	= businessUser.ownerMobile;
			var grandTotal 		= paymentCheck.totalAmount;
			var quickWalletInput = {
				"partnerid"	:   quickwalletDetail.partnerid,
				"mobile"   	:   mobileNumber,
				"secret"   	:   quickwalletDetail.secret,
				"amount"   	:    grandTotal,
				"udf1"		: 	paymentCheck._id,
				"redirecturl" : 'http://'+METEOR_URL+'/paymentAds-response?payId='+paymentCheck._id+"&InvNo="+paymentCheck.invoiceNumber+"&BusLink="+paymentCheck.businessLink,
			};

			console.log('quickWalletInput: ',quickWalletInput);

			try {
				console.log("Im trying");
				if (Meteor.isServer) {

						var result = HTTP.call("POST", quickWalletUrl+"/api/partner/323/requestPayment",
										{params: quickWalletInput});
										console.log("result: ",result);
						if(result.data.status == 'success'){
							var paymentUrl = result.data.data.url;
							console.log("paymentUrl: ",paymentUrl);
				
							return paymentUrl;
						}else{
							return false;
						}
					}
			} catch (err) {
				return false;
			}
		}
	},
	
	'addNewOfferinPayment': function(_id, offerId){
		Payment.update( {"_id":_id},
			{$push: {offers: {"offerId": offerId},"offerId": offerId}},
			function(error,result){
				if(error){
					return error;
				}else{
					return result;
				}
			}
		);
	},
	'removeNewOfferinPayment': function(_id, offerId){
		Payment.update( {"_id":_id},
			{$pull: {offers: {"offerId": offerId}, "offerId": offerId} },
			function(error,result){
				if(error){
					return error;
				}else{
					return result;
				}
			}
		);
	},

	'updateInvoiceforOnlinePayment':function(businessLink, invoiceNumber,current){
		var receiptObj = Payment.findOne({"vendorId" : Meteor.userId(),
			"businessLink" : businessLink,
			"invoiceNumber": parseInt(invoiceNumber),
			"orderType"    :'Offer',
		});

		if (process.env.NODE_ENV == 'development') {
			var quickWalletUrl = 'https://uat.quikwallet.com';
		  	var METEOR_URL = 'localhost:3000'; // your production server url
		  	// console.log('quickWalletUrl :',quickWalletUrl);
		  	// console.log('METEOR_URL :',METEOR_URL);
		}else{
			var quickWalletUrl = 'https://uat.quikwallet.com';

			var METEOR_URL = current;
			// console.log('quickWalletUrl :',quickWalletUrl);
		 //  	console.log('METEOR_URL :',METEOR_URL);
		}

		if(receiptObj.totalAmount){
			var quickwalletDetail 	= QuickwalletDetails.findOne({'_id':'2'});
			console.log('quickwalletDetail :',quickwalletDetail);
			var userId       		= Meteor.userId();
			var userObj      		= Meteor.users.findOne({"_id":userId});
			var mobileNumber 		= userObj.profile.mobile;
			var grandTotal 			= receiptObj.totalAmount;
			var quickWalletInput 	= {
				"partnerid"		:   quickwalletDetail.partnerid,
				"mobile"   		:   mobileNumber,
				"secret"   		:   quickwalletDetail.secret,
				"amount"   		:    grandTotal,
				"udf1"			: 	receiptObj._id,
				"redirecturl" 	: 	'http://'+METEOR_URL+'/payment-response?orderId='+receiptObj._id+"&InvNo="+receiptObj.invoiceNumber+"&BusLink="+receiptObj.businessLink,
			};

			try {
				if (Meteor.isServer) {
					// console.log('quickWalletUrl: ',quickWalletUrl);
						var result = HTTP.call("POST", quickWalletUrl+"/api/partner/323/requestPayment",
										{params: quickWalletInput});
						if(result.data.status == 'success'){
							var paymentUrl = result.data.data.url;
							return paymentUrl;
						}else{
							return false;
						}
					}
			} catch (err) {
				return false;
			}
		}
	},
	'insertOnlineDetailsToOffers':function(id, billnumbers, payId){
		var getPayOfferArr = Payment.findOne({"_id":payId});
		if(getPayOfferArr.transactionId != id){
			var dataArr = getPayOfferArr.offerId;
			Payment.update(
				{"_id": payId},
				{ $set:	{ 
							"paymentStatus" 			: "paid",
							"paymentDate" 				: moment(new Date()).format('DD/MM/YYYY'),
							"modeOfPayment" 			: "Online",
							"transactionId"				: id, 
						}, 
				},
				function(error,result){
					if(error){
						return error;
					}else{
						dataArr.map((data)=>{
							Offers.update(
								{"_id": data},
								{ $set:	{ 
											"offerStatus" 	: "Active",
										}, 
								},
								function(error1,result1){
									if(error1){
										return error1;
									}
									if(result1){
										return result1;
									}
								}
							);
						});
					
						return result;
					}
				}
			);
		}
		
	},

	'updateAdsBannerInvoiceforPayment':function(id,billNo,payId,businessLink){
		Payment.update(
			{"_id": payId},
			{ $set:	{ 
						"paymentStatus" 			: "paid",
						"paymentDate" 				: moment(new Date()).format('DD/MM/YYYY'),
						"modeOfPayment" 			: "online"
					}, 
			},
			function(error,result){
				if(error){
					return error;
				}else{
					BusinessBanner.update(
						{"businessLink": businessLink, "status":"new"},
						{ $set:	{ 
									"status" 	: "active",
								}, 
						},{multi: true},
						function(error1,result1){
							if(error1){
								return error1;
							}
							if(result1){
								return result1;
							}
						}
					);
					return result;
				}
			}
		);
	},
	'updateAdsInvoiceforPayment':function(id,billNo,payId,businessLink){
		Payment.update(
			{"_id": payId},
			{ $set:	{ 
						"paymentStatus" 			: "paid",
						"paymentDate" 				: moment(new Date()).format('DD/MM/YYYY'),
						"modeOfPayment" 			: "online"
					}, 
			},
			function(error,result){
				if(error){
					return error;
				}else{
					BusinessAds.update(
						{"businessLink": businessLink, "status":"new"},
						{ $set:	{ 
									"status" 	: "active",
								}, 
						},{multi: true},
						function(error1,result1){
							if(error1){
								return error1;
							}
							if(result1){
								return result1;
							}
						}
					);
					return result;
				}
			}
		);
	},

	'updateInvoiceforPayment':function(_id,offerId,mode){
		Payment.update(
			{"_id": _id},
			{ $set:	{ 
						"paymentStatus" 			: "paid",
						"paymentDate" 				: moment(new Date()).format('DD/MM/YYYY'),
						"modeOfPayment" 			: mode
					}, 
			},
			function(error,result){
				if(error){
					return error;
				}else{
					Offers.update(
						{"_id": offerId},
						{ $set:	{ 
									"offerStatus" 	: "Active",
								}, 
						},
						function(error1,result1){
							if(error1){
								return error1;
							}
							if(result1){
								return result1;
							}
						}
					);
					return result;
				}
			}
		);
	},

	'insertAdsPayment':function(formValues){
		return Payment.insert({  
			"vendorId"  			: formValues.vendorId,
			"businessId"  			: formValues.businessId,
			"businessLink" 			: formValues.businessLink, 
			"invoiceNumber"			: formValues.invoiceNumber,
			"invoiceDate"			: new Date(), 
			"discountPercent"		: formValues.discountPercent, 
			"discountedPrice"		: formValues.discountedPrice, 
			"totalAmount"			: formValues.totalAmount, 
			"totalDiscount"			: formValues.totalDiscount,
			"paymentStatus"			: 'unpaid',
			"paymentDate"			: '', 
			"orderType"				: 'Ads',				
		}, function(error,result){
			if(error){
				console.log(error);
				return error;
			}
			if(result){
				return result;
			}
		});
	},
	'updateAdsPayment':function(formValues){
		Payment.update( 
			{"businessLink": formValues.businessLink,"orderType":'Ads'},
			{$set : {
			 	"vendorId"  			: formValues.vendorId,
				"businessId"  			: formValues.businessId,
				"businessLink" 			: formValues.businessLink, 
				"invoiceNumber"			: formValues.invoiceNumber,
				"invoiceDate"			: new Date(), 
				"discountPercent"		: formValues.discountPercent, 
				"discountedPrice"		: formValues.discountedPrice, 
				"totalAmount"			: formValues.totalAmount, 
				"totalDiscount"			: formValues.totalDiscount,
				"paymentStatus"			: 'unpaid',
				"paymentDate"			: '', 
				"orderType"				: 'Ads',				
				}
			}, 
			function(error,result){
				if(error){
					// console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			}
		);
		// return businessLink;
	},
	
});
