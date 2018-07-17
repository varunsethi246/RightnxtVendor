import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';
import { Area } from '/imports/api/masterData/areaMaster.js';
import { Notification } from '/imports/api/notification.js';
import { Categories } from '/imports/api/masterData/categoriesMaster.js';
import { Business } from '/imports/api/businessMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './searchbar.html'
import '../vendor/businessList/businessMapView/businessMapView.js'
import '/imports/vendor/businessList/businessMapView/businessMap.html'
import '/imports/vendor/businessList/businessMapView/businessMapView.js'



var options = {
  keepHistory: 0,
  localSearch: false
};

var fields = ['businessTitle','tags','businesscategories'];
dropdownSearchList = new SearchSource('dropdownSearch', fields, options);
businessSearch1 = new SearchSource('business', fields, options);

if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({ v: '3', key: 'AIzaSyCIxR9lCmbgk46wSoqQNpG7jwM4Hdx_-Jw', libraries: 'geometry,places' });
  });
}


Template.searchbar.onRendered(function(){
	var getCityVal = FlowRouter.getParam('city');
	// if(getCityVal){
	// 	$('.hiddenCitySearchInpBox').val(getCityVal);
	// }else{
	// 	var oldVal = $('.hiddenCitySearchInpBox').val();
	// 	$('.hiddenCitySearchInpBox').val(oldVal);
	// }
	Session.set("userSelecetedRXTCity",getCityVal);
});


Template.searchbar.helpers({
	businessSearchTypeBus: function(searchType){
		if(searchType=="Category") {
			return true;
		} else {
			return false;
		}
	},

	//To get business list of search results
	businessSearchList() {
		var busList 		= dropdownSearchList.getData();
		// console.log("busList: ",busList);
		if(busList){
			return busList;
		}
	},
	searchAreaList(){
		var currentParams 	= FlowRouter.getParam('businessurl');
		var userId = Meteor.userId();
		if(userId){
			var cityObject = Meteor.users.findOne({"_id":userId});
			if(cityObject.selectedCity){
				var currentCity = cityObject.selectedCity;
			}else {
				var sesVal = Session.get('rxtNxtCityDatlist');
		        if(sesVal){
		          currentCity = sesVal;
		        }else{
		          var currentCity = "Pune";
		        }
		          // var currentCity = "Pune";
		        
			}
		}else{
			var sesVal = Session.get('rxtNxtCityDatlist');
	        if(sesVal){
	          currentCity = sesVal;
	        }else{
	          var currentCity = "Pune";
	        }
			// if(currentParams){
			// 	var busCity = Business.findOne({"businessLink":currentParams},{fields: {'businessCity': 1}});
			// 	var currentCity = busCity.businessCity;
			// }else{
			// 	// var currentCity = FlowRouter.getParam('city');
			// 	var currentCity = "Pune";
			// }
		}

	    var currentArea =  FlowRouter.getParam('area');
	    var currentAreaData = Area.find({'city':currentCity}).fetch();
	    
	    // To Arrange the Area object Alphabetically
	    currentAreaData.sort(function(a, b) {
		    var textA = a.area.toUpperCase();
		    var textB = b.area.toUpperCase();
		    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		});

		for(i=0;i<currentAreaData.length;i++){
		  	if(currentAreaData[i].area == currentArea){
		  		currentAreaData[i].selected = 'selected';
		  	} else {
		  		currentAreaData[i].selected = '';
		  	}
		}
	    return currentAreaData;
	},

	searchbartext(){
		if(Session.get('searchText')){
			return Session.get('searchText');
		}else{
			return '';
		}
	},

	searchArea(){
		if(Session.get('searchArea')){
			return Session.get('searchArea');
		}else{
			return '';
		}		
	},

	showIcon(){
		var currentUrl = FlowRouter.current().path;
		if(currentUrl){
			var newURl = currentUrl.split('/');
		}

		if(newURl[1] == 'search'|| newURl[1] == 'searchMap'){
			return true;
		}else{
			return false;
		}
	},
});

Template.searchbar.events({
	'keydown #gridSearchBusiness':function(e){
		//For Up and Down arrow selection in dropdown
		e.stopPropagation(); 
		$('.topSearchBarList').css('display','block');
		$('.showGridData').show();
		var current_index = $('.selectedSearch').index();
	    var $number_list = $('.topSearchBarListWrapper');
	    var $options = $number_list.find('.optionSearch');
		var items_total = $options.length;
		if (e.keyCode == 40) {
	        if (current_index + 1 < items_total) {
	            current_index++;
	            change_selection();
	        }
	    } else if (e.keyCode == 38) {
	        if (current_index > 0) {
	            current_index--;
	            change_selection();
	        }
	    }

	    // To redirect the page to Business List Page or Business Page
	    var currentParams 	= FlowRouter.getParam('businessurl');
	    var currentPath 	= FlowRouter.current().path;
	    var businessLink 	= $('.selectedSearch').attr('data-busLink');
		var currentText		= $('#gridSearchBusiness').val();
		var currentCatg		= $('.selectedSearch').attr('data-catg');
		if(currentPath){
			var newURl = currentPath.split('/');
		}

		var userId = Meteor.userId();
		if(userId){
			var cityObject = Meteor.users.findOne({"_id":userId});
			if(cityObject.selectedCity){
				var currentCity = cityObject.selectedCity;
			}else {
				var currentCity = "Pune";
			}
		}else{
			if(currentParams){
				var busCity = Business.findOne({"businessLink":currentParams},{fields: {'businessCity': 1}});
				var currentCity = busCity.businessCity;
			}else{
				var currentCity = FlowRouter.getParam('city');
			}
		}

	    if(e.keyCode===13&&newURl[1] == 'search'){
	    	// From Business List Page
	    	if(businessLink==undefined){
				$('.topSearchBarList').css('display','none');
				if(currentCatg){
					// For Category Only
					var	area = $('#getArea').val();
					var flowGo = "/search/"+currentCity+"/"+area+"/"+currentCatg;
					FlowRouter.go(flowGo);
				}else{
					var	area = $('#getArea').val();
					// If pressed enter withount arrow up or down
					if(currentText.length>0){
						var flowGo = "/search/"+currentCity+"/"+area+"/"+currentText;
						FlowRouter.go(flowGo);
					}else{
						var flowGo = "/search/"+currentCity+"/"+area;
						FlowRouter.go(flowGo);
					}
				}
	    	}else{
				var flowGo = "/" + businessLink;
	    		FlowRouter.go(flowGo);
	    	}
	    }else if(e.keyCode===13&&currentPath!=undefined&&currentParams!=undefined){
			// From Business Page
			Session.set('showGridView',true);
			Session.set('showMapView',false);
			
			
	    	if(businessLink==undefined){
				// var busCity = Business.findOne({"businessLink":currentParams},{fields: {'businessCity': 1}});
	    		if(currentCatg){
					// For Category Only
					var area = $('#getArea').val();
					var flowGo = "/search/"+currentCity+"/"+area+"/"+currentCatg;
					FlowRouter.go(flowGo);
				}else{
					// If pressed eneter withount arrow up or down
					var area = $('#getArea').val();
					if(currentText){
						var flowGo = "/search/"+currentCity+"/"+area+"/"+currentText;
						FlowRouter.go(flowGo);
					}else{
						var flowGo = "/search/"+currentCity+"/"+area;
						FlowRouter.go(flowGo);
					}
					
				}
	    	}else{
				var flowGo = "/" + businessLink;
	    		FlowRouter.go(flowGo);
	    	}
	    }else if(e.keyCode===13&&currentParams==undefined){
			// From other General Vendor and User Pages
			Session.set('showGridView',true);
			Session.set('showMapView',false);
			
	    	if(businessLink==undefined){
	    		if(currentCatg){
					// For Category Only
					var area = $('#getArea').val();
					
					var flowGo = "/search/"+currentCity+"/"+area+"/"+currentCatg;
					FlowRouter.go(flowGo);
					var searchText = currentCity + '|' + area + '|' + currentCatg;
					businessSearch1.search(searchText);
					businessSearchbanner1.search(searchText);
				}else{
					// If pressed eneter withount arrow up or down
					var area = $('#getArea').val();
					if(currentText){
						var flowGo = "/search/"+currentCity+"/"+area+"/"+currentText;
						FlowRouter.go(flowGo);
						var searchText = currentCity + '|' + area + '|' + currentText;
						businessSearch1.search(searchText);
						businessSearchbanner1.search(searchText);
					}else{
						var flowGo = "/search/"+currentCity+"/"+area;
						FlowRouter.go(flowGo);
						var searchText = currentCity + '|' + area + '|' + "";
						businessSearch1.search(searchText);
						businessSearchbanner1.search(searchText);
					}
					
				}
	    	}else{
				var flowGo = "/" + businessLink;
	    		FlowRouter.go(flowGo);
	    	}
	    }


	    function change_selection() {
		    $options.removeClass('selectedSearch');
		    $options.eq(current_index).addClass('selectedSearch');
		    var text = $('.selectedSearch .selectedTitleVal').text();
		    $('#gridSearchBusiness').val(text.trim());
			$('.topSearchBarList').addClass('searchDisplayShow').removeClass('searchDisplayHide');

			// To scroll the selection
			var $s = $('.topSearchBarList');
			var optionTop = $('.selectedSearch').offset().top;
			var selectTop = $s.offset().top;
			$s.scrollTop($s.scrollTop() + (optionTop - selectTop)-4);

		}
	},
	'click .optionSearch': function(e){
	    $('.optionSearch').removeClass('selectedSearch');
	    $(e.currentTarget).addClass('selectedSearch');


		var currentPath = FlowRouter.current().path;
		var businessLink = $('.selectedSearch').attr('data-busLink');
		var currentCatg = $('.selectedSearch').attr('data-catg');
		var currentParams 	= FlowRouter.getParam('businessurl');
		var currentText = "*";
		
		if(currentPath){
			var newURl = currentPath.split('/');
		}

		var userId = Meteor.userId();
		if(userId){
			var cityObject = Meteor.users.findOne({"_id":userId});
			if(cityObject.selectedCity){
				var currentCity = cityObject.selectedCity;
			}else {
				var currentCity = "Pune";
			}
		}else{
			if(currentParams){
				var busCity = Business.findOne({"businessLink":currentParams},{fields: {'businessCity': 1}});
				var currentCity = busCity.businessCity;
			}else{
				var currentCity = FlowRouter.getParam('city');
			}
		}
		$('#gridSearchBusiness').val(currentCatg); 
		
	    if(newURl[1] == 'search'){
	    	// From Business List Page
	    	if(businessLink==undefined){
				$('.topSearchBarList').css('display','none');
				// if(currentCatg){
					// For Category Only
					var	area = $('#getArea').val();					
					
					var flowGo = "/search/"+currentCity+"/"+area+"/"+currentCatg;
					FlowRouter.go(flowGo);
					var searchText = currentCity + '|' + area + '|' + currentCatg;
					businessSearch1.search(searchText);
					businessSearchbanner1.search(searchText);
	    	}else{
				var flowGo = "/" + businessLink;
	    		FlowRouter.go(flowGo);
	    	}
	    }else if(currentPath!=undefined&&currentParams!=undefined){
			// From Business Page
			Session.set('showGridView',true);
			Session.set('showMapView',false);
			
	    	if(businessLink==undefined){
				// var busCity = Business.findOne({"businessLink":currentParams},{fields: {'businessCity': 1}});
	    		// if(currentCatg){
					// For Category Only
					var area = $('#getArea').val();
					var flowGo = "/search/"+currentCity+"/"+area+"/"+currentCatg;
					FlowRouter.go(flowGo);
					var searchText = currentCity + '|' + area + '|' + currentCatg;
					businessSearch1.search(searchText);
					businessSearchbanner1.search(searchText);
	    	}else{
				var flowGo = "/" + businessLink;
	    		FlowRouter.go(flowGo);
	    	}
	    }else if(currentParams==undefined){
			// From other General Vendor and User Pages
			Session.set('showGridView',true);
			Session.set('showMapView',false);
			
	    	if(businessLink==undefined){
					// For Category Only
					var area = $('#getArea').val();					
					var flowGo = "/search/"+currentCity+"/"+area+"/"+currentCatg;
					FlowRouter.go(flowGo);
					var searchText = currentCity + '|' + area + '|' + currentCatg;
					businessSearch1.search(searchText);
					businessSearchbanner1.search(searchText);
	    	}else{
				var flowGo = "/" + businessLink;
	    		FlowRouter.go(flowGo);
	    	}
		}
	},
	
	'click .seachBusiness': function(e){
		// console.log("Me clicked");
		$('.topSearchBarList').addClass('searchDisplayShow').removeClass('searchDisplayHide');
		var currentPath = FlowRouter.current().path;
		var currentParams 	= FlowRouter.getParam('businessurl');
		var currentText = $('#gridSearchBusiness').val();
		// if(!currentText){
		// 	currentText = "*";
		// }
		if(currentPath){
			var newURl = currentPath.split('/');
		}

		var userId = Meteor.userId();
		if(userId){
			var cityObject = Meteor.users.findOne({"_id":userId});
			if(cityObject.selectedCity){
				var currentCity = cityObject.selectedCity;
			}else {
				var currentCity = "Pune";
			}
		}else{
			if(currentParams){
				var busCity = Business.findOne({"businessLink":currentParams},{fields: {'businessCity': 1}});
				var currentCity = busCity.businessCity;
				

			}else{
				var currentCity = FlowRouter.getParam('city');
			}
		}
		// console.log('url :',newURl[2]);
		if(newURl[1] == 'search'){
			// From Business List Page
			var	area = $('#getArea').val();
			// console.log('area :',area);
			if(currentText){
				var flowGo = "/search/"+currentCity+"/"+area+"/"+currentText;
				FlowRouter.go(flowGo);
				var searchText = currentCity + '|' + area + '|' + currentText;
				// business.search(searchText);
				// console.log('search :',business.search(searchText));
				businessSearch1.search(searchText);
				// console.log('search :',businessSearch1.getData());
				businessSearchbanner1.search(searchText);

			}else{
				var flowGo = "/search/"+currentCity+"/"+area;
				FlowRouter.go(flowGo);
				var searchText = currentCity + '|' + area + '|' + "";

				// businessSearch1.search(searchText);
				businessSearch1.search(searchText);

				businessSearchbanner1.search(searchText);
			}
			
			
		}else if(currentPath!=undefined&&currentParams!=undefined){
			// From Business Page
			var	area = $('#getArea').val();
			Session.set('showGridView',true);
			Session.set('showMapView',false);
			

			if(currentText){
				var flowGo = "/search/"+currentCity+"/"+area+"/"+currentText;
				FlowRouter.go(flowGo);
				var searchText = currentCity + '|' + area + '|' + currentText;
				businessSearch1.search(searchText);
				businessSearchbanner1.search(searchText);
			}else{
				var flowGo = "/search/"+currentCity+"/"+area;
				FlowRouter.go(flowGo);
				var searchText = currentCity + '|' + area + '|' + "";
				businessSearch1.search(searchText);
				businessSearchbanner1.search(searchText);
			}

			

		}else if(currentParams==undefined){
			// From other General Vendor and User Pages
			var	area = $('#getArea').val();
			Session.set('showGridView',true);
			Session.set('showMapView',false);
			

			if(currentText){
				var flowGo = "/search/"+currentCity+"/"+area+"/"+currentText;
				FlowRouter.go(flowGo);
				var searchText = currentCity + '|' + area + '|' + currentText;
				businessSearch1.search(searchText);
				businessSearchbanner1.search(searchText);
			}else{
				var flowGo = "/search/"+currentCity+"/"+area;
				FlowRouter.go(flowGo);
				var searchText = currentCity + '|' + area + '|' + "";
				businessSearch1.search(searchText);
				businessSearchbanner1.search(searchText);
			}
			
			
		}
		
	    // Session.set("showGridOnMainPageSearch",true);
	},
	'click #gridSearchBusiness': function(e){
		//To stop closing the dropdown
	    var currentText		= $('#gridSearchBusiness').val();
		$('.topSearchBarList').addClass('searchDisplayShow').removeClass('searchDisplayHide');
		e.stopPropagation(); 
	},
	'click .topSearchBarList': function(e){
		//To stop closing the dropdown
		$('.topSearchBarList').addClass('searchDisplayShow').removeClass('searchDisplayHide');
	    $('.topSearchBarList').css('display','none');
		e.stopPropagation(); 
	},
	"keyup #gridSearchBusiness": _.throttle(function(e) {
		if(e.keyCode != 40&&e.keyCode != 38&&e.keyCode != 37&&e.keyCode != 39){
			var text = $('#gridSearchBusiness').val().trim();

			var userId = Meteor.userId();
			if(userId){
				var cityObject = Meteor.users.findOne({"_id":userId});
				if(cityObject.selectedCity){
					var currentCity = cityObject.selectedCity;
				}else {
					var currentCity = "Pune";
				}
			}else{
				var currentParams 	= FlowRouter.getParam('businessurl');
				if(currentParams){
					var busCity = Business.findOne({"businessLink":currentParams},{fields: {'businessCity': 1}});
					var currentCity = busCity.businessCity;
				}else{
					var currentCity = FlowRouter.getParam('city');
				}
			}

			var	area = $('#getArea').val();
		   	var category = $('.selectedSearch').attr('data-catg');

		   	// Session set to stop data rendering in helper
		   	// if(e.keyCode!=13){
    		// 	Session.set("rxtSearchText","");
		   	// }

			var searchText = currentCity + '|' + area + '|' + text;
		    // if(text.length>0){
		    	$('.topSearchBarList').removeClass('searchDisplayHide').addClass('searchDisplayShow');
			    dropdownSearchList.search(searchText);
				
		    	if(e.keyCode==13){
					businessSearch1.search(searchText);
					businessSearchbanner1.search(searchText);
			   	}
		    // } else{
		    // 	$('.topSearchBarList').addClass('searchDisplayHide').removeClass('searchDisplayShow');
		    // }	

		    // For Business List Page businessList.js fields
		    // Session.set('searchQueryText',text);
		    setTimeout(function() {
		    	if($('.listRelevance').hasClass('busListSelected')){
					$('.listRelevance').click();
				}
				if($('.listOffers').hasClass('busListSelected')){
					$('.listOffers').click();
				}
				if($('.listDistance').hasClass('busListSelected')){
					$('.listDistance').click();
				}
				if($('.gridVwBus').hasClass('bkgOrange')){
					$('.gridVwBus').trigger('click');
				}
				if($('.mapVwPointer').hasClass('bkgOrange')){
					$('.mapVwPointer').trigger('click');
				}
		  	}, 1);	    
		}
	  }, 200),


	'click .mapVwPointer':function(event){
		event.preventDefault();

		var data = Template.currentData(self.view);
		// console.log('data:',data);
        Blaze.renderWithData(Template.businessMap, data, $(".mapContainer")[0]);
        $('.sidebarMapPre').css('display','none');
		
        $('.displayMapView').show();
		$('.displayMapView').addClass('col-lg-5');
		$('.displayGridView').removeClass('col-lg-8');
		$('.displayGridView').addClass('col-lg-5');
		$('.displayGridBus').hide();

		$('.gridViewBusList').hide();
		$('.mapViewBusList').show();
		$('.thumbBusList').addClass('scrollMapVwBus');
		$('.gridVwBus').removeClass('bkgOrange');
		$('.mapVwPointer').addClass('bkgOrange');

		Session.set('showMapView',true);
		Session.set('showGridView',false);


		setTimeout(function() {
        	if($('.listRelevance').hasClass('busListSelected')){
				$('.listRelevance').click();
			}
			if($('.listOffers').hasClass('busListSelected')){
				$('.listOffers').click();
			}
			if($('.listDistance').hasClass('busListSelected')){
				$('.listDistance').click();
			}
      	}, 1);
	},
	'click .gridVwBus':function(event){
		event.preventDefault();
		$('.sidebarMapPre').css('display','block');
		
        $('.displayMapView').hide();
        $('.displayGridView').show();
        $('.displayGridBus').show();
       
       	$('.displayMapView').removeClass('col-lg-5');
		$('.displayGridView').addClass('col-lg-8');
		$('.displayGridView').removeClass('col-lg-5');

		$('.gridViewBusList').show();

		$('.mapViewBusList').hide();
		$('.thumbBusList').removeClass('scrollMapVwBus');
		$('.gridVwBus').addClass('bkgOrange');
		$('.mapVwPointer').removeClass('bkgOrange');

		Session.set('showMapView',false);
		Session.set('showGridView',true);

	}
});



$(document).on("click",function() {
    if( $(".topSearchBarList").hasClass('searchDisplayShow')&&!($("#gridSearchBusiness").is(":focus"))){
		$('.topSearchBarList').addClass('searchDisplayHide').removeClass('searchDisplayShow');
    }
});