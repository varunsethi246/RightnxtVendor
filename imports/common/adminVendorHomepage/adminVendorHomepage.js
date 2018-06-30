import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';

import '/imports/common/common.js';
import './adminVendorHomepage.html';


AdminVendorHomepage = function () {  
  BlazeLayout.render("anonymousUserLayout",{main: 'adminVendorHomepage'});
}

export { AdminVendorHomepage };