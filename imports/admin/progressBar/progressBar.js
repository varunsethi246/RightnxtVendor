import { Session } from 'meteor/session'; 
import './progressBar.html';
import './progressCompleted.html';
import '../catgManagement/catgBulkUpload.html';

Template.progressBar.onRendered(function(){
	var totalTime = Session.get("elapsedTime");
	var $progress = 0;
	var id = setInterval(function(){
	$progress += 20;
		$('#progressbar').animate({width: $progress+'%'},{duration: 0, easing : "linear"});        
	 if($progress == 100){
		 clearInterval(id);
		}
	},totalTime);
});