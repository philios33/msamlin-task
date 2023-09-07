Please create a sign up and login page in React using typescript. The react app should also have a protected route that only authenticated users can access (this can be a random page with no content).
For the frontend can you also add an external state management package like redux, redux-toolkit, zustand or recoil. It is an overkill for a simple app like that, but we would like to see how you are using the library you choose.
The backed should be in express again using typescript and the communication between React and Express should be via REST API. The express should also have a middleware for protected routes.
The user data should be stored in any SQL database you like. Please feel free to write couple of test cases  for both React and Express. 
(you can have a frontend with  just a bit of CSS (vanilla CSS if possible)  to make it look okish, if you like and that is totally fine by us). 
As a deliverable just send us over all the code for both react and express (excluding node modules ) in a zip format over email (or a link to a GitHub repo) 


What we’re looking for:
 1.	The best possible approach for authentication and reusing the JWT across protected routes.
 2.	Creation of Form to avoid character input re-rendering and demonstrate optimization technique where need be.
 3.	Protect front end routes and also a middleware in the back end to validate the access token and either allow or deny access to the endpoint. Maybe some redirect mechanism to the login if user not authenticated. 
 4.	Unit tests around the middleware, front end routing and either login or signup form are the minimum.
 5.	Ideally use redux hooks or redux toolkit
 6.	Want to see some raw sql scripts, so re-frame from using ORM.
 7.	Importing css as modules
 8.	bonus – disabling features whilst a request has been made (maybe show a spinner) and the use of useEffect return function to cancel an ongoing request.
