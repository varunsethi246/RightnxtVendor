import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Business } from '/imports/api/businessMaster.js';
import { State } from '/imports/api/masterData/stateMaster.js';
import { City } from '/imports/api/masterData/cityMaster.js';
import { Area } from '/imports/api/masterData/areaMaster.js';
import { CompanySettings } from '/imports/api/companysettingsAPI.js';
import { BusinessBanner } from '/imports/api/businessBannerMaster.js';
import { Discount } from '/imports/api/discountMaster.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { Position } from '/imports/api/discountMaster.js';
import { Payment } from '/imports/api/paymentMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';



import './businessBanner.html';
// import './bannerReceipt.html';
import './bannerInvoice.html';
import './businessBannerList.html';
import './businessBannerList.js';
import '/imports/admin/commonAdmin/commonAdmin.js';


bannerListArr = [];


var options = {
  keepHistory: 0,
  localSearch: false
};


var fields1 = ['businessTitle'];

// claimSearch1 = new SearchSource('business2', fields1, options);
bannerBussinessSearch1 = new SearchSource('bannerBusiness', fields1, options);
var fields2 = ['area'];
areaSearch1 = new SearchSource('area', fields2, options);
var selectedCategories = [];
var fields = ['level0', 'level1', 'level2','level3','level4'];

bannerCategorySearch1 = new SearchSource('bannerCategories', fields, options);
var dataIndex = 0;

Template.businessBanner.onRendered(function(){
	var todayNext = new Date().toISOString().split('T')[0];
	console.log('todayNext',todayNext);
	document.getElementsByName("DateBanner")[0].setAttribute('min', todayNext);

	// var todayNext = new Date().toISOString().split('T')[0];
	// document.getElementsByName("dateCurrent")[0].setAttribute('min', todayNext);
	// To set Current Date plus One Day to Input Field
	var currentdate = new Date();
	var startDate = moment(currentdate);
    var setDate = moment(startDate).add(1, 'days').format('YYYY-MM-DD');
	console.log('setDate',setDate);

    $('#dateCurrent').val(setDate);

    // var startDate = moment(setDate);
    var futureMonth = moment(setDate).add(1, 'M').format('YYYY-MM-DD');
    console.log('futureMonth :',futureMonth);
    
 //    var todayNext = new Date().toISOString().split('T')[0];
	// console.log('todayNext',todayNext);
	document.getElementsByName("EndBanner")[0].setAttribute('min', futureMonth);
    $('.enddate').val(futureMonth);
});

Template.businessBanner.helpers({
	getbusiness: function() {
	    return bannerBussinessSearch1.getData();
  	},

	getArea: function() {
		return areaSearch1.getData();
	},


  	getcategory: function() {
	    var data =  bannerCategorySearch1.getData();
	    data = _.uniq(data, function(p){ return p.level1; });
	    return data;
  	},

	ifDashData: function(content){
		// console.log('content ' , content);
		if(content == '--'){
			return false;
		}
		else
			return true;
	},

	'businessCategories':function(){
  		var businessLink = Session.get("businessLink");
  		var categoryArray = [];  
    	if(businessLink){
	  		var businessDetails = Business.findOne({'businessLink':businessLink});
 	  		if(businessDetails){
	   			if(businessDetails.businesscategories.length > 0){
	 	  			var busCatLength = businessDetails.businesscategories.length;
	 	  			// Category Loop
	   				for(var i=0; i <busCatLength ; i++){
	   					var buscategoryVal = businessDetails.businesscategories[i];
	   					// First check if the category value already been processed.
	   					// if yes, then skip this category processing.
	   					var catgAlreadyProcessed = false;

	   					if(buscategoryVal != ""){
	 	  					var split = buscategoryVal.split(">");
		  					var category = split[1];  					
							var categoryVal = category.trim();

		   					if(categoryArray.length > 0){
			   					for(j=0; j<categoryArray.length; j++){
								    if (categoryArray[j].category == categoryVal) {
								        catgAlreadyProcessed = true;
								        break;
								    }
			   					}	   						
		   					}

		   					if(!catgAlreadyProcessed){
								var categoryBusObj = {
									"category" : categoryVal,
									"businessArray" : [],
								};
								categoryArray.push(categoryBusObj);		   						
		   					}

	 					}// if buscategoryVal

	 	  			}// for i loop


	   				//Add categories coming from "add Category" input field.
	 	  			if(Session.get("catgArray")){
		   				catgAlreadyProcessed = false;
				    	var addCategory = Session.get("catgArray");
				    	// console.log('helper addCategory: ', addCategory);
	   					if(categoryArray.length > 0){
		   					for(j=0; j<categoryArray.length; j++){
		   						for(k=0; k<addCategory.length; k++){
								    if(categoryArray[j].category == addCategory[k]) {
								        catgAlreadyProcessed = true;
								        break;
								    }		   							
		   						}
		   						if(catgAlreadyProcessed){break;}
		   					}	   						
	   					}

	   					if(!catgAlreadyProcessed){
	   						for(k=0; k<addCategory.length; k++){
								var categoryBusObj = {
									"category" : addCategory[k],
									"businessArray" : [],
								};
								categoryArray.push(categoryBusObj);
							}
	   					}

	 	  			}

	 	  		}//businessDetails.businesscategories
	 	  		// Session.set('businessUrl', businessurl);
 	  		}//businessDetails
	   		
    	}//businessId
 

    	// console.log('categoryArray = ',categoryArray);
    	//now create businessArray for each position
    	if(categoryArray.length > 0){
    		for(i=0;i<categoryArray.length;i++){
		    	var pos = 0;
    			for(j=0;j<10;j++){

    				var businessName = '';
    				var status = '';
    				if(j%2 == 0){
	    				var businessRank = 'a';
	    				pos = parseInt(pos) + 1;
    				}else{
    					var businessRank = 'b';
    				}
    				var businessPosition = pos.toString();
    				var selector = {
    								 "position"  	: businessPosition,
									 "category" 	: categoryArray[i].category, 
									 "rank" 		: businessRank,
									 "status" 		: {$in : ['active','new']},
									};
					// console.log('selector = ',selector);

    				// var businessBanner = BusinessBanner.findOne(selector);
    				var businessBanner = BusinessBanner.findOne(selector);

					if(businessBanner){
						// console.log('businessBanner = ',businessBanner);
						businessName = businessBanner.businessTitle;
						status = businessBanner.status;
					}    				

    				if(businessName == '') {
    					var className = "blankRow";
    				}else{
    					var className = "contentRow";
    				}


    				var businessArrayObj = {
    					"businessName" 		: businessName,
    					"businessPosition" 	: pos,
    					"businessRank" 		: businessRank,
    					"className"			: className,
    					"status"			: status,
    				}
    				categoryArray[i].businessArray.push(businessArrayObj);
    			}
	    	}
    	}
 
 		// console.log('categoryArray: ', categoryArray);
 	  	return categoryArray; 
  	},


  	businessRankEqualToa(businessRank){
  		if(businessRank == 'a'){
  			return true;
  		}
  	},

  	selectedCategories(){
  		var catgArray = Session.get('catgArray');
  		console.log("catgArray: ",catgArray);
  		return catgArray; 
  	},
  	selectedAreas(){
  		var areaArray = Session.get('areaBannerArray');
  		// console.log(areaArray);
  		return areaArray; 
  	},


  	selectedCategoryPayment(){		

  		var businessLink = Session.get("businessLink");

    	var businessBanner = BusinessBanner.find({"businessLink":businessLink,"status":"new"}).fetch();
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
    		}
    	}
		return businessBanner;
  	},

  	states(){
  		var states = State.find({"country":"India","status":"active"}).fetch();
         if(states){
            return states;
        }
  	},

  	cities(){
      	var bannerState = Session.get("addbannerStateSess");
      	if(bannerState){
	  		var cities = City.find({"country":"India","state":bannerState,"status":"active"}).fetch();
	         if(cities){
	            return cities;
	        }
	    }
  	},
  	areas(){
      	var bannerState = Session.get("addbannerStateSess");
      	var bannerCity = Session.get("addbannerCitySess");
      	if(bannerCity && bannerState){
	  		var areas = Area.find({"country":"India","state":bannerState,"city":bannerCity,"status":"active"}).fetch();
	         if(areas){
	            return areas;
	        }
	    }
  	},
});




Template.bannerInvoice.helpers({
	checkPaymentStatus(data){
		if(data == "paid"){
			return false;
		}else{
			return true;
		}
	},
	bannerInvoiceData(){
		var businessLink = FlowRouter.getParam('businessLink');
  		var businessDetails = Business.findOne({"businessLink":businessLink, "status":"active"});
		var paymentCheck = Payment.findOne({"businessLink":businessLink,"orderType":"Banner"});

		if(businessDetails){
			if(paymentCheck) {
				console.log('paymentCheck: ',paymentCheck);
				businessDetails.invoiceNumber 	= paymentCheck.invoiceNumber;
		    	businessDetails.discountPercent = paymentCheck.discountPercent;
		    	businessDetails.totalDiscount 	= paymentCheck.totalDiscount;
		    	businessDetails.discountedPrice = paymentCheck.discountedPrice;


			}else{
				businessDetails.invoiceNumber = 'None';
			}
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
			var businessBanner = [];
			if(paymentCheck.paymentStatus == "paid"){
				var selector = {"businessLink":businessLink,"status":"active"};
			}else{
				var selector = {"businessLink":businessLink,"status":"new"};
			}
	    	businessBanner = BusinessBanner.find(selector).fetch();
			
			if(businessBanner && businessBanner.length>0){
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

	    	businessDetails.paymentCheck = paymentCheck.paymentStatus;
	    	businessDetails.businessLink = businessLink;
	    	businessDetails.totalPrice = totalPrice;
	    	businessDetails.businessBanner = businessBanner;
    	}
		return businessDetails;
	},
});

Template.bannerInvoice.events({
	'click .bannerPayButton': function(event){
		var currentLink = $(event.currentTarget).attr('data-busLink');
		var currentVal = $(event.currentTarget).siblings('.bannerPayButtonRadio').val();
		var current = window.location.host;
		console.log("window.location : ",current );
		if(currentVal == "online"){
			Meteor.call("updateBannerPaymentOnline",currentLink,current,(error, result)=>{
				if(result){
					window.location = result;
				}
			});
		}else{
			FlowRouter.go("/businessBannerList");
		}
	},
});


Template.businessBanner.events({
	'click .bannerButton':function(event){
		event.preventDefault();
		var invoiceNumber 	= Counts.get('noOfInvoiceCount')+1;
		console.log('invoiceNumber :',invoiceNumber);
		var businessLink 	= Session.get("businessLink");
		var businessData 	= Business.findOne({"businessLink":businessLink, "status":"active"});

		var totalPrice 		= 0;
    	var businessBanner 	= BusinessBanner.find({"businessLink":businessLink,"status":"new"}).fetch();
    	
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

    	var discountData = Discount.find({}).fetch();

		// To sort an discount percent array by price
		function sortArrOfObjectsByParam(a, b) {
		  const genreA = parseInt(a.price);
		  const genreB = parseInt(b.price);
		  let comparison = 0;
		  if (genreA > genreB) {
		    comparison = 1;
		  } else if (genreA < genreB) {
		    comparison = -1;
		  }
		  return comparison;
		}
		discountData.sort(sortArrOfObjectsByParam);

		var discountPercent = 0;
		if(discountData){
			for(i=0;i<discountData.length;i++){
				if(totalPrice>discountData[i].price){
					discountPercent = discountData[i].discount;
				}
			}
		}

		var totalDiscount = totalPrice*(discountPercent/100)
		var discountedPrice = totalPrice-totalDiscount;

		formValues = {
			'vendorId' 			: 	businessData.businessOwnerId,
			'businessId' 		: 	businessData._id,
			'businessLink' 		: 	businessLink,
			'invoiceNumber'		: 	invoiceNumber,
			'totalAmount'		:	totalPrice,
			'discountPercent'	: 	discountPercent,
			'totalDiscount'		: 	totalDiscount,
			'discountedPrice'	: 	discountedPrice,
		}

		var paymentCheck = Payment.find({"businessLink":businessLink,"orderType":'Banner'}).fetch();

		if(paymentCheck.length>0) {
			formValues.invoiceNumber = paymentCheck[0].invoiceNumber;
			Meteor.call('updateBannerPayment', formValues, function(error,position){
				if(error){
					console.log('Error occured while updating Business Banner: ', error);
				}else{
					if(formValues.totalAmount>0){
						FlowRouter.go('/businessbannersInvoice/:businessLink',{'businessLink':businessLink});
					}
				}
			});
		} else{
			Meteor.call('insertBannerPayment', formValues, function(error,position){
				if(error){
					console.log('Error occured while inserting Business Banner: ', error);
				}else{
					if(formValues.totalAmount>0){
						FlowRouter.go('/businessbannersInvoice/:businessLink',{'businessLink':businessLink});
					}
				}
			});
		}
		

		

	},
	'click .bunchCatCross':function(event){
		var selectedCategories = Session.get('catgArray');
		$(event.currentTarget).parent().remove();
		var catText = $(event.currentTarget).parent().clone().children().remove().end().text().trim();
		var posCat = jQuery.inArray( catText, selectedCategories );
		selectedCategories.splice(posCat,1);
		Session.set('catgArray',selectedCategories);
	},
	'click .bunchAreaCross':function(event){
		var selectedAreas = Session.get('areaBannerArray');
		$(event.currentTarget).parent().remove();
		var areaText = $(event.currentTarget).parent().clone().children().remove().end().text().trim();
		var posArea = jQuery.inArray( areaText, selectedAreas );
		selectedAreas.splice(posArea,1);
		Session.set('areaBannerArray',selectedAreas);
	},

	'change #business': function(event){
		var selectedOption = event.currentTarget.value;
		console.log('selectedOption: ',selectedOption);

		var splitOption = selectedOption.split('|');
		if(splitOption){
			var title    = splitOption[0].trim();
			if(splitOption[1]){
				var splitBusinessLink = splitOption[1].split('/');
				if(splitBusinessLink){
					var businessLink = splitBusinessLink[1].trim();
					Session.set("businessLink",businessLink);


					// Add Area of business from address
					var businessData 	= Business.findOne({"businessLink":businessLink, "status":"active"});
					
					var businessArea = [];
					if(businessData){

						// New Code
						Session.set("busAreaCity",businessData.businessCity);

						var busArea = businessData.businessArea;
						businessArea = [busArea];
					}
					Session.set('areaBannerArray',businessArea);
				}
			}
		}
	},
	'change #getCategory': function(event){
	    var val = event.currentTarget.value;
	    var opts = document.getElementById('bannerSearchCat').childNodes;
	    for (var i = 0; i < opts.length; i++) {
	        if (opts[i].value === val) {
	        	var selectedCatg = event.currentTarget.value;
				Session.set("addCategory",selectedCatg);
				if(Session.get('catgArray')){
					var catgArray = Session.get('catgArray');
				}else{
					var catgArray = [];
				}		
				catgArray.push(selectedCatg);	
				Session.set('catgArray',catgArray);
				$('#getCategory').val('');
	          	break;
	        }
	    }

	},
	'change .getBannerArea': function(event){
		var val = event.currentTarget.value;
	    var opts = document.getElementById('searchArea').childNodes;
	    for (var i = 0; i < opts.length; i++) {
	        if (opts[i].value === val) {
	        	var selectedArea = event.currentTarget.value;
				if(Session.get('areaBannerArray')){
					var areaBannerArray = Session.get('areaBannerArray');
				}else{
					var areaBannerArray = [];
				}		
				areaBannerArray.push(selectedArea);	
				Session.set('areaBannerArray',areaBannerArray);
				$('.getBannerArea').val('');
	          	break;
	        }
	    }


	    // Logic
	    // var val = event.currentTarget.value;
	    // var opts = document.getElementById('searchArea').childNodes;
	    // for (var i = 0; i < opts.length; i++) {
	    //     if (opts[i].value === val) {
	        	
	    //     	break;
	    //     }
	    // }

		// var selectedArea = event.currentTarget.value;
		// if(Session.get('areaBannerArray')){
		// 	var areaBannerArray = Session.get('areaBannerArray');
		// }else{
		// 	var areaBannerArray = [];
		// }		
		// areaBannerArray.push(selectedArea);	
		// Session.set('areaBannerArray',areaBannerArray);
		// $('.getBannerArea').val('');

	},

	'click .blankRow': function(event){

		var busTitle 			= $("#business").val();
		var splitOption 		= busTitle.split('|');
		var title    			= splitOption[0].trim();
		var splitBusinessLink 	= splitOption[1].split('/');
		var businessLink 		= splitBusinessLink[1].trim();

		var dataCatg 	= $(event.currentTarget).attr('data-catg');
		var dataPos 	= $(event.currentTarget).attr('data-position');
		var dataRank 	= $(event.currentTarget).attr('data-rank');

		//First verify whether this business is already added to this category.
		//If yes, then delete from banner table and then insert
		var checkBanner = BusinessBanner.findOne({
													"businessLink" : businessLink,
													"category"     : dataCatg,
												}); 

		var checkBannerActive = BusinessBanner.findOne({
			"businessLink" : businessLink,
			"category"     : dataCatg,
			"status"	   : "active",
		}); 

		if(checkBanner&&!checkBannerActive){
			Meteor.call('removeBusinessBannerAll', businessLink, dataCatg, 
						function(error,position){
								if(error){
									console.log('Error occured while removing Business Banner: ', error);
								}else{
									// console.log('Business Banner successfully removed');
								}
						});

		}


		var areaNames =[];
		if(Session.get('areaBannerArray')){
			areaNames = Session.get('areaBannerArray');
		}else{
			areaNames = [];
		}


		var formValues = {
			"businessLink" 	: businessLink,
			"category" 		: dataCatg,
			"position" 		: dataPos,
			"rank" 			: dataRank,
			"startDate" 	: $('.startDate').val(),
			"endDate" 		: $('.enddate').val(),
			"noOfMonths"	: $('.getmonth').val(),
			"selectedAreas" : areaNames, 
		}
		
		if(Session.get('paymentBannerTable')){
			var payTableArray = Session.get('paymentBannerTable');
		}else{
			var payTableArray = [];
		}	
		payTableArray.push(formValues);	
		Session.set('paymentBannerTable',payTableArray);

		if(!checkBannerActive){
			Meteor.call('insertBusinessBanner',formValues,function(error,result){
				if (error) {
					console.log('Error in Business Banners Insert: ', error);
				}else{
					// console.log('Data for category: '+dataCatg+' inserted successfully');
				}
			});
		}
		

	},

	'click .contentRow': function(event){
		var dataCatg = $(event.currentTarget).attr('data-catg');
		var dataPos 	= $(event.currentTarget).attr('data-position');
		var dataRank 	= $(event.currentTarget).attr('data-rank');

		var busTitle 	= $("#business").val();
		var splitOption = busTitle.split('|');
		var splitBusinessLink = splitOption[1].split('/');
		var businessLink = splitBusinessLink[1].trim();

		var checkBannerActive = BusinessBanner.findOne({
			"businessLink" : businessLink,
			"category"     : dataCatg,
			"status"	   : "active",
		}); 

		if(!checkBannerActive){
			Meteor.call('removeBusinessBanner', businessLink, dataCatg, dataPos, dataRank, function(error,position){
				if(error){
					console.log('Error occured while removing Business Banner: ', error);
				}else{
					console.log('Business Banner successfully removed');
				}
			});
		}
		
	},

	"keyup #business": _.throttle(function(e) {
		$('.displayListShow').show();
		    var searchText = $(e.target).val().trim();
		    var state = Session.get("addbannerStateSess");
		    var city = Session.get("addbannerCitySess");
		    var area = $('.addbannerArea').val();
		    var searchTxt = state + '|' + city + '|' + area + '|' + searchText;
		    bannerBussinessSearch1.search(searchTxt);		    
		}, 200),


	'click .areaName': function(event){

		var title = $('.areaName').text();
		$('#area').val(title);
		$('.areaName').text('');
		$('#areaRow').remove();
	},

	"keyup #area": _.throttle(function(e) {

		$('.displayArea').show();
		    var areaVal = $(e.target).val().trim();

		    // New Code
		    var areaCity = Session.get("busAreaCity");
		    var text = areaVal + '|' + areaCity;

			var currentAreaArr = Session.get("areaBannerArray");
		    var currentText = text;
			if(currentAreaArr && currentAreaArr.length>0){
				for(i=0;i<currentAreaArr.length;i++){
					currentText = currentText+ "|||" + currentAreaArr[i];
				}
			}
		   	
		    areaSearch1.search(currentText);		    
		  }, 200),

	"keyup #getCategory": _.throttle(function(e) {
		$('.bannercategoryListShow').show();
	    var text = $(e.target).val().trim();
		var currentCatArr = Session.get("catgArray");

		var currentText = text;
		if(currentCatArr && currentCatArr.length>0){
			for(i=0;i<currentCatArr.length;i++){
				currentText = currentText+ "|||" + currentCatArr[i];
			}
		}

	    if(text == ""){
	    	$('.bannercategoryListShow').hide();
	    	$('.displayDiv').remove();
	    }
	    // bannerCategorySearch1.search(text);
	    bannerCategorySearch1.search(currentText);
	    
	  }, 200),
	'focusout .getdate':function(){
		var month = $('.getmonth').val(); 
		var startDate = moment($('.startDate').val());
        var futureMonth = moment(startDate).add(month, 'M').format('YYYY-MM-DD');
		$('.enddate').val(futureMonth);
	},
	'focusout .getmonth':function(template){
		var month = $('.getmonth').val(); 
		
		var startDate = moment($('.getdate').val());
        var futureMonth = moment(startDate).add(month, 'M').format('YYYY-MM-DD');
        $('.enddate').val(futureMonth);
        var companyData = CompanySettings.findOne({"companyId" : 101});
        if(companyData){
        	if(companyData.BusinessRates){
        		var monthlyRate = companyData.BusinessRates[0].monthlyRate;
        		$('.monthlyRate').val(monthlyRate);
        	}
        }//companyData
        var count = 0;
		$("div.tableDiv").each(function(index){
			count++;
		});
		var total  = count * month * monthlyRate;
		$('.total').val(total);

		var discountData = Discount.find({}).fetch();
	    if(discountData){
	    	for(var i=0 ; i<discountData.length ; i++){
	    		var price    = discountData[i].price;
	    		var discount = discountData[i].discount;
				if(total <= price){
					discount = 0;
				}else if(total > price){
					discount;
				}
	    	}//i
	    }//discountData
	    $('.discount').val(discount);
	    var final = total*discount/100;
	    $('.finalTot').val(final);

	},

	'change .addbannerState':function(){
		var state = $(".addbannerState").val();
      	Session.set("addbannerStateSess",state);

      	var myFuncVar = $(".addbannerState").val();
        if (myFuncVar==null||myFuncVar==""||myFuncVar=='--Select--') {
            $(".SpanBusinessState").addClass("ErrorRedText");
            $(".addbannerState").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessState" ).text("Please select Valid State" );
        } else {
            $(".SpanBusinessState").removeClass("ErrorRedText");
            $(".addbannerState").removeClass("SpanLandLineRedBorder");
        }
	},
	
	'change .addbannerCity':function(){
		var city = $(".addbannerCity").val();
      	Session.set("addbannerCitySess",city);

      	var myFuncVar = $(".addbannerCity").val();
        if (myFuncVar==null||myFuncVar==""||myFuncVar=='--Select--') {
	        $(".SpanBusinessCity").addClass("ErrorRedText");
	        $(".addbannerCity").addClass("SpanLandLineRedBorder");
	        $( ".SpanBusinessCity" ).text("Please Enter Valid City" );
	    } else {
	        $(".SpanBusinessCity").removeClass("ErrorRedText");
	        $(".addbannerCity").removeClass("SpanLandLineRedBorder");
	    }
	},
	
});

businessBannerForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'businessBanner'});
}

export { businessBannerForm }

bannerInvoiceForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'bannerInvoice'});
}

export { bannerInvoiceForm }