// import './companysettingsCarousel/companysettingsHeader.html';
import './companySettings.html';

import './companysettingsCarousel/companysettingsDisplayCarousel.js';
import './companysettingsCarousel/companysettingsFormsCarousel.js';
import './companysettingsCarousel/companysettingsModal.js';


import { CompanySettings } from '/imports/api/companysettingsAPI.js';

// Meteor.subscribe('companySettings');

Template.companysettingsHeader.helpers({

	'companyCount' : function() {
    	return CompanySettings.find({}).count();
	},
	
});