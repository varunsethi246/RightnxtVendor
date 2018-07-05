import '../../common/searchinitialisation.js'
import './mainBusinessSearch.html';
import { Business } from '/imports/api/businessMaster.js';
// Meteor.subscribe('vendorBusiness');
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


// var options = {
//   keepHistory: 0,
//   localSearch: true
// };

// var fields = ['businessTitle','businessTag','businesscategories'];

// businessSearch1 = new SearchSource('business', fields, options);

// var dataIndex = 0;

Template.mainBusinessSearch.onRendered(function(){
	$('.homeSearchBarList').removeClass('searchDisplayShow').addClass('searchDisplayHide');
});

Template.mainBusinessSearch.events({
	'focusout #getBusiness': function(event){
		// $('.businessListShow').css('display','block');
		$('.homeSearchBarList').addClass('searchDisplayShow').removeClass('searchDisplayHide');
	},
	
	'click .focus-getBusiness1' : function(event){
		$('.getBusiness1').focus();
	},
	
	"keyup #getBusiness": _.throttle(function(e) {
		if(e.keyCode != 40&&e.keyCode != 38&&e.keyCode != 37&&e.keyCode != 39){
			var city = '';
			var area = '';
			
			$('.homeSearchBarList').show();
			
		    var text = $('#getBusiness').val().trim();
		    if(text == ""){
		        $('.homeSearchBarList').hide();
		        $('.displayDiv').remove();
		    }

			var sesCity = $('#getCity').val();
			if(sesCity){
				city = sesCity;
			}else {
				city = 'Pune';
			}
		    
			var sesArea= $('#getArea').val();
			if(sesArea){
				area = sesArea;
			}else {
				area = 'All Area';
			}

		    var searchText = city + '|' + area + '|' + text;
		    dropdownSearchList.search(searchText);
		}
	  }, 200),

	'keydown #getBusiness':function(e){
		//For Up and Down arrow selection in dropdown
		e.stopPropagation(); 
		var current_index = $('.selectedSearchHomePage').index();
	    var $number_list = $('.homeSearchBarListWrapper');
	    var $options = $number_list.find('.optionSearchHomePage');
	    var items_total = $options.length;

		if (e.keyCode == 40) {
	        if (current_index + 1 < items_total) {
	            current_index++;
	            change_selectionHome();
	        }
	    } else if (e.keyCode == 38) {
	        if (current_index > 0) {
	            current_index--;
	            change_selectionHome();
	        }
	    }

	    function change_selectionHome() {
		    $options.removeClass('selectedSearchHomePage');
		    $options.eq(current_index).addClass('selectedSearchHomePage');
		    var text = $('.selectedSearchHomePage .selectedTitleVal').text();
		    $('#getBusiness').val(text.trim());
			$('.homeSearchBarList').addClass('searchDisplayShow').removeClass('searchDisplayHide');

			// To scroll the selection
			var $s = $('.homeSearchBarList');
			var optionTop = $('.selectedSearchHomePage').offset().top;
			var selectTop = $s.offset().top;
			$s.scrollTop($s.scrollTop() + (optionTop - selectTop)-4);

		}

		var selectedBus = $('.selectedSearchHomePage').attr('data-busLink');
		if(selectedBus&&e.keyCode===13){
			var flowGo = "/" + selectedBus;
	    	FlowRouter.go(flowGo);
		}else if(!selectedBus&&e.keyCode===13){
			var searchCatg = $('.selectedSearchHomePage').attr('data-catg');
			var searchString = $('#getBusiness').val();
			var currentCity = $('#getCity').val();
			var currentArea = $('#getArea').val();

			if(searchCatg){
				// For Category Only
				var flowGo = "/search/"+currentCity+"/"+currentArea+"/"+searchCatg;
				FlowRouter.go(flowGo);
			}else{
				// If pressed eneter withount arrow up or down
				if(searchString){
					var flowGo = "/search/"+currentCity+"/"+currentArea+"/"+searchString;
					FlowRouter.go(flowGo);
				}else{
					var flowGo = "/search/"+currentCity+"/"+currentArea;
					FlowRouter.go(flowGo);
				}
				
			}
		}
	},

	'click .optionSearchHomePage':function(e){
		$('.optionSearchHomePage').removeClass('selectedSearchHomePage');
		$(e.currentTarget).addClass('selectedSearchHomePage');
		var text = $('.selectedSearchHomePage .selectedTitleVal').text();

		var selectedBus = $('.selectedSearchHomePage').attr('data-busLink');
		if(selectedBus){
			var flowGo = "/" + selectedBus;
	    	FlowRouter.go(flowGo);
		}
		if(!selectedBus){
			var searchCatg = $(e.currentTarget).attr('data-catg');
			var currentCity = $('#getCity').val();
			var currentArea = $('#getArea').val();

			var path =  "/search/"+currentCity+"/"+currentArea+"/"+searchCatg;
			FlowRouter.go(path);
			
		}
	},
	
	'click #getBusiness':function(e){
		e.stopPropagation(); 
		$('.homeSearchBarList').addClass('searchDisplayShow').removeClass('searchDisplayHide');
	},
});

Template.mainBusinessSearch.helpers({
  	getbusiness: function() {
		var data = dropdownSearchList.getData();
		var searchString = $('#getBusiness').val();

  		if(data){
			if(searchString){
				$('.homeSearchBarList').addClass('searchDisplayShow').removeClass('searchDisplayHide');
			}else{
				$('.homeSearchBarList').removeClass('searchDisplayShow').addClass('searchDisplayHide');
			}
  		}
	    return data;
  	},
  	businessHomeSearchTypeBus: function(searchType){
		if(searchType=="Business") {
			return true;
		} else {
			return false;
		}
	},
});

$(document).on("click",function() {
    if( $(".homeSearchBarList").hasClass('searchDisplayShow')&&!($("#getBusiness").is(":focus"))){
		$('.homeSearchBarList').addClass('searchDisplayHide').removeClass('searchDisplayShow');
    }
});