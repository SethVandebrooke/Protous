# Protous
Protous.js is a clever javascript library for adding real time backend functionality to your prototypes without needing a server, database or knowledge of a backend programming language. 

Protous uses javascript's localStorage capabilities to store keys and values in the browser, so users will be remembered even when the computer is shutdown. Protous is perfect for giving a full user experience to your web/hybrid application prototype. It's quick, easy, and powerful.

#Including Protous Reference File
How to include the Protous reference file as meta data in the head tag of the HTML document:
<b>&lt;script type="text/javascript" src="http://brookestudios.com/library/protous/protous-v1.1.3.js"&gt; &lt;script&gt;</b>

# Protous includes a Smart Tag system.
Smart Tags are html tags that represent an output of data. By defining what values are to be given for specific tag names you can create your own tag system. For example:

var Tags = new Array();
Tags[0] = "hw|hello world";

The above code states that whereever you place: &lt;hw&gt;&lt;/hw&gt; it will automatically change it to hello world.
Now lets say you want to show the username of whoever is logged in using protous...

var Tags = new Array();
Tags[0] = "username|"+getUsername();

The above code defines that where there is &lt;username&gt;&lt;/username&gt; place the username of whoever is logged in.

# Protous includes the following functions:

<b>RegisterUser(username,properties)</b> // Registers a username with the associated user properties

Use: RegisterUser("John","John Green|Johng@gmail.com|password123|I am John");
                          name       email           password    biography

<b>deleteUserAccount(username)</b> //Deletes a user based on the given username

Use: deleteUserAccount("John");

<b>Login(username,password)</b> //Validates the user credentials and stores the username in a session variable

Use: Login("John","password");

<b>logout()</b> //Delets session variable and logs the user out

Use: logout();

<b>getUsername()</b> //Returns the name of the user that is logged in

Use: var = username = getUsername();

<b>getUser(username)</b> //Returns an object of the given user

Use: var user = getUser(getUsername());

<b>updateUser(username,properties)</b> //Updates a users properties

Use: updateUser("John","John Green|example@gmail.com|password13|I am the John");

<b>getProfilePicture(id)</b> //Sets the src value of an image tag to the profile picture data of whoever is logged in

Use: getProfilePicture("profilepic");

<b>uploadProfilePic(id,event)</b> //Uploads and saves the profile picture for the logged in user and sets the src of the given element to the image data

Use: &lt;input type="file" accept="image/*" onchange="uploadProfilePic('profile',event)"&gt;


NOTE!
The following code is the user object constructor. It defines what properties your users will have. Add or remove properties but they must all be equal to a specific (not used otherwise) index of the properties array [which increment downwards].

function user(properties) {

	properties = properties.split("|");

	this.u_name = properties[0];

	this.u_email = properties[1];

	this.u_password = properties[2];

	this.u_biography = properties[3];

}

Post object functions

<b>addPOST(postname,properties)</b> //Adds a post

Use: POST.addPOST("post1","mypost|this is my post text|12/5/6|John");

<b>getPOST(postname)</b> //Returns a post object

Use: var mypost = POST.getPOST("post1");

<b>listPOSTS()</b> //Returns an array of all post objects

Use: var myposts = POST.listPOSTS();

<b>updatePOST(postname,properties)</b> //Updates a post

Use: POST.updatePOST("post1","new title|this is my new post text|12/5/6|John");

<b>deletePOST(postname)</b> //Deletes a post

Use: POST.deletePOST("post1");

The same syntax for the post object functions applies to the comment, message, and friendship object functions.
