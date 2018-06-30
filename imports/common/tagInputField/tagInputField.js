import './tagInputField.html';

var tagIndex = 0;
tagsList = '';
function hasComaSpace(s) {
  return s.indexOf(',') >= 0;
}
Template.tagInputField.events({
	'click .focus-tag' : function(event){
		$('.getTag1').focus();
	},

	'focusout #getTag': function(event){
		var text = $(event.target).val();
	    var textTrue =	/^[,]*$/.test(text);


		if(text == ','|| textTrue){
			$('#getTag').val('');
		}
    	if(!textTrue && text != '' && text != ',' && !(typeof text == 'undefined')){
	    	$('#listTags').append("<div class='js-click-tag1 str-tags-each1' id='tagIndex-" + tagIndex + "' > <div class='str-tag1'> " + text + " x </div> </div>");
	    	tagsList = $('#searchTags').val();
	    	if(tagsList){
				tagsList = tagsList + ',' + text;
			}
			else{
				tagsList = text;
			}
			$('#searchTags').val(tagsList);
			$('#getTag').val('');
			tagIndex = tagIndex + 1;
		}
	},
	// 'click .tag-input-outer' : function(event){
	'click .str-tag1' : function(event){

		var getdataIndex = $(event.target).parent().attr('id');
		if(getdataIndex){
			var deleteDiv = '#' + getdataIndex;
			$(deleteDiv).remove();
			var ind = parseInt(getdataIndex.slice(-1)) ;
			var newTags = '';
			var selectedTags = $('#searchTags').val();
			var rmTag = selectedTags.split(',');
			for(var i = 0 ; i < tagIndex ; i++ ){
				if( i == ind)
					continue;
				if(rmTag[i])
					newTags = newTags + ',' + rmTag[i];
			}
			$('#searchTags').val(newTags);

		}
	},
	
	"keyup #getTag": _.throttle(function(e) {
	    var text = $(e.target).val().trim();
	    var textTrue =	/^[,]*$/.test(text);
	    
	    if(e.keyCode == 188&&!textTrue){
	    	var text = $(e.target).val().trim();
		    	text = text.slice(0,-1);
	    	if(text == ''){
				// $('#getTag').val('');
	    	}else{
		    	$('#listTags').append("<div class='js-click-tag1 str-tags-each1' id='tagIndex-" + tagIndex + "' > <div class='str-tag1'> " + text + " x </div> </div>");
		    	tagsList = $('#searchTags').val();
		    	if(tagsList){
					tagsList = tagsList + ',' + text;
				}
				else{
					tagsList = text;
				}
				$('#searchTags').val(tagsList);
				$('#getTag').val('');
				tagIndex = tagIndex + 1;
			}
		}
	    
	  }, 200)
});