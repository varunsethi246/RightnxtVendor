import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import './companyBankDetails.html';
import './companyAllBankDetails.js';



Template.companyBankDetails.helpers({
	'editBankDetails': function (){
		return Session.get('editBankDetails');
	}

});

Template.companyAllBankDetails.events({

	'click .editBankDetails': function(e) {
        e.preventDefault();
        $('.HRMSTextbox').css({
            'background-color': 'transparent',
            'color': '#000',
            'font-weight':'bold',
            'font-size': '15px'
        });
        // var locationObj = CompanySettings.find({'responsiblePerson':'Admin'});
        var rule = this;
        
        var address = rule.companyAddress;
        var id = {id : e.currentTarget.name};

        FlowRouter.setQueryParams(id);
        $('input[name="accHolderName"]').val(this.accHolderName);
        $('input[name="bankName"]').val(this.bankName);
        $('input[name="branchName"]').val(this.branchName);
        $('input[name="accNumber"]').val(this.accNumber);
        $('input[name="ifscCode"]').val(this.ifscCode);
       
        
        Session.set('editBankDetails',true);        
      
    },
});

Template.companyBankDetails.events({


  'click .btnUpdateBankDetails': function(event){
    event.preventDefault();
   
    companyBankDetailsFormValue = {
        accHolderName  : $("input#accHolderName").val(),
        bankName       : $("input#bankName").val(),
        branchName     : $("input#branchName").val(),
        accNumber      : $("input#accNumber").val(),
        ifscCode       : $("input#ifscCode").val(),
   

    }
    
    console.log(companyBankDetailsFormValue);

    Meteor.call('updateBankDetails', companyBankDetailsFormValue);
    // event.target.accHolderName.value ='';
    // event.target.bankName.value ='';
    // event.target.branchName.value ='';
    // event.target.accNumber.value ='';
    // event.target.ifscCode.value ='';
    },

    'click .addBankDetails': function(event){
        $('.morebankdetails ').toggleClass('fa fa-caret-right');
        $('.morebankdetails ').toggleClass('fa fa-caret-down');
        $('.bankDetailsFormWrapper').slideToggle();
   }


   
});
