import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';


Template.UMeditMyProfile.onCreated(function(){
	Meteor.subscribe('userfunction');

});

Template.UMeditMyProfile.helpers({
	edit: ()=> {
		// var userId = FlowRouter.getParam('userId');
		var userId = Meteor.userId();
		// console.log(userId);
		return Meteor.users.findOne({'_id': userId}) ;
	},

	// genderRadio: (gender)=> {
	// 	console.log(this.profile.signGender + "== "+gender);
	// 	return this.profile.signGender == gender;
	// },

});

Template.registerHelper('compare', function(v1, v2) {
  if (typeof v1 === 'object' && typeof v2 === 'object') {
    return _.isEqual(v1, v2); // do a object comparison
  } else {
    return v1 === v2;
  }
});

Template.UMeditMyProfile.events({


// 'change .js-browseImg1': function(event,Template){
//     event.preventDefault();
//     var file = event.target.files[0];  //assuming u have only one file
//     var render = new FileReader(); //this works only in html5
//     render.onload =function(event){
//        fileData1 = render.result;
//     };
//     render.readAsDataURL(file);
//   },


 'submit #editMyProfile': function (event) {
      event.preventDefault();

		 if(!window.fileData1){fileData1 = '';}
        // var userId = FlowRouter.getParam('userId');
        var userId =Meteor.userId();

        doc = {
        salutationVar1   : event.target.salutation1.value,
        lastNameVar1     : event.target.lastName1.value,
        firstNameVar1    : event.target.firstName1.value,
        // emailVar1        : event.target.signupEmail1.value,
        // userNameVar1     : event.target.userName1.value,
        signGenderVar1   : event.target.signGender1.value,
        homeAddVar1      : event.target.homeAdd1.value,
        cityVar1         : event.target.city1.value,
        stateVar1        : event.target.state1.value,
        zipVar1          : event.target.zip1.value,
        countryVar1      : event.target.country1.value,
        mobNumberVar1    : event.target.mobNumber1.value,
        alterNumberVar1  :event.target.alterNumber1.value,
        passwordVar1     : event.target.signupPassword1.value,
        displayPicture1  : fileData1,
        signupConfirmPasswordVar1 : event.target.signupConfirmPassword1.value,
       }



		var userId = Meteor.userId();
		var user = Meteor.users.findOne({'_id': userId}) ;
		if(pass == null || confirmPass == null){
	       var pass        = 'demopassword';
	       var confirmPass = 'demopassword';			
		}else{
	       var pass        = doc.passwordVar1;
	       var confirmPass = doc.signupConfirmPasswordVar1;			
		}

		console.log(pass +"  "+confirmPass);
   //Check password is at least 6 chars long
    var isValidPassword = function(pass, confirmPass) {
       if (pass === confirmPass) {
        // console.log('passwordVar.length'+ passwordVar.length >= 6 ? true : swal(''));
         return pass.length >= 6 ? true : swal({
								                    title: "password should be at least 6 characters long",
								                    text: "Please try again or create an account",
								                    timer: 1700,
								                    showConfirmButton: false,
								                    type: "error"
								                });
       } else {
         return swal({
            title: 'Passwords dont match',
            text: 'Please try again',
            showConfirmButton: true,
            type: 'error'
         }); //End of error swal
       } //End of else

     }

    if (isValidPassword(pass, confirmPass)) { 

		Meteor.call('updateUserByUser', userId, doc,(error,result)=>{
			if(error){

			}else{
				if(doc.passwordVar1 != '' || doc.passwordVar1 != null || doc.passwordVar1 != undefined){
					Bert.alert('Profile updated!');
				
				}else{
					Bert.alert('Password Changed. Please login again!');
					FlowRouter.go('/');	
				}

			}
		});

	}
    // event.target.salutation1.value ='';
    // event.target.lastName1.value ='';
    // event.target.firstName1.value ='';
    // event.target.signupEmail1.value ='';
    // event.target.userName1.value ='';
    // event.target.signGender1.value ='';
    // event.target.homeAdd1.value ='';
    // event.target.city1.value ='';
    // event.target.state1.value ='';
    // event.target.zip1.value ='';
    // event.target.country1.value ='';
    // event.target.mobNumber1.value ='';
    // event.target.alterNumber1.value ='';
    // event.target.signupPassword1.value ='';
    // event.target.displayPicture1.value ='';
    // event.target.signupConfirmPassword1.value ='';


    } //End of submit update form
  }); //End of Template Events