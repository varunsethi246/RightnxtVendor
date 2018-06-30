// import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { Session } from 'meteor/session';

import { State } from '../../api/masterData/stateMaster.js';
import { City } from '../../api/masterData/cityMaster.js';
import { Area } from '../../api/masterData/areaMaster.js';
import { Categories } from '../../api/masterData/categoriesMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


import './manageLocations.html';

import './masterArea.html';
import './masterCity.html';
import './masterState.html';
import './masterBulkUpload.html';

import './manageCategoriesLevels.html';
import './manageCategoriesList.html';
import './categoriesList.html';
import './categoriesBulkUpload.html';
import './businessBlkup.html';
// Meteor.subscribe('categories');
import '/imports/admin/commonAdmin/commonAdmin.js';
import '/imports/admin/catgManagement/catgBulkUpload.html';
import '/imports/admin/catgManagement/catgBulkUpload.js';




// ========================== Master State ===============================

Template.masterState.helpers({
    masterState: function (){
      	var states = State.find({},{sort:{'createdAt': -1}}).fetch();
      	if(states){
      		for(i=0; i<states.length; i++){
				if(states[i].status == "inactive"){
					states[i].statusIconClass 	= 'fa-circle';
					states[i].statusTooltipClass = 'tooltipinactive';
					states[i].statusTooltipText = 'Activate';
				}else{
					states[i].statusIconClass = 'fa-check-circle';
					states[i].statusTooltipClass = 'tooltipactive';
					states[i].statusTooltipText = 'Deactivate';
				}
      		}
      	  // console.log(states);
	      return states;
      	}
    },
});


Template.masterState.events({
	'keyup #searchStateTable': _.throttle(function(event) {
		var searchText = event.currentTarget.value;
		var filter = searchText.toUpperCase();
		var table = $('#StateTable');
		table.find('tr').each(function(index, row)
		{
			var allCells = $(row).find('td');
			if(allCells.length > 0)
			{
				var found = false;
				allCells.each(function(index, td)
				{
					var regExp = new RegExp(searchText, 'i');
					if(regExp.test($(td).text().toUpperCase()))
					{
						found = true;
						return false;
					}
				});
				if(found == true)$(row).show();else $(row).hide();
			}
		});
	}, 200),

	'change #stateMaster': function(event){
		event.preventDefault();
		var stateInputVal = $("#areaState").val().trim();
		// console.log(stateInputVal);
		var stateInputData = State.findOne({"state":stateInputVal});
		if (stateInputData) { 
				$(".duplication4").addClass("AlreadyAdded hvr-buzz-out");
				$(".duplication4").text("State already Added.");
			}
		else{
				$(".duplication4").removeClass("AlreadyAdded hvr-buzz-out");
				$(".duplication4").addClass("NotAdded");
			}
	},
	

	'submit #stateMaster': function(event){
		event.preventDefault();
		$("input[value='']:not(:checkbox,:button):visible:first").focus();

		var stateInputVal = $("#areaState").val().trim();
		var camelCaseState = stateInputVal.toLowerCase().replace(/\b[a-z]/g, function(letter) {
		    return letter.toUpperCase();
		});
		stateInputVal = camelCaseState;
		// console.log(stateInputVal);

		var stateInputData = State.findOne({"state":stateInputVal});
		if (stateInputData) { 
				$(".duplication4").addClass("AlreadyAdded hvr-buzz-out");
				$(".duplication4").text("State already Added.");
			}
		else if (stateInputVal==null||stateInputVal==''){
			$('.areaStaes').addClass('SpanLandLineRedBorder');
		}
		else{
				$(".duplication4").removeClass("AlreadyAdded hvr-buzz-out");
				$(".duplication4").addClass("NotAdded");
				
				
				var formValues = {
					"country"	: event.target.country.value.trim(),
					"state"		: stateInputVal,
				};

				Meteor.call('insertState',formValues, 
							function(error,result){
								if(error){
									Bert.alert('There is some error in inserting State value to database!','danger','growl-top-right');
									// console.log(error);
				$("input[value='']:not(:checkbox,:button):visible:first").focus();

									return;
								}else{
									Bert.alert('State value submitted successfully to database!','success','growl-top-right');
		                            event.target.state.value       = '';
		                            
									return;							
								}
								('.error').text('');
							}
				);
			}
	},
	// ============== Delete ======================
	'click .delete':function(event){
		event.preventDefault();

		var modelid = $(event.target).parent().parent().parent().parent().parent().attr('id');
		var id  = modelid.split("-");
		// console.log('delete id ' + id[1]);
		Meteor.call('removeState',id[1],function(error,result){
			if(error){
				Bert.alert(error.reason,"danger",'growl-top-right');
			}else{
				Bert.alert('Deleted','success','growl-top-right');
			}
		});
		$('.modal-backdrop').hide();
	},
	// ===========tooltip===============
	// 'mouseover .fa-circle':function(){
	// 	event.preventDefault();
	// 	$('.tooltipinactive').tooltip({title: "Inactive", trigger: "hover"});
	// },
	
	// 'mouseover .fa-check-circle':function(){
	// 	event.preventDefault();
	// 	$('.tooltipactive').tooltip({title: "Active", trigger: "hover"});
	// },


	'mouseover .showTooltip': function(event){
		$(event.currentTarget).siblings('.newtooltip').show();
	},

	'mouseout .showTooltip': function(event){
		$(event.currentTarget).siblings('.newtooltip').hide();
	},




	// ============== Update Status ==================
	'click .inactiveStatus': function(event){
		event.preventDefault();
		var currentTargetState = $(event.target).attr('id');
		var stateId = currentTargetState ;
		var recId = stateId.split('-');
		Meteor.call('updateStatusActive',recId[1],"active");
	},

	'click .activeStatus': function(event){
		event.preventDefault();
		var stateId = $(event.target).attr('id');
		var recId = stateId.split('-');
		Meteor.call('updateStatusInactive',recId[1],"inactive");
	},
});

// ========================================================================
// 
// 								Master City
// 
// ========================================================================

Template.masterCity.helpers({

    masterCity: function () {
		if(Session.get('stateValue')){
			var fields = {"state": Session.get('stateValue') };
			var data = City.find(fields,{sort:{'createdAt': -1}}).fetch();
			if(data){
				for(i=0; i<data.length; i++){
					if(data[i].status == "inactive"){
						data[i].statusIconClass = 'fa-circle';
						data[i].statusTooltipClass = 'tooltipinactive';
						data[i].statusTooltipCity = 'Activate';
					}else{
						data[i].statusIconClass = 'fa-check-circle';
						data[i].statusTooltipClass = 'tooltipactive';
						data[i].statusTooltipCity = 'Deactivate';
					}
				}
			  // console.log(data);
		  // return fields;
			}
		}else{
			var data = false;
		}
		// console.log(fields);
		return data;
	},

    masterCityState: function () {
      var masterCityStateArray = State.find({'status':'active'}).fetch();
      // Session.set('statesession',state);
      return masterCityStateArray;
    },
});


Template.masterCity.events({
	'keyup #searchCityTable': _.throttle(function(event) {
		var searchText = event.currentTarget.value;
		var filter = searchText.toUpperCase();
		var table = $('#CityTable');
		table.find('tr').each(function(index, row)
		{
			var allCells = $(row).find('td');
			if(allCells.length > 0)
			{
				var found = false;
				allCells.each(function(index, td)
				{
					var regExp = new RegExp(searchText, 'i');
					if(regExp.test($(td).text().toUpperCase()))
					{
						found = true;
						return false;
					}
				});
				if(found == true)$(row).show();else $(row).hide();
			}
		});
	}, 200),
	'change #cityMaster': function(event){
		event.preventDefault();
		
		var cityInputVal = $("#areaCity").val().trim();
		var cityInputData = State.findOne({"city":cityInputVal});
		if (cityInputData) { 
				$(".duplication").addClass("AlreadyAdded hvr-buzz-out");
				$(".duplication").text("");
			}
		else{
				$(".duplication").removeClass("AlreadyAdded hvr-buzz-out");
				$(".duplication").addClass("NotAdded");
			}
	},

	'submit #cityMaster': function(event){
		event.preventDefault();
		var countryVals = $('#country').val();
		if(!countryVals){
			countryVals = 'India';
		}
		
		var stateVals = $('#states').val();
		
		if (stateVals != "-- Select State --" ) {
			$(".selectStates").removeClass("AlreadyAdded hvr-buzz-out");
			$(".selectStates").addClass("NotAdded");
			
			var camelCaseCountry = countryVals.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			    return letter.toUpperCase();
			});
			countryVals = camelCaseCountry;

			var camelCaseState = stateVals.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			    return letter.toUpperCase();
			});
			stateVals = camelCaseState;
			var cityInputVal = event.target.city.value;
			var camelCaseCity = cityInputVal.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			    return letter.toUpperCase();
			});
			cityInputVal = camelCaseCity;

			var cityInputData = City.findOne({"country":countryVals,"state":stateVals,"city":cityInputVal});
			if (cityInputData) {
				$(".duplication").addClass("AlreadyAdded hvr-buzz-out");
				$(".duplication").text("City already Added.");

			}else{

				$(".duplication").removeClass("AlreadyAdded hvr-buzz-out");
				$(".duplication").addClass("NotAdded");


				var formValues = {
						"country"	: countryVals,
						"state"		: stateVals,
						"city"		: cityInputVal,
					};


				Meteor.call('insertCity',formValues, 
						function(error,result){
							if(error){
								Bert.alert('There is some error in inserting City value to database!','danger','growl-top-right');
								// console.log(error);
								return;
							}
							else{
								Bert.alert('City value submitted successfully to database!','success','growl-top-right');
	             				 event.target.city.value        = '';
								return;							
							}
						}
					);
			
			}

		}else{
			$(".selectStates").addClass("AlreadyAdded hvr-buzz-out");
			$(".selectStates").text("Please Select State.");
		}
		
	},

	'change #states': function(event){
		event.preventDefault();
		var stateValue = event.currentTarget.value;
		Session.set('stateValue', stateValue);
	},

  	'click .delete':function(event){
		event.preventDefault();

		var modelid = $(event.target).parent().parent().parent().parent().parent().attr('id');
		var id  = modelid.split("-");
		// console.log('delete id ' + id[1]);
		Meteor.call('removeCity',id[1],function(error,result){
			if(error){
				Bert.alert(error.reason,"danger",'growl-top-right');
			}else{
				Bert.alert('Deleted','success','growl-top-right');
			}
		});
		$('.modal-backdrop').hide();
	},

	// ===========tooltip===============
	
	// 'mouseover .fa-circle':function(){
	// 	event.preventDefault();
	// 	$('.tooltipinactive').tooltip({title: "Inactive", trigger: "hover"});
	// },
	
	// 'mouseover .fa-check-circle':function(){
	// 	event.preventDefault();
	// 	$('.tooltipactive').tooltip({title: "Active", trigger: "hover"});
	// },

	'mouseover .showTooltip': function(event){
		$(event.currentTarget).siblings('.newtooltip').show();
	},

	'mouseout .showTooltip': function(event){
		$(event.currentTarget).siblings('.newtooltip').hide();
	},

	//================Update Status ================= 

	'click .inactiveStatus': function(event){
		event.preventDefault();
		var cityId = $(event.target).attr('id');
		var recId = cityId.split('-');
		Meteor.call('updateStatusCityActive',recId[1],"active");
	},

	'click .activeStatus': function(event){
		event.preventDefault();	
		var cityId = $(event.target).attr('id');
		var recId = cityId.split('-');
		Meteor.call('updateStatusCityInactive',recId[1],"inactive");
	},
});

// ========================================================================
// 
// 								Master Area
// 
// ========================================================================

Template.masterArea.events({
	'keyup #searchAreaTable': _.throttle(function(event) {
		var searchText = event.currentTarget.value;
		var filter = searchText.toUpperCase();
		var table = $('#AreaTable');
		table.find('tr').each(function(index, row)
		{
			var allCells = $(row).find('td');
			if(allCells.length > 0)
			{
				var found = false;
				allCells.each(function(index, td)
				{
					var regExp = new RegExp(searchText, 'i');
					if(regExp.test($(td).text().toUpperCase()))
					{
						found = true;
						return false;
					}
				});
				if(found == true)$(row).show();else $(row).hide();
			}
		});
	}, 200),
	'change #area' : function(event){
		event.preventDefault();
		var areaInputval = $("#area").val().trim();
		var areaZipInputval = $("#pinCodes").val().trim();
		
		if(areaZipInputval != '' & areaInputval != ''){
			var areaInputData = Area.findOne({"area":areaInputval});
			var areaZipInputData = Area.findOne({"zipcode":areaZipInputval});
			if (areaInputData && areaZipInputData) { 		
				$(".duplication1").addClass("AlreadyAdded hvr-buzz-out");
				$(".duplication2").addClass("AlreadyAdded hvr-buzz-out");
				$(".duplication1").text("");
				$(".duplication2").text("");
			}else{
				$(".duplication1").removeClass("AlreadyAdded hvr-buzz-out");
				$(".duplication2").removeClass("AlreadyAdded hvr-buzz-out");
				$(".duplication1").addClass("NotAdded");			
				$(".duplication2").addClass("NotAdded");			
			}
		}
	}, // end of change event

	'change #pinCodes' : function(event){
		event.preventDefault();
		var areaInputval = $("#area").val().trim();
		var areaZipInputval = $("#pinCodes").val().trim();
		
		if(areaZipInputval != '' & areaInputval != ''){
			var areaInputData = Area.findOne({"area":areaInputval});
			var areaZipInputData = Area.findOne({"zipcode":areaZipInputval});
			if (areaInputData && areaZipInputData) { 		
				$(".duplication1").addClass("AlreadyAdded hvr-buzz-out");
				$(".duplication2").addClass("AlreadyAdded hvr-buzz-out");
				$(".duplication1").text("");
				$(".duplication2").text("");
			}else{
				$(".duplication1").removeClass("AlreadyAdded hvr-buzz-out");
				$(".duplication2").removeClass("AlreadyAdded hvr-buzz-out");
				$(".duplication1").addClass("NotAdded");			
				$(".duplication2").addClass("NotAdded");			
			}
		}
	},// end of change event

	// 'click areaMasterBtn':function(){
 
	//     var location = document.getElementById('stateopt');
	//     var invalid = location.value == "-- Select State --";
	 
	//     if (invalid) {
	//         alert('Please enter first name');
	//         location.className = 'error';
	//     }
	//     else {
	//         location.className = '';
	//     }
	    
	//     return !invalid;
	// },

	'submit #areaMaster': function(event){
		event.preventDefault();
		var countryVals = $('#countryopt').val();
		if(!countryVals){
			countryVals = 'India';
		}
		var stateVals   = $('#stateopt').val();
		// console.log('stateVals ', stateVals);
		var cityVals    = $('#cityArea').val();
		if (stateVals == '-- Select State --') {
			$('.selectState').addClass('AlreadyAdded hvr-buzz-out');
			$('.selectState').text('hello state');
		}
		if (stateVals != "-- Select State --" && cityVals != "-- Select State --") {
			$(".selectState").removeClass("AlreadyAdded hvr-buzz-out");
			$(".selectCity").removeClass("AlreadyAdded hvr-buzz-out");
			$(".selectState").addClass("NotAdded");
			$(".selectCity").addClass("NotAdded");
			//search of zipcode
			var zipVals = event.target.zipcode.value.trim();
			// console.log('zipVals ',zipVals);
			var areaZipInputData = Area.findOne({"zipcode":zipVals});
			
			if(areaZipInputData){
				// console.log('areaZipInputData ',areaZipInputData);

				$(".duplication1").addClass("AlreadyAdded hvr-buzz-out");
				$(".duplication2").addClass("AlreadyAdded hvr-buzz-out");
				$(".duplication1").text("Pincode already Added.");
				$(".duplication2").text("Area already Added.");

			}else{
				var camalCaseCountry = countryVals.toLowerCase().replace(/\b[a-z]/g, function(letter) {
				    return letter.toUpperCase();
				});
				countryVals = camalCaseCountry;
				// console.log('countryVals ',countryVals);

				var camalCaseState = stateVals.toLowerCase().replace(/\b[a-z]/g, function(letter) {
				    return letter.toUpperCase();
				});
				stateVals = camalCaseState;
				// console.log('stateVals ',stateVals);
			
				var camelCaseCity = cityVals.toLowerCase().replace(/\b[a-z]/g, function(letter) {
				    return letter.toUpperCase();
				});
				cityVals = camelCaseCity;
				// console.log('cityVals ',cityVals);

				var areaVals = event.target.area.value.trim();
				var camalCaseArea = areaVals.toLowerCase().replace(/\b[a-z]/g, function(letter) {
				    return letter.toUpperCase();
				});	
				areaVals = camalCaseArea;
				// console.log('areaVals ',areaVals);

				var areaInputData = Area.find({"country":countryVals ,"state":stateVals,"city":cityVals, "area":areaVals}).fetch();
				if(areaInputData){
					// console.log('areaInputData' ,areaInputData);
					if(areaInputData.zipcode == zipVals){
						$(".duplication1").addClass("AlreadyAdded hvr-buzz-out");
						$(".duplication1").text("Area and Zipcode already Added.");	
					}else{
						var formValues = {
							"country"	: countryVals,
							"state"		: stateVals,
							"city"		: cityVals,
							"area"		: areaVals,
							"zipcode"	: zipVals,
						};
						// console.log('formValues ', formValues);
						Meteor.call('insertArea',formValues, 
							function(error,result){
								if(error){
									Bert.alert('There is some error in inserting Area value to database!','danger','growl-top-right');
									// console.log(error);
									return;
								}else{
									Bert.alert('Area & Pincode values submitted successfully to database!','success','growl-top-right');
				                     	event.target.area.value      = '';
				                      	event.target.zipcode.value   = '';
											return;							
								}
							}
						);
					}//else if end of submit area	
				}else{
					// console.log('area not found');
				}
			}//else if end of search zipcode

		}else if(stateVals == "-- Select State --" || cityVals == "-- Select State --"){
			if (stateVals == "-- Select State --") {
				$(".selectState").addClass("AlreadyAdded hvr-buzz-out");
				$(".selectState").text("Please Select State.");
			}else{
				$(".selectCity").addClass("AlreadyAdded hvr-buzz-out");
				$(".selectCity").text("Please Select city.");
			} //else if end of selected state or city

		} //else if end of selected state and city
		
	},//end of submit event


	'change .stateSelect': function(event){
		var selectedState = $('.stateSelect').val();
		Session.set('State', selectedState );
	},//end of change event

	'change .citySelect': function(event){
		var selectedCity = $('.citySelect').val();
		Session.set('City', selectedCity );
	},//end of change event


	'click .delete':function(event){
		event.preventDefault();

		var modelid = $(event.target).parent().parent().parent().parent().parent().attr('id');
		var id  = modelid.split("-");
		
		Meteor.call('removeArea',id[1],function(error,result){
			if(error){
				Bert.alert(error.reason,"danger",'growl-top-right');
			}else{
				Bert.alert('Deleted','success','growl-top-right');
			}
		});
		$('.modal-backdrop').hide();
	},//end of click event

	// ===========tooltip===============
	
	// 'mouseover .fa-circle':function(){
	// 	event.preventDefault();
	// 	$('.tooltipinactive').tooltip({title: "Inactive", trigger: "hover"});
	// },
	
	// 'mouseover .fa-check-circle':function(){
	// 	event.preventDefault();
	// 	$('.tooltipactive').tooltip({title: "Active", trigger: "hover"});
	// },

	'mouseover .showTooltip': function(event){
		$(event.currentTarget).siblings('.newtooltip').show();
	},

	'mouseout .showTooltip': function(event){
		$(event.currentTarget).siblings('.newtooltip').hide();
	},
	//================Update Status ================= 

	'click .inactiveStatus': function(event){
		event.preventDefault();
		var areaId = $(event.target).attr('id');
		var recId = areaId.split('-');
		Meteor.call('updateStatusAreaActive',recId[1],"active");
	},

	'click .activeStatus': function(event){	
		event.preventDefault();
		var cityId = $(event.target).attr('id');
		var recId = cityId.split('-');
		Meteor.call('updateStatusAreaInactive',recId[1],"inactive");
	},
});// end of events masterArea.

Template.masterArea.helpers({
	masterArea: function () {
		var state = Session.get('State');
		var city = Session.get('City');
		var allRec = Area.find({"state" : state , 	"city" : city },{sort:{'createdAt': -1}}).fetch(); 
		if(allRec){
      		for(i=0; i<allRec.length; i++){
				if(allRec[i].status == "inactive"){
					allRec[i].statusIconClass = 'fa-circle';
					allRec[i].statusTooltipClass = 'tooltipinactive';
					allRec[i].statusTooltipState = 'Activate';

				}else{
					allRec[i].statusIconClass = 'fa-check-circle';
					allRec[i].statusTooltipClass = 'tooltipactive';
					allRec[i].statusTooltipState = 'Deactivate';

				}
      		}
      	  // console.log(allRec);
	      return allRec;
      	}
		// return allRec;
	},

	masterAreaCity: function(){
		var selectedState = Session.get('State');
		var cities = City.find({'state': selectedState,'status':'active'},{'city':1,'_id':0}).fetch();
		return cities;
	},

	masterAreaState: function () {
	    var masterAreaStateArray = State.find({'status':'active'}).fetch();
	    return masterAreaStateArray ;
    },

});


// ========================================================================
// 
// 							Master Categories
// 
// ========================================================================


Template.categoriesList.onRendered( ()=>{
	Session.set('catgListLimit',10);
});

Template.categoriesList.helpers({

	masterCategories: function () { 
		var listLimit = Session.get('catgListLimit');
		if(listLimit == 0){
  			var catVal = Categories.find({},{sort:{categoryIndex: -1}}).fetch();
  			if(catVal){
  				for(i=0;i<catVal.length;i++){
  					if(catVal[i].menuStatus=="Enable"){
  						catVal[i].menuStatusVal   = 'Disable';
  						catVal[i].menuStatusClass = 'danger';
  					} else{
  						catVal[i].menuStatusVal   = 'Enable';
  						catVal[i].menuStatusClass = 'success';
  					}
  				}
  			}

      		return catVal;

      		// if(data){
      		// 	return data;
      		// }
  		}else{
  			var catVal = Categories.find({},{sort:{categoryIndex: -1}, limit: listLimit}).fetch();
  			if(catVal){
  				for(i=0;i<catVal.length;i++){
  					if(catVal[i].menuStatus=="Enable"){
  						catVal[i].menuStatusVal   = 'Disable';
  						catVal[i].menuStatusClass = 'danger';
  					} else{
  						catVal[i].menuStatusVal   = 'Enable';
  						catVal[i].menuStatusClass = 'success';
  					}
  				}
  			}

      		return  catVal;
      		// if(data){
      		// 	// $('.loadMoreRows .fa-spinner').hide();
      		// 	return data;
      		// }
      	}
    },
    valueLevel0:function(type){
  		var valueL0 = {};
  		if(type == 'Products'){
  			valueL0.value = 'P';
  		}else{
  			valueL0.value = 'S';	
  		}
  		return valueL0;
  	},
    
});

Template.categoriesList.events({
	'click .updateCatMenu': function(event){

		var id = $(event.currentTarget).attr('data-docId');
		var menuStatus = $(event.currentTarget).attr('data-catStatus');
		if(menuStatus=="Enable"){
			menuStatus = "Disable";
		} else {
			menuStatus = "Enable";
		}
		Meteor.call('removeCategoryMenuStatus', id, menuStatus, function(error,reslt){

		});

	},
	'click .plusEdit':function(event){
		event.preventDefault();
		$('body').scrollTop(0);
		var id = event.currentTarget.id;
		Session.set('currentID',id);
		var catgData = Categories.findOne({_id:id});
		if(catgData){
			$('select').val(catgData.level0);
			$('#level1Name').val(catgData.level1);
			$('#level1Tags').val(catgData.level1Tags);
			$('#level2Name').val(catgData.level2);
			$('#level2Tags').val(catgData.level2Tags);
			$('#level3Name').val(catgData.level3);
			$('#level3Tags').val(catgData.level3Tags);
			$('#level4Name').val(catgData.level4);
			$('#level4Tags').val(catgData.level4Tags);
			$('#level1Name').focus();
		}
		
	},
	'focus #searchCategoriesTable': function(event){
		Session.set('catgListLimit',0);
	},

	'keyup #searchCategoriesTable': _.throttle(function(event) {
		var searchText = event.currentTarget.value;
		var filter = searchText.toUpperCase();
		var table = $('#categoriesListTable');
		table.find('tr').each(function(index, row)
		{
			var allCells = $(row).find('td');
			if(allCells.length > 0)
			{
				var found = false;
				allCells.each(function(index, td)
				{
					var regExp = new RegExp(searchText, 'i');
					if(regExp.test($(td).text().toUpperCase()))
					{
						found = true;
						return false;
					}
				});
				if(found == true)$(row).show();else $(row).hide();
			}
		});
	}, 200),

	

	'click .loadMoreRows50': function(event){
		$('.spinner').hide();
		$('.loadMoreRows50 .spinner').show();
		var catgLimit50 = Session.get('catgListLimit');
		if(catgLimit50 != 0){
			var nextLimit = Session.get('catgListLimit') + 50;
			Session.set('catgListLimit',nextLimit);
		}
	},

	'click .loadMoreRows100': function(event){
		$('.spinner').hide();
		$('.loadMoreRows100 .spinner').show();
		var catgLimit100 = Session.get('catgListLimit');
		if(catgLimit100 != 0){
			var nextLimit = Session.get('catgListLimit') + 100;
			Session.set('catgListLimit',nextLimit);
		}
	},

	'click .loadMoreRowsRest': function(event){
		$('.spinner').hide();
		$('.loadMoreRowsRest .spinner').show();
		var nextLimit = 0;
		Session.set('catgListLimit',nextLimit);
	},

	'click .delete':function(event){
		event.preventDefault();

		var modelid = $(event.target).parent().parent().parent().parent().parent().attr('id');
		var id  = modelid.split("-");
		// console.log('delete id ' + id[1]);
		Meteor.call('removecategories',id[1],function(error,result){
			if(error){
				Bert.alert(error.reason,"danger",'growl-top-right');
			}else{
				Bert.alert('Deleted','success','growl-top-right');
			}
		});
		$('.modal-backdrop').hide();
	},

});

var options = {
  keepHistory: 0,
  localSearch: false
};
//Level1 Categories
var field1 = ['level1'];
categoryLevel1Search = new SearchSource('categoriesLevel1', field1, options);
//Level2 Categories
var field2 = ['level2'];
categoryLevel2Search = new SearchSource('categoriesLevel2', field2, options);
//Level3 Categories
var field3 = ['level3'];
categoryLevel3Search = new SearchSource('categoriesLevel3', field3, options);
//Level4 Categories
var field4 = ['level4'];
categoryLevel4Search = new SearchSource('categoriesLevel4', field4, options);


Template.categoriesLevels.helpers({
	'editDisplayTags' : function () {
		var catId = Session.get('currentID'); 
    	var catgObj = Categories.findOne({'_id':catId});
    	if(catgObj){
	    	// console.log(catgObj.tags);
	    	return catgObj.tags;    		
    	}
   },
   'getcategoryLevel1' : function(){
   		var data =  categoryLevel1Search.getData({
	      transform: function(matchText, regExp) {
	        return catgL1Array = matchText.replace(regExp, "$&");    
	      },
	    });
	    if(!data){
	    	$('.categoryLevel1Show').hide();
	    }
	    return data;
    },
	'getcategoryLevel2' : function(){
   		var data =  categoryLevel2Search.getData({
	      transform: function(matchText, regExp) {
	        return matchText.replace(regExp, "$&");    
	      },
	    });
	    return data;
    },
	'getcategoryLevel3' : function(){
	   		var data =  categoryLevel3Search.getData({
		      transform: function(matchText, regExp) {
		        return matchText.replace(regExp, "$&");    
		      },
		    });
		    return data;
	   },
	'getcategoryLevel4' : function(){
   		var data =  categoryLevel4Search.getData({
	      transform: function(matchText, regExp) {
	        return matchText.replace(regExp, "$&");    
	      },
	    });
	    return data;
   },
});

Template.categoriesLevels.events({
	'keydown .levelValidationCreate': function(e){
      if ($.inArray(e.keyCode, [8, 9, 27, 13]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))||
            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true))||
            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true))||
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40) || (e.keyCode === 189) || (e.keyCode === 32)) {
                 // let it happen, don't do anything

                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode===190 || e.keyCode===46 || e.keyCode===110) && (e.keyCode < 64 || e.keyCode > 90)) {
            e.preventDefault();
        }
   },
	
	'submit #categoriesForms': function(event){
		event.preventDefault();
		var optionsVals = $("#selectOptions").val();
		if (optionsVals == "-- Select Options --") {
			$(".selectProSer").addClass("AlreadyAdded hvr-buzz-out");
			$(".selectProSer").text("Please Select Options.");
		}else {
			$(".selectProSer").removeClass("AlreadyAdded hvr-buzz-out");
			$(".selectProSer").text("");
			var level0Name = optionsVals;
			var level1Name = event.target.level1Name.value;
			var level1Tags = event.target.level1Tags.value;
			var level2Name = event.target.level2Name.value;
			var level2Tags = event.target.level2Tags.value;
			var level3Name = event.target.level3Name.value;
			var level3Tags = event.target.level3Tags.value;
			var level4Name = event.target.level4Name.value;
			var level4Tags = event.target.level4Tags.value;
			// var tagsAll = event.target.tagsAll.value;



			var formValues = {
				level0Name : level0Name,
				level1Name : level1Name,
				level1Tags : level1Tags,
				level2Name : level2Name,
				level2Tags : level2Tags,
				level3Name : level3Name,
				level3Tags : level3Tags,
				level4Name : level4Name,
				level4Tags : level4Tags,
				allTags    : level1Tags + ',' + level2Tags + ',' + level3Tags + ','+ level4Tags,
			};
			// console.log('formValues : ' ,formValues);
			var data = Categories.findOne({"level0":formValues.level0Name,
										   "level1":formValues.level1Name,
										   "level2":formValues.level2Name,
										   "level3":formValues.level3Name,
										   "level4":formValues.level4Name});
			var curid = Session.get('currentID');
			if(curid){
						
				Meteor.call('updateCategoriesMultipleTags',curid,formValues, 
					function(error,result){
						if(error){
							Bert.alert('There is some error in inserting Category value to database!','danger','growl-top-right');
							// console.log(error.reason);
							
						}else{
							Bert.alert('Category values updated successfully!','success','growl-top-right');
			                    event.target.level0.value   = '-- Select Options --';
				                    event.target.level1Name.value   = '';
				                    event.target.level1Tags.value   = '';
				                    event.target.level2Name.value   = '';
				                    event.target.level2Tags.value   = '';
				                    event.target.level3Name.value   = '';
				                    event.target.level3Tags.value   = '';
				                    event.target.level4Name.value   = '';
				                    event.target.level4Tags.value   = '';
				                    $('.categoryLevel1Show').hide();
							    	$('.displayDivLevel1').remove();
									$('.categoryLevel2Show').hide();
							    	$('.displayDivLevel2').remove();
									$('.categoryLevel3Show').hide();
							    	$('.displayDivLevel3').remove();
									$('.categoryLevel4Show').hide();
							    	$('.displayDivLevel4').remove();
			                    Session.set('currentID','');							
						}
					}
				);
			}else{
				if(!data){
					Meteor.call('insertCategoriesMultipleTags',formValues, 
						function(error,result){
							if(error){
								Bert.alert('There is some error in inserting Category value to database!','danger','growl-top-right');
								// console.log(error.reason);
								
							}else{
								Bert.alert('Category values submitted successfully!','success','growl-top-right');
				                    event.target.level0.value   = '-- Select Options --';
				                    event.target.level1Name.value   = '';
				                    event.target.level1Tags.value   = '';
				                    event.target.level2Name.value   = '';
				                    event.target.level2Tags.value   = '';
				                    event.target.level3Name.value   = '';
				                    event.target.level3Tags.value   = '';
				                    event.target.level4Name.value   = '';
				                    event.target.level4Tags.value   = '';
				                    $('.categoryLevel1Show').hide();
							    	$('.displayDivLevel1').remove();
									$('.categoryLevel2Show').hide();
							    	$('.displayDivLevel2').remove();
									$('.categoryLevel3Show').hide();
							    	$('.displayDivLevel3').remove();
									$('.categoryLevel4Show').hide();
							    	$('.displayDivLevel4').remove();
				                    // event.target.tags.value   = '';
							}
						}
					);
				}else{
					Bert.alert('Category already exits','danger','growl-top-right');	
				}
			}
		}
		
	},

	
	'click .removeOlderTags':function(event){
		event.preventDefault();
		var tagId = $(event.target).parent().attr('id')
		// console.log('tagId ', tagId);
		if(tagId){
			var deleteDiv = '#' + tagId;
			$(deleteDiv).remove();
			var ind = tagId.split('-');
			Meteor.call('removeCategoriestags',Session.get('currentID'),parseInt(ind[1]),function (err,res) {
		        if(err){
		          console.log('error ', err.reason);
		        }
		        else{
		          // $(event.target).parent().remove();      
		        }
		      });
		}
		// $('.str-tag1').remove();
	},

	'change #tagsinput': function(event){
		event.preventDefault();
		// $("#tagsinput").tagsInput();

		$("#tagsinput_tag").on('paste',function(e){
		    var element=this;
		    setTimeout(function () {
		        var text = $(element).val();
		        var target=$("#tagsinput");
		        var tags = (text).split(/[ ,]+/);
		        for (var i = 0, z = tags.length; i<z; i++) {
		              var tag = $.trim(tags[i]);
		              if (!target.tagExist(tag)) {
		                    target.addTag(tag);
		              }
		              else
		              {
		                  $("#tagsinput_tag").val('');
		              }
		                
		         }
		    }, );
		});

    },

    'click .delete':function(event){
		event.preventDefault();

		var modelid = $(event.target).parent().parent().parent().parent().parent().attr('id');
		var id  = modelid.split("-");
		// console.log('delete id ' + id[1]);
		Meteor.call('removecategories',id[1],function(error,result){
			if(error){
				Bert.alert(error.reason,"danger",'growl-top-right');
			}else{
				Bert.alert('Deleted','success','growl-top-right');
			}
		});
		$('.modal-backdrop').hide();
	},

	
	"keyup #level1Name": function(e) {
	    var text = $(e.target).val().trim();
	    categoryLevel1Search.search(text);	    
	},

	"focusout #level1Name" : function(event){
		var selectedOption = event.currentTarget.value;
		var allL1Categories = Categories.find({"level1":selectedOption}).fetch();
		var tagsSet = '';
		if(allL1Categories){
			for(i=0;i<allL1Categories.length;i++){
				if(i==0){
					tagsSet = allL1Categories[i].level1Tags;	
				}else{
					tagsSet = tagsSet + ',' + allL1Categories[i].level1Tags;	
				}
			}
			var tagsArray = tagsSet.split(',');
			tagsArray = _.uniq(tagsArray);
			$("#level1Tags").val(tagsArray.toString());
		}
	},
	  
	"keyup #level2Name": function(e) {
	    var text = $(e.target).val().trim();
	    categoryLevel2Search.search(text);	    
	},

	"focusout #level2Name" : function(event){
		var selectedOption = event.currentTarget.value;
		var allL1Categories = Categories.find({"level2":selectedOption}).fetch();
		var tagsSet = '';
		if(allL1Categories){
			for(i=0;i<allL1Categories.length;i++){
				if(i==0){
					tagsSet = allL1Categories[i].level1Tags;	
				}else{
					tagsSet = tagsSet + ',' + allL1Categories[i].level1Tags;	
				}
			}
			var tagsArray = tagsSet.split(',');
			tagsArray = _.uniq(tagsArray);
			$("#level2Tags").val(tagsArray.toString());
		}
	},

	"keyup #level3Name": function(e) {
	    var text = $(e.target).val().trim();
	    categoryLevel3Search.search(text);
	    
	},

	"focusout #level3Name" : function(event){
		var selectedOption = event.currentTarget.value;
		var allL1Categories = Categories.find({"level3":selectedOption}).fetch();
		var tagsSet = '';
		if(allL1Categories){
			for(i=0;i<allL1Categories.length;i++){
				if(i==0){
					tagsSet = allL1Categories[i].level1Tags;	
				}else{
					tagsSet = tagsSet + ',' + allL1Categories[i].level1Tags;	
				}
			}
			var tagsArray = tagsSet.split(',');
			tagsArray = _.uniq(tagsArray);
			$("#level3Tags").val(tagsArray.toString());
		}
	},

	"keyup #level4Name": function(e) {
	    var text = $(e.target).val().trim();
	    categoryLevel4Search.search(text);	    
	},

	"focusout #level4Name" : function(event){
		var selectedOption = event.currentTarget.value;
		var allL1Categories = Categories.find({"level4":selectedOption}).fetch();
		var tagsSet = '';
		if(allL1Categories){
			for(i=0;i<allL1Categories.length;i++){
				if(i==0){
					tagsSet = allL1Categories[i].level1Tags;	
				}else{
					tagsSet = tagsSet + ',' + allL1Categories[i].level1Tags;	
				}
			}
			var tagsArray = tagsSet.split(',');
			tagsArray = _.uniq(tagsArray);
			$("#level4Tags").val(tagsArray.toString());
		}
	},

});

// =============categories bulkupload===============



Template.catgBulkUpload.events({

	'click #categoriesDelete': function(event){
		Meteor.call('removecategories',this._id,
			function(error,result){
			});
	},

	// 'click .plusEdit' : function(event){
	//   	var currentCategoryIndex = this.categoryIndex;

	//   	// console.log('id ' + currentCategoryIndex);
	//   	var showData = Categories.findOne({"categoryIndex":{$gt:currentCategoryIndex}});
	//   	// var newCategoryIndex =  Categories.find({"categoryIndex" : currentCategoryIndex})

	//   	var formValuesone = {
	//   		// "categoryIndex" : showData.categoryIndex + 1,
	//   		"categoryIndex" : 0,
	//   		"level0"		: '-NA-',
	// 		"level1"		: '-NA-',
	// 		"level2"		: '-NA-',
	// 		"level3"		: '-NA-',
	// 		"level4"		: '-NA-',
	// 		"tags"			: '-NA-',
			
	// 	};

	// 	// console.log(formValuesone);

	// 	Meteor.call('insertCategoriesBlank',formValuesone, 
	// 		function(error,result){
	// 			if(error){
	// 				Bert.alert('There is some error in inserting New Field to database!','danger','growl-top-right');
	// 				// console.log(error);
	// 				return;
	// 			}else{
	// 				Bert.alert('New Field is Added successfully to database!','success','growl-top-right');
	// 				return;							
	// 			}
	// 		}
	// 	); 
	// },
});


// ========================================================================
//
//                      location bulkupload 
// 
// ========================================================================

Template.masterBulkUpload.onCreated( () => {
  	Template.instance().uploading = new ReactiveVar( false );
});


Template.masterBulkUpload.helpers({
  
  uploading() {
    return Template.instance().uploading.get();
  },

  showProgressBar() {
  	
    var elapsedTime   = Session.get('elapsedTime');
    var requiredelapsedTime = (elapsedTime/1000);
    var totalRecords  = Session.get('totalRecords');

    if (elapsedTime > 0) {
      var showProgressBar = {
        'uploadingFinished' : true,
        'elapsedTime'     : elapsedTime,
        'requiredelapsedTime' : requiredelapsedTime,
        'totalRecords'    : totalRecords,
      }
      // console.log('showProgressBar: ' + showProgressBar);
    }else{
      var showProgressBar = {
        'uploadingFinished' : false,
        'elapsedTime'     : 0,
        'totalRecords'    : 0,
      }      
    }
    
    return showProgressBar;
  },
});

Template.masterBulkUpload.events({
	'click .idShowDetails' : function (event) {
		var id = this._id;
		FlowRouter.go('/dailyOrdersShow/:sid',{'sid': id});
	},

	'click .idDelDailyOrderBlk' : function (events) {
		event.preventDefault();
		var sampleFormId = this._id; 
		Session.set("sessionIdDOBlk",this._id);
		
	},

	'click #delDailyOrderBlkRec' : function (events) {
		event.preventDefault();
		var sampleFormId1 = Session.get("sessionIdDOBlk");
		
		Meteor.call('removeDailyOrder',sampleFormId1);
	},

	'change [Name=upCatgBlk]' : function(event, template){
	// 'click #submitBulk' : function(event, template){
		// console.log('bulk upload');
		Session.set('elapsedTime', 0 );
	    Session.set('totalRecords', 0);
    	var beforeTime = new Date().valueOf();
    	template.uploading.set( true );
    	// console.log(event.target.files[0]);
		Papa.parse( event.target.files[0], {
		    header: true,
		    complete( results, file ) {
		    	Meteor.call( 'CSVUploadLocation', results.data, ( error, result ) => {
         			if ( error ) {
            			Bert.alert( error.reason, 'warning' );
         			} else {
         				  // template.uploading.set( false );
                  // console.log('results: ' , results);
           				Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
                  event.currentTarget.value = '';
                  // var afterTime = new Date().valueOf();
                  // var elapsedTime = afterTime - beforeTime;      
                  // console.log('elapsedTime: ' +(elapsedTime/1000) + 'sec' );
                  // Session.set('elapsedTime',elapsedTime);
                  // Session.set('totalRecords',results.data.length);
         			}
      			});
		    }
      	});

	},
});


// =================================================================
//                          validation only
// =================================================================

Template.masterArea.onRendered(function(){
	$.validator.addMethod("Areavali", function(value, element, regexpr) {          
    	return regexpr.test(value);
	}, "Please enter atleast three Alphabets.");

	// $.validator.addMethod("regex", function(value, element, regexpr) {          
 //    	return regexpr.test(value);
	// }, "Invalid Format");
	$.validator.addMethod("regexx", function(value, element, regexpr) {          
    	return regexpr.test(value);
	}, "Invalid Pincode Number.");
	 // var messages = {
  //       'firstNameRequired': "Please enter your first name."
  //   };
	 $("#areaMaster").validate({
	 	rules: {
	        area: {
	            required: true,
	            Areavali: /^[A-Za-z0-9\s\.\-\/]{3,30}$/,
	        },
	    	zipcode: {
	            required: true,
	            regexx: /^\d{6}(?:[-\s]\d{6})?$/,
	        },
	        state:{
	        	required:true,
	        },
	        city:{
	        	required:true,
	        }
	        
    	}
	 });
});


Template.masterCity.onRendered(function(){
	$.validator.addMethod("cityValida", function(value, element, regexpr) {          
    	return regexpr.test(value);
	}, "Please enter atleast three Alphabets.");
	$.validator.addMethod("regex", function(value, element, regexpr) {          
    	return regexpr.test(value);
	}, "Invalid Format");
	 $("#cityMaster").validate({
	 	rules: {
	        city: {
	            required: true,
	            cityValida: /^[a-zA-Z\s\-]+$/,
	        },
	        state:{
	        	required:true,
	        },
    	}
	 });
});

Template.masterState.onRendered(function(){
	$.validator.addMethod("regx", function(value, element, regexpr) {          
    	return regexpr.test(value);
	}, "State should only contain Alphabet.");
	$.validator.addMethod("regex", function(value, element, regexpr) {          
    	return regexpr.test(value);
	}, "Invalid Format");
	 $("#stateMaster").validate({
	 	rules: {
	        state: {
	            required: true,
	            regx: /^[a-zA-Z\s]+$/,
	        },
    	}
	 });
});
// =================================================================
//                  dynamic import
// =================================================================


manageLocationsForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'manageLocations'});
}
export { manageLocationsForm }

manageCategoriesListForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'manageCategoriesList'});
}
export { manageCategoriesListForm }