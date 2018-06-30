import './adminStatistics.html';

import { users } from '/imports/api/userMasterAPI.js';
import { Business } from '/imports/api/businessMaster.js';
import { Enquiry } from '/imports/api/businessMaster.js';
import { Offers } from '/imports/api/offersMaster.js';


Template.adminStatistics.helpers({
	'adminStatistics':function() {
		var userCounts 		= Counts.get('noOfUserCount');
		var vendorCounts 	= Counts.get('noOfVendorCount');
		var busActCounts 	= Counts.get('noOfBusinessActive');
		var busInactCounts 	= Counts.get('noOfBusinessInactive');
		var enqWeek 		= Counts.get('noOfEnqWeek');
		var enqMonth		= Counts.get('noOfEnqMonth');
		var enqYear 		= Counts.get('noOfEnqYear')
		var offerWeek 		= Counts.get('noOfOfferWeek')
		var offerMonth 		= Counts.get('noOfofferMonth')
		var offerYear 		= Counts.get('noOfofferYear')
		// console.log('offerYear :' , offerYear);
		
		// console.log('offerWeek :',offerWeek);


		// console.log('userCounts', userCounts);
		var value = {
						"userCounts" 		: userCounts,
						"vendorCounts" 		: vendorCounts,
						"busActCounts" 		: busActCounts,
						"busInactCounts" 	: busInactCounts,
						"enqWeek"			: enqWeek,
						"enqMonth"			: enqMonth,
						"enqYear" 			: enqYear,
						"offerWeek"			: offerWeek,
						"offerMonth"		: offerMonth,
						"offerYear"			: offerYear,
					}
		// console.log('value', value);
		return value;

	}
});


