

// Format for sending mail //
var msgvariable = {
					'[username]' 	: 'John Doe',
   				   	'[orderNo]' 	: '12345',
                   	'[orderDate]'	: '06-08-2017'
               	  };


var inputObj = {
	from         : 'dXphvadmmNwPFn9bL',
    to           : 'dXphvadmmNwPFn9bL',
    templateName : 'User Registered',
    variables    : msgvariable,
}

sendMailNotification(inputObj); 

// Format for sending notification //
var msgvariable = {
					'[username]' 	: 'John Doe',
   				   	'[orderNo]' 	: '12345',
                   	'[orderDate]'	: '06-08-2017'
               	  };


var inputObj = {
    to           : 'dXphvadmmNwPFn9bL',
    templateName : 'User Registered',
    variables    : msgvariable,
}

sendInAppNotification(inputObj); 

// Format for sending SMS //
var msgvariable = {
					'[username]' 	: 'John Doe',
   				   	'[orderNo]' 	: '12345',
                   	'[orderDate]'	: '06-08-2017'
               	  };


var inputObj = {
    to           : 'dXphvadmmNwPFn9bL',
    templateName : 'User Registered',
    number       : 'XXXXXXXXXXX',
    variables    : msgvariable,
}

sendSMS(inputObj); 