# AppServer

<h1>Technical Guide for Web & GIS app development project </h1>
<p style="font-family:calibri;font-size:150%;"> 
          This project consists of 3 components; the AppServer, QuestionsApp and the QuizApp. The  three repositories together allow to create a location-based quiz. The project is also supported by data from postgreSQL/PGAdmin4 - which stores the data created/used in this project. The following is to be used as a technical guide to make this system work.</p>
          
<h2> NodeJS Server: AppServer </h2>
          <p style="font-family:calibri;font-size:150%;"> 
                                                        The AppServer repository consists of server-side code to 
                                                        process, upload/download and store data in both the web and mobile
                                                        applications. A HTTP server is used for both the QuizApp and QuestionsApp as a result of a lack certification in HTTPS servers.
  GET and POST commands are used to download and upload data in both the QuizApp and QuestionsAppH</p>

<h3> Installation Guide </h3>
          <p style="font-family:calibri;font-size:150%;">
          <ul>
          <li>Install the AppServer repository by going on terminal and typing: git clone https://github.com/1imz/AppServer.git </li>
          <li>Go to the AppServer directory using the terminal: "~/code/AppServer"</li>
          <li>To run the server, type: "node httpServer.js &". The addition of the '&' allows the server to run in the background.</li>
          <li>In order to stop running the servers, type: "fg 1" which will display the current running servers and then type :"Ctrl+C". 
          <li> Having run the httpServer.js in the background, navigate to a phonegap app directory e.g. QuestionsApp, inside the ucXXXXX folder and type: "phonegap serve
          </li>
            <li>Once the phonegap server is running successfully go to: http://developer.cege.ucl.ac.uk:3126*/ (insert user specific number in place of the *)</li>
          <li>To stop the phonegap server, press Ctrl+C.</li>
          </ul></p>

<h3> Technical Information </h3>
<p style="font-family:calibri;font-size:150%;">
The following port numbers were used in the project and are assigned to each server:
<ul>
          <li>HTTP: 30264</li>
          <li>HTTPS: 31064</li>
          <li>Phonegap: 31264</li>
                                                  
<h2> Web Application: QuestionApp </h2>
<p style="font-family:calibri;font-size:150%;"> The QuestionsApp part is for use in a web browser, accessible to the creators/administrators of the project. </p>

<h3> Installation Guide </h3>
<p style="font-family:calibri; font-size:150%;">
<ul>
<li>Install the 'QuestionsApp' repository by going on terminal and typing: git clone https://github.com/1imz/QuestionsApp.git </li>
<li> To run the app - the AppServer from the section above needs to be installed and running in the background. </li>
<li>Go to the QuestionsApp directory and run the phonegap server: "~/code/QuestionsApp/ucesibh" and enter "phonegap serve"</li>
<li>In one of the specified ports highlighted in the technical information section, use the following URL to load the app: http://developer.cege.ucl.ac.uk:31264/ </li>
<li>To understand how to use this app, go to: http://developer.cege.ucl.ac.uk:31264/Guide.html </li></ul></p>

<h3> Technical Information </h3>
<p style="font-family:calibri; font-size:150%;"> 
This app was tested using the following browsers:
          <ul>
          <li>Google Chrome v66.0.3359.139 (Official Build) (64-bit)</li>
          <li>Microsoft Edge v41.16299.371.0</li>
          </ul></p>

<h2>Mobile Application: QuizApp </h2>
<p style="font-family:calibri;font-size:150%;">The QuizApp is created specifically for use on an android mobile devices,  and given that a user can connect to the UCL VPN network. This app is the client-side component of the project. </p>

<h3> Installation Guide </h3>
<p style="font-family:calibri; font-size:150%;">
<ul>
<li>Install the 'QuizApp' repository by going on terminal and typing: git clone https://github.com/1imz/QuizApp.git </li>
<li> To run the app - the AppServer from the section above needs to be installed and running in the background. </li>
<li>Go to the QuizApp directory and run the phonegap server: "~/code/QuizApp/ucesibh" and enter "phonegap serve"</li>
<li>In one of the specified ports highlighted in the technical information section, use the following URL to load the app: http://developer.cege.ucl.ac.uk:31264/ </li>
<li>To understand how to use this app, go to: http://developer.cege.ucl.ac.uk:31264/UserGuide.html </li></ul></p>

<h3> Technical Information </h3>
<p style="font-family:calibri; font-size:150%;"> 
This app was tested using the following browsers:
          <ul>
          <li>Google Chrome v66.0.3359.139 (Official Build) (64-bit)</li>
          <li>Microsoft Edge v41.16299.371.0</li>
          </ul>
And the following mobile operating system:
          Android Marshmallow 6.0.1</p>

<li>Code adapted from: https://github.com/claireellul/cegeg077-week5server/blob/master/httpServer.js</li>
<li>Code adapted from: https://github.com/claireellul/cegeg077-week5app/blob/master/ucfscde/www/js/appActivity.js</li>
<li>Code adapted from: https://github.com/claireellul/cegeg077-week6formcode</li>

            
          
            
