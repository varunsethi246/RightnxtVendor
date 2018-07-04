
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

loadingFf = function () {    
	import('/imports/common/common.js').then(function (handle) {        
		handle.loadingF();    
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
profileSettingFunc= function () {    
	import('/imports/userarea/profileSetting/profileSetting.js').then(function (handle) {        
		handle.profileSettingForm();    
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
editProfileFunc= function () {    
	import('/imports/userarea/profileSetting/editProfile.js').then(function (handle) {        
		handle.editProfileForm();    
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

ViewAllNotifFunc= function () {    
	import('/imports/admin/commonAdmin/commonAdmin.js').then(function (handle) {        
		handle.ViewAllNotifForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}