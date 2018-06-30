import './categoriesSearchField.html';
import { Categories } from '/imports/api/masterData/categoriesMaster.js';
Meteor.subscribe('categories');

var options = {
  keepHistory: 0,
  localSearch: false
};
selectedCategoriesList = [];
var fields = ['level0', 'level1', 'level2','level3','level4'];

categorySearch1 = new SearchSource('categories', fields, options);

var dataIndex = 0;


Template.categoriesSearchField.events({
	'focusout #agetCategory' : function(event){
		var data = event.currentTarget.value;
		if(data == ''){
			// $('#businessAnythingElse').focus();
			return;
		}
		var data1  = data.split('>');
		if(data1.length == 1 ){
			if(data1[0]=='Products' || data1[0]=='Services'){

			}else{
				$('#agetCategory').val('');
				$('#agetCategory').focus();
				return;
			}
		}
		for(var i = 0 ; i < data1.length; i++){
			data1[i] = data1[i].trim();
		}
		
		
		var showData =data1[4];
		if(data1[4] == ' --' || !data1[4]){
			showData = data1[3];
		}
		if(data1[3] == ' -- ' || !data1[3]){
			showData = data1[2];
		}
		if(data1[2] == ' -- ' || !data1[2]){
			showData = data1[1];
		}
		if(data1[1] == ' -- ' || !data1[1]){
			showData = data1[0];
		}
		data = data1[0];
		for(var k = 1 ; k < data1.length; k++){
			if(data1[k] != '' || !(typeof data1[k] == 'undefined')){
				data = data + ' > ' + data1[k];
			}
		}

		var temp = 0;
		for(var j = 0 ; j < selectedCategoriesList.length; j++){
			if(data == selectedCategoriesList[j] ){
				temp = 1;
			}
		}
		if(temp == 0){
			selectedCategoriesList.push(data);	
			$('#alistCategory').append("<div class='js-click-tag1 str-tags-each1' id='catgIndex-" + dataIndex + "' > <div class='str-category str-category1' > " + showData + " x </div> </div>");
			dataIndex = dataIndex + 1;
			$('.category').text('');
			$('#agetCategory').val('');
			var catgList = $('#asearchCategories').val();
			if(catgList){
				catgList = catgList + '|' + data;
			}
			else{
				catgList = data;
			}
			$('#asearchCategories').val(catgList);
		}else{
			$('#agetCategory').val('');
		}
		$('#agetCategory').focus();

	},
	
	
	'click .focus-agetCategory1' : function(event){
		$('.agetCategory1').focus();
	},
	
	'click .str-category1' : function(event){
		// $('.agetCategory1').focus();

		var getdataIndex = $(event.target).parent().attr('id');
		
		var deleteDiv = '#' + getdataIndex;
		$(deleteDiv).remove();
		var ind = parseInt(getdataIndex.slice(-1)) ;
		//remove entry from selectedCategoriesList 
				
		var varCategoryValue = $('#asearchCategories').val();
		if(varCategoryValue){
			var splitvarCategoryValue = varCategoryValue.split('|');
			var toRemoveCategory = splitvarCategoryValue[ind];
			var indexofSelectedCat = selectedCategoriesList.indexOf(toRemoveCategory);
			selectedCategoriesList.splice(indexofSelectedCat,1);			
			//remove entry from  asearchCategories
			splitvarCategoryValue[ind] = '';
			console.log('splitvarCategoryValue : ',splitvarCategoryValue);
			var newSplitvarCategoryValue = '';
			for(var i = 0 ; i < splitvarCategoryValue.length; i++){
				if(splitvarCategoryValue[i] != ''){
					if(i == 0){
						newSplitvarCategoryValue = splitvarCategoryValue[i];	
					}else{
						newSplitvarCategoryValue = newSplitvarCategoryValue + '|' +splitvarCategoryValue[i];
					}
				}
			}
			console.log('newSplitvarCategoryValue : ',newSplitvarCategoryValue);
			$('#asearchCategories').val(newSplitvarCategoryValue);
		}
		
	},

	
	"keyup #agetCategory": _.throttle(function(e) {
	    var text = $(e.target).val().trim();
	    categorySearch1.search(text);
	    
	  }, 200)

	
});

Template.categoriesSearchField.helpers({
	getcategory: function() {
		var data =  categorySearch1.getData({
	      transform: function(matchText, regExp) {
	        return matchText.replace(regExp, "$&");    
	      },
	      
	    });
	    var temp = 0;
	    var dataReturn = [];
	    
	    for(var i = 0 ; i < data.length; i++){
	    	temp = 0;

	    	var collectionData = '';
	    	if(data[i].level0 != '--' || (typeof data[i].level0 == 'undefined')){
    			collectionData = data[i].level0;
    		}
    		if(data[i].level1 != '--' || (typeof data[i].level1 == 'undefined')){
    			collectionData = collectionData + ' > ' + data[i].level1;
    		}
    		if(data[i].level2 != '--' || (typeof data[i].level2 == 'undefined')){
    			collectionData = collectionData + ' > ' + data[i].level2;
    		}
    		if(data[i].level3 != '--' || (typeof data[i].level3 == 'undefined')){
    			collectionData = collectionData + ' > ' + data[i].level3;
    		}
    		if(data[i].level4 != '--' || (typeof data[i].level4 == 'undefined')){
    			collectionData = collectionData + ' > ' + data[i].level4;
    		}
    		
	    	for(var j = 0 ; j < selectedCategoriesList.length ; j++){
	    		if(collectionData == selectedCategoriesList[j]){
			    	temp = 1;
			    }
		    }
		    if(temp == 0){
		    	dataReturn.push({
			    		'_id'	 : data[i]._id,
			    		'level0' : data[i].level0.trim(),
			    		'level1' : data[i].level1.trim(),
			    		'level2' : data[i].level2.trim(),
			    		'level3' : data[i].level3.trim(),
			    		'level4' : data[i].level4.trim(),
			    		'status' : ''
			    });
		    }
	    }
	    return dataReturn;
  	},

  	ifDashData: function(content){
  		
  		if(typeof content == 'undefined'){
  			return false;
  		}

  		if(content == '--' || content == ' ' || content=='undefined'){
  			return false;
  		}
  		else{
  			return true;
  		}
  	},

  	
});


