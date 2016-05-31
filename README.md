#Protous v4

* [Getting Started](#getting-started)
* [Documentation](#documentation)
* [Application Syntax](#protous-application-syntax)
* [DataSection Functions](#datasection-functions)
* [User Account System Functions](#user-account-system-functions)

Protous is a module based API for bringing backend functionality to the client side.
Uses for Protous include: prototyping, UI/UX testing, offline web applications, and HTML5 hybrid mobile apps.
One of the advantages of Protous is that it gives you backend functionality without the need for any server or database, and it can be run entirely offline.

FEATURES:
* Create user account systems 
* Store, manipulate, and filter application data - for storing and handling data such as posts, comments, likes, images, etc...
* Super Easy and customizable form handling
* Data looping and markup templating - for displaying data such as posts,comments, etc...

# Getting Started

Note that Protous IS IN FACT MODULE BASED so IF YOU DO NOT UNDERSTAND MODULAR JS THEN LOOK IT UP! (Otherwise this will make no sense to you what so ever)

Lets say you want to test it out by making a simple online store application:
```js
var app = (function(){
	var backend = new PROTOUS_MODULE.app("categories,products,cartProducts","customers");
})();
```
The above code sets up the backend of your application.
Although it may not look like much...That middle line of code returns a super object full of functions for handling all data in your entire application and initializes your application storage.
Don't belive me? Try running ( var backend = new PROTOUS_MODULE.app("categories,products,cartProducts","customers"); ) in your javascript console and navigate the returned object.
Now this short snippet of code creates the whole backend for your app but it is no use if you don't do anything with it...
```js
var app = (function(){
	var backend = new PROTOUS_MODULE.app("categories,products,cartProducts","customers");
	events.respond('submitProduct', function(data){
		backend['products'].add(data);
	});
})();
```
The above code shows the use of the Protous event BUS (Which is technically a pubsub).
It allows you "respond", "trigger", or "neglect" an event. In this case, we are storing the event data as the product object in the backend of the application.
To trigger that event, you would say something like this:
```js
events.trigger('submitProduct', getWholeForm("form"));
```
Passing the data of the form, the submitProduct event is triggered and the assigned functions (from above) are run with the provided data.
You can add as many event responses as wanted. These allow you to define how you want Protous to react.
Now lets say you want to display all the products in a div from your DOM. The following HTML would do the trick:
```html
<loop ds-name="products" logic-all="true">
	<div class="product">
		<h1>(-title-) - <b>(-price-)</b></h1>
		<img src="(-image-)">
		<p>(-description-)</p>
	</div>
</loop>
<script>app.dsLogic();</script>
```
Assuming that your product objects have the following properties (title, price, description, and image) this would loop through all of your products (thus logic-all="true") and display the markup within the loop element (replacing the (-propertyName-)s with the property values) for each product that is stored. But wait, that won't work! You have not yet given app the dsLogic method. To import Protous functions simply return them as properties to your app object:
```js
var app = (function(){
	var backend = new PROTOUS_MODULE.app("categories,products,cartProducts","customers");
	events.respond('userRegistered', function(data){
		backend['customers'].SignUp(data.username,data.properties,data.used||null);
	});
	return {
		dsLogic: backend.dsLogic
	}; 
})();
```
You could include all of the data looping functions if you wanted:
```js
var app = (function(){
	var backend = new PROTOUS_MODULE.app("categories,products,cartProducts","customers");
	events.respond('userRegistered', function(data){
		backend['customers'].SignUp(data.username,data.properties,data.used||null);
	});
	events.respond('submitProduct', function(data){
		backend['product'].add(data);
	});
	return {
		protousLogic: backend.ProtousLogic,
		generateAllLoop: backend.generateAllLoop,
		generateWhereLoop: backend.generateWhereLoop,
		addAllLoop: backend.addWhereLoop,
		addWhereLoop: backend.addWhereLoop,
		dsLogic: backend.dsLogic,
		logicLoop: backend.logicLoop
	}; 
})();
```
But that isn't needed.

I hope this gave you a feel for what Protous 4 can do. This documentation will be improved upon soon, but let me know if you have any questions in the comments below.


# Documentation

PROTOUS_MODULE.app is a constructor for creating the backend of an application.
SYNTAX: app(DATA_SECTIONS, USER_ACCOUNT_SYSTEMS);
DataSections are the types of data that you want to store and handle: posts, comments, products, messages, etc...
User Account Systems are exactly that
Both parameters are strings with each section or system devided by a comma.
Only one of the parameters need to be filled for the constructor to work. In order to bypass DataSections, simply set it to null.
Neither Parameters require more than one element but if there are they MUST BE SEPARATED WITH COMMAS.

##Protous Application Syntax

```js
var myApp = new PROTOUS_MODULE.app("posts,comments,likes","users");

//Application Syntax: APP[DATASECTION][FUNCTION](PARAMETERS);
myApp['posts']['add']({
	title: "First Post",
	body: "This is my first post.",
	by: "Seth",
	date: new Date();
});
//app section  function  parameters
// |     |        |         |
myApp['users']['SignUp']("SethV"/*Username */, {//User Object:
	name: "Seth Vandebrooke",
	password: "*******",
	email: "example@example.com",
	joined: new Date();
}, function(){ //Function to run if the user already exists
	alert("This username: "+username+" has already been used");
});
//Application Syntax^
```
Protous application syntax is quite simple: AppName, DataSectionORUserAccountSystem, FunctionToRun, and Parameters.
As seen used above.
```js
APP[DATASECTION][FUNCTION](PARAMETERS);
```
Lists of functions and capabilities are below:

##DataSection functions:

Function                                    | Returns           | Description 
------------------------------------------- | ----------------- | --------------------------------------------------------------------
add(OBJECT)                                 | undefined         | Stores an object in the datasection
edit(whereThis,equalsThis,setThis,toThis)   | undefined         | Changes a property's value of any object who's given property equals the given value.
remove(whereThis,equalsThis)                | undefined         | Removes any object who's given property equals the given value.
get(whereThis,equalsThis)                   | object            | Returns the object who's given property equals the given value.
listAll()                                   | array of objects  | Returns all stored objects in the dataSection
search(whereThis,equalsThis)                | array of objects  | Returns all objects who's given property equals the given value.
filter(whereThese,equalsThese)              | array of objects  | Does the same as search but takes two arrays as parameters. One array of properties and another of values. All objects who's given properties equal the given values will be returned.
filterE(evaluations)                        | array of objects  | Runs an evaluation against every object in the dataSection. Every object where the evaluation(s) are true are returned. NOTE in the evaluations, if you want to reference the object that the evaluation is being run against simply use "object": Example... object.name!==null


##User Account System functions:

Function                                     | Returns           | Description
-------------------------------------------  | ----------------- | -------------------------------------------------------------------
SignUp(username,userObject,used)             | undefined         | Registers a user account with the given userObject and runs a function (used) if the username has already been used. NOTE: the used parameter is optional.
Login(username,password,wrongPass,noSuchUser)| undefined         | Logs the given user in if the username and password match and the user exists. If the user does not exist then it will run the function given for noSuchuser. Likewise if the password is incorrect then it will run the function given for wrongPass. Both wrongPass and noSuchUser are optional parameters.
LoginWEmail(email,password,wrongPass,noSuchUser)| undefined      | Logs the given user in who's email is equal to the given email if the email and password match. wrongPass and noSuchUser act the same as the Login function.
logout()                                     | undefined         | Logs the currently logged in user out.
deleteUserAccount(username)                  | undefined         | Deletes the user with the given username.
getUsername()                                | string            | Returns the username of the user that's logged in.
getUser(username)                            | object            | Return the userObject for the given username.
updateUser(username,OBJECT)                  | undefined         | Overrides the userObject for the given username with the given object.
updateUserProperty(username,propertyToChange,value) | undefined  | Updates (or edits) a property of the userObject for the given username by changing it to the given value.
