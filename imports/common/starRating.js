import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { Accounts } from 'meteor/accounts-base'; 

import './starRating.html'; 


function starCaptions() {
	var captions = [
		"Eek! Something else next time.",
		"Eek! Something else next time.",
		"Jeez! Will prefer others.",
		"Meh! I have Experienced better.",
		"Ummmm! Kind of Ok.",
		"Ahem! Above Average.",
		"Yay! I Like it.",
		"Yipiee! I am a fan.",
		"Yes! Almost perfect.",
		"Wow! Awesome.",
	];

	return captions;
}


Template.starRating.events({
	'mouseenter .boxbg': function(event){
		var whatClass = $(event.currentTarget).attr('class');
		var classes = whatClass.split(' ');
		var theClass = classes[classes.length - 1];
		if(theClass == 'fixStar1' || theClass == 'fixStar2'){
			theClass = classes[classes.length - 2];
		}
		var classnum = theClass.substr(3);
		var numofSelDivs = $('.boxStar1').length;
		var numofSelDivs = numofSelDivs + $('.boxStar2').length;
		if(numofSelDivs > classnum){
			for(j=classnum; j<= numofSelDivs; j++){
				$('.box'+j).removeClass('boxStar1');
				$('.box'+j).removeClass('boxStar2');
			}
		}
		for(i=0;i<=classnum;i++){
			if(i%2 != 0){
				$('.box'+i).addClass('boxStar1');
			}else{
				$('.box'+i).addClass('boxStar2');
			}
		}
		var captions = starCaptions();
		$('.textbox').text('');
		$('.textbox').text(captions[classnum-1]);
	},

	'mouseout .box1': function(event){
		var goldStars = $('.boxStar1').length;
		var goldStars = goldStars + $('.boxStar2').length;

		if(goldStars == 1){
			$('.box1').removeClass('boxStar1');			
		}
	},

	'mouseout .boxbg': function(event){
		$('.textbox').text('');
		$('.boxbg').removeClass('boxStar1');
		$('.boxbg').removeClass('boxStar2');
	},

	'click .boxbg': function(event){
		var whatClass = $(event.currentTarget).attr('class');
		var classes = whatClass.split(' ');
		var theClass = classes[classes.length - 2];
		var classnum = theClass.substr(3);
		for(i=0;i<=classnum;i++){
			if(i%2 != 0){
				$('.box'+i).removeClass('boxStar1');
				$('.box'+i).addClass('fixStar1');
			}else{
				$('.box'+i).removeClass('boxStar2');
				$('.box'+i).addClass('fixStar2');
			}
		}

		//When new rating given is less than original rating... 
		var totalStars = $('.fixStar1').length;
		var totalStars = totalStars + $('.fixStar2').length;

		if(totalStars > classnum){
			var nextClass = parseInt(classnum) + 1;
			for(j=nextClass; j<=totalStars; j++){
				$('.box'+j).removeClass('fixStar1');
				$('.box'+j).removeClass('fixStar2');
			}
		}
	},
});