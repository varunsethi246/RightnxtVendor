import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './main.html';

Meteor.startup(() => {
	global.Buffer = function() {}
	global.Buffer.isBuffer = () => false
	// global.Buffer = global.Buffer || require("buffer").Buffer;
});

$(document).on("click",function(){
	$('.activeDownList').hide();
	$('.activeDownListFlag').hide();
});
$(document).on('click',function(){
	$(".loginClosenew").click(function() {
	    $('.loginEmail').val('');
	    $('.loginPassword').val('');
	});
});
// $(document).on('click',function(){
// 	$(function(){
// 		// alert('hi');
// 	    $(".showreviewdiv").slice(0, 1).show(); // select the first ten
// 	    $("#loadmorediv").click(function(e){ // click event for load more
// 	        e.preventDefault();
// 	        $(".showreviewdiv:hidden").slice(0, 1).show(); // select next 10 hidden divs and show them
// 	        if($(".showreviewdiv:hidden").length == 0){ // check if any hidden divs still exist
// 	            alert("No more divs"); // alert if there are none left
// 	        }
// 	    });
// 	});
// });

Meteor.startup(function () {
  TimeSync.loggingEnabled = false;

	generateURLid =function(id){
		var newurl = 'q=rightnxt+url&oq=user..69i57j0j69i60l2j0l2.4907j0j7&'+id+'&sourceid=chrome&ie=UTF-8';
			return newurl;
		}
		produceURLid = function (id){
			var newid = id.split('&');
			return newid[2];
		}
	});


VendorHomepageFunc = function () {
	import('/imports/common/adminVendorHomepage/adminVendorHomepage.js')
	.then(function (handle) {  
		handle.AdminVendorHomepage();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

UMregisterFunc= function () {
// console.log('asda');    
	import('/imports/common/UM/UMregister.js').then(function (handle) {        
		handle.UMregisterForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

LoginOTPFunc= function () {    
	import('/imports/common/LoginOTP.js').then(function (handle) {        
		handle.LoginOTP();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
VenderLoginFormFunc= function () {    
	import('/imports/common/vendorLoginForm.js').then(function (handle) {        
		handle.VenderLoginForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
vendorSignUpFormFunc= function () {    
	import('/imports/common/vendorSignUpForm.js').then(function (handle) {        
		handle.vendorSignUpForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
adminDashboardFunc= function () {    
	import('/imports/admin/admin.js').then(function (handle) {        
		handle.adminDashboard();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
// companysettingsFunc= function () {    
// 	import('/imports/companysettings/companySettings.js').then(function (handle) {        
// 		handle.companysettingsDashboard();    
// 	})
// }

careerJoinUsFormFunc= function () {    
	import('/imports/admin/admin.js').then(function (handle) {        
		handle.careerJoinUsForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

addNewJobFormFunc= function () {    
	import('/imports/general/careers/career.js').then(function (handle) {        
		handle.addNewJobForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
listOfUsersFunc= function () {    
	import('/imports/admin/userManagement/UMlistOfUsers.js').then(function (handle) {        
		handle.listOfUsersForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
editMyProfileAdminFunc= function () {    
	import('/imports/admin/userManagement/UMeditMyProfile.js').then(function (handle) {        
		handle.editMyProfileAdminForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
businessBlkupFunc= function () {    
	import('/imports/admin/masterData/businessBlkup.js').then(function (handle) {        
		handle.businessBlkupForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
adminAddRolesListFunc= function () {    
	import('/imports/admin/userManagement/UMaddRoleList.js').then(function (handle) {        
		handle.adminAddRolesListForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
businessBannerFunc= function () {    
	import('/imports/admin/businessBanner/businessBanner.js').then(function (handle) {        
		handle.businessBannerForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
bannerInvoiceFunc= function () {    
	import('/imports/admin/businessBanner/businessBanner.js').then(function (handle) {        
		handle.bannerInvoiceForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
businessBannerListFunc= function () {    
	import('/imports/admin/businessBanner/businessBannerList.js').then(function (handle) {        
		handle.businessBannerListForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
businessAdsFunc= function () {    
	import('/imports/admin/businessAds/businessAds.js').then(function (handle) {        
		handle.businessAdsForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
adsInvoiceFunc= function () {    
	import('/imports/admin/businessAds/businessAds.js').then(function (handle) {        
		handle.adsInvoiceForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
businessAdsListFunc= function () {    
	import('/imports/admin/businessAds/businessAdsList.js').then(function (handle) {        
		handle.businessAdsListForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
adsDiscountManagementFunc= function () {    
	import('/imports/admin/businessAds/positionAndDiscountManagement/adsManagement.js').then(function (handle) {        
		handle.adsDiscountManagementForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
adsPositionManagementFunc= function () {    
	import('/imports/admin/businessAds/positionAndDiscountManagement/adsManagement.js').then(function (handle) {        
		handle.adsPositionManagementForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
manageLocationsFunc= function () {    
	import('/imports/admin/masterData/masterData.js').then(function (handle) {        
		handle.manageLocationsForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
manageCategoriesListFunc= function () {    
	import('/imports/admin/masterData/masterData.js').then(function (handle) {        
		handle.manageCategoriesListForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
listOfBusinessFunc= function () {    
	import('/imports/admin/myBusiness/myBusinessAdmin.js').then(function (handle) {        
		handle.listOfBusinessForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
editBusinessAdminFunc= function () {    
	import('/imports/admin/myBusiness/myBusinessAdmin.js').then(function (handle) {        
		handle.editBusinessAdminForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

addNewBusInfoAdminFunc= function () {    
	import('/imports/admin/myBusiness/myBusinessAdmin.js').then(function (handle) {        
		handle.addNewBusInfoAdminForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
discountManagementFunc= function () {    
	import('/imports/admin/discountManagement/discountManagement.js').then(function (handle) {        
		handle.discountManagementForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
positionManagementFunc= function () {    
	import('/imports/admin/discountManagement/discountManagement.js').then(function (handle) {        
		handle.positionManagementForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

openCloseDayAdminFunc= function () {    
	import('/imports/admin/myBusiness/myBusinessAdmin.js').then(function (handle) {        
		handle.openCloseDayAdminForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

aboutOwnerAdminFunc= function () {    
	import('/imports/admin/myBusiness/myBusinessAdmin.js').then(function (handle) {        
		handle.aboutOwnerAdminForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

addImagesVidAdminFunc= function () {    
	import('/imports/admin/myBusiness/myBusinessAdmin.js').then(function (handle) {        
		handle.addImagesVidAdminForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

UMdeleteUserConfirmFunc= function () {    
	import('/imports/admin/userManagement/UMlistOfUsers.js').then(function (handle) {        
		handle.UMdeleteUserConfirmForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

createUsersFunc= function () {    
	import('/imports/admin/editUser/createUsers.js').then(function (handle) {        
		handle.createUsersForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

editMyProfilesFunc= function () {    
	import('/imports/admin/editUser/editMyProfiles.js').then(function (handle) {        
		handle.editMyProfilesForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

contactUsListFunc= function () {    
	import('/imports/admin/contactUsList/contactUsList.js').then(function (handle) {        
		handle.contactUsListForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

salesTableViewFunc = function () {    
	import('/imports/admin/salesReport/salesReport.js').then(function (handle) {        
		handle.salesTableViewForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

salesReportTabsBannerFunc = function () {    
	import('/imports/admin/salesReportBanner/salesReportBanner.js').then(function (handle) {        
		handle.salesReportTabsBannerForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

configSettingsFunc= function () {    
	import('/imports/admin/editUser/configSettings.js').then(function (handle) {        
		handle.configSettingsForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

ViewAllNotifsFunc= function () {
	console.log('function');    
	import('/imports/admin/commonAdmin/commonAdmin.js').then(function (handle) {        
		handle.ViewAllNotifsForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

homePageBannerFunc = function () { 
	import('/imports/admin/homePageBanner/homePageBanner.js').then(function (handle) {        
		handle.homePageBannerForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

vendorBusinessLayoutFunc= function () {    
	import('/imports/vendor/vendorBusinessDetails/vendorBusinessDetails.js')
	.then(function (handle) {        
		handle.vendorBusinessLayoutForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}




/* user profile */

userTimelinePageFunc= function () {    
	import('/imports/userarea/userTimeline/userTimelinePage.js')
	.then(function (handle) {        
		handle.userTimelinePageForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

userLikeFunc= function () {    
	import('/imports/userarea/userLike/userLike.js').then(function (handle) {        
		handle.userLikeForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

userReviewPageFunc= function () {    
	import('/imports/userarea/userReview/userReviewPage.js').then(function (handle) {        
		handle.userReviewPageForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

userPhotosFunc= function () {    
	import('/imports/userarea/userPhotos/userPhotos.js').then(function (handle) {        
		handle.userPhotosForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

userFollowersFunc= function () {    
	import('/imports/userarea/userFollowers/userFollowers.js').then(function (handle) {        
		handle.userFollowersForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

userBookmarksFunc= function () {    
	import('/imports/userarea/userBookmarks/userBookmark.js').then(function (handle) {        
		handle.userBookmarksForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

userBeenThereFunc= function () {    
	import('/imports/userarea/userBeenThere/userBeenThere.js').then(function (handle) {        
		handle.userBeenThereForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

userRatingsFunc = function () {    
	import('/imports/userarea/userRatings/userRatings.js').then(function (handle) {        
		handle.userRatingsForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
userOffersFunc= function () {    
	import('/imports/userarea/userOffers/userOffers.js').then(function (handle) {        
		handle.userOffersForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
userEnquiryPageFunc= function () {    
	import('/imports/userarea/userEnquiry/userEnquiry.js').then(function (handle) {        
		handle.userEnquiryPageForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
profileSettingFunc= function () {    
	import('/imports/userarea/profileSetting/profileSetting.js').then(function (handle) {        
		handle.profileSettingForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
editProfileFunc= function () {    
	import('/imports/userarea/profileSetting/editProfile.js').then(function (handle) {        
		handle.editProfileForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

ResetPasswordFunc= function () { 
	// console.log('infunction');   
	import('/imports/common/passwords.js').then(function (handle) {           
		handle.ResetPasswordForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

notificationConfigFunc= function () {    
	import('/imports/notifications/notificationConfig.js').then(function (handle) {        
		handle.notificationConfigForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
ViewAllNotifFuncs = function () {    
	import('/imports/admin/commonAdmin/commonAdmin.js').then(function (handle) {        
		handle.ViewAllNotifsForms();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
loadingFf = function () {    
	import('/imports/common/common.js').then(function (handle) {        
		handle.loadingF();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
// ViewAllNotifsForms
/*=============== vendor profile ===============*/

vendorDashboardFunc= function () {    
	console.log('hello');

	import('/imports/vendor/vendorDashboard/vendorDashboard.js')
	.then(function (handle) {        
		handle.vendorDashboardForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
vendorbannersFunc= function () { 
	console.log('in mainjs');   
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
ViewAllNotifFunc= function () {    
	import('/imports/admin/commonAdmin/commonAdmin.js').then(function (handle) {        
		handle.ViewAllNotifForm();    
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


/*================general page =====================*/

aboutUsFunc= function () {    
	import('/imports/general/aboutUs/aboutUs.js').then(function (handle) {        
		handle.aboutUsForm();    
``	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
careerFunc= function () {    
	import('/imports/general/careers/career.js').then(function (handle) {        
		handle.careerForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
claimFunc= function () {    
	import('/imports/general/claim/claim.js').then(function (handle) {        
		handle.claimForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
contactUsFunc= function () {    
	import('/imports/general/contactUs/contactUs.js').then(function (handle) {        
		handle.contactUsForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
comingSoonFunc= function () {    
	import('/imports/general/generalLayout/generalLayout.js').then(function (handle) {        
		handle.comingSoonForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
joinUsFunc= function () {    
	import('/imports/general/careers/career.js').then(function (handle) {        
		handle.joinUsForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
codeOfConductFunc= function () {    
	import('/imports/general/codeOfConduct/codeOfConduct.js').then(function (handle) {        
		handle.codeOfConductForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
privacyPolicyFunc= function () {    
	import('/imports/general/privacyPolicy/privacyPolicy.js').then(function (handle) {        
		handle.privacyPolicyForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
termsOfServiceFunc= function () {    
	import('/imports/general/termsCondition/termsOfService.js').then(function (handle) {        
		handle.termsOfServiceForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
faqFunc= function () {    
	import('/imports/general/FAQ/faq.js').then(function (handle) {        
		handle.faqForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
merchantGuidelinesFunc= function () {    
	import('/imports/general/merchantGuidelines/merchant.js').then(function (handle) {        
		handle.merchantGuidelinesForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
aboutUsFormTwoFunc= function () {    
	import('/imports/general/aboutUs/aboutUs.js').then(function (handle) {        
		handle.aboutUsFormTwo();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
generalContentFunc= function () {    
	import('/imports/general/generalLayout/generalLayout.js').then(function (handle) {        
		handle.generalContentForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
faqFormThreeFunc= function () {    
	import('/imports/general/FAQ/faq.js').then(function (handle) {        
		handle.faqFormThree();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
editPagesFunc= function () {    
	import('/imports/general/EditPages/editPages.js').then(function (handle) {        
		handle.editPagesForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
jobListFunc= function () {    
	import('/imports/general/careers/career.js').then(function (handle) {        
		handle.jobListForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
createEmailTemplateFunc= function () {    

	import('/imports/notifications/createEmailTemplate.js').then(function (handle) {        
		handle.createEmailTemplateForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})

	
}
editTemplateFunc= function () {    
	import('/imports/notifications/createEmailTemplate.js').then(function (handle) {        
		handle.editTemplateForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})	
}
viewTemplateFunc= function () {    
	import('/imports/notifications/createEmailTemplate.js').then(function (handle) {        
		handle.viewTemplateForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})	
}
userDefinedTemplateFunc= function () {    
	import('/imports/notifications/userDefinedTemplate.js').then(function (handle) {        
		handle.userDefinedTemplateForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})	
}
findYourFriendsFunc= function () {    
	import('/imports/userarea/userFollowers/userFollowers.js').then(function (handle) {        
		handle.findYourFriendsForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})	
}
