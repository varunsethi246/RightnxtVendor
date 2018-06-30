if (Meteor.isServer) {
	Inject.rawHead("loader", Assets.getText('initial-loading.html'));
}

// if (Meteor.isClient) {
// 	Meteor.startup(function() {
// 		setTimeout(function() {
// 			$("#inject-loader-wrapper").fadeOut(500, function() { $(this).remove(); });
// 		}, 500);
// 	});
// }