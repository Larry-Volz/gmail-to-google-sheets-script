# Gmail to Google Sheet Script

**NeonContracts.gs is the COMPLETE app script copied back down from google script app and is working**

NeonContracts.gs I wrote based on the original script cloned from below that scrapes e-mails for specific data and then distributes that data into the correct cells in a google spreadsheet.  

It's a good template for that kind of thing if your emails have predictable patterns.  Notice how I distributed the address by using javascript .subscript and .slice and reversed the string, stripped off the zip since it is predictable (compensating for 5 and 5+4 formats), then stripped off the state since it is predictably book-ended with commmas, city for the same reason and then the rest was the street address.  Prevented having to compare with states.  Does not separate between address1 and 2. 

The rest of this Google Script can do any search on your Gmail account, and store the results on a sheet file.

The search will be made on your gmail account, from your Google Script. All data will be changed inside your account, with no external access to it.

## How to use

* Create a new Google Sheet
* Access menu Tools > Script Editor
* Copy the content from [gmailt-to-sheets.gs](gmailt-to-sheets.gs) to editor, replacing the sample code there
* Replace the value on `SEARCH_QUERY` to your real query (Do your search on gmail first, copy and paste the search terms there) 
* Select `saveEmails` on menu (near "run" and "debug" buttons)
* Click on "Run" button
* It will ask for authorization at first run, proceed accepting it (it's your Gmail account authorizing your Google Script account)
* After run, the results will be applied to you sheet

## Changing fields

If you want to save different message attributes, take a look at [gmail-message class](https://developers.google.com/apps-script/reference/gmail/gmail-message) and chage your script file the code below comments with a pencil (✏️)
