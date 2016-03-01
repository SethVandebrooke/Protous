# Protous
Protous.js is a clever javascript library for adding real time backend functionality to your prototypes without needing a server, database or knowledge of a backend programming language.

Including functions:

RegisterUser(username,properties) // Registers a username with the associated user properties
Use: RegisterUser("John","John Green,Johng@gmail.com,password123,I am John");
                          name       email           password    biography

deleteUserAccount(username) //Deletes a user based on the given username
Use: deleteUserAccount("John");

Login(username,password) //Validates the user credentials and stores the username in a session variable
Use: Login("John","password");

logout() //Delets session variable and logs the user out
Use: logout();

getUsername() //Returns the name of the user that is logged in
Use: var = username = getUsername();

getUser(username) //Returns an object of the given user
Use: var user = getUser(getUsername());

updateUser(username,properties) //Updates a users properties
Use: updateUser("John","")

NOTE!
The following code is the user object constructor. It defines what properties your users will have. Add or remove properties but they must all be equal to a specific (not used otherwise) index of the properties array [which increment downwards].
function user(properties) {
	properties = properties.split(",");
	this.u_name = properties[0];
	this.u_email = properties[1];
	this.u_password = properties[2];
	this.u_biography = properties[3];
}

Post object functions

addPOST(postname,properties) //Adds a post
Use: POST.addPOST("post1","mypost,this is my post text,12/5/6,John");

getPOST(postname) //Returns a post object
Use: var mypost = POST.getPOST("post1");

listPOSTS() //Returns an array of all post objects
Use: var myposts = POST.listPOSTS();

updatePOST(postname,properties) //Updates a post
Use: POST.updatePOST("post1","new title,this is my new post text,12/5/6,John");

deletePOST(postname) //Deletes a post
