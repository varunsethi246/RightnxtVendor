import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './vendorAds.html';
import '../../vendor.js';
import './vendorAds.html';
import '../../VendorPayments/VendorPayments.js';
// import '../../VendorPayments/VendorPayments.html'


import { Business } from '../../../api/businessMaster.js';
import { Payment } from '../../../api/paymentMaster.js';
import { Position } from '/imports/api/discountMaster.js';
import { CompanySettings } from '/imports/api/companysettingsAPI.js';
import { BusinessBanner } from '/imports/api/businessBannerMaster.js';
import { BusinessAds } from '/imports/api/businessAdsMaster.js';


Template.vendorAds.helpers({
	'paymentDetailsAds':function(){
		var paymentDetails 	= Payment.find({"vendorId":Meteor.userId(),'orderType':'Ads'},{sort:{invoiceNumber:-1}}).fetch();
		// console.log('paymentDetails :',paymentDetails);
		if(paymentDetails){
		// console.log('paymentDetails 2 :',paymentDetails);

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
					paymentDetails[i].receiptLink = "/" + paymentDetails[i].businessLink + "/receipt/" + paymentDetails[i].invoiceNumber;
				}
			}
			return paymentDetails;
		}

	},
});

vendorAdsForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'vendorAds'});
}

export { vendorAdsForm };