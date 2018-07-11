import './claim.html';
import './claimOtp.html';
import './claimProcess.html';
import './alreadyClaimed.html';
import '../../common/header.html';
import '../../common/generalHeader.js';
import '../../common/searchbar.js';
import '../../common/vendorSignUpForm.js';
import '../generalLayout/generalLayout.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { Meteor } from 'meteor/meteor';
import { Business } from '/imports/api/businessMaster.js';
import { Area } from '/imports/api/masterData/areaMaster.js';
import { City } from '/imports/api/masterData/cityMaster.js';

var fields = ['businessTitle'];

claimSearch1 = new SearchSource('business2', fields);

var pageSize = 4;
var totalpgno = 1;

Template.claim.onRendered(function(){
	Session.set('pgno',1);
	totalpgno = 1;
});

Template.claim.helpers({ 

	pgcount:function(){
		var getClaimData   = claimSearch1.getData();
		if(getClaimData){
			if(getClaimData.length > 0){
				var returnpgno = [];
				var totalpgno = Math.ceil(getClaimData.length / 6);
				if(totalpgno > 5){
					var nxtArrow = false;
				}else{
					var nxtArrow = true;
				}
				for(var i=1; i<= totalpgno; i++) {
					if(i == 1)
					{
						var pgnoactive = {
							pgno:i,
							classNm:'active'
						};
						returnpgno.push(pgnoactive);
					}else{
						var pgnoactive = {
							pgno:i,
							classNm:''
						};
						returnpgno.push(pgnoactive);
					}
				}
				var result = {'returnpgno' : returnpgno, 'nxtArrow':nxtArrow};
				return result;
			}
		}     
	},
 
	claimContent: function() {		
		var getClaimData   = claimSearch1.getData();
		if(getClaimData){
			if(getClaimData.length > 0){
				var getpagenoData  = [];
				totalpgno = Math.ceil(getClaimData.length / 6);
				var currentPageNo = Session.get("pgno") - 1;
				var k = currentPageNo * 6 ;
				getpagenoData  = [];
				for(i = k; i < (k+6) ; i++){
						if( i < getClaimData.length){
				    	getpagenoData.push(getClaimData[i]);
						}
				}
			  return getpagenoData;	
			}else{
				return false;
			}
		}else{
			return false;
		}
   	
  },

  claimDetails(businessOwnerId){
  	var businessObj = Business.find({});
  	if(businessObj){
  		var ownerId = businessOwnerId;
  		if(ownerId == "null"){
  			var statusClaim    = 'Claim your business';
  			var statusClass    = 'statusClass-g';
  			var newStatusClass = 'statusClass-green';
  		}
  		else{
  			var statusClaim    = 'Already Claimed';
  			var statusClass    = 'statusClass-r';
  			var newStatusClass = 'statusClass-red';
  		}

  		var data = {
  			statusClaim 	  : statusClaim,
  			statusClass 	  : statusClass,
  			newStatusClass 	: newStatusClass,
  			id 				      : this._id,
  		}
  	}
  	return data;
  },
  showCityClaim(){
  	return citySearch1.getData({
      docTransform: function(doc) {
        return _.extend(doc, {
          owner: function() {
            return City.find({})
          }
        })
      },
      
    }, true);
  },
  showAreasClaim: function(){
    var currentCity = '';
    if(Session.get("claimSelectedCity")){
      currentCity =  Session.get("claimSelectedCity");
    } else {
      currentCity = 'Pune';
    }
    
    var currentArea = Area.find({'city':currentCity,"status":"active"}).fetch();
     currentArea.sort(function(a, b) {
		var textA = a.area.toUpperCase();
		var textB = b.area.toUpperCase();
		return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
	});

      return  currentArea;
    // return currentArea;
  }
});

Template.claimOtp.helpers({
	showElement(){
		if(Session.get('idGVal')){
			// console.log("idGVal");
			var id = Session.get('idGVal');
			var businessData = Business.findOne({"_id":id});
			if(businessData){
				var ownerId = businessData.businessOwnerId;
				var mobile = businessData.businessMobile;
				var landline = businessData.businessLandline;
				if(mobile){
					businessObj = {
						ownerId 	: ownerId,
						mobile  	: mobile,
						id 			: id,
						showClaim 	: '',
					}
					return businessObj;	
				}else{
					businessObj = {
						ownerId 	: '',
						mobile  	: '',
						id 			: '',
						showClaim 	: 'eForm',
					}
					return businessObj;
				}
			}		
		}
	},
	replaceMob(){
		if(Session.get('idGVal')){
			var id = Session.get('idGVal');
			var businessData = Business.findOne({"_id":id});
			var businessMobile = businessData.businessMobile;
			var mobile = businessMobile.toString();
			// console.log('mobile length: '+mobile.length);
			if(mobile.length == 13){
				var newMobile = mobile.substring(3,13);
			}else if(mobile.length == 11){
				var newMobile = mobile.substring(1,11);
			}else{
				var newMobile = mobile;
			}
			console.log('newMobile :',newMobile);
			var sub = newMobile.substring(2,8);
			var res = newMobile.replace(sub , "******"); 
			// console.log('mobile: '+res);
			return res;
		}		
	},
});

Template.alreadyClaimed.helpers({
	alreadyClaimData(){
		if(Session.get('idVal')){
			var id = Session.get('idVal');
			var businessData = Business.findOne({"_id":id});
			var businessName = businessData.businessTitle;
			var id = businessData._id;
			var data = {
				businessName : businessName,
				id 			 : id,
			}
			return data;
		}
	}
});


Template.claim.onRendered(function(){
	$(".visible-lg").removeClass("claimlg");
	$(".visible-md").removeClass("claimmd");
	$(".visible-sm").removeClass("claimsm");
	$(".visible-xs").removeClass("claimxs");
	$(window).scroll(function() {
	    if ($(document).scrollTop() > 25) {
	      $(".visible-lg").addClass("claimlg");
	      $(".visible-md").addClass("claimmd");
	      $(".visible-sm").addClass("claimsm");
	      $(".visible-xs").addClass("claimxs");
	    } else {
	   	  $(".visible-lg").removeClass("claimlg");
	      $(".visible-md").removeClass("claimmd");
	      $(".visible-sm").removeClass("claimsm");
	      $(".visible-xs").removeClass("claimxs");
	    }
  	});
	Session.set('idVal','');
	Session.set('idGVal','');
	Session.set("claimSelectedCity",'Pune');
	
});

Template.claim.events({
	"keyup #claimBusiness": _.throttle(function(e) {
		$('.footer-row').removeClass("hidden-lg");
		var claimSearchCity = $("#getClaimCity").val();
		var claimSearchArea = $("#getAreaClaim").val();
    var text = $(e.target).val().trim();
    var searchBusinessText = claimSearchCity + '|' + claimSearchArea + '|' + text;
    if(text == ''){
    	$('#claimRow').hide();
    }
	    claimSearch1.search(searchBusinessText);
	}, 200),

	'keyup #getClaimCity': _.throttle(function(e) {
      var text = $(e.target).val().trim();
      citySearch1.search(text);
    }, 200),

	"click .pageNo":function(event){
    event.preventDefault();
		var clickPageNum = $(event.target).val();
		Session.set('pgno',clickPageNum);
	  $('.pageNo.active').removeClass('active');
    $(event.target).addClass('active');
	},

	'click .claimPreviousButton':function(event){
		event.preventDefault();
		$("#claimNextButton").removeAttr("disabled");
		var num1 = parseInt($('#claimChangeValue1').val()) - 1; $('#claimChangeValue1').val(num1);
		var num2 = parseInt($('#claimChangeValue2').val()) - 1; $('#claimChangeValue2').val(num2);
		var num3 = parseInt($('#claimChangeValue3').val()) - 1; $('#claimChangeValue3').val(num3);
		if(num1 == 1){
		  $("#claimPreviousButton").attr("disabled", "disabled");
		}
		for(var i = 1 ; i <= 3 ; i++){
			var idName = '#claimChangeValue' + i;
			if (Session.get('pgno') == $(idName).val()) {
			  $('.pageNo.active').removeClass('active');
				$(idName).addClass("active");
			}
		}
	},
	'click .claimNextButton':function(event){
		event.preventDefault();
		$("#claimPreviousButton").removeAttr("disabled");
		var num1 = parseInt($('#claimChangeValue1').val()) + 1; $('#claimChangeValue1').val(num1);
		var num2 = parseInt($('#claimChangeValue2').val()) + 1; $('#claimChangeValue2').val(num2);
		var num3 = parseInt($('#claimChangeValue3').val()) + 1; $('#claimChangeValue3').val(num3);
		if (num1 != 1) {
			$("#claimChangeValue1").removeClass("active");
		}
		for(var i = 1 ; i <= 3 ; i++){
			var idName = '#claimChangeValue' + i;
			if (Session.get('pgno') == $(idName).val()) {
			  $('.pageNo.active').removeClass('active');
				$(idName).addClass("active");
			}
		}
		if(num3 == totalpgno){
			$("#claimNextButton").attr("disabled", "disabled")
		}
	},

	'change #getClaimCity': function(event){
	    var selectedCityClaim = event.currentTarget.value;
	    var id = selectedCityClaim.trim();
	    Session.set("claimSelectedCity",id);
	    $('.claimUserCity').text(id)
	    $('#changeCityModal').modal('hide');
	  },
	'click .reclaim' : function(event){
		event.preventDefault();
		var id = event.currentTarget.id;
		Session.set('idGVal',id);
		var businessObj = Business.findOne({'_id' : id});
		var mobile = businessObj.businessMobile;
		var otp = Math.floor(1000 + Math.random() * 9000);

		$('.alreadyClaimed').hide();
		$('.claimOtp').show();
		$('.claimProcess').show();

		if(mobile != ""){
			Meteor.call('sendOtp',mobile,otp,
			function(error,result){
				if(error){
					Bert.alert(error.reason,"danger","growl-top-right");
				}else{
					// Bert.alert('OTP sent.','success',"growl-top-right");
				}
			});
			Meteor.call('updateOtp',id,otp,
			function(error,result){
				if(error){
					Bert.alert(error.reason,"danger","growl-top-right");
				}else{
					// Bert.alert('OTP updated.','success',"growl-top-right");
				}
			});
		}else{
			Bert.alert('Your mobile number is not found. Please press "call back" button to claim your business.','danger','growl-top-right');
		}
	},

	'click .statusClass-r' : function(event){
		event.preventDefault();
		var userId = Meteor.userId();
		if($(event.target).hasClass('statusClass-r') && userId){
			$('.claimOtp').hide();
			$('.claimProcess').show();
			$('.alreadyClaimed').show();
			var targetVal = $(event.target).attr('class');
			var newVal = targetVal.split(' ');
			Session.set('idVal',newVal[3]);
		}
	},

	'click .statusClass-g' : function(event){
		event.preventDefault();
		var targetVal = $(event.target).attr('class');
		var newGVal = targetVal.split(' ');
		var userId = Meteor.userId();
		var id = newGVal[3];
		var businessObj = Business.findOne({'_id' : id});
		var mobile = businessObj.businessMobile;

		if($(event.target).hasClass('statusClass-g') && userId){
			$('.claimOtp').show();
			$('.claimProcess').show();
			$('.alreadyClaimed').hide();
			Session.set('idGVal',newGVal[3]);
		}

		var otp = Math.floor(1000 + Math.random() * 9000);

		if(mobile != ""){
			Meteor.call('sendOtp',mobile,otp,
			function(error,result){
				if(error){
					Bert.alert(error.reason,"danger","growl-top-right");
				}else{
					// Bert.alert('OTP sent.','success',"growl-top-right");
					Meteor.call('updateOtp',id,otp,
					function(error,result){
						if(error){
							Bert.alert(error.reason,"danger","growl-top-right");
						}else{
							// Bert.alert('OTP updated.','success',"growl-top-right");
						}
					});
				}
			});
			
		}else{

			Bert.alert('Your mobile number is not found. Please press "call back" button to claim your business.','danger','growl-top-right');
		}
	},

	'click .statusClass-green' : function(event){
		event.preventDefault();
		var userId = Meteor.userId();

		if($(event.target).hasClass('statusClass-green') && !userId){
			$(event.target).removeAttr("data-target");
			$('.claimOtp').hide();	
			$('.claimProcess').hide();
			$('.alreadyClaimed').hide();
			$('#loginModal').modal('show');
			// $('.loginScreen').hide();
			// $('.signupScreen').hide();
			// $('.thankyouscreen').hide();
			// $('.genLoginSignup').show();
			// $('.signUpBox').hide();
			$('.loginScreen').hide();
			$('.genLoginSignup').hide();
			$('.signupScreen').hide();
			$('.thankyouscreen').hide();
			$('.signUpBox').show();
		}
		else{
			$(event.target).removeAttr("data-target");
			$('#nouserreview').modal('show');
			$('#loginModal').modal('hide');
		}
	},

	'click .statusClass-red' : function(event){
		event.preventDefault();
		var userId = Meteor.userId();

		if($(event.target).hasClass('statusClass-red') && !userId){
			$(event.target).removeAttr("data-target");
			$('.claimOtp').hide();	
			$('.claimProcess').hide();
			$('.alreadyClaimed').hide();
			$('#loginModal').modal('show');
			// $('.loginScreen').hide();
			// $('.signupScreen').hide();
			// $('.thankyouscreen').hide();
			// $('.genLoginSignup').show();
			// $('.signUpBox').hide();
			$('.loginScreen').hide();
			$('.genLoginSignup').hide();
			$('.signupScreen').hide();
			$('.thankyouscreen').hide();
			$('.signUpBox').show();
		}
		else{
			$(event.target).removeAttr("data-target");
			$('#nouserreview').modal('show');
			$('#loginModal').modal('hide');
		}
	},

	'click .addBusiness': function(event){
		event.preventDefault();
		var userId = Meteor.userId();

		if(userId){
			if(Roles.userIsInRole(userId, ['Vendor'])){
				FlowRouter.go('/addNewBusiness/businessInfo');
			}else{
				$('#nouserreview').modal('show');
			}
		}else{
			$('#loginModal').modal('show');
			// $('.loginScreen').hide();
			// $('.signupScreen').hide();
			// $('.thankyouscreen').hide();
			// $('.genLoginSignup').show();
			// $('.signUpBox').hide();	

			// $('.loginScreen').hide();
			// $('.genLoginSignup').hide();
			// $('.signupScreen').hide();
			// $('.thankyouscreen').hide();
			// $('.signUpBox').show();
			$('.loginScreen').hide();
		$('.genLoginSignup').hide();
		$('.signupScreen').hide();
		$('.thankyouscreen').hide();
		$('.signUpBox').show();
		}
	},
	'click .pagenumbers': function(event){
		event.preventDefault();
  	var numOfBoxes = Session.get('inputFields');
  	if(numOfBoxes){
  		numOfBoxes = numOfBoxes + 1;
  	}else{
  		numOfBoxes = 1;
  	}
  	Session.set('inputFields', numOfBoxes);
  },
});

Template.claimOtp.events({
	'click .otpbtn' : function(event){
		event.preventDefault();
		var mobile = $(event.target).parent().parent().find('input[name = "claimMob"]').val();
		var id = $(event.target).parent().parent().find('input[name = "claimName"]').val();
		var businessObj = Business.findOne({'_id': id});
		var typedOtp = $(event.target).siblings().val();
		if(businessObj){
			var savedOtp = businessObj.otp.otp;						
			if(typedOtp == savedOtp){
				Meteor.call('updateOwnerID',id,savedOtp,
				function(error,result){
					if(error){
						Bert.alert(error.reason,"danger","growl-top-right");
					}else{
						// Bert.alert('Entered OTP matches with existing OTP.','success',"growl-top-right");
						$('.modal-backdrop').hide();
						// FlowRouter.go('/addNewBusiness/businessInfo');
						FlowRouter.go('/aboutBusiness/:businessLink',{'businessLink':businessObj.businessLink});
					}
				});
			}else{
				Bert.alert('Entered OTP does not matches with existing OTP.','danger','growl-top-right'); 
			}
		}
	},
	'click .callBkbtn' : function(event){
		event.preventDefault();
		var id = event.currentTarget.id;
		var currentuser = Meteor.userId();
		console.log('currentuser :' ,currentuser);
		var businessId = Session.get("idGVal");
		var Alternate  = $('#alternatenmbers').val();
		console.log('Alternate',Alternate);
		console.log('businessId: ',businessId);
		var businessName = Business.findOne({"_id":businessId});
		if(businessName){
			var name 			= businessName.ownerFullName;
			var businessTitle 	= businessName.businessTitle;
		}//businessName
		console.log('businessName: ',businessName);
		var newdate = new Date();
		var currentdate = moment(newdate).format('DD/MM/YYYY');
		var userData  = Meteor.users.findOne({'roles':'admin'});
        if(userData){
            var adminID = userData._id;
            var msgvariable = {
				'[vendorname]' 		: name,
				'[date]' 			: currentdate,
	           	'[businessname]'	: businessTitle,
	           	'[AlternateNumber]' : Alternate,
	       	};


			var inputObj = {
				from         : adminID,
			    to           : adminID,
			    templateName : 'Claim',
			    variables    : msgvariable,
			}

			sendMailNotification(inputObj);

			var inputObj = {
			    to           : adminID,
			    templateName : 'Claim',
			    variables    : msgvariable,
			} 

			sendInAppNotification(inputObj); 

			// var inputObj = {
	  //           roles       : 'admin',
	  //           to          : adminID,
	  //           templateName: 'Claim',
	  //           OrderId     : id,
	  //       }

	  //       sendMailnNotif(inputObj); 
	        $('#claimLoginModal').modal('hide');
	        
	    }//userData 
	},
});

// claimForm = function () {  
//   // BlazeLayout.render("generalLayoutWithImage",{generalcontent: 'career'});
//   Blaze.render(Template.claim,document.body);
// }

// export { claimForm };
claimForm = function () {  
  BlazeLayout.render("generalLayout" ,{generalcontent: 'claim'});
  // Blaze.render(Template.claim,document.body);
}

export { claimForm };