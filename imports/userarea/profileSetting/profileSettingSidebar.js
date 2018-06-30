import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

import './profileSettingSidebar.html';

Template.profileSettingSidebar.events({
	'click .menuItem':function(event){        
        $('.menuItem').removeClass('active');
        $(event.currentTarget).addClass('active');
	},
});