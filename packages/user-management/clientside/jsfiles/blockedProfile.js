Template.blockedProfile.events({

	'click .logout': function(event) {
		event.preventDefault();
		Meteor.logout();
		FlowRouter.go('/');
	},	

});