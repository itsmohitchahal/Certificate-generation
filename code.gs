function myFunction() {
	const PRESENTATION_ID = "GOOGLE-SLIDES-FILE-ID"; // Has design/template of file to be customized and mass produced
	const SPREADSHEET_ID = "GOOGLE-SHEETS-FILE-ID"; // Has list of custom values like name, email
	const FOLDER_ID = "GOOGLE-DRIVE-FOLDER-ID"; // Destination folder where you'd like to save everyone's custom edit of the template in Google Drive


//  GET TARGET ELEMENT
	const editableElmntId = "Elm-Id"; // ID of Element in Page that you'd need to customize (We need only one element to change/update, but you can have multiple)
	// To find Element IDs, check file testing.gs (in root directory of this repository)
	const folder = DriveApp.getFolderById(FOLDER_ID); // Getting destination folder


//  RUN LIST OF NAMES
	const names = getNamesList(SPREADSHEET_ID); // Makes an array of all the custom values (You may use a multi-dimensional array, if you have more than 1 custom values) 


//  LOOPING THROUGH THE TEMPLATE
	for (let i = 0; i < names.length; i++) { 
		var name = names[i]; // Gets the current custom value to be added to the template
		var fileName = name.split(" ").join(""); // Gets a string value we can use for file name (same in next line)
		fileName = fileName + " Custom Certificate"; // Further customizing the naming of to-be-saved files so they're easy to navigate around in your Drive folder

		const currentPresentation = SlidesApp.openById(PRESENTATION_ID);
		const editableElement = currentPresentation.getSlides()[0].getPageElementById(editableElmntId); // Getting the element we want to edit/customize in

		editableElement.asShape().getText().setText(name); // This is where we customise our editable element
		currentPresentation.saveAndClose(); // We need to do this so that setText() actually saves it, otherwise it'd wait for the end of the script to execute itself

		var myFileBlob = DriveApp.getFileById(currentPresentation.getId()).getBlob();
		var newFile = folder.createFile(myFileBlob); // Uses "createFile()" to make a PDF of the selected blob
		newFile.setName(fileName); // Renames the file to our custom filename

		sendEmail(SPREADSHEET_ID, i, newFile.getId()); // Calls our custom function to email the just-made file to its appropriate recipient
		Logger.log('Successfuly emailed the file to ' + names[i]); // Logging to see if program worked well so far
	}
	Logger.log("THE SCRIPT HAS REACHED ITS END SUCCESSFULY"); // If this gets logged, we have reached the end of our script
}


// Custom Function to get data of names (customizable data) to be looped through in the template
function getNamesList(SPREADSHEET_ID) {
	const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID); // Opening our Google Slides Spreadsheet to fetch data from
	const data = spreadsheet.getDataRange().getValues(); // Fetching all data in the spreadsheet
	var list = [];
	for (var i = 0; i < data.length; i++) {
		list.push(data[i][0]); // Getting relevant data (that needs to be looped through)
	}
	return list;
}


// Custom Function to send individual emails, with attachments of their file
function sendEmail(SPREADSHEET_ID, index, myFileId){
	const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID); 
	const data = spreadsheet.getDataRange().getValues();
	const email = data[index][1]; // Getting email address of the person (using index)
	const myFile = DriveApp.getFileById(myFileId).getBlob(); // File to be attached
	const subject = "Your email subject"; // Your Email Subject
	const body = "<h1>Your Email Body</h1><br /><h3>Do you like my html email?</h3><hr />" // Your Email Body

//  EMAILING CURRENT MADE FILE TO THE RECICPIENT
	GmailApp.sendEmail(email, subject, body, {
			htmlBody: body,
			attachments: [{
						fileName: String(data[index][0]) + ".pdf", // Name you want to be displayed when the file is attached
						content: myFile.getBytes(),
						mimeType: "application/pdf"
				}]
		});

}



