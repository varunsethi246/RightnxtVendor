import { Mongo } from 'meteor/mongo';
 
export const CheckedField = new Mongo.Collection('checkedField');

// if (Meteor.isServer) {

//   Meteor.publish('signUpConfig', function signUpConfig() {
//       return CheckedField.find({});
//   });
  
// }

Meteor.methods({

     'checkedField.insertCheckedData' : function (formValues) {

      CheckedField.insert(
        {

         responsibleUser   : Meteor.userId() , 

         companyDomain     : formValues.companyDomain,

         defaultRoleToUser : formValues.defaultRoleToUser,

         signUpConfig : [

          {
            'fieldName'          :   formValues.companyName, 
            'display'            :   formValues.checkboxcompanyName,
          },
                   
          {
            'fieldName'          :   formValues.title, 
            'display'            :   formValues.checkboxtitle,
          },

          {
            'fieldName'          :   formValues.firstName,
            'display'            :   formValues.checkboxfirstName,
          },

          {
            'fieldName'          :   formValues.lastName, 
            'display'            :   formValues.checkboxlastName,
          },

          {
            'fieldName'          :   formValues.emailAddress,
            'display'            :   formValues.checkboxemailAddress,
          },

          {
            'fieldName'          :   formValues.userName, 
            'display'            :   formValues.checkboxuserName,
          },

          {
            'fieldName'          :   formValues.gender,
            'display'            :   formValues.checkboxgender,
          },

          {
            'fieldName'          :   formValues.picture, 
            'display'            :   formValues.checkboxpicture,
          },

          {
            'fieldName'          :   formValues.homeAddress,
            'display'            :   formValues.checkboxhomeAddress,
          } ,

          {
            'fieldName'          :   formValues.city, 
            'display'            :   formValues.checkboxcity,
          },

          {
            'fieldName'          :   formValues.state,
             'display'           :   formValues.checkboxstate,
          },

          {
            'fieldName'          :   formValues.pin, 
            'display'            :   formValues.checkboxpin,
          },

          {
            'fieldName'          :   formValues.country, 
            'display'            :   formValues.checkboxcountry,
          },

          {
            'fieldName'          :   formValues.mobNum,
            'display'            :   formValues.checkboxmobNum,
          },

          {
            'fieldName'          :   formValues.alterMobNum,
            'display'            :   formValues.checkboxalterMobNum,
          } ,

          {
            'fieldName'          :   formValues.password,
            'display'            :   formValues.checkboxpassword,
          } ,

          {
            'fieldName'          :   formValues.confirmPassword,
            'display'            :   formValues.checkboxconfirmPassword,
          } ,

          {
            'fieldName'          :   formValues.newsLetterSubscription,
            'display'            :   formValues.checkboxNewsLetterSubscription,
          } ,

      ],

      createdAt : new Date(),

        },  function(error,result){
                  console.log(error,result);
                  if(error) {
                      return error;
                  } else {
                        FlowRouter.go('/');
                        console.log ('Login first then add company settings');
                        Bert.alert( 'Login first then add company settings!', 'success', 'growl-top-right' );                  
                      return result;
                  }
              }
        );

    }, //End of Insert Method

     'checkedField.updateCheckedData' : function (formValues, matchedRow) {

      CheckedField.update(


        { '_id' : matchedRow._id},
        {
          $set : {
         responsibleUser : Meteor.userId() , 

         companyDomain   : formValues.companyDomain,

         defaultRoleToUser : formValues.defaultRoleToUser,

         signUpConfig    : [
                    
                        {
                          'fieldName'          :   formValues.title, 
                          'display'            :   formValues.checkboxtitle,
                        },

                        {
                          'fieldName'          :   formValues.firstName,
                          'display'            :   formValues.checkboxfirstName,
                        },

                        {
                          'fieldName'          :   formValues.lastName, 
                          'display'            :   formValues.checkboxlastName,
                        },

                        {
                          'fieldName'          :   formValues.emailAddress,
                          'display'            :   formValues.checkboxemailAddress,
                        },

                        {
                          'fieldName'          :   formValues.userName, 
                          'display'            :   formValues.checkboxuserName,
                        },

                        {
                          'fieldName'          :   formValues.gender,
                          'display'            :   formValues.checkboxgender,
                        },

                        {
                          'fieldName'          :   formValues.picture, 
                          'display'            :   formValues.checkboxpicture,
                        },

                        {
                          'fieldName'          :   formValues.homeAddress,
                          'display'            :   formValues.checkboxhomeAddress,
                        } ,

                        {
                          'fieldName'          :   formValues.city, 
                          'display'            :   formValues.checkboxcity,
                        },

                        {
                          'fieldName'          :   formValues.state,
                           'display'           :   formValues.checkboxstate,
                        },

                        {
                          'fieldName'          :   formValues.pin, 
                          'display'            :   formValues.checkboxpin,
                        },

                        {
                          'fieldName'          :   formValues.country, 
                          'display'            :   formValues.checkboxcountry,
                        },

                        {
                          'fieldName'          :   formValues.mobNum,
                          'display'            :   formValues.checkboxmobNum,
                        },

                        {
                          'fieldName'          :   formValues.alterMobNum,
                          'display'            :   formValues.checkboxalterMobNum,
                        } ,

                        {
                          'fieldName'          :   formValues.password,
                          'display'            :   formValues.checkboxpassword,
                        } ,

                        {
                          'fieldName'          :   formValues.confirmPassword,
                          'display'            :   formValues.checkboxconfirmPassword,
                        } ,

                        {
                          'fieldName'          :   formValues.newsLetterSubscription,
                          'display'            :   formValues.checkboxNewsLetterSubscription,
                        } ,
      ], // End of signupconfig array

      createdAt : new Date(),
    }
        },  function(error,result){
                  console.log(error,result);
                  if(error) {
                      return error;
                  } else {
                        console.log ('server update success');
                        Bert.alert( 'Sign Up configuration updated Successfully!', 'success', 'growl-top-right' );                    
                      return result;
                  }
              } // End of Error function
        ); //End of update Method

    }, //End of Method


  addAdminRoleToUser: function(addAdminVar){
      Roles.addUsersToRoles( addAdminVar, 'admin');
  },

}); // End of Meteor Methods