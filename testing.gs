// Function to test whether your Apps Script is working or not
function testSendingEmail(){
	const recipient = "example@abc.com"; // Change this to your secondary email, or just email yourself
	const subject = "Testing Subject";
	const body = "Testing Body";
	var myFile = DriveApp.getFileById("DRIVE-FILE-ID").getBlob(); // Change this to the Drive ID of the file you watnt to attach in the email

	GmailApp.sendEmail(recipient, subject, body, {
		htmlBody: body,
		attachments: [{
						fileName: "Attachment" + ".pdf",
						content: myFile.getBytes(),
						mimeType: "application/pdf"
				}]
	});
}


// Function that logs all the elements of the slide (Use this to identify which element you'd need to be editting in your template)
function getElementId(){
	slides.forEach(slide => {
		const elements = slide.getPageElements();
		elements.forEach(element => {
				const type =
				element.getPageElementType().toJSON().toLowerCase();
				if (type === 'shape') {
					console.log(element.getObjectId(),
					element.asShape().getText().asString());
				}
		});
	});
 }
