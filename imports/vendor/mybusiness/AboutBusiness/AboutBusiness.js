import './AboutBusiness.html';


import { Business } from '/imports/api/businessMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { State } from '/imports/api/masterData/stateMaster.js';
import { City } from '/imports/api/masterData/cityMaster.js';
import { Area } from '/imports/api/masterData/areaMaster.js';
import { Categories } from '/imports/api/masterData/categoriesMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { OwnerImage } from '/imports/videoUploadClient/ownerImageClient.js';

import '../../vendor.js';
import '../../../common/starRating2.html';
// import './VendorBusinessInformation.js';
// import './VendorOpeningAndClosing.js';
// import './vendorAboutOwner.js';
// import './VendorImagesVideos.js';

Template.aboutBusiness.onCreated(function() {
  this.subscribe('ownerImage');
});
Template.aboutBusiness.helpers({
	// showRating(){
	// 	var businessLink = FlowRouter.getParam('businessLink');
	// 	var business = Business.findOne({"businessLink" : businessLink,'status':'active'});
	// 	var latestRating = business.latestRating;		

	// 	var intRating = parseInt(latestRating);
	// 	var balRating = latestRating - intRating;
	// 	var finalRating = intRating + balRating;
	// 	if(balRating > 0 && balRating < 0.5){
	// 		var finalRating = intRating + 0.5;
	// 	}
	// 	if(balRating > 0.5){
	// 		var finalRating = intRating + 1;
	// 	}

	// 	var ratingObj = {};

	// 	for(i=1; i<=10; i++){
	// 		var x = "star" + i;
	// 		if(i <= finalRating*2){
	// 			if( i%2 == 0){
	// 				ratingObj[x] = "fixStar2";
	// 			}else{
	// 				ratingObj[x] = "fixStar1";
	// 			}				
	// 		}else{
	// 			ratingObj[x]  = "";
	// 		}
		
	// 	}
	// 	return ratingObj;
	// },
	showRating(){
		var businessLink = FlowRouter.getParam('businessLink');
		var allReviews = Review.find({"businessLink" : businessLink}).fetch();
		var totalRating = 0;
		for(i=0; i<allReviews.length; i++){
			totalRating = totalRating + allReviews[i].rating;
		}
		// console.log('totalRating: '+totalRating+' | number: '+allReviews.length );
		totalRating = totalRating / allReviews.length ;
		// console.log('totalRating2: '+totalRating);
		var intRating = parseInt(totalRating);
		var balRating = totalRating - intRating;
		var finalRating = intRating + balRating;
		if(balRating < 0.5 && balRating > 0){
			var finalRating = intRating + 0.5;
		}
		if(balRating > 0.5){
			var finalRating = intRating + 1;
		}

		ratingObj = {
		};

		for(i=1; i<=10; i++){

			var x = "star" + i;
			// console.log('x = ', x);
			if(i <= finalRating*2){
				if( i%2 == 0){
					ratingObj[x] = "fixStar2";
				}else{
					ratingObj[x] = "fixStar1";
				}				
			}else{
				ratingObj[x]  = "";
			}
		
		}

		// console.log(ratingObj);
		return ratingObj;
	},

	'thisBusinessDetails' : function(){
		var businessLink = FlowRouter.getParam('businessLink');	

		var data = Business.findOne({"businessLink":businessLink});

		if(data){
			if(data.businessMobile){
		        data.businessMobile=data.businessMobile.substring(3);
		    }
		    if(data.businessAltMobile){
		        data.businessAltMobile=data.businessAltMobile.substring(3);
		    }
		    if(data.ownerMobile){
		        data.ownerMobile=data.ownerMobile.substring(3);
		    }
			// Owner Role
			var vendorRoleDataArray = ['Business Owner','Business Manager','Business Coordinator'];
		    if(vendorRoleDataArray){
			    data.vendorRoles = [];
			    for(i = 0;i < vendorRoleDataArray.length;i++){
			      if (vendorRoleDataArray[i]==data.ownerRole) {
			        var roleObj = {'vendorRole':vendorRoleDataArray[i],'selected':'selected'};
			        data.vendorRoles.push(roleObj);
			      } else {
			        var roleObj = {'vendorRole':vendorRoleDataArray[i],'selected':''};
			        data.vendorRoles.push(roleObj);
			      }
			    }
			}
		  	
		  	// Match states
		    var states = State.find({"country":"India","status":"active"}).fetch();
	      	if(states){
	      		data.states = [];
	        	for(i=0; i<states.length; i++){
	          		if(data.businessState == states[i].state){
	          			var stateObj = {'stateName':states[i].state,'selected':'selected'};
	          			data.states.push(stateObj);
	        		} 	else{
	          			var stateObj = {'stateName':states[i].state,'selected':''};
	          			data.states.push(stateObj);
	        		}
	        	}
	    	}

		  	// Match cities
		  	if(Session.get('busState')){
		  		var stateValue = Session.get('busState');
		  	}	else{
		  		var stateValue = data.businessState;
		  	}
	      	var cities = City.find({"country":"India", "state":stateValue,"status":"active"}).fetch();
	      	if(cities){
	      		data.cities = [];
	        	for(i=0; i<cities.length; i++){
	          		if(data.businessCity == cities[i].city){
	          			var cityObj = {'cityName':cities[i].city,'selected':'selected'};
	          			data.cities.push(cityObj);
	          		}	else{
	          			var cityObj = {'cityName':cities[i].city,'selected':''};
	          			data.cities.push(cityObj);
	          		}
	        	}
	      	}

	      	// Match areas
	      	if(Session.get('busCity')){
		  		var cityValue = Session.get('busCity');
		  	}	else{
		  		var cityValue = data.businessCity;
		  	}
	      	var areas = Area.find({"country":"India", "state":stateValue, "city":cityValue,"status":"active"}).fetch();
	      	if(areas){
	      		data.areas = [];
	        	for(i=0; i<areas.length; i++){
	          		if(data.businessArea == areas[i].area){
	          			var areaObj = {'areaName':areas[i].area,'selected':'selected'};
	          			data.areas.push(areaObj);
	          		}	else{
	          			var areaObj = {'areaName':areas[i].area,'selected':''};
	          			data.areas.push(areaObj);
	          		}
	        	}
	      	}
	      	var areaActiveList = data.areas;
	      	data.areas = _.uniq(areaActiveList, function(p){ return p.areaName; });

	      	// Match zipcodes
	       	if(Session.get('busArea')){
		  		var areaValue = Session.get('busArea');
		   	}	else{
			  	var areaValue = data.businessArea;
		   	}
	      	var zipcodes = Area.find({"country":"India", "state":stateValue,"city":cityValue,"area":areaValue,"status":"active"}).fetch();
	      	if(zipcodes){
	      		data.zipcodes = [];
	        	for(i=0; i<zipcodes.length; i++){
	          		if(data.businessZipCode == zipcodes[i].zipcode){
	          			var zipcodeObj = {'zipcode':zipcodes[i].zipcode,'selected':'selected'};
	          			data.zipcodes.push(zipcodeObj);
	          		}	else{
	          			var zipcodeObj = {'zipcode':zipcodes[i].zipcode,'selected':''};
	          			data.zipcodes.push(zipcodeObj);
	          		}
	        	}
	      	}



		    paymentModeE = data.businessModeOfPay;
		    var paySeperator = '';

		    if(paymentModeE){
			    if (paymentModeE.CreditCard && paymentModeE.DebitCard && paymentModeE.Netbanking &&
		            paymentModeE.Paytm && paymentModeE.Cheque && paymentModeE.Cash) {
			        data.businessModeOfPay.allVal = true;        
			    }else{
			        data.businessModeOfPay.allVal = false;
			    }

			    paySeperator = ', ';
				// Replace Payment Mode Text with Selected value
				var selText = '';
				$.each( data.businessModeOfPay, function(key,value) {
				  	if(value){
				  		selText = selText + key+ paySeperator;
				  	}
				});
				if(selText !== '' || typeof(selText) != 'undefined'){
					var originalSelText =  'Select Payment Modes [Selected Options: ' + selText + ']';
				}else{
					var originalSelText =  'Select Payment Modes';
				}
				originalSelText = originalSelText.replace(', allVal','').replace(/,([^,]*)$/,'$1').replace(/\s([^\s]*)$/,'$1');

				if(originalSelText=="Select Payment Modes [Selected Options:]"){
					data.originalSelText = "Select Payment Modes";
				}else{
					data.originalSelText = originalSelText;
				}
			} else{
				data.originalSelText = "Select Payment Modes";
			}
			Session.set("originalSelText",data.originalSelText);


			// Session.set('inputBoxVal',data.businessTitle);
			Session.set('inputBoxLink',data.businessLink);
			var pic = OwnerImage.findOne({"_id":data.ownerPhoto});

	      	if(pic){
      			if(pic.type == 'image/png'){
					data.checkpngImg = 'bkgImgNone';
					$('#changeOwnerProfilePic').addClass(data.checkpngImg);
				}else{
					data.checkpngImg = '';
					$('#changeOwnerProfilePic').addClass(data.checkpngImg);
				}
	      		data.ownerPhoto = pic.link();
	      	}else {
	      		data.ownerPhoto = '/users/profile/profile_image_dummy.svg';
	      	}
			
	      	if(data.businessVideo ){
	      		if(data.businessVideo == 0 ){
	      			data.businessVideo = false;
	      		}else{
			      	Session.set("videoPresent",1);
			    }
		    }

		    if(data.businesscategories){
		    	for(var i = 0 ; i < data.businesscategories.length; i++){
		    		selectedCategoriesList.push(data.businesscategories[i]);
		    	}
		    }

		    // Show Hide Add Images and Videos Form Menu Options
		    	var statusArr = [];
		    	var statusEnable = '';
		    	if(data.allCategories){
		    		var busCatArr = (data.allCategories).split(',');

		    		if(busCatArr){
		    			for(i=0;i<busCatArr.length;i++){
		    				var catStringSplit = busCatArr[i].split('>');
		    				if(catStringSplit.length==1){
		    					var obj = {
		    						"level":"level0",
		    						"category": (catStringSplit[0]).trim(),
		    					}
		    					statusArr.push(obj);
		    				} else if(catStringSplit.length==2){
		    					var obj = {
		    						"level":"level1",
		    						"category": (catStringSplit[1]).trim(),
		    					}
		    					statusArr.push(obj);
		    				} else if(catStringSplit.length==3){
		    					var obj = {
		    						"level":"level2",
		    						"category": (catStringSplit[2]).trim(),
		    					}
		    					statusArr.push(obj);
		    				} else if(catStringSplit.length==4){
		    					var obj = {
		    						"level":"level3",
		    						"category": (catStringSplit[3]).trim(),
		    					}
		    					statusArr.push(obj);
		    				} else if(catStringSplit.length==5){
		    					var obj = {
		    						"level":"level4",
		    						"category": (catStringSplit[4]).trim(),
		    					}
		    					statusArr.push(obj);
		    				}
		    				
		    			}
		    		}

		    		if(statusArr.length>0){
			    		for(i=0;i<statusArr.length;i++){
			    			var name = statusArr[i].level;
							var value = statusArr[i].category;
							var query = {};
							query[name] = value;

			    			var catVal = Categories.findOne(query);
			    			
			    			if(catVal){
			    				if(catVal.menuStatus=="Disable"){

			    					statusEnable = "disabledCatMenu";
			    				} else {
			    					statusEnable = "enabledCatMenu";
			    					break;
			    				}
			    			}
			    		}
			    	}
		    	} else{
					statusEnable = "disabledCatMenu";
	    		}
		    	data.statusEnable = statusEnable;
		    // Show Hide Add Images and Videos Form Menu Options End
		    





			return data;
		}
	},
});

Template.aboutBusiness.events({
	'click .activeAcco1': function(event) {
		// activeAccoPre
		$(".vAccordionHead").removeClass("accordianSelect");
		$(".activeAcco1").toggleClass("accordianSelect");
		$(".activeAcco1 i").toggleClass("fa-chevron-right fa-chevron-down");

		if($(".activeAcco1 i").hasClass("fa-chevron-right")){
			$(".activeAcco1").removeClass("accordianSelect");
		}

		if($(".activeAcco2 i").hasClass("fa-chevron-down")){
			$(".activeAcco2 i").toggleClass("fa-chevron-right fa-chevron-down");
		}
		if($(".activeAcco3 i").hasClass("fa-chevron-down")){
			$(".activeAcco3 i").toggleClass("fa-chevron-right fa-chevron-down");
		}
		if($(".activeAcco4 i").hasClass("fa-chevron-down")){
			$(".activeAcco4 i").toggleClass("fa-chevron-right fa-chevron-down");
		}
	},
	'click .activeAcco2': function(event) {
		$(".vAccordionHead").removeClass("accordianSelect");
		$(".activeAcco2").addClass("accordianSelect");
		$(".activeAcco2 i").toggleClass("fa-chevron-right fa-chevron-down");

		if($(".activeAcco2 i").hasClass("fa-chevron-right")){
			$(".activeAcco2").removeClass("accordianSelect");
		}

		if($(".activeAcco1 i").hasClass("fa-chevron-down")){
			$(".activeAcco1 i").toggleClass("fa-chevron-right fa-chevron-down");
		}
		if($(".activeAcco3 i").hasClass("fa-chevron-down")){
			$(".activeAcco3 i").toggleClass("fa-chevron-right fa-chevron-down");
		}
		if($(".activeAcco4 i").hasClass("fa-chevron-down")){
			$(".activeAcco4 i").toggleClass("fa-chevron-right fa-chevron-down");
		}

	},
	'click .activeAcco3': function(event) {
		$(".vAccordionHead").removeClass("accordianSelect");
		$(".activeAcco3").addClass("accordianSelect");
		$(".activeAcco3 i").toggleClass("fa-chevron-right fa-chevron-down");

		if($(".activeAcco3 i").hasClass("fa-chevron-right")){
			$(".activeAcco3").removeClass("accordianSelect");
		}

		if($(".activeAcco1 i").hasClass("fa-chevron-down")){
			$(".activeAcco1 i").toggleClass("fa-chevron-right fa-chevron-down");
		}
		if($(".activeAcco2 i").hasClass("fa-chevron-down")){
			$(".activeAcco2 i").toggleClass("fa-chevron-right fa-chevron-down");
		}
		if($(".activeAcco4 i").hasClass("fa-chevron-down")){
			$(".activeAcco4 i").toggleClass("fa-chevron-right fa-chevron-down");
		}
	},
	'click .activeAcco4': function(event) {
		$(".vAccordionHead").removeClass("accordianSelect");
		$(".activeAcco4").addClass("accordianSelect");
		$(".activeAcco4 i").toggleClass("fa-chevron-right fa-chevron-down");

		if($(".activeAcco4 i").hasClass("fa-chevron-right")){
			$(".activeAcco4").removeClass("accordianSelect");
		}

		if($(".activeAcco1 i").hasClass("fa-chevron-down")){
			$(".activeAcco1 i").toggleClass("fa-chevron-right fa-chevron-down");
		}
		if($(".activeAcco2 i").hasClass("fa-chevron-down")){
			$(".activeAcco2 i").toggleClass("fa-chevron-right fa-chevron-down");
		}
		if($(".activeAcco3 i").hasClass("fa-chevron-down")){
			$(".activeAcco3 i").toggleClass("fa-chevron-right fa-chevron-down");
		}
		
	},
	'click .deleteTemp': function(event){
		event.preventDefault();		
		var businessId = $(event.currentTarget).attr("data-bussinessId");
		var vendorId = $(event.currentTarget).attr("data-vendorId");
		// console.log('vendorId :',vendorId);
		var businessTitle = $(event.currentTarget).attr("data-busTitle");
		var businessLink = $(event.currentTarget).attr("data-busLink");
		// console.log('in delete');
		Meteor.call('deleteBusiness',businessId,function(error,result){
			if(error){
				Bert.alert(error.reason,"danger",'growl-top-right');
			}else{
				Bert.alert('Business deleted Successfully','success','growl-top-right');

				// ============================================================
				// 			Notification Email / SMS / InApp
				// ============================================================
				
				var admin = Meteor.users.findOne({'roles':'admin'});
				var vendorDetail = Meteor.users.findOne({'_id':vendorId});
				// console.log('vendorDetail :',vendorDetail);
				var notificationOn = vendorDetail.notificationConfiguration;

				// console.log('notificationOn:',notificationOn);

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
						'[businessName]': businessTitle

	               	};

					var inputObj = {
						notifPath	 : businessLink,
					    to           : vendorId,
					    templateName : 'Delete Business Vendor',
					    variables    : msgvariable,
					}
					// console.log('inputObj :',inputObj);
					
					sendInAppNotification(inputObj);

					var inputObj = {
						notifPath	 : businessLink,
						from         : adminId,
					    to           : vendorId,
					    templateName : 'Delete Business Vendor',
					    variables    : msgvariable,
					}
					// console.log('inputObj :',inputObj);
					sendMailNotification(inputObj);

					//Send Notification, Mail and SMS to Admin
     //        		var date 		= new Date();
     //        		var currentDate = moment(date).format('DD/MM/YYYY');
     //        		var msgvariable = {
					// 	'[vendorname]' 	: vendorname,
					// 	'[adminname]'	: username,
	   	// 				'[currentDate]'	: currentDate,
					// 	'[businessName]': businessTitle

	    //            	};

					// var inputObj = {
					// 	notifPath	 : businessLink,
					//     to           : adminId,
					//     templateName : 'Delete Business Admin',
					//     variables    : msgvariable,
					// }
					// sendInAppNotification(inputObj);

					// var inputObj = {
					// 	notifPath	 : businessLink,
					// 	from         : adminId,
					//     to           : adminId,
					//     templateName : 'Delete Business Admin',
					//     variables    : msgvariable,
					// }
					// sendMailNotification(inputObj); 
				}
				//============================================================
				// 			End Notification Email / SMS / InApp
				//============================================================
				console.log('in meteor');
				// var currentUserId = ;
				var currentRoleData = Meteor.users.findOne({'_id':Meteor.userId()});
				console.log('currentRoleData :',currentRoleData);

				if(currentRoleData){
					console.log('currentRoleData :',currentRoleData);

					if(currentRoleData.roles[0] == "Vendor"){
						FlowRouter.go('/addNewBusiness/businessInfo/');
					}else{
						FlowRouter.go('/listOfBusiness');
					}
				}
			}
		});
		$('.modal-backdrop').hide();
	},
  
  'change .venState': function (events) {
    var state = $(".venState").val();
    Session.set("busState",state);

    var myFuncVar = $(".venState").val();
     if (myFuncVar=='--Select--') {
        $(".SpanBusinessState").addClass("ErrorRedText");
        $(".venState").addClass("SpanLandLineRedBorder");
        $( ".SpanBusinessState" ).text("Please Select Valid State" );
     } else {
        $(".SpanBusinessState").removeClass("ErrorRedText");
        $(".venState").removeClass("SpanLandLineRedBorder");
     }
  },
  
  'change .venCity': function (events) {
  	var city = $(".venCity").val();
    Session.set("busCity",city);

    var myFuncVar = $(".venCity").val();
    if (myFuncVar=='--Select--') {
        $(".SpanBusinessCity").addClass("ErrorRedText");
        $(".venCity").addClass("SpanLandLineRedBorder");
        $( ".SpanBusinessCity" ).text("Please Select Valid City" );
     } else {
        $(".SpanBusinessCity").removeClass("ErrorRedText");
        $(".venCity").removeClass("SpanLandLineRedBorder");
     }
  },
  'change .venArea': function (events) {
  	var area = $(".venArea").val();
    Session.set("busArea",area);

    var myFuncVar = $(".venArea").val();
     if (myFuncVar=='--Select--') {
        $(".SpanBusinessArea").addClass("ErrorRedText");
        $(".venArea").addClass("SpanLandLineRedBorder");
        $( ".SpanBusinessArea" ).text("Please Select Valid Business Area" );
     } else {
        $(".SpanBusinessArea").removeClass("ErrorRedText");
        $(".venArea").removeClass("SpanLandLineRedBorder");
     }

    var myFuncVarPin = $(".venPin").val();
     if (!myFuncVarPin&&myFuncVarPin==null&&myFuncVarPin=='') {
        $(".SpanBusinessZipCode").addClass("ErrorRedText");
        $(".venPin").addClass("SpanLandLineRedBorder");
        $( ".SpanBusinessZipCode" ).text("Please Select Valid Business Area" );
     } else {
        $(".SpanBusinessZipCode").removeClass("ErrorRedText");
        $(".venPin").removeClass("SpanLandLineRedBorder");
     }
  },
  // 'onfocus .vBusTitleI': function(events){
  // 	$('[data-toggle="tooltip"]').tooltip();
  // }
});

Template.aboutBusiness.onRendered(function(){
	$('html, body').scrollTop(0);
});

aboutBusinessForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'aboutBusiness'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { aboutBusinessForm };