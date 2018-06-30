import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { UserProfileStoreS3New } from './UserProfileS3.js';

SearchSource.defineSource('tagFriend', function(searchText, options) {
  var options = {};
  var userId = Meteor.userId();


    // =========================================================
    // ==================Get Image URL from Start ==============
    // =========================================================
    var userPageShowImage = (imgId)=> {
      if(imgId){
          var imgData = UserProfileStoreS3New.findOne({"_id":imgId});
          if(imgData)	{
            var data = imgData.url();
          }else{
            var data = '/users/profile/profile_image_dummy.svg';
          }
          return data;
      }
    }
    // =========================================================
    // ==================Get Image URL from End ================
    // =========================================================

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = { "profile.name":  regExp  ,
                      "profile.status":"Active",
                     "_id":{$ne: userId} , 
                     "roles":{$nin: [ 'admin', 'Vendor', "Staff"]} 
                   };
    // var selector = { "userId" : userId ,
    //                  "name" : regExp
    //                }
    var data =  Meteor.users.find(selector, options).fetch();
                  

    if(data){
      for(i=0;i<data.length;i++){
        if(data[i].profile.userProfilePic){
          data[i].userPhoto = userPageShowImage(data[i].profile.userProfilePic);
        }else{
          data[i].userPhoto = '/users/profile/profile_image_dummy.svg';
        }
      }
      return data;
    }
  }else {
    var data =  Meteor.users.find({"_id":{$ne: userId} , 
                                  "profile.status":"Active",
                                  "roles":{$nin: [ 'admin', 'Vendor', "Staff"]}}, options).fetch();
    if(data){
      for(i=0;i<data.length;i++){
        if(data[i].profile.userProfilePic){
          data[i].userPhoto = userPageShowImage(data[i].profile.userProfilePic);
        }else{
          data[i].userPhoto = '/users/profile/profile_image_dummy.svg';
        }
      }
      return data;
    }
  }
});

function buildRegExp(searchText) {
  var words = searchText.trim().split(/[ \-\:]+/);
  var exps = _.map(words, function(word) {
    return "(?=.*" + word + ")";
  });
  var fullExp = exps.join('') + ".+";
  return new RegExp(fullExp, "i");
}



// main html

// <style>
//       html { position: relative; }
//       #slow-notice { width:600px; position: absolute; top:0; left:50%; margin-left: -260px; background-color: #F89B1C; text-align: center; z-index: 100; padding: 10px; font-family: sans-serif; font-size: 14px; }
//       #slow-notice a, #slow-notice .dismiss { color: #000; text-decoration: underline; cursor:pointer; }
//       #slow-notice .dismiss-container { text-align:right; padding-top:10px; font-size: 10px;}
//   </style>
//   <script async defer="defer">
//       function setCookie(cname,cvalue,exdays) {
//           var d = new Date();
//           d.setTime(d.getTime()+(exdays*24*60*60*1000));
//           var expires = "expires="+d.toGMTString();
//           document.cookie = cname + "=" + cvalue + ";path=/;" + expires;
//       }
//       function getCookie(cname) {
//           var name = cname + "=";
//           var ca = document.cookie.split(';');
//           for(var i=0; i<ca.length; i++) {
//               var c = ca[i].trim();
//               if (c.indexOf(name)==0) return c.substring(name.length,c.length);
//           }
//           return "";
//       } 
//       if (getCookie('dismissed') != '1') {
//           var html_node = document.getElementsByTagName('html')[0];
//           var div = document.createElement('div');
//           div.setAttribute('id', 'slow-notice');
//           var slowLoad = window.setTimeout( function() {
//               var t1 = document.createTextNode("The website is taking a long time to load.");
//               var br = document.createElement('br');
//               var t2 = document.createTextNode("You can wait!!!");
//               var dismiss = document.createElement('span');
//               dismiss.innerHTML = '[x] dismiss';
//               dismiss.setAttribute('class', 'dismiss');
//               dismiss.onclick = function() {
//                   setCookie('dismissed', '1', 1);
//                   html_node.removeChild(div);
//               }
//               var dismiss_container = document.createElement('div');
//               dismiss_container.appendChild(dismiss);
//               dismiss_container.setAttribute('class', 'dismiss-container');
//               div.appendChild(t1);
//               div.appendChild(br);
//               div.appendChild(t2);
//               div.appendChild(dismiss_container);
//               html_node.appendChild(div);
//           }, 10 );
//           window.addEventListener( 'load', function() {
//               try {
//                   window.clearTimeout( slowLoad );
//                   html_node.removeChild(div);
//               } catch (e){
//                   // that's okay.
//               }
//           });
//       }
//   </script>
//   <script async defer="defer" >
//     window.___gcfg = {
//       lang: 'en-US',
//       parsetags: 'onload'
//     };
//   </script>
//   <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>

// <!-- <script>
//   window.fbAsyncInit = function() {
//     FB.init({
//       appId      : '{193603531259655}',
//       cookie     : true,
//       xfbml      : true,
//       version    : '{latest-api-version}'
//     });
      
//     FB.AppEvents.logPageView();   
      
//   };

//   (function(d, s, id){
//      var js, fjs = d.getElementsByTagName(s)[0];
//      if (d.getElementById(id)) {return;}
//      js = d.createElement(s); js.id = id;
//      js.src = "https://connect.facebook.net/en_US/sdk.js";
//      fjs.parentNode.insertBefore(js, fjs);
//    }(document, 'script', 'facebook-jssdk'));
// </script> -->
// <!-- <script>
// =======
// <script>
// >>>>>>> Stashed changes
//   // This is called with the results from from FB.getLoginStatus().
//   function statusChangeCallback(response) {
//     console.log('statusChangeCallback');
//     console.log(response);
//     // The response object is returned with a status field that lets the
//     // app know the current login status of the person.
//     // Full docs on the response object can be found in the documentation
//     // for FB.getLoginStatus().
//     if (response.status === 'connected') {
//       // Logged into your app and Facebook.
//       testAPI();
//     } else {
//       // The person is not logged into your app or we are unable to tell.
// <<<<<<< Updated upstream
//       document.getElementById('fbook').innerHTML = 'Please log ' +
// =======
//       document.getElementById('status').innerHTML = 'Please log ' +
// >>>>>>> Stashed changes
//         'into this app.';
//     }
//   }

//   // This function is called when someone finishes with the Login
//   // Button.  See the onlogin handler attached to it in the sample
//   // code below.
//   function checkLoginState() {
//     FB.getLoginStatus(function(response) {
//       statusChangeCallback(response);
//     });
//   }

//   window.fbAsyncInit = function() {
//     FB.init({
//       appId      : '288260801708620',
//       cookie     : true,  // enable cookies to allow the server to access 
//                           // the session
//       xfbml      : true,  // parse social plugins on this page
//       version    : 'v3.0' // use graph api version 2.8
//     });

//     // Now that we've initialized the JavaScript SDK, we call 
//     // FB.getLoginStatus().  This function gets the state of the
//     // person visiting this page and can return one of three states to
//     // the callback you provide.  They can be:
//     //
//     // 1. Logged into your app ('connected')
//     // 2. Logged into Facebook, but not your app ('not_authorized')
//     // 3. Not logged into Facebook and can't tell if they are logged into
//     //    your app or not.
//     //
//     // These three cases are handled in the callback function.

//     FB.getLoginStatus(function(response) {
//       statusChangeCallback(response);
//     });

//   };

//   // Load the SDK asynchronously
//   (function(d, s, id) {
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) return;
//     js = d.createElement(s); js.id = id;
//     js.src = "https://connect.facebook.net/en_US/sdk.js";
//     fjs.parentNode.insertBefore(js, fjs);
//   }(document, 'script', 'facebook-jssdk'));

//   // Here we run a very simple test of the Graph API after login is
//   // successful.  See statusChangeCallback() for when this call is made.
//   function testAPI() {
//     console.log('Welcome!  Fetching your information.... ');
//     FB.api('/me', function(response) {
//       console.log('Successful login for: ' + response.name);
// <<<<<<< Updated upstream
//       // document.getElementById('fb-root').innerHTML =
//         // 'Thanks /for logging in, ' + response.name + '!';
//     // });
//   }
// </script> -->

