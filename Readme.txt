Gmail WebClient

Steps to run the client:

1. Database
	No additional steps are needed to setup db. The DB file is attached, and located in the APP_DATA folder.
	Asp.Net MVC should recognize DB by himself properly. If not - please contact me
	
2. Source code
	Source code is fully listed. Maybe needed to restore NuGet packages.
	
3. Assumptions and missed requirements
	Only one difference between requirements and implementation is used Entity Framework (included by default in the Asp.Net MVC 4 project) instead of Linq to Sql
	
4. Run application
	Project could be ran directly from the Visual Studio (VS 2012 was used) by clicking 'Run' button or by attaching it to IIS (follow http://blogs.msdn.com/b/rickandy/archive/2011/04/22/test-you-asp-net-mvc-or-webforms-application-on-iis-7-in-30-seconds.aspx)
	
5. Notes
	All server configs are mathced in web.config
	This application is almost complete gmail client. 
	Features supported:
		1) Register/Login
		2) Get messages
		3) Send new message
		4) Reply/Reply to all/Forward message
		5) Delete message
		6) Downloading attachments
		7) Input field validations
		
	Not supported features:
		1) Attach files to the message
	
	To check new emails just click on the mailbox name
	For sending email to multiple addresses just enter them separeted by semi-colon (';') character
	
6. Feedback
	This test assigment is really interesting. It was really nice to do it
	