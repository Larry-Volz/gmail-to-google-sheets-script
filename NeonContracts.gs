// Starter Google Script searches Gmail account, and stores the results on a Google Sheet file
// Original thanks to: https://github.com/TiagoGouvea/gmail-to-google-sheets-script/

//The rest is to extract specific fields from email and separate out into individual cells

// Add here your search query. Do your search on gmail first, copy and paste the search terms here
// Samples: "label: hiring-process", "to: sales@mycompany.com"
const SEARCH_QUERY = 'label: NeonContracts';
// If you want each email address just once on sheet, set to true
const AVOID_REPEATED_ADDRESS = false;


// Main function, the one that you must select before run
function saveEmails() {
  //pick spreadsheet
  let sheet = SpreadsheetApp.openById('1rhuSiuy1BcJUoQnzrugE1MRoIiK74W3uAWu5ICrbodQ').getSheetByName('Sheet1');


    console.log("Clearing sheet...");
    sheet.clear();  

  
    console.log(`Searching for: "${SEARCH_QUERY}"`);
    let start = 0;
    let max = 500;  //CHANGE IF MORE EMAILS TO SEARCH
    
    let threads = GmailApp.search(SEARCH_QUERY, start, max);

    if (threads!=null){
      console.log("Threads found 🎉");
      console.log("Paginating to collect email addresses...");
    } else {
      console.warn("No emails found within search criteria 😢");
      return;
    }

    // Add Sheet header collumns ✏️
    appendData(1, [["Last Contacted","Contact next","Contact notes","Date contract sent","Items"]]);
    

    let totalEmails = 0;
    let emails = [];
    let addresses = [];


    while (threads.length>0){
      for (let i in threads) {
          let thread=threads[i];
          let data = thread.getLastMessageDate();
          let msgs = threads[i].getMessages();
          for (let j in msgs) {
            let msg = msgs[j];

            // Values to get and store ✏️
            let date = msg.getDate();          
            let from = msg.getFrom();
            let to = msg.getTo();
            // let subject = msg.getSubject();
            let body = msg.getBody();

            let locatorString = "Items: ";
            let endingString = "<br>";
            let items = extractEmailItems(body, locatorString, endingString)
            // console.log("Items:", items)

             locatorString = "Purchaser: ";
             endingString = "<br>";
            let purchaser = extractEmailItems(body, locatorString, endingString)
            // console.log("purchaser:", purchaser)

             locatorString = "Performance Location: ";
             endingString = "<br>";
            let performanceLocation = extractEmailItems(body, locatorString, endingString)
            // console.log("Performance Location:", performanceLocation)

             locatorString = "Performance Date: ";
             endingString = "<br>";
            let performanceDate = extractEmailItems(body, locatorString, endingString)
            // console.log("Performance Date:", performanceDate)

             locatorString = "Performance Time: ";
             endingString = "<br>";
            let performanceTime = extractEmailItems(body, locatorString, endingString)
            // console.log("Performance Time: ", performanceTime)

             locatorString = "Special Instructions:";
             endingString = "<br>";
            let specialInstructions = extractEmailItems(body, locatorString, endingString)
            // console.log("Special Instructions:", specialInstructions)

             locatorString = "Advisor Contact: ";
             endingString = " / ";
            let directorName = extractEmailItems(body, locatorString, endingString)
            console.log("Director / Advisor Name: ", directorName)


          let locator1 = "Advisor Contact: ";
          let locator2 = "Phone";
          endingString = "/"
          let directorPhone = extractDeeperEmailItems(body, locator1,locator2,endingString)
          console.log("Director / Advisor Phone: ", directorPhone)





            let dataLine = [date,body];
            //console.log(dataLine)

            // Add values to array
            if (!AVOID_REPEATED_ADDRESS || (AVOID_REPEATED_ADDRESS && !addresses.includes(to))){
              emails.push(dataLine);
              addresses.push(to);
             // bodies.push(body);
            }
          }
      }

      totalEmails = totalEmails + emails.length;

      // Add emails to sheet
      appendData(2, emails);
      
      if (threads.length == max){
          console.log("Reading next page...");
      } else {
          console.log("Last page read 🏁");
      }
      start = start + max; 
      threads = GmailApp.search(SEARCH_QUERY, start, max);
    }



    console.info(totalEmails+" emails added to sheet 🎉");
}


//------------------------------FUNCTIONS--------------------------------------------------------

// Add contents to sheet
function appendData(line, array2d) {
  let sheet = SpreadsheetApp.openById('1rhuSiuy1BcJUoQnzrugE1MRoIiK74W3uAWu5ICrbodQ').getSheetByName('Sheet1');

  sheet.getRange(line, 1, array2d.length, array2d[0].length).setValues(array2d);
}



function extractEmailItems(body, locatorString, endingString){

  //find index of locater string (like Purchaser: )
	let preIndex = body.indexOf(locatorString);

  //get index of 1st <br> after the preIndex - substring w/1 variable goes to end
	let searchIndex = body.substring(preIndex).indexOf(endingString);
  //add it to the preIndex to get actual index
  searchIndex += preIndex
  
  //get where to start substring (end of locatorString)
  preIndex = preIndex + locatorString.length;
	return body.slice(preIndex, searchIndex);
}

function extractDeeperEmailItems(body, locator1,locator2,endingString){

let offset1 = body.indexOf(locator1);
  console.log("offset1", offset1);

let offset2 = body.substring(offset1).indexOf(locator2);
console.log("offset2", offset2);

let offset3 = body.substring(offset1+offset2).indexOf(endingString);
console.log("offset3", offset3);

let preIndex = offset1+offset2+locator2.length
console.log("preIndex", preIndex);

let lastIndex = offset1+offset2+offset3
console.log("lastIndex", lastIndex);

return body.slice(preIndex, lastIndex);

}

// //find index of locater string (like Purchaser: )
// 	let preIndex = body.indexOf(locator1);
//   console.log("preIndex", preIndex);
//   console.log("preIndex string: ", body.substring(preIndex, preIndex+5));

//   //get index of 1st locator string after the preIndex
// 	let midIndex = body.substring(preIndex).indexOf(locator2)
//    console.log("midIndex", midIndex);
//    console.log("midIndex string", body.substring(midIndex,midIndex+3));

//   let lastIndex = body.substring(preIndex+midIndex).indexOf(endingString)
//    console.log("lastIndex", lastIndex);
//    console.log("lastIndex string", body.substring(lastIndex,lastIndex+7));
  
//   //get where to start substring (end of locatorString)
//   preIndex += midIndex + locator2.length;
//    console.log("final preIndex", preIndex);









