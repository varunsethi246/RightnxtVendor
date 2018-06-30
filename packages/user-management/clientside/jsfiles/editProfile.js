import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Email } from 'meteor/email'

// import './editProfile.html';
    
Template.editProfile.onCreated(function(){
	Meteor.subscribe('userfunction');

});

Template.editProfile.helpers({
	edit: ()=> {
		var userId = FlowRouter.getParam('userId');
		return Meteor.users.findOne({'_id': userId}) ;
	},

});

Template.editProfile.events({


'change .js-browseImg1': function(event,Template){
    event.preventDefault();
    var file = event.target.files[0];  //assuming u have only one file
    var render = new FileReader(); //this works only in html5
    render.onload =function(event){
       fileData1 = render.result;
    };
    render.readAsDataURL(file);
  },


 'submit #edit': function (event) {

    event.preventDefault();

    var urlUID = FlowRouter.getParam('userId');
    var loggedInUser = Meteor.userId();
    const target = event.target;
    const passwordVar1 = target.signupPassword1.value;


    // console.log('currpassword : ' + currpassword);
    console.log('urlUID : ' + urlUID);
    console.log('loggedInUser : ' + loggedInUser);

 if(!window.fileData1){fileData1 = '';}
        // var userId = FlowRouter.getParam('userId');
        doc = {

        salutationVar1   : event.target.salutation1.value,
        lastNameVar1     : event.target.lastName1.value,
        firstNameVar1    : event.target.firstName1.value,
        emailVar1        : event.target.signupEmail1.value,
        userNameVar1     : event.target.userName1.value,
        signGenderVar1   : event.target.signGender1.value,
        homeAddVar1      : event.target.homeAdd1.value,
        cityVar1         : event.target.city1.value,
        stateVar1        : event.target.state1.value,
        zipVar1          : event.target.zip1.value,
        countryVar1      : event.target.country1.value,
        mobNumberVar1    : event.target.mobNumber1.value,
        alterNumberVar1  :event.target.alterNumber1.value,
        displayPicture1  : fileData1

       }


        if( urlUID == loggedInUser){
           //Check current Password
            const currpassword = target.currentPassword.value;  
            var digest = Package.sha.SHA256(currpassword);        
            Meteor.call('checkcurrentPassword', digest, urlUID, function(err, result) {
              if (result) {
                console.log('the passwords match!');
              }
            }); 

           userFormValues = {
                            passwordVar1     : event.target.signupPassword1.value,
                            signupConfirmPasswordVar1 : event.target.signupConfirmPassword1.value
            }

           Meteor.call('updateUserByUser', urlUID, doc , userFormValues); 
        }else if(Roles.userIsInRole(loggedInUser, ['admin'])){
            Meteor.call('updateUserByAdmin', urlUID, doc , passwordVar1); 
            var from = 'rashmimhatre100@gmail.com';
            var to = 'rashmimhatre100@gmail.com';
            var subject = 'Password Reset!';
            var body = 'Password reset by Admin. Your New Password is ' + passwordVar1 ;
            Meteor.call('sendEmail', to , from, subject ,body);
        }else{
            console.log('Unauthorized Access!');
        }

        FlowRouter.go('/');
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


    }, //End of submit update form
  }); //End of Template Events