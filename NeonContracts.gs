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

            let preString = "Items: ";
            let searchString = "<br>";
            let items = getCellContents(body, preString, searchString)
            // console.log("Items:", items)

             preString = "Purchaser: ";
             searchString = "<br>";
            let purchaser = getCellContents(body, preString, searchString)
            // console.log("purchaser:", purchaser)

             preString = "Performance Location: ";
             searchString = "<br>";
            let performanceLocation = getCellContents(body, preString, searchString)
            // console.log("Performance Location:", performanceLocation)

             preString = "Performance Date: ";
             searchString = "<br>";
            let performanceDate = getCellContents(body, preString, searchString)
            // console.log("Performance Date:", performanceDate)

             preString = "Performance Time: ";
             searchString = "<br>";
            let performanceTime = getCellContents(body, preString, searchString)
            // console.log("Performance Time: ", performanceTime)

             preString = "Special Instructions:";
             searchString = "<br>";
            let specialInstructions = getCellContents(body, preString, searchString)
            // console.log("Special Instructions:", specialInstructions)

             preString = "Advisor Contact: ";
             searchString = " / ";
            let directorPhone = getCellContents(body, preString, searchString)
            console.log("Director / Advisor Contact: ", directorPhone)






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



function getCellContents(body, preString, searchString){

  //find index of locater string (like Purchaser: )
	let preIndex = body.indexOf(preString);

  //get index of 1st <br> after the preIndex - substring w/1 variable goes to end
	let searchIndex = body.substring(preIndex).indexOf(searchString);
  //add it to the preIndex to get actual index
  searchIndex += preIndex
  
  //get where to start substring (end of preString)
  preIndex = preIndex + preString.length;
	return body.slice(preIndex, searchIndex);
}







