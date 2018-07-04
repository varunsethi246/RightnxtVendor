/*=============== vendor profile ===============*/

VendorHomepageFunc = function () {
	import('/imports/common/adminVendorHomepage/adminVendorHomepage.js')
	.then(function (handle) {  
		handle.AdminVendorHomepage();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

vendorDashboardFunc= function () { 
	import('/imports/vendor/vendorDashboard/vendorDashboard.js')
	.then(function (handle) {        
		handle.vendorDashboardForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
vendorbannersFunc= function () {    
	import('/imports/vendor/mybusiness/Banners/vendorbanners.js').then(function (handle) {        
		handle.vendorbannersForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
aboutBusinessFunc= function () {    
	import('/imports/vendor/mybusiness/AboutBusiness/AboutBusiness.js').then(function (handle) {        
		handle.aboutBusinessForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
VendorGotLikesFunc= function () {    
	import('/imports/vendor/mybusiness/Likes/VendorGotLikes.js').then(function (handle) {        
		handle.VendorGotLikesForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(500, function() { $(this).remove(); });
	})
}
VendorBeenThereFunc= function () {    
	import('/imports/vendor/mybusiness/BeenThere/VendorBeenThere.js').then(function (handle) {        
		handle.VendorBeenThereForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
vendorReportFunc= function () {    
	import('/imports/vendor/mybusiness/Report/vendorReport.js').then(function (handle) {        
		handle.vendorReportForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
vendorCommentsFunc= function () {    
	import('/imports/vendor/mybusiness/Comments/VendorComments.js').then(function (handle) {        
		handle.vendorCommentsForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
vendorPhotosFunc= function () {    
	import('/imports/vendor/mybusiness/Photos/vendorPhotos.js').then(function (handle) {        
		handle.vendorPhotosForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
vendorMyOffersFunc= function () {    
	import('/imports/vendor/mybusiness/MyOffers/vendorMyOffers.js').then(function (handle) {        
		handle.vendorMyOffersForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
paymentInvoiceFunc= function () {    
	import('/imports/vendor/mybusiness/MyOffers/vendorMyOffers.js').then(function (handle) {        
		handle.paymentInvoiceForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
paymentSuccessFunc= function () {    
	import('/imports/vendor/mybusiness/MyOffers/vendorMyOffers.js').then(function (handle) {        
		handle.paymentSuccessForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
paymentFailedFunc= function () {    
	import('/imports/vendor/mybusiness/MyOffers/vendorMyOffers.js').then(function (handle) {        
		handle.paymentFailedForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
receiptFunc= function () {    
	import('/imports/vendor/mybusiness/MyOffers/vendorMyOffers.js').then(function (handle) {        
		handle.receiptForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
vendorEnquiryFunc= function () {    
	import('/imports/vendor/mybusiness/Enquiry/vendorEnquiry.js').then(function (handle) {        
		handle.vendorEnquiryForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
vendorAdsFunc= function () {    
	import('/imports/vendor/mybusiness/Ads/vendorAds.js').then(function (handle) {        
		handle.vendorAdsForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
vendorPaymentsFunc= function () {    
	import('/imports/vendor/VendorPayments/VendorPayments.js').then(function (handle) {        
		handle.vendorPaymentsForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
vendorBannerInvoiceFunc= function () {
	// console.log('in banner invoice');    
	import('/imports/vendor/VendorPayments/VendorPayments.js').then(function (handle) {        
		handle.vendorBannerInvoiceForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
vendorAdsInvoiceFunc= function () {    
	import('/imports/vendor/VendorPayments/VendorPayments.js').then(function (handle) {        
		handle.vendorAdsInvoiceForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
paymentSuccessAdsBannersFunc= function () {    
	import('/imports/vendor/VendorPayments/VendorPayments.js').then(function (handle) {        
		handle.paymentSuccessAdsBannersForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
addVendorBusInfoFunc= function () {    
	import('/imports/vendor/AddNewBusiness/addvendorBusInfo.js').then(function (handle) {        
		handle.addVendorBusInfoForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
addvendorOpeningAndClosingFunc= function () {    
	import('/imports/vendor/AddNewBusiness/AddvendorOpeningAndClosing.js').then(function (handle) {        
		handle.addvendorOpeningAndClosingForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
addvendorAboutOwnerFunc= function () {    
	import('/imports/vendor/AddNewBusiness/AddvendorAboutOwner.js').then(function (handle) {        
		handle.addvendorAboutOwnerForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
addvendorImagesVideosFunc= function () {    
	import('/imports/vendor/AddNewBusiness/AddvendorImagesVideos.js').then(function (handle) {        
		handle.addvendorImagesVideosForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
businessListFunc= function () {    
	import('/imports/vendor/businessList/businessList.js').then(function (handle) {        
		handle.businessListForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}