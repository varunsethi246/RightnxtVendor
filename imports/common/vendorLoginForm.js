import './vendorLoginForm.html';
import '/imports/common/common.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


Template.vendorLoginForm.events({
	'submit form.loginForm' : function(){
		event.preventDefault();

		FlowRouter.go('/claim');
	},
});
VenderLoginForm = function () {  
  BlazeLayout.render("anonymousUserLayout",{main: 'VenderLoginForm'});
}

export { VenderLoginForm };