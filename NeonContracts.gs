// Starter Google Script searches Gmail account, and stores the results on a Google Sheet file
// Original thanks to: https://github.com/TiagoGouvea/gmail-to-google-sheets-script/

//The rest is to extract specific fields from email and separate out into individual cells

let stateNames = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming', 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];


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

          locator1 = "Advisor Contact: ";
          locator2 = "mailto:"
          endingString = '">';
          let directorEmail = extractDeeperEmailItems(body, locator1,locator2,endingString)
          console.log("Director / Advisor email: ", directorEmail)

          locatorString = "Student Contact:";
          endingString = " / ";
            let studentName = extractEmailItems(body, locatorString, endingString)
            console.log("Student Contact: ", studentName)

          locator1 = "Student Contact:";
          locator2 = "Phone";
          endingString = "/"
          let studentPhone = extractDeeperEmailItems(body, locator1,locator2,endingString)
          console.log("Student Phone: ", studentPhone)

          locator1 = "Student Contact:";
          locator2 = "mailto:";
          endingString = '">';
          let studentEmail = extractDeeperEmailItems(body, locator1,locator2,endingString)
          console.log("Student email: ", studentEmail)

          locatorString = "Emergency Number:";
          endingString = "<br>";
            let emergencyNumber = extractEmailItems(body, locatorString, endingString)
            console.log("emergencyNumber: ", emergencyNumber)

          locatorString = "Mailing Address:";
          endingString = "<br>";
            let mailingAddressFull = extractEmailItems(body, locatorString, endingString);
            // console.log("Mailing Address (full): ", mailingAddressFull);

          let zip = getZip(mailingAddressFull);

          let state = getState(mailingAddressFull, zip);

          let city = getCity(mailingAddressFull, state);

          let address1 = getCity(mailingAddressFull,city);


          console.log("Address1:", address1);
          console.log("City:", city);
          console.log("State:", state);
          console.log("Zip: ", zip);


          locatorString = "Hotel: ";
            endingString = "<br>";
            let hotel = extractEmailItems(body, locatorString, endingString)
            console.log("Hotel:", hotel)

          locatorString = "Sound";
            endingString = "<br>";
            let sound = extractEmailItems(body, locatorString, endingString)
            console.log("sound:", sound)
          

          locatorString = "GROUND INFORMATION </b><br>";
            endingString = "<br>";
            let groundInfo = extractEmailItems(body, locatorString, endingString)
            console.log("groundInfo:", groundInfo)
          
           locatorString = "after commission): ";
            endingString = "<br>";
            let price = extractEmailItems(body, locatorString, endingString)
            console.log("price:", price)


          locatorString = "Price Includes: ";
            endingString = "<br>";
            let priceIncludes = extractEmailItems(body, locatorString, endingString)
            console.log("priceIncludes:", priceIncludes)


          locatorString = "Tax Notes; ";
            endingString = "<br>";
            let taxNotes = extractEmailItems(body, locatorString, endingString)
            console.log("taxNotes:", taxNotes)


          locatorString = "Two Checks: ";
            endingString = "<br>";
            let twoChecks = extractEmailItems(body, locatorString, endingString)
            console.log("twoChecks:", twoChecks)


           
          locatorString = "Contract Questions:";
            endingString = "<br>";
            let contractQuestions = extractEmailItems(body, locatorString, endingString)
            console.log("contractQuestions:", contractQuestions)


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

function getZip(msg) {
      /* returns 5 or 10 digit zip code depending on what is input*/
          let last5 = msg.slice(-5);
          let dashTest = last5.substring(0,1);

          if (dashTest == "-") {
              //  answer="correct";
              zip = msg.slice(-10);
              }  else {
                  zip=last5;
              }
          return zip;
      }


    function getState(msg, zip) {
        /*HAVE TO RUN ZIP FIRST!!! */

        //first remove the zip
        let zipIndex = msg.indexOf(zip);
        let zipStripped = msg.substring(0,zipIndex);

        //then reverse the string
        let rvs = zipStripped.split('').reverse().join('');

        //Find the first comma and retrieve that state portion
        let commaIndex= rvs.indexOf(',');
        let reversedState = rvs.slice(0,commaIndex);

        //reverse it back and verify it's the state
        let state = reversedState.split('').reverse().join('');
        
        //return the state
        return state;
}


function getCity(msg, state){
    /*HAVE TO RUN STATE & ZIP FIRST!!! */
    /* CAN CLEAN UP CODE LATER - DO IT ALL IN ONE FUNCTION & RETURNING AN ARRAY OR OBJ*/

    //first remove the state onwards
    let stateIndex = msg.indexOf(state);
    let stateStripped = msg.substring(0,stateIndex-1); //might need to strip a comma

    //then reverse the string
    let rvs = stateStripped.split('').reverse().join('');

    //Find the first comma and retrieve that city portion
    let commaIndex= rvs.indexOf(',');
    let reversedCity = rvs.slice(0,commaIndex);

    //reverse it back and verify it's the state
    city = reversedCity.split('').reverse().join('');

    //return the state
    return city;
}


function extractDeeperEmailItems(body, locator1,locator2,endingString){

    let offset1 = body.indexOf(locator1);
      // console.log("offset1", offset1);

    let offset2 = body.substring(offset1).indexOf(locator2);
    // console.log("offset2", offset2);

    let offset3 = body.substring(offset1+offset2).indexOf(endingString);
    // console.log("offset3", offset3);

    let preIndex = offset1+offset2+locator2.length
    // console.log("preIndex", preIndex);

    let lastIndex = offset1+offset2+offset3
    // console.log("lastIndex", lastIndex);

    return body.slice(preIndex, lastIndex);


  

}









