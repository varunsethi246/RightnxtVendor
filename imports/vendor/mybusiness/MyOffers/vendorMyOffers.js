import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Bert } from 'meteor/themeteorchef:bert';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from 'meteor/reactive-var';

import { Business } from '../../../api/businessMaster.js';
import { Offers } from '../../../api/offersMaster.js';
import { Payment } from '../../../api/paymentMaster.js';
import { CompanySettings } from '../../../api/companysettingsAPI.js';
import { OfferImage } from '/imports/videoUploadClient/offerImageClient.js';
import ImageCompressor from 'image-compressor.js';

import '../../vendor.js';
import './VendorMyoffers.html';
import './vendorOffer1.html';
import './vendorOffer2.html';
import './offerAccordian.html';
import './offerPayment.html';
import './paymentInvoice.html';
import './receipt.html';
import './editOffer.html';
import './paymentSuccess.html';
import './paymentFailed.html';
import './viewVendorOffer.html';


var files = [];

function printDiv() {
  var divToPrint=document.getElementById('DivIdToPrint');

  var newWin=window.open('', 'PRINT', 'height=400,width=600');

  newWin.document.open();

  //For potrait view
  newWin.document.write('<html><head></head><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');
  
  //For landscape view
  // newWin.document.write('<html><head><style type="text/css" media="print">@page { size: landscape; }</style></head><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');

  newWin.document.close();

  // setTimeout(function(){newWin.close();},10);

}

Template.vendorMyOffers.helpers({
	businessName(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessName = Business.findOne({"businessLink":businessLink, "status":"active"},{"businessTitle":1});
		return businessName;
	},
});

Template.paymentSuccess.helpers({
	paymentSuccessfull(){
		var status      = FlowRouter.getQueryParam('status');
	    var id          = FlowRouter.getQueryParam('id');
	    var billnumbers = FlowRouter.getQueryParam('billnumbers');
	    var checksum    = FlowRouter.getQueryParam('checksum');
		var userId      = Meteor.userId();
		var payId    	= FlowRouter.getQueryParam('orderId');
 
	    if(status == 'paid'){
            Meteor.call("insertOnlineDetailsToOffers",id, billnumbers, payId, function(err,result){
                if(result){

				}
			});
		}

	},
	invoiceDetailsForOnline(){
		var invNum 			= parseInt(FlowRouter.getQueryParam('InvNo'));
		var businessLink 	= FlowRouter.getQueryParam('BusLink');
		var businessDetails = Business.findOne({"businessLink":businessLink, "status":"active"});
		var companyDetails 	= CompanySettings.findOne({'companyId':101});
		var paymentDetails 	= Payment.findOne({'invoiceNumber':invNum,"orderType":'Offer'});
		var vendorObj = Meteor.users.findOne({'_id':Meteor.userId()});
		if(vendorObj){
			var vendorname = vendorObj.profile.name;
		}

		if(paymentDetails){
			var offers = [];
			var totalPrice = 0;
			for( var i = 0 ; i< paymentDetails.offers.length ; i++)
			{

				var offerObj 	=  Offers.findOne({"_id":paymentDetails.offers[i].offerId});

				offers[i] = {
					"i"			   : (i+1),
					offerId 	   : paymentDetails.offers[i].offerId,
					dealHeadline   : offerObj.dealHeadline,
					numberOfMonths : offerObj.numOfMonths,
					ratePerOffer   : paymentDetails.offerPricePerMonth,
					totalAmount    : parseInt(offerObj.numOfMonths) * parseInt(paymentDetails.offerPricePerMonth),
				}
				totalPrice     = (totalPrice + offers[i].totalAmount);
			}
			
			// var dateTime = paymentDetails.invoiceDate.toLocaleString();
			var dateTime = paymentDetails.invoiceDate;
			var newDateTime = moment(dateTime).format('DD/MM/YYYY hh:mm');
			if(paymentDetails.paymentStatus == 'paid'){
				var payDateTime = moment(paymentDetails.paymentDate).format('DD/MM/YYYY hh:mm');
			}else{
				var payDateTime = "";
			}

			var data = {
				businessName			: businessDetails.businessTitle ,
				companyName				: companyDetails.companyName,
				merchantRef				: paymentDetails._id.toUpperCase(),
				transactionID			: paymentDetails.transactionId,
				invDate					: newDateTime,
				paymentDate				: payDateTime,
				paymentMode 			: paymentDetails.modeOfPayment,
				totalAmount				: paymentDetails.totalAmount,
				totalPrice				: totalPrice,
				transactionMsg 			: paymentDetails.paymentStatus,
				vendorname 				: vendorname,
				invoiceNumber 			: invNum,
				orderNumber 			: paymentDetails.orderNumber
			}
			return data;
		}
	},

});

Template.paymentSuccess.events({
	'click .button2': function(event){
		var invNum       = FlowRouter.getParam('invoiceNumber');
		var businessLink = FlowRouter.getParam('businessLink');
		if(invNum || businessLink){
			if(invNum.split('-')[1]){
				FlowRouter.go('/VendorPayments');
			}else{
				FlowRouter.go('/businessOffers/:businessLink',{'businessLink':businessLink});
			}	
		}else{
			FlowRouter.go('/VendorPayments');
		}
	},
	'click .button1': function(event){
		printDiv();
	},
	'click .shareReceiptEmail' : function(event){
		var userId = Meteor.userId();
		var userDetails = Meteor.users.findOne({'_id':userId});
		if(userDetails){
			if(userDetails.profile){
				var name = userDetails.profile.name;
			}else{
				var name = '';
			}
			var email = $('#toVEmail').val();
			if(email){
			    var divToPrint=document.getElementById('DivIdToPrint');
				var message = '<html><head></head><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>'; 
				// console.log('message ',message);

				var date 		= new Date();
				var currentDate = moment(date).format('DD/MM/YYYY');
				var businessLink = FlowRouter.getQueryParam('BusLink');
				var businessDetails = Business.findOne({"businessLink":businessLink});
				if(businessDetails){
					var msgvariable = {
						'[receipt]' 	: message,
						'[currentDate]'	: currentDate,
						'[username]' 	: name,
						'[businessName]': businessDetails.businessTitle,
						'[message]'		: message,
						// '[dealHeadline]': offerObj.dealHeadline

			       	};

					var inputObj = {
						notifPath	 : "",
						from 		 : userDetails.emails[0].address,
					    to           : email,
					    templateName : 'Mail Receipt',
					    variables    : msgvariable,
					}
					sendMailReceiptNotification(inputObj);
				}
			}else{
				Bert.alert('Please enter email address.','danger','growl-top-right');
			}
		}
		$(event.target).parent().parent().find('input').val('');
	},
});

Template.vendorMyOffers.events({
	
	'click .viewModal': function(event){
		event.preventDefault();
		var id = event.currentTarget.id;
		Session.set('id',id);
	},
	'change .offrdInput': function(event){		
		var offrdInput = event.currentTarget.value;
		Session.set('numberOfOffers', offrdInput);
	},

	'change .numOfMonths': function(event){
		var numOfMonths = event.currentTarget.value;
		Session.set('numOfMonths', numOfMonths);
	},

	'keyup .numOfMonths': function(event){
		var numOfMonths = event.currentTarget.value;
		Session.set('numOfMonths', numOfMonths);
	},

	'change .changeDate': function(event){
		var changeFromDate = new Date(event.currentTarget.value);
		if(Session.get('numOfMonths')){
			var numOfMonths = Session.get('numOfMonths');
		}else{
			var numOfMonths = 1;
		}

		var result = moment(changeFromDate).add(numOfMonths, 'months');
		var newToDate = moment(result).format('YYYY-MM-DD');
		$(event.target).parent().siblings().find('.changeMonth').val(newToDate);
		$(event.target).parent().parent().siblings().find('.changeMonth').val(newToDate);
	},

	// 'change .changeMonth': function(event){
	//  	// Session.set('noOfMonths','');
	// 	var changeFromDate = new Date($('input[name="expirationFromDate"]').val());
	// 	var changeToDate = new Date(event.currentTarget.value);
	// 	var result = moment([changeToDate.getFullYear(), changeToDate.getMonth(), changeToDate.getDate()]).diff(moment([changeFromDate.getFullYear(), changeFromDate.getMonth(), changeFromDate.getDate()]), 'months', true);
	// 	var numOfMonths = Math.ceil(result);
	// 	$('#offerMonthNo').val(numOfMonths);
	// 	Session.set('numOfMonths', numOfMonths);
	// },

	'click .angleToggle': function(event){
    	var $this = $(event.currentTarget);
    	$this.parent().parent().parent().toggleClass('accordianSelect');
		$this.addClass('fa-angle-up');
		$this.removeClass('fa-angle-down');
		var toggleClass = $this.parent().parent().parent().parent().find('.panel-collapse');
		if(toggleClass.hasClass('in')){
			$this.removeClass('fa-angle-up');
    		$this.addClass('fa-angle-down');
		}else{
			
		}
		var panelHeading = $this.parent().parent().parent();
		$('.panel-heading').not(panelHeading).removeClass('accordianSelect');
    	$('.panel-heading').not(panelHeading).find('i').removeClass('fa-angle-up');
		$('.panel-heading').not(panelHeading).find('i').addClass('fa-angle-down');
	},

	'click .panel-heading': function(event){
    	var $this = $(event.target);
   		if($this.hasClass('panel-heading')){
    		$this.toggleClass('accordianSelect');
    		$this.find('i').addClass('fa-angle-up');
    		$this.find('i').removeClass('fa-angle-down');
    		var toggleClass = $this.parent().find('.panel-collapse');
    		if(toggleClass.hasClass('in')){
    			$this.find('i').removeClass('fa-angle-up');
	    		$this.find('i').addClass('fa-angle-down');
    		}else{
    			
    		}
    		$('.panel-heading').not($this).removeClass('accordianSelect');
	    	$('.panel-heading').not($this).find('i').removeClass('fa-angle-up');
    		$('.panel-heading').not($this).find('i').addClass('fa-angle-down');
    	}
    	else if($this.hasClass('panel-title')){
    		$this.parent().toggleClass('accordianSelect');
    		$this.find('i').addClass('fa-angle-up');
    		$this.find('i').removeClass('fa-angle-down');
    		var toggleClass = $this.parent().parent().find('.panel-collapse');
    		if(toggleClass.hasClass('in')){
    			$this.find('i').removeClass('fa-angle-up');
	    		$this.find('i').addClass('fa-angle-down');
    		}else{
    			
    		}
    		$('.panel-title').not($this).parent().removeClass('accordianSelect');
   		 	$('.panel-title').not($this).find('i').removeClass('fa-angle-up');
    		$('.panel-title').not($this).find('i').addClass('fa-angle-down');
    	}
	},

	'submit #OrderForm': function(event,template){
		event.preventDefault();
		var $this = $(event.target);
		$($this).find('input[name="save1"]').attr('disabled','disabled');
		var businessLink = FlowRouter.getParam('businessLink');
		var businessId =  $('input[name="businessId"]').val();
		var numOfMonths = $('input[name="numOfMonths"]').val();
		var imgId = '';
		var imgAvail = $($this).find(('input[name="files"]')).val();

		if(files[0]&&imgAvail){
			const imageCompressor = new ImageCompressor();
		    imageCompressor.compress(files[0])
		        .then((result) => {
		          // console.log(result);

		          // Handle the compressed image file.
		          // We upload only one file, in case
		        // multiple files were selected
		        const upload = OfferImage.insert({
		          file: result,
		          streams: 'dynamic',
		          chunkSize: 'dynamic',
		          // imagetype: 'profile',
		        }, false);

		        upload.on('start', function () {
		          // template.currentUpload.set(this);
		        });

		        upload.on('end', function (error, fileObj) {
		          if (error) {
		            // alert('Error during upload: ' + error);
		            console.log('Error during upload 1: ' + error);
		            console.log('Error during upload 1: ' + error.reason);
		          } else {
		            // alert('File "' + fileObj._id + '" successfully uploaded');
		            Bert.alert('Offer Image uploaded.','success','growl-top-right');
		            // console.log(fileObj._id);
		            // Session.set("vendorImgFilePath",fileObj._id);
		            imgId =  fileObj._id ;
				    var formValues = {
						"businessId"			: businessId,
						"vendorId"  			: Meteor.userId(),
						"dealTemplate" 			: event.target.dealTemplate.value,
						"dealHeadline"			: event.target.dealHeadline.value,
						"dealDescription" 		: event.target.dealDescription.value,
						// "expirationFromDate" 	: event.target.expirationFromDate.value,
						// "expirationToDate" 		: event.target.expirationToDate.value,
						"expirationFromDate" 	: $this.find('#usrtimeFrom').val(),
						"expirationToDate" 		: $this.find('#usrtimeTo').val(),
						"legalNotices"			: event.target.legalNotices.value,
						"offerStatus"			: 'New',
						"numOfMonths"			: numOfMonths,
						"offerImage"			: imgId,
						"businessLink"			: businessLink,
					};

					// var $this = $(event.target);
					Meteor.call('insertOffers',formValues,
						function(error, result, event){
							if(error){
								Bert.alert(error.reason, 'danger','growl-top-right');
								$($this).find('input[name="save1"]').removeAttr('disabled');
							}
							else{
								// Bert.alert("Offer saved sucessfully.",'success','growl-top-right');
								// ============================================================
								// 			Notification Email / SMS / InApp
								// ============================================================
								var vendorId = Meteor.userId();
								// console.log('vendorId ',vendorId); 
								var admin = Meteor.users.findOne({'roles':'admin'});
								// console.log('admin ',admin);

								var vendorDetail = Meteor.users.findOne({'_id':vendorId});
								// console.log('vendorDetail ',vendorDetail);

								var businessDetails = Business.findOne({"_id":businessId});
								// console.log('businessDetails ',businessDetails);
								if(businessDetails){
									if(admin&&vendorDetail){
								    	var adminId = admin._id;

										//Send Notification, Mail and SMS to Current Vendor
										var vendorname 	= vendorDetail.profile.name;
										var username 	= admin.profile.firstName;

					            		var date 		= new Date();
					            		var currentDate = moment(date).format('DD/MM/YYYY');
					            		var msgvariable = {
											'[vendorname]' 	: vendorname,
						   					'[currentDate]'	: currentDate,
											'[businessName]': businessDetails.businessTitle,
											'[dealHeadline]': formValues.dealHeadline

						               	};

										var inputObj = {
											notifPath	 : businessDetails.businessLink,
										    to           : vendorId,
										    templateName : 'Thanks for Submiting Offer',
										    variables    : msgvariable,
										}
										sendInAppNotification(inputObj);

										var inputObj = {
											notifPath	 : businessDetails.businessLink,
											from         : adminId,
										    to           : vendorId,
										    templateName : 'Thanks for Submiting Offer',
										    variables    : msgvariable,
										}
										sendMailNotification(inputObj);

										//Send Notification, Mail and SMS to Admin
					            		var date 		= new Date();
					            		var currentDate = moment(date).format('DD/MM/YYYY');
					            		var msgvariable = {
											'[vendorname]' 	: vendorname,
											'[adminname]'	: username,
						   					'[currentDate]'	: currentDate,
											'[businessName]': businessDetails.businessTitle,
											'[dealHeadline]': formValues.dealHeadline
						               	};

										var inputObj = {
											notifPath	 : businessDetails.businessLink,
										    to           : adminId,
										    templateName : 'Vendor has Submiting Offer',
										    variables    : msgvariable,
										}
										sendInAppNotification(inputObj);

										var inputObj = {
											notifPath	 : businessDetails.businessLink,
											from         : adminId,
										    to           : adminId,
										    templateName : 'Vendor has Submiting Offer',
										    variables    : msgvariable,
										}
										sendMailNotification(inputObj); 
									}
								}
								//============================================================
								// 			End Notification Email / SMS / InApp
								//============================================================
								
								Bert.alert("Offer saved sucessfully.",'success','growl-top-right');

							}
						}	
					);
		          }
		          // template.currentUpload.set(false);
		        });

		        upload.start();
		        })

		        .catch((err) => {
		          // Handle the error
		    })    
		}else{
			imgId = 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg';
			var formValues = {
				"businessId"			: businessId,
				"vendorId"  			: Meteor.userId(),
				"dealTemplate" 			: event.target.dealTemplate.value,
				"dealHeadline"			: event.target.dealHeadline.value,
				"dealDescription" 		: event.target.dealDescription.value,
				// "expirationFromDate" 	: event.target.expirationFromDate.value,
				// "expirationToDate" 		: event.target.expirationToDate.value,
				"expirationFromDate" 	: $this.find('#usrtimeFrom').val(),
				"expirationToDate" 		: $this.find('#usrtimeTo').val(),
				"legalNotices"			: event.target.legalNotices.value,
				"offerStatus"			: 'New',
				"numOfMonths"			: numOfMonths,
				"offerImage"			: imgId,
				"businessLink"			: businessLink,
			};

			// var $this = $(event.target);
			Meteor.call('insertOffers',formValues,
				function(error, result, event){
					if(error){
						Bert.alert(error.reason, 'danger','growl-top-right');
						$($this).find('input[name="save1"]').removeAttr('disabled');
					}
					else{
						Bert.alert("Offer saved sucessfully.",'success','growl-top-right');
						// $($this).find('input[name="save1"]').attr('disabled','disabled');
						// $($this).find('.drag').show();
						// $($this).find('input[name="choosePic"]').css('margin-top','0px');
						// ============================================================
						// 			Notification Email / SMS / InApp
						// ============================================================
						var vendorId = Meteor.userId();
						var admin = Meteor.users.findOne({'roles':'admin'});
						var vendorDetail = Meteor.users.findOne({'_id':vendorId});
						var businessDetails = Business.findOne({"_id":businessId});
						if(businessDetails){
							if(admin&&vendorDetail){
						    	var adminId = admin._id;

								//Send Notification, Mail and SMS to Current Vendor
								var vendorname 	= vendorDetail.profile.name;
								var username 	= admin.profile.firstName;

			            		var date 		= new Date();
			            		var currentDate = moment(date).format('DD/MM/YYYY');
			            		var msgvariable = {
									'[vendorname]' 	: vendorname,
				   					'[currentDate]'	: currentDate,
									'[businessName]': businessDetails.businessTitle,
									'[dealHeadline]': formValues.dealHeadline

				               	};

								var inputObj = {
									notifPath	 : businessDetails.businessLink,
								    to           : vendorId,
								    templateName : 'Thanks for Submiting Offer',
								    variables    : msgvariable,
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : businessDetails.businessLink,
									from         : adminId,
								    to           : vendorId,
								    templateName : 'Thanks for Submiting Offer',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj);

								//Send Notification, Mail and SMS to Admin
			            		var date 		= new Date();
			            		var currentDate = moment(date).format('DD/MM/YYYY');
			            		var msgvariable = {
									'[vendorname]' 	: vendorname,
									'[adminname]'	: username,
				   					'[currentDate]'	: currentDate,
									'[businessName]': businessDetails.businessTitle,
									'[dealHeadline]': formValues.dealHeadline
				               	};

								var inputObj = {
									notifPath	 : businessDetails.businessLink,
								    to           : adminId,
								    templateName : 'Vendor has Submiting Offer',
								    variables    : msgvariable,
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : businessDetails.businessLink,
									from         : adminId,
								    to           : adminId,
								    templateName : 'Vendor has Submiting Offer',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj); 
							}
						}
						//============================================================
						// 			End Notification Email / SMS / InApp
						//============================================================
					}
				}	
			);
		}
	},
});

Template.paymentInvoice.helpers({
	invoiceDetails(){
		var invNum 			= parseInt(FlowRouter.getParam('invoiceNumber'));
		var businessLink 	= FlowRouter.getParam('businessLink');

		var businessDetails = Business.findOne({"businessLink":businessLink, "status":"active"});
		var companyDetails 	= CompanySettings.findOne({'companyId':101});
		// var paymentDetails 	= Payment.findOne({'invoiceNumber':invNum,"orderType":'Offer'});

		var paymentDetails 	= Payment.findOne({'invoiceNumber':invNum});


		if(paymentDetails){
			var offers = [];
			var totalPrice = 0;
			for( var i = 0 ; i< paymentDetails.offers.length ; i++)
			{
				var offerObj 	=  Offers.findOne({"_id":paymentDetails.offers[i].offerId});
				offers[i] = {
					"i"			   : (i+1),
					offerId 	   : paymentDetails.offers[i].offerId,
					dealHeadline   : offerObj.dealHeadline,
					numberOfMonths : offerObj.numOfMonths,
					ratePerOffer   : paymentDetails.offerPricePerMonth,
					totalAmount    : parseInt(offerObj.numOfMonths) * parseInt(paymentDetails.offerPricePerMonth),
				}
				totalPrice     = (totalPrice + offers[i].totalAmount);
			}
			
			var data = {
				businessName			: businessDetails.businessTitle ,
				companyName				: companyDetails.companyName,
				companyAddress			: companyDetails.companyLocationsInfo[0].companyAddress,
				companyPincode			: companyDetails.companyLocationsInfo[0].companyPincode,
				companyCity				: companyDetails.companyLocationsInfo[0].companyCity,
				companyState			: companyDetails.companyLocationsInfo[0].companyState,
				companyCountry			: companyDetails.companyLocationsInfo[0].companyCountry,
				vendorCompanyName 		: businessDetails.businessTitle,
				vendorCompanyAddress 	: businessDetails.businessAddress,
				vendorPincode			: businessDetails.businessZipCode,
				vendorCity				: businessDetails.businessCity,
				vendorState				: businessDetails.businessState,
				vendorArea				: businessDetails.businessArea,
				ratePerOffer 			: companyDetails.rates.ratePerOffer,
				invDate					: moment(paymentDetails.invoiceDate).format('DD/MM/YYYY'),
				invNum 					: paymentDetails.invoiceNumber,
				numberOfMonths			: paymentDetails.numberOfMonths,
				totalAmount				: paymentDetails.totalAmount,
				offers 					: offers,
				totalPrice				: totalPrice,
				paymentMode 			: paymentDetails.modeOfPayment,
				orderNumber 			: paymentDetails.orderNumber,
			}
			// console.log(data);
			return data;
		}
	},

});

Template.paymentInvoice.events({
	'click #placeOrder':function(event){
		event.preventDefault();

		var businessLink = FlowRouter.getParam('businessLink');
		var invoiceNumber = FlowRouter.getParam('invoiceNumber');
		var mode = $('input[name="modeOfPayment"]:checked').val();
		var totalAmount = parseInt(this.totalPrice);
		// console.log('businessLink :',businessLink);
		// console.log('invoiceNumber :',invoiceNumber);
		var receiptObj = Payment.findOne({"vendorId"	  : Meteor.userId(),
										   "businessLink" : businessLink,
										   "invoiceNumber": parseInt(invoiceNumber),
										   "orderType"    :'Offer',
										});
		if(receiptObj){
			if(mode == 'Cash'){
				for (var i = 0; i < receiptObj.offers.length; i++) {
					Meteor.call('updateInvoiceforPayment',receiptObj._id,receiptObj.offers[i].offerId,mode, 
						function(error,result){
							if(error){
								Bert.alert("Error occurs while payment!","danger","growl-top-right");
							}else{
								Bert.alert("Payment successfully completed.","success","growl-top-right");
								var id = receiptObj._id;

								// send mail to admin //
			                    var userData    = Meteor.users.findOne({'roles':'admin'});
			                    if(userData){
				                    var adminID = userData._id;
			                   	}//userData

			                    //send mail to the vendor//
		                     	var paymentData = Payment.findOne({"_id":id,"orderType":'Offer'});
		                      	if(paymentData){
		                        	var vendormailId = paymentData.vendorId;
		                        	var userDetail = Meteor.users.findOne({'_id':vendormailId});
		                        	
			                        if(userDetail){
			                            var notifConf = userDetail.notificationConfiguration.payment;
			                            if(notifConf == "true"){
			                            	var busPaymentId 	= paymentData.businessId;
				                      		var invoiceDate 	= moment(paymentData.invoiceDate).format();
				                      		var numberOfOffers 	= paymentData.numberOfOffers;
				                      		var totalAmount 	= paymentData.totalAmount;
				                      		var paymentDate		= moment(paymentData.paymentDate).format('DD/MM/YYYY');
				                        	var busPaymentId 	= paymentData.businessId;
				                        	var busId 			= Business.findOne({'_id':busPaymentId});
				                        	if(busId){
				                        		var vendorname 		= busId.ownerFullName;
				                        		var businessName 	= busId.businessTitle;
				                        	}
				                        	var date 		= new Date();
		                					var currentDate = moment(date).format('DD/MM/YYYY');
			                            	var msgvariable = {
												'[vendorname]' 			: vendorname,
												'[invoiceDate]' 		: invoiceDate,
												'[numberOfOffers]' 		: numberOfOffers,
												'[totalAmount]' 		: totalAmount,
												'[paymentDate]' 		: paymentDate,
												'[busPaymentId]' 		: busPaymentId,
							   				   	'[businessName]' 		: businessName,
							                   	'[currentDate]'			: currentDate
						               	  	};


											var inputObj = {
											    to           	: vendormailId,
											    templateName 	: 'Payment Successfull',
											    variables    	: msgvariable,
											}

											sendInAppNotification(inputObj);

											var inputObj = {
												from         : adminID,
											    to           : vendormailId,
											    templateName : 'Payment Successfull',
											    variables    : msgvariable,
											}

											sendMailNotification(inputObj);

											var inputObj = {
											    to           : adminID,
											    templateName : 'Payment Successfull',
											    variables    : msgvariable,
											}

											sendInAppNotification(inputObj);

											var inputObj = {
												from         : vendormailId,
											    to           : adminID,
											    templateName : 'Payment Successfull',
											    variables    : msgvariable,
											}

											sendMailNotification(inputObj);  
					                    }
					                }
		                      	}//paymentData 
								FlowRouter.go('/:businessLink/receipt/:invoiceNumber',{'businessLink':businessLink, 'invoiceNumber':invoiceNumber});
							}
						}
					);
				}
			}
			else{
				//Send user to Payment Gateway link
				var current = window.location.host;
				// console.log("window.location : ",current );

				Meteor.call('updateInvoiceforOnlinePayment', businessLink, parseInt(invoiceNumber), current,totalAmount, (error, result)=>{
					if(result){
						window.location = result;
					}
				});
			}
		}
	},	
});

Template.offerPayment.helpers({
	orderData(){
		var companyRates = CompanySettings.findOne({'companyId':101},{"rates":1,"_id":0});
		if(Session.get('numberOfOffers')){
			var numOfOffers = Session.get('numberOfOffers');
		}else{
			var numOfOffers = 1;
		}
		if(Session.get('numOfMonths')){
			var numOfMonths = Session.get('numOfMonths');
		}else{
			var numOfMonths = 1;
		}

		if(companyRates){
			var value = {
				"ratePerOffer" 	: companyRates.rates.ratePerOffer,
				"numOfOffers"	: numOfOffers,
				"numOfMonths"	: numOfMonths,
				"totalPrice"	: companyRates.rates.ratePerOffer * numOfOffers * numOfMonths,
			}
			return value;			
		}
	},
});

Template.offerAccordian.helpers({
	numberOfOffers(){
		var value = [];
		if(Session.get('numOfMonths')){
			var numOfMonths = Session.get('numOfMonths');
		}else{
			var numOfMonths = 1;
		}

		if(Session.get('numberOfOffers')){
			var numberOfOffers = Session.get('numberOfOffers');	
		}else{
			var numberOfOffers = 1;
		}

		for(i=0;i<numberOfOffers;i++){	
			var count = i+1;
			// console.log('count',$('.offerFromDt-'+count).val());
			if($('.offerFromDt-'+count).val()){
				var changeFromDate = new Date($('.offerFromDt-'+count).val());
				var result = moment(changeFromDate).add(numOfMonths, 'months');
			}else{
				var date = new Date(moment().date((moment().date())+1));
				var result = moment(date).add(numOfMonths, 'months');
				// console.log(result);
			}
			var newToDate = moment(result).format('YYYY-MM-DD');
			value.push({"i":(i+1),"todateData":newToDate});
		}
		// console.log(value)
		return value;
	},
	inData(){
		if(this.i == 1){
			return true;
		}	
	}
});

Template.vendorOffer1.helpers({
	dateData(){
		var date = moment().date((moment().date())+1);
		var newDate = moment(date).format('YYYY-MM-DD');
		return newDate;
	},
});

Template.vendorOffer1.events({
	'change .dealx':function(event){
		var dealDescriptionval = $(event.currentTarget).val();
		// console.log(dealDescriptionval);
		if (dealDescriptionval == 'Percent Off') {
			var dealdes = 'X% off on your order';
		}else if(dealDescriptionval == 'Price Off'){
			var dealdes = 'Rs.X off on your total bill';
		}else if(dealDescriptionval == 'Fixed Price'){
			var dealdes = 'Rs. X for our fixed price menu for Limited time';
		}else if(dealDescriptionval == 'Free Item'){
			var dealdes = 'X free glass of juice with every Entry before 7 ';
		}else if(dealDescriptionval == 'Create Your own Deal'){
			var dealdes = 'Create your own Deal';
		}
		$(event.target).parent().siblings().children('input').val(dealdes);	
	},
	'change .businessPhotofiles' : function(event){
		var $this = $(event.target);
		$this.parent().parent().find('output').empty();
		$this.parent().next().find('.drag').hide();
		// $this.parent().find('input[name="choosePic"]').css('margin-top','45%');
		var imageId = $this.parent().parent().find('output').attr('id');
		files = event.target.files; // FileList object\
		// Loop through the FileList and render image files as thumbnails.
		// console.log(files);
		if(files){
			$this.siblings('.vUploadButton1Offer').hide();
			$this.hide();
			for (var i = 0, f; f = files[i]; i++) {
				files[i].businessLink = Session.get('SessionBusinessLink');
				
			    // Only process image files.
			    if (!f.type.match('image.*')) {
			      continue;
				}

				var reader = new FileReader();
				
				// Closure to capture the file information.
			    reader.onload = (function(theFile) {
			      return function(e) {
			        // Render thumbnail.
			        var span = document.createElement('span');
			        span.innerHTML = ['<i class="pull-right fa fa-times-circle cursorPointer exitOfferImage"></i><img class="thumbnail draggedImgOffers imgVendorSpan" src="', e.target.result,
			                          '" title="', escape(theFile.name), '"/>'].join('');
			        document.getElementById(imageId).insertBefore(span, null);
			      };
			    })(f); //end of onload

			    // Read in the image file as a data URL.
			    reader.readAsDataURL(f);
			}// end of for loop
		}
	},
	'click .exitOfferImage' :  function(event){
		files = [];
		var $this = $(event.target);
		$this.parent().parent().siblings('input').show();
		$this.parent().parent().empty();
		$('.businessPhotofiles').val('');
	},	
	'click #imgVendorSpan' :  function(event){
		$('input[name="files"]').val('');
		$(event.target).parent().hide();
		$(event.target).hide();
		$(event.target).parent().parent().parent().find('.drag').show();
		$(event.target).parent().parent().parent().parent().children().find('.uploadButton1').css('margin-top','0px');
	},
});

Template.viewVendorOffer.helpers({
	formvaluesData(){
		var offerId = Session.get('id');
		var offerObj = Offers.findOne({"_id":offerId});
		var offerData = Offers.find({}).fetch();
		var count = 0;
		var headDealY = Session.get('dealHeadY');
		if(offerObj){
			if (headDealY) {

			var dateToDate = headDealY;
			}else{
			var dateToDate = offerObj.expirationToDate;

			}
			var date1 = moment(dateToDate).format('YYYY-MM-DD');
			var dateFromDate = offerObj.expirationFromDate;
			var date2 = moment(dateFromDate).format('YYYY-MM-DD');

			var data={
				dealTemplate 		: offerObj.dealTemplate,
				dealHeadline 		: offerObj.dealHeadline,
				dealDescription 	: offerObj.dealDescription,
				expirationFromDate  : moment(date2).format('DD/MM/YYYY'),
				expirationToDate	: moment(date1).format('DD/MM/YYYY'),
				legalNotices 		: offerObj.legalNotices,
				offerImage 			: offerObj.offerImage,
				id 					: offerObj._id,
			}
		}
		return data;
	},
	offerImgData(){
		var offerId = Session.get('id');
		var offerObj = Offers.findOne({"_id":offerId});
		if(offerObj){
			var pic = OfferImage.findOne({'_id' : offerObj.offerImage});
		}
		return pic;
	}
});

Template.vendorOffer2.helpers({
	formvaluesData(){
		var offerId = Session.get('id');
		var offerObj = Offers.findOne({"_id":offerId});
		var offerData = Offers.find({}).fetch();
		var count = 0;
		var headDealY = Session.get('dealHeadY');
		var selectedPercent = '';
		var selectedPrice = '';
		var selectedFixed = '';
		var selectedFree = '';
		var selectedCreate = '';

		if(offerObj){
			if (headDealY) {

			var dateToDate = headDealY;
			}else{
			var dateToDate = offerObj.expirationToDate;

			}
			var date1 = moment(dateToDate).format('YYYY-MM-DD');
			var dateFromDate = offerObj.expirationFromDate;
			var date2 = moment(dateFromDate).format('YYYY-MM-DD');
			if(offerObj.dealTemplate == 'Percent Off'){
				var selectedPercent = 'selected';
			}else if(offerObj.dealTemplate == 'Price Off'){
				var selectedPrice = 'selected';
			}else if(offerObj.dealTemplate == 'Fixed Price'){
				var selectedFixed = 'selected';
			}else if(offerObj.dealTemplate == 'Free Item'){
				var selectedFree = 'selected';
			}else if(offerObj.dealTemplate == 'Create Your own Deal'){
				var selectedCreate = 'selected';
			} 
			var data={
				selectedPercent 	: selectedPercent,
				selectedPrice 		: selectedPrice,
				selectedFixed 		: selectedFixed,
				selectedFree 		: selectedFree,
				selectedCreate 		: selectedCreate,
				dealTemplate 		: offerObj.dealTemplate,
				dealHeadline 		: offerObj.dealHeadline,
				dealDescription 	: offerObj.dealDescription,
				expirationFromDate  : date2,
				expirationToDate	: date1,
				legalNotices 		: offerObj.legalNotices,
				offerImage 			: offerObj.offerImage,
				id 					: offerObj._id,
			}
		}
		return data;
	},
	offerImgData(){
		var offerId = Session.get('id');
		var offerObj = Offers.findOne({"_id":offerId});
		if(offerObj){
			var pic = OfferImage.findOne({'_id' : offerObj.offerImage});
			// console.log(pic);
		}
		return pic;
	}
});

Template.vendorOffer2.events({
	'click #locationIcon':function(event){
		event.preventDefault();
	    $('.modal-backdrop').hide();
		var windowWidth = $(window).width();
		if(windowWidth <= 767){
    		FlowRouter.go('/terms-of-service');
		}else{
    		FlowRouter.go('https://rightnxt.com/terms-of-service');
		}
	},
	'change .dealy':function(event){
		// var dealDescriptionval = event.target.dealTemplate.value;
		var dealDescriptionval = $('.dealy').val();
		if (dealDescriptionval == 'Percent Off') {
			var dealdes = 'X% off on your order';
		}else if(dealDescriptionval == 'Price Off'){
			var dealdes = 'Rs.X off on your total bill';
		}else if(dealDescriptionval == 'Fixed Price'){
			var dealdes = 'Rs. X for our fixed price menu for Limited time';
		}else if(dealDescriptionval == 'Free Item'){
			var dealdes = 'X free glass of juice with every Entry before 7 ';
		}else if(dealDescriptionval == 'Create Your own Deal'){
			var dealdes = 'Create your own Deal';
			}
		var dealHeadY=$('#dealHeadliney').val(dealdes);
		Session.set('dealHeadY',dealHeadY);		
	},
	'submit #OfferForm': function(event){
		event.preventDefault();
		var id = $(event.target).parent().parent().parent().parent().parent().find('i').attr('id');
		var offers = Offers.findOne({"_id":id});
		var offersImgId = offers.offerImage;
		// var monthVal = (moment($(event.target).find('input[name="expirationFromDate"]').val()).month())+1;
		// var monthVal1 = (moment($(event.target).find('input[name="expirationToDate"]').val()).month())+1;
		// var num = parseInt(monthVal1) - parseInt(monthVal);
		// if(num < 0){
		// 	var offerStatus = 'Inactive';
		// }else if(num > 0 && offers.offerStatus == 'Active'){
		// 	var offerStatus = 'Active';
		// }else if(num > 0 && offers.offerStatus == 'Inactive'){
		// 	var offerStatus = 'Inactive';
		// }
		
		if(offers.offerStatus){
			var offerStatus = offers.offerStatus;
		}else{
			var offerStatus = "";
		}

		var businessLink = FlowRouter.getParam('businessLink');
		
		if(files[0]){
			const imageCompressor = new ImageCompressor();
		    imageCompressor.compress(files[0])
		        .then((result) => {
		          // console.log(result);

		          // Handle the compressed image file.
		          // We upload only one file, in case
		        // multiple files were selected
		        const upload = OfferImage.insert({
		          file: result,
		          streams: 'dynamic',
		          chunkSize: 'dynamic',
		          // imagetype: 'profile',
		        }, false);

		        upload.on('start', function () {
		          // template.currentUpload.set(this);
		        });

		        upload.on('end', function (error, fileObj) {
		          if (error) {
		            // alert('Error during upload: ' + error);
		            console.log('Error during upload 1: ' + error);
		            console.log('Error during upload 1: ' + error.reason);
		          } else {
		            // alert('File "' + fileObj._id + '" successfully uploaded');
		            Bert.alert('Offer Image uploaded.','success','growl-top-right');
		            // console.log(fileObj._id);
		            // Session.set("vendorImgFilePath",fileObj._id);
		            imgId =  fileObj._id ;
		            var formValues = {
						"dealTemplate" 			: event.target.dealTemplate.value,
						"dealHeadline"			: event.target.dealHeadline.value,
						"dealDescription" 		: event.target.dealDescription.value,
						// "expirationFromDate" 	: event.target.expirationFromDate.value,
						// "expirationToDate" 		: event.target.expirationToDate.value,
						"expirationFromDate" 	: $(event.target).find('#usrtimeOne').val(),
						"expirationToDate" 		: $(event.target).find('#usrtimeTwo').val(),
						"legalNotices"			: event.target.legalNotices.value,
						"numOfMonths"			: offers.numOfMonths,
						"offerImage"			: imgId,
						"offerStatus"			: offerStatus,
						"businessLink" 			: businessLink,
					};

					Meteor.call('updateOffers',formValues,id,
						function(error, result){
							if(error){
								Bert.alert(error.reason,"danger","growl-top-right");
							}else{
								Bert.alert("Offer updated sucessfully.","success","growl-top-right");
								$('.modal-backdrop').hide();
								$('.modaledit').hide();
							}
						}
					);
		          }
		          // template.currentUpload.set(false);
		        });

		        upload.start();
		        })

		        .catch((err) => {
		          // Handle the error
		    })
		}else{
			if($(event.target).find('output').is(':empty') && $(event.target).find('.vendor2Img').is(':empty')){
				offerImageId = 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg';
			}else{
				offerImageId = offersImgId;
			}

			var formValues = {
				"dealTemplate" 			: event.target.dealTemplate.value,
				"dealHeadline"			: event.target.dealHeadline.value,
				"dealDescription" 		: event.target.dealDescription.value,
				// "expirationFromDate" 	: event.target.expirationFromDate.value,
				// "expirationToDate" 		: event.target.expirationToDate.value,
				"expirationFromDate" 	: $(event.target).find('#usrtimeOne').val(),
				"expirationToDate" 		: $(event.target).find('#usrtimeTwo').val(),
				"legalNotices"			: event.target.legalNotices.value,
				"numOfMonths"			: offers.numOfMonths,
				"offerImage"			: offerImageId,
				"offerStatus"			: offerStatus,
				"businessLink" 			: businessLink,
			};

			Meteor.call('updateOffers',formValues,id,
				function(error, result){
					if(error){
						Bert.alert(error.reason,"danger","growl-top-right");
					}else{
						Bert.alert("Offer updated sucessfully.","success","growl-top-right");
						$('.modal-backdrop').hide();
						$('.modaledit').hide();
					}
				}
			);
		}
	},
	'change .businessPhotofiles' : function(event){
		var $this = $(event.target);
		$this.parent().parent().find('output').empty();
		// $('.drag').hide();
		$this.parent().next().find('.drag').hide();
		$this.parent().parent().find('.vendor2Img').empty();
		var imgId = $this.parent().parent().find('output').attr('id','setImgID');
		var imageId = $this.parent().parent().find('output').attr('id');
		// $this.parent().parent().css('margin-bottom','-30px');

		files = event.target.files; // FileList object\
		if(files){
			$this.siblings('.vUploadButton1Offer').hide();
			$this.hide();
			// Loop through the FileList and render image files as thumbnails.
			for (var i = 0, f; f = files[i]; i++) {
				files[i].businessLink = Session.get('SessionBusinessLink');
				
			    // Only process image files.
			    if (!f.type.match('image.*')) {
			      continue;
				}

				var reader = new FileReader();
				
				// Closure to capture the file information.
			    reader.onload = (function(theFile) {
			      return function(e) {
			        // Render thumbnail.
			        var span = document.createElement('span');
			        span.innerHTML = ['<i class="pull-right fa fa-times-circle cursorPointer exitOfferImage"></i><img class="thumbnail draggedImgOffers imgVendorSpan" src="', e.target.result,
			                          '" title="', escape(theFile.name), '"/>'].join('');
			        document.getElementById(imageId).insertBefore(span, null);
			      };
			    })(f); //end of onload

			    // Read in the image file as a data URL.
			    reader.readAsDataURL(f);
			}// end of for loop
		}
	},
	'click .exitOfferImage' :  function(event){
		files = [];
		var $this = $(event.target);
		$this.parent().parent().siblings('input').show();
		$this.parent().parent().empty();
		$('.businessPhotofiles').val('');
	},
	'click .delOfferImage' :  function(event){
		var $this = $(event.target);
		var id = $this.attr('id');
		var imgId = $this.attr('data-imgid');
		
		Meteor.call('deleteOfferImg',id,
            function(error, result) { 
              if(error) {
                console.log ('Error Message: ' +error ); 
              }else{
				Meteor.call('removeOfferImage',imgId,
		            function(error, result) { 
		              if(error) {
		                console.log ('Error Message: ' +error ); 
		              }else{
		            }
				});
            }
		});
	}	
});

Template.receipt.helpers({
	paymentcheck(){
		var invNum 			= parseInt(FlowRouter.getParam('invoiceNumber'));

		var paymentDetails 	= Payment.findOne({'invoiceNumber':invNum,"orderType":'Offer'});
		// console.log('paymentDetails :',paymentDetails);
		if(paymentDetails){
			var paymentStatusOne = paymentDetails.paymentStatus;
			if (paymentStatusOne == 'unpaid') {
		// console.log('paymentDetails true:',paymentStatusOne);

				return true;

			}else{
		// console.log('paymentDetails false:',paymentStatusOne);
				
				// var PaymentSuccess = 'Payment Successful';
				return false;
			}
		}
	},
	receiptDetails(){
		var invNum 			= parseInt(FlowRouter.getParam('invoiceNumber'));
		var businessLink 	= FlowRouter.getParam('businessLink');
		var businessDetails = Business.findOne({"businessLink":businessLink, "status":"active"});
		var companyDetails 	= CompanySettings.findOne({'companyId':101});
		var paymentDetails 	= Payment.findOne({'invoiceNumber':invNum});
		var vendorObj = Meteor.users.findOne({'_id':Meteor.userId()});
		if(vendorObj){
			var vendorname = vendorObj.profile.name;
		}

		if(paymentDetails){
			var paymentStatusOne =paymentDetails.paymentStatus;
			if (paymentStatusOne == 'unpaid') {
				if(paymentDetails.modeOfPayment){
					var PaymentSuccess = 'Payment Failed';
					var PaymentClass = 'text-danger';
					var payDateTime = "";
				}else{
					var PaymentSuccess = 'Payment Pending';
					var PaymentClass = 'text-danger';
					var payDateTime = "";
				}
			}else{
				var PaymentSuccess = 'Payment Successful';
				var PaymentClass = 'text-success';
				var payDateTime = moment(paymentDetails.paymentDate).format('DD/MM/YYYY hh:mm');
			}

			if(paymentDetails.orderType=='Offer'){
				var offers = [];
				var totalPrice = 0;
				for( var i = 0 ; i< paymentDetails.offers.length ; i++)
				{

					var offerObj 	=  Offers.findOne({"_id":paymentDetails.offers[i].offerId});

					offers[i] = {
						"i"			   : (i+1),
						offerId 	   : paymentDetails.offers[i].offerId,
						dealHeadline   : offerObj.dealHeadline,
						numberOfMonths : offerObj.numOfMonths,
						ratePerOffer   : paymentDetails.offerPricePerMonth,
						totalAmount    : parseInt(offerObj.numOfMonths) * parseInt(paymentDetails.offerPricePerMonth),
					}
					totalPrice     = (totalPrice + offers[i].totalAmount);
					// var statusPayment = Offers.findOne({})
				}
			}else{
				var totalPrice = paymentDetails.discountedPrice;
			}
			
			var dateTime = paymentDetails.invoiceDate;
			var newDateTime = moment(dateTime).format('DD/MM/YYYY hh:mm');

			var data = {
				businessName			: businessDetails.businessTitle ,
				companyName				: companyDetails.companyName,
				merchantRef				: paymentDetails._id.toUpperCase(),
				vendorname				: vendorname,
				invDate					: newDateTime,
				paymentDate				: payDateTime,
				transactionID			: paymentDetails.transactionId,
				paymentMode 			: paymentDetails.modeOfPayment,
				totalAmount				: paymentDetails.totalAmount,
				totalPrice				: totalPrice,
				transactionMsg 			: PaymentSuccess,
				paymentclass 			: PaymentClass,
				invoiceNumber 			: invNum,
				orderNumber 			: paymentDetails.orderNumber,
			}
			return data;
		}
	},
});

Template.receipt.events({
	'click .buttonMakePaymet': function(event){
		var invNum       = FlowRouter.getParam('invoiceNumber');
		var businessLink = FlowRouter.getParam('businessLink');
		var invoiceNumber = invNum.split('-')[0];
		FlowRouter.go('/businessOffers/:businessLink/invoice/:invoiceNumber',{'businessLink':businessLink, 'invoiceNumber':invoiceNumber}); 	
	},
	'click .button2': function(event){
		var invNum       = FlowRouter.getParam('invoiceNumber');
		var businessLink = FlowRouter.getParam('businessLink');
		if(invNum.split('-')[1]){
			FlowRouter.go('/VendorPayments');
		}else{
			FlowRouter.go('/businessOffers/:businessLink',{'businessLink':businessLink});
		}	
	},
	'click .button1': function(event){
		printDiv();
	},
	'click .shareReceiptEmail' : function(event){
		var userId = Meteor.userId();
		var userDetails = Meteor.users.findOne({'_id':userId});
		if(userDetails){
			if(userDetails.profile){
				var name = userDetails.profile.name;
			}else{
				var name = '';
			}
			var email = $('#toVEmail').val();
			if(email){
			    var divToPrint=document.getElementById('DivIdToPrint');
				var message = '<html><head></head><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>'; 
				// console.log('message ',message);

				var date 		= new Date();
				var currentDate = moment(date).format('DD/MM/YYYY');
				var businessLink = FlowRouter.getParam('businessLink');
				var businessDetails = Business.findOne({"businessLink":businessLink});
				if(businessDetails){
					var msgvariable = {
						'[receipt]' 	: message,
						'[currentDate]'	: currentDate,
						'[username]' 	: name,
						'[businessName]': businessDetails.businessTitle,
						'[message]'		: message,
						// '[dealHeadline]': offerObj.dealHeadline

			       	};

					var inputObj = {
						notifPath	 : "",
						from 		 : userDetails.emails[0].address,
					    to           : email,
					    templateName : 'Mail Receipt',
					    variables    : msgvariable,
					}
					sendMailReceiptNotification(inputObj);
				}
			}else{
				Bert.alert('Please enter email address.','danger','growl-top-right');
			}
		}
		$(event.target).parent().parent().find('input').val('');
	},
});

Template.editOffer.events({
	'click #offersub': function(event){
		event.preventDefault();

	    var businessId =  $('input[name="businessId"]').val();
	    var businessLink =  $('input[name="businessLink"]').val();
		
	 	var formValues = {
			"businessId"  			: businessId,
			"businessLink" 			: businessLink,
		};

		//If vendor already has invoice with 'unpaid' status in payment collection,
		// then don't add new invoice in payment collection.
		var unpaidInvoiceObj = Payment.findOne({"vendorId"	 	: Meteor.userId(), 
												"businessId" 	: formValues.businessId,
												"paymentStatus" : 'unpaid',
												"orderType"		: 'Offer',
											  });
		if(unpaidInvoiceObj){
			var invNum = unpaidInvoiceObj.invoiceNumber;
			//If unpaid invoice for this business exists, then check if any new offer is still 
			//pending to be added into invoice - payment collection
			var offersArray = Offers.find({"vendorId"	 	: Meteor.userId(), 
										   "businessId" 	: formValues.businessId,
										   "offerStatus" 	: 'Payment Pending'
										  }).fetch();
			var newOffersArray = Offers.find({"vendorId"	: Meteor.userId(), 
										   "businessId" 	: formValues.businessId,
										   "offerStatus" 	: 'New'
										  }).fetch(); 
			if(unpaidInvoiceObj.offers){
				if(newOffersArray){
					for(k=0; k<newOffersArray.length; k++){
						for (l=0; l<unpaidInvoiceObj.offers.length;l++) {
							if(newOffersArray[k]._id == unpaidInvoiceObj.offers[l].offerId){
								Meteor.call('removeNewOfferinPayment',unpaidInvoiceObj._id, newOffersArray[k]._id,
									function(error,result){
										if(error){
											Bert.alert('There is some error occur while adding recent offer to invoice!','danger','growl-top-right');
										}
										else{
											// console.log('checking1');
											// Bert.alert('Your recent new Offer added to Invoice.','success','growl-top-right');
										}
									}
								);	
							} 
						}
					}
				}
				if(offersArray){					
					// if(unpaidInvoiceObj.offers.length != offersArray.length){
						for(i=0; i<offersArray.length; i++){
							var offerFound = 'notfound';
							for (j=0; j<unpaidInvoiceObj.offers.length;j++) {
								if(offersArray[i]._id == unpaidInvoiceObj.offers[j].offerId){
									offerFound = 'found';
									break;
								} 
							}
							if(offerFound != 'found'){
								Meteor.call('addNewOfferinPayment',unpaidInvoiceObj._id, offersArray[i]._id,
									function(error,result){
										if(error){
											Bert.alert('There is some error while adding recent offer to invoice!','danger','growl-top-right');
										}
										else{
											// console.log('checking1');
											Bert.alert('Your recent new Offer added to Invoice.','success','growl-top-right');
										}
									}
								);									
							}
						}
					// }
				}
			}
			FlowRouter.go('/businessOffers/:businessLink/invoice/:invoiceNumber',{'businessLink':businessLink, 'invoiceNumber':invNum});
		}else{
			Meteor.call('insertPayment',formValues,
				function(error, result){
					if(error){
						Bert.alert(error.reason, 'danger','growl-top-right');
					}
					else{
						Bert.alert("Payment Invoice is Created!",'success','growl-top-right');
						var payid = result;
						console.log('payid',payid);
						// send mail to admin //
	                    var userData = Meteor.users.findOne({'roles':'admin'});
	                    if(userData){
	                      	var adminID = userData._id; 
	                    }//userData

	                    //send mail to the vendor//
                     	var paymentData = Payment.findOne({"_id":payid,"orderType":'Offer'});
                      	if(paymentData){
                      		var invoiceNumber 	= paymentData.invoiceNumber;
                      		var invoiceDate 	= moment(paymentData.invoiceDate).format();
                      		var numberOfOffers 	= paymentData.numberOfOffers;
                      		var totalAmount 	= paymentData.totalAmount;
                      		var paymentDate		= moment(paymentData.paymentDate).format('DD/MM/YYYY');
                        	var busPaymentId 	= paymentData.businessId;
                        	var busId 			= Business.findOne({'_id':busPaymentId});
                        	if(busId){
                        		var vendorname 		= busId.ownerFullName;
                        		var businessName 	= busId.businessTitle;
                        	}
                        	var date 		= new Date();
		                	var currentDate = moment(date).format('DD/MM/YYYY');
		                	var vendormailId = paymentData.vendorId;
                        	var userDetail = Meteor.users.findOne({'_id':vendormailId});
	                        if(userDetail){
				                var msgvariable = {
									'[invoiceNumber]' 	: invoiceNumber,
									'[invoiceDate]' 	: invoiceDate,
									'[numberOfOffers]' 	: numberOfOffers,
									'[totalAmount]' 	: totalAmount,
									'[paymentDate]' 	: paymentDate,
									'[busPaymentId]' 	: busPaymentId,
									'[businessName]' 	: businessName,
									'[username]' 		: vendorname,
				   				   	// '[orderNo]' 	: '12345',
				                   	'[orderDate]'		: currentDate
				               	};

								var inputObj = {
								    to           : vendormailId,
								    templateName : 'Invoice',
								    variables    : msgvariable,
								}

								sendInAppNotification(inputObj);
								var inputObj = {
									from         : adminID,
								    to           : vendormailId,
								    templateName : 'Invoice',
								    variables    : msgvariable,
								}

								sendMailNotification(inputObj); 
								var inputObj = {
									from         : vendormailId,
								    to           : adminID,
								    templateName : 'Invoice',
								    variables    : msgvariable,
								}

								sendMailNotification(inputObj); 
								var inputObj = {
								    to           : adminID,
								    templateName : 'Invoice',
								    variables    : msgvariable,
								}

								sendInAppNotification(inputObj); 

	                         //    var notifConf = userDetail.notificationConfiguration.invoice;
	                         //    if(notifConf == "true"){
		                        // 	// var inputObj = {
			                       //  //     roles       : 'Vendor',
			                       //  //     to          : vendormailId,
			                       //  //     templateName: 'Invoice',
			                       //  //     OrderId     : payid,
		                        // 	// }
		                        // 	// sendMailnNotif(inputObj);
		                        // }
		                    }
                      	}//paymentData 
	                   

						var maxInvNum = Payment.find({"orderType":'Offer'}, {sort: {invoiceNumber:-1, limit:1}}).fetch();
						if(maxInvNum.length > 0){
							var invNum = maxInvNum[0].invoiceNumber;
							FlowRouter.go('/businessOffers/:businessLink/invoice/:invoiceNumber',{'businessLink':businessLink, 'invoiceNumber':invNum});
						}
					}
				}
			);
		}
	},
	'click .editModal': function(event){
		event.preventDefault();
		$(".vendorOfferForm2-"+this.i).validate({
		 	rules: {
		        dealHeadline: {
		            required: true,
		        },
		        dealDescription: {
		        	required: true,
		        },
		        expirationFromDate: {
		        	required: true,
		        },
		        expirationToDate: {
		        	required: true,
		        },
		        legalNotices: {
		        	required: true,
		        },
		        dealTemplate: {
		        	required: true,
		        },
	    	},
	    });

		var id = event.currentTarget.id;
		Session.set('id',id);

		// $('.modal-backdrop').hide();
		
		if($(event.target).hasClass('inactiveOk')){
			$('#inactOfferModal-'+id).modal('hide');
			// $('#editDataModal-'+id).modal('show');
		}
	},
	'click .deleteModal':function(event){
		event.preventDefault();
		var businessLink = FlowRouter.getParam('businessLink');
		var modelid = $(event.target).attr('id');
		var offerObj 	=  Offers.findOne({"_id":modelid});
		var status = offerObj.offerStatus; 
		if(status == 'New' || status == 'Payment Pending'){
			Meteor.call('deleteOffers',modelid,businessLink,function(error,result){
				if(error){
					Bert.alert(error.reason,"danger","growl-top-right");
					$('.modal-backdrop').hide();
				}else{
					Bert.alert('Offer deleted sucessfully.','success',"growl-top-right");
					Meteor.call('removeOfferImage',offerObj.offerImage,function(error,result){
						if(error){
							console.log(error.reason);
							$('.modal-backdrop').hide();
						}else{

						}
					});

					// ============================================================
					// 			Notification Email / SMS / InApp
					// ============================================================
					var vendorId = Meteor.userId();
					var admin = Meteor.users.findOne({'roles':'admin'});
					var vendorDetail = Meteor.users.findOne({'_id':vendorId});
					var businessDetails = Business.findOne({"businessLink":businessLink});
					if(businessDetails){
						if(admin&&vendorDetail){
					    	var adminId = admin._id;

							//Send Notification, Mail and SMS to Current Vendor
							var vendorname 	= vendorDetail.profile.name;
							var username 	= admin.profile.firstName;

		            		var date 		= new Date();
		            		var currentDate = moment(date).format('DD/MM/YYYY');
		            		var msgvariable = {
								'[vendorname]' 	: vendorname,
			   					'[currentDate]'	: currentDate,
								'[businessName]': businessDetails.businessTitle,
								'[dealHeadline]': offerObj.dealHeadline

			               	};

							var inputObj = {
								notifPath	 : businessDetails.businessLink,
							    to           : vendorId,
							    templateName : 'Offer Deleted',
							    variables    : msgvariable,
							}
							sendInAppNotification(inputObj);

							var inputObj = {
								notifPath	 : businessDetails.businessLink,
								from         : adminId,
							    to           : vendorId,
							    templateName : 'Offer Deleted',
							    variables    : msgvariable,
							}
							sendMailNotification(inputObj);

							//Send Notification, Mail and SMS to Admin
		            		var date 		= new Date();
		            		var currentDate = moment(date).format('DD/MM/YYYY');
		            		var msgvariable = {
								'[vendorname]' 	: vendorname,
								'[adminname]'	: username,
			   					'[currentDate]'	: currentDate,
								'[businessName]': businessDetails.businessTitle,
								'[dealHeadline]': offerObj.dealHeadline
			               	};

							var inputObj = {
								notifPath	 : businessDetails.businessLink,
							    to           : adminId,
							    templateName : 'Vendor deleted Offer',
							    variables    : msgvariable,
							}
							sendInAppNotification(inputObj);

							var inputObj = {
								notifPath	 : businessDetails.businessLink,
								from         : adminId,
							    to           : adminId,
							    templateName : 'Vendor deleted Offer',
							    variables    : msgvariable,
							}
							sendMailNotification(inputObj); 
						}
					}
					//============================================================
					// 			End Notification Email / SMS / InApp
					//============================================================
					$('.modal-backdrop').hide();

				}
			});
		}
	},
	'click .offerCheckbox':function(event){
	    var id = event.target.value;
	    if(event.target.checked){
	    	var status = 'Payment Pending';
	    	$(event.target).prop('checked',true);
		}else{
	    	var status = 'New';
	    	$(event.target).prop('checked',false);
		}
	    Meteor.call("updateOfferStatus",id,status, function(error,result){
	        if(error){
	          console.log(error.reason);
	        }else{
	          // swal("Done","Basic Information inserted successfully!"); 
	        }
        });
	},
	'click .offerStatus':function(event){
		event.preventDefault();
		var modelid = $(event.target).attr('id');
		var offerObj 	=  Offers.findOne({"_id":modelid});
		var status = offerObj.offerStatus; 
		if(status == 'Active'){
			Meteor.call('updateOfferStatus',modelid,'Inactive',function(error,result){
				if(error){
					Bert.alert(error.reason,"danger","growl-top-right");
				}else{
					Bert.alert('Your offer inactivated sucessfully.','success',"growl-top-right");
				}
			});
		}
		else{
			var postDate = offerObj.expirationFromDate;
			var todayDate = moment(new Date()).format("YYYY-MM-DD");
			var expireDate = offerObj.expirationToDate;
			if(expireDate < postDate || expireDate < todayDate){
				// $(event.target).removeAttr('data-target','modal');
				$('#inactOfferModal-'+modelid).modal('show');
			}else{
				if(status == 'Inactive'){
					Meteor.call('updateOfferStatus',modelid,'Active',function(error,result){
						if(error){
							Bert.alert(error.reason,"danger","growl-top-right");
						}else{
							Bert.alert('Your offer activated sucessfully.','success',"growl-top-right");
						}
					});	
				}
			}
		}
	},
});

Template.editOffer.helpers({
	paymentBtn(){
		var businessLink = FlowRouter.getParam("businessLink");
		var businessObj = Business.findOne({"businessLink":businessLink, "status":"active"});
		var valueObj = {'value' : 'disabled'};
		if(businessObj){
			var unpaidOffers = Offers.find({"vendorId":Meteor.userId(),
											"businessId":businessObj._id,
											"offerStatus":"Payment Pending"}).count();
			if(unpaidOffers){
				if(unpaidOffers > 0){
					var valueObj = {'value' : ''};
				}
				return valueObj;				
			}
		}		
		return valueObj;				
	},
	editOffers(){
		var allPages = [];
		var businessLink = FlowRouter.getParam('businessLink');
		var businessName = Business.findOne({"businessLink":businessLink, "status":"active"});
		var businessId = businessName._id;
		var companyRates = CompanySettings.findOne({'companyId':101},{"rates":1,"_id":0});
		allPages = Offers.find({"vendorId":Meteor.userId(),"businessId":businessId}).fetch();
		if(allPages&&allPages.length>0){
			var newAllPages = [];
	    	var countAllPages = 0;
	    	for(i=0;i<allPages.length;i++){
				var postDate = allPages[i].expirationFromDate;
				var todayDate = moment(new Date()).format("YYYY-MM-DD");
				var expireDate = allPages[i].expirationToDate;
				if(expireDate < postDate || expireDate < todayDate){
					// var offerStatus = 'inactive';
					Meteor.call('updateInactiveStatus',allPages[i]._id,'Inactive',businessLink,function(error,result){
						if(error){
							Bert.alert(error.reason,"danger","growl-top-right");
						}else{
							// Bert.alert('Offer status updated sucessfully.','success',"growl-top-right");
						}
					});
					allPages[i].showActive = false;
				}else{
					if(allPages[i].offerStatus=='Inactive'){
						allPages[i].showActive = true;
					}else{
						allPages[i].showActive = false;
					}
				}

				if(todayDate >= postDate&&allPages[i].offerStatus=='Paid'){
					Meteor.call('updateInactiveStatus',allPages[i]._id,'Active',businessLink,function(error,result){
						if(error){
							Bert.alert(error.reason,"danger","growl-top-right");
						}else{
							// Bert.alert('Offer status updated sucessfully.','success',"growl-top-right");
						}
					});
				}
				
				if(allPages[i].offerStatus=='Inactive'){
    				newAllPages.splice((allPages.length-1),0,allPages[i]);		
				}else{
					newAllPages.splice(countAllPages,0,allPages[i]);
					countAllPages++;
				}
			}
			// console.log('newAllPages',newAllPages)
			if(newAllPages&&newAllPages.length>0){
				for (var j = 0; j < newAllPages.length; j++) {
					if(companyRates){
						if(companyRates.rates){
							var getPaymentStatus = Payment.findOne({'offers.offerId':newAllPages[j]._id});
							if(getPaymentStatus){
								var payment = parseInt(getPaymentStatus.offerPricePerMonth) * parseInt(newAllPages[j].numOfMonths);
							}else{
								var payment = companyRates.rates.ratePerOffer * newAllPages[j].numOfMonths;
							}
						}else{
							var payment = 0;
						}			
					}else{
						var payment = 0;
					}

					
					newAllPages[j] = {
						"i"					: (j+1),
						_id 				: newAllPages[j]._id,
						offerStatus 		: newAllPages[j].offerStatus,
						dealHeadline		: newAllPages[j].dealHeadline,
						expirationFromDate 	: moment(newAllPages[j].expirationFromDate).format('DD/MM/YYYY'),
						expirationToDate 	: moment(newAllPages[j].expirationToDate).format('DD/MM/YYYY'),
						payment 			: payment,
						buttonActive 		: newAllPages[j].showActive,
					};
				}
			}
			console.log('newAllPages',newAllPages);
			return newAllPages;			
		}
	},
	showEditOffer(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessName = Business.findOne({"businessLink":businessLink, "status":"active"});
		if(businessName){
			var businessId = businessName._id;
		}
		var offersObj = Offers.findOne({"vendorId":Meteor.userId(),"businessId":businessId});
		if(offersObj){
			return true;
		}else{
			return false;
		} 
	},
	disableEditOffer(){
		var offerStatus = this.offerStatus;
		if(offerStatus != 'Inactive'){
			return true;
		}else{
			return false;
		}
	},
	showDeleteOffer(){
		var offerStatus = this.offerStatus;
		if(offerStatus == 'New' || offerStatus == 'Payment Pending' || offerStatus == 'Inactive'){
			return true;
		}else{
			return false;
		}
	},
	showCheckedOffer(){
		var offerStatus = this.offerStatus;
		if(offerStatus == 'Payment Pending'){
			return true;
		}else{
			return false;
		}
	},
	showActiveOffer(){
		var offerStatus = this.offerStatus;
		if(offerStatus == 'Active'){
			return true;
		}else{
			return false;
		}
	},
	activeInactiveOffer(){
		var offerStatus = this.offerStatus;
		if(offerStatus == 'Active' || offerStatus == 'Inactive' || offerStatus == 'Paid'){
			return false;
		}else{
			return true;
		}
	},
});

Template.offerPayment.onRendered(function(){	
});

Template.offerAccordian.onRendered(function(){
});

Template.paymentInvoice.onRendered(function(){
	$("html,body").scrollTop(0);
});

Template.receipt.onRendered(function(){
	$("html,body").scrollTop(0);
	$('.recDiv').show();
});

Template.vendorMyOffers.onRendered(function(){
	$("html,body").scrollTop(0);
	Session.set('numberOfOffers','');
	Session.set('numOfMonths','');
	Session.set('id','');
});

Template.editOffer.onRendered(function(){
	Session.set('id','');
});

Template.vendorOffer1.onRendered(function(){
	$("html,body").scrollTop(0);
	$("#OrderForm").validate({
	 	rules: {
	        dealHeadline: {
	            required: true,
	        },
	        dealDescription: {
	        	required: true,
	        },
	        expirationFromDate: {
	        	required: true,
	        },
	        expirationToDate: {
	        	required: true,
	        },
	        legalNotices: {
	        	required: true,
	        },
	        dealTemplate: {
	        	required: true,
	        },
    	},
    });
	var todayNext = new Date().toISOString().split('T')[0];
	document.getElementsByName("expirationToDate")[0].setAttribute('min', todayNext);
	
	var today = new Date().toISOString().split('T')[0];
	document.getElementsByName("expirationFromDate")[0].setAttribute('min', today);
	
	var dates = $("#from").datepicker({
	    minDate: "0",
	    maxDate: "+2Y",
	    defaultDate: "+1w",
	    dateFormat: 'mm/dd/yy',
	    numberOfMonths: 1,
	    onSelect: function(date) {
	        for(var i = 0; i < dates.length; ++i) {
	            if(dates[i].id < this.id)
	                $(dates[i]).datepicker('option', 'maxDate', date);
	            else if(dates[i].id > this.id)
	                $(dates[i]).datepicker('option', 'minDate', date);
	        }
	    } 
	});
});

vendorMyOffersForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'vendorMyOffers'});
}

export { vendorMyOffersForm };

paymentInvoiceForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'paymentInvoice'});
}

export { paymentInvoiceForm };

paymentSuccessForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'paymentSuccess'});
}

export { paymentSuccessForm };

paymentFailedForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'paymentFailed'});
}

export { paymentFailedForm };

receiptForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'receipt'});
}

export { receiptForm };