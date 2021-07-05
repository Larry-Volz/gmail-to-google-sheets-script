/* My first experiment cut and pasted from the app*/

function NeonGigs() {
  var sheet = SpreadsheetApp.openById('1SRpB6onDJQUBW8wwl7735VpiW8IbZYKw_iNtESmiQOU').getSheetByName('Sheet1');
  var labels = GmailApp.getUserLabelByName("NeonGigs");
  var gigEmails = labels.getThreads();
  

  
  const regex1 = '\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b';
  
  Logger.log(gigEmails.length);
  
  //OUTER LOOP FOR EACH THREAD
  for (var threadNum = 0; threadNum < Math.floor(gigEmails.length/100); threadNum++){
    
    var msg = gigEmails[threadNum].getMessages(); // an array - may have more than 1 message (threads) within each
    
    //INNER LOOP FOR EACH MESSAGE WITHIN EACH THREAD
    for(var msgNum=0; msgNum<msg.length;msgNum++){
    //for(var i=0; i<2;i++){
      var message = msg[msgNum].getBody();
      
      var subject = msg[msgNum].getSubject();
      var dateSent = msg[msgNum].getDate();
      var fromSender = msg[msgNum].getFrom();
      //msg[msgNum].star();  // to flag it
      
      
      var extractedEmail = extractEmails(message); //use regex to get email
      var extractedPhone = extractedPhones(message);
      
      Logger.log('Message#: ' + msgNum + ' Email(s):' + extractedEmail + ' Phone: ' + extractedPhone);
            
      if((extractedEmail)||(extractedPhone)){
        
        //we only want the first one and if we get it break out of inner loop & go on to the next message
        break;
        
      } //end of if
      
    } //message-inner loop
  } //thread - inner loop
  
} // end of function



function extractEmails (text)
{
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);s
  
//  var segment2 = "Advisor";
//  var segment3 = '([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi';
//  var textMatcher =  segment2;
//  return text.match(textMatcher);
}


function extractedPhones(text){
  
  return text.match('/((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/');
}