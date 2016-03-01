//PROTOUS - A powerful prototyping system

/* --------------------------- PROTOUS LICENSE --------------------------

  The MIT License (MIT)

  Copyright (c) 2015 Seth Vandebrooke

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
  */

//Main localStorage Functions
function set(name,value) {
	localStorage.setItem(name,value);
}

function get(name) {
	return localStorage.getItem(name);
}

function erase(name) {
	localStorage.removeItem(name);
}

function clearALLdata() {
	localStorage.clear();
	sessionStorage.clear();
}
//SMART TAGS
//if (sessionStorage.getItem("username")!=null) {
	var user = getUser(getUsername());
//}
var Tags = new Array();
Tags[0] = "username|"+getUsername();
Tags[1] = "email|"+user.u_email;
Tags[2] = "biography|"+user.u_biography;
Tags[3] = "name|"+user.u_name;


//User Account Functions

//User Object Constructor
function user(properties) {
	properties = properties.split("|");
	this.u_name = properties[0];
	this.u_email = properties[1];
	this.u_password = properties[2];
	this.u_biography = properties[3];
}

function RegisterUser(username,properties) {//properties being email password etc... [must be seperated by commas]
	if (get(username)==null) {
		if (get("Users")==null) {
			set("Users",username);
		} else {
			set("Users",get("Users")+","+username);
		}
		set(username,properties);
		alert(username+" is registered!");
	} else {
		alert("Sorry! That username is already in use!");
	}
}

function deleteUserAccount(username) {
	if (confirm("Are you sure you want to delete your account?")==true) {
		if (get("Users")==username) {
			set("Users",null);
		} else {
			set("Users",get("Users").replace(","+username,""));
		}
		erase(username);
	}
}

function Login(username,password) {
	var userstring = get(username);
	if (userstring==null) {
		alert("This user account does not exist!");
	} else {
		var me = new user(userstring);
		if (me.u_password == password) {
			sessionStorage.setItem("username",me.u_name);
			alert(username+" is Logged in!");
		}
	}
}

function logout() {
	if (sessionStorage.getItem('username')!=null) {
		if (confirm("Are you sure you want to logout?")==true) {
			sessionStorage.removeItem('username');
		};
	};
}

function getUsername() {
	return sessionStorage.getItem('username');
}

function getUser(username) {
	var theuser = get(username);
	var me = new user(theuser);
	return me;
}

function updateUser(username,properties) {
	if (get(username)!=null) {
		set(username,properties);
	};
}

//POSTS
var POST = new Object();
function APost(properties) {
	properties = properties.split("|");
	this.p_title = properties[0]; //The title of the post
	this.p_body = properties[1]; //The main post text
	this.p_date = properties[2]; //When the post was made
	this.p_author = properties[3]; //Who it was made by
}
POST.addPOST = function(postname,properties) {
	if (get("Posts")==null) {
		set("Posts",postname);
	} else {
		set("Posts",get("Posts")+","+postname);
	}
	set(postname,properties);
}
POST.getPOST = function(postname) {
 	var list = get(postname);
 	return new APost(list);
}
POST.listPOSTS = function() {
	var posts = get("Posts");
	posts = posts.split(",");
	var allposts = new Array();
	for (var i = 0; i < posts.length; i++) {
		var post = POST.getPOST(posts[i]);
		allposts[i] = post;
	};
	return allposts;
}
POST.updatePOST = function(postname,properties) {
	set(postname,properties);
}
POST.deletePOST = function(postname) {
	if (get("Posts")==postname) {
		set("Posts",null);
	} else {
		set("Posts",get("Posts").replace(","+postname,""));
	}
	erase(postname);
}
//COMMENTS
var Comment = new Object();
function AComment(properties) {
	properties = properties.split("|");
	this.c_title = properties[0]; //The title of the Comment
	this.c_body = properties[1]; //The main Comment text
	this.c_date = properties[2]; //When the Comment was made
	this.c_author = properties[3]; //Who it was made by
	this.c_for = properties[4]; //Who it was made by
}
Comment.addComment = function(Commentname,properties) {
	if (get("Comments")==null) {
		set("Comments",Commentname);
	} else {
		set("Comments",get("Comments")+","+Commentname);
	}
	set(Commentname,properties);
}
Comment.getComment = function(Commentname) {
 	var list = get(Commentname);
 	return new AComment(list);
}
Comment.listComments = function(cfor) {
	var Comments = get("Comments");
	Comments = Comments.split(",");
	var allComments = new Array();
	for (var i = 0; i < Comments.length; i++) {
		var Comment = Comment.getComment(Comments[i]);
		if (Comment.c_for == cfor) {
			allComments[allComments.length++] = Comment;
		};
	};
	return allComments;
}
Comment.updateComment = function(Commentname,properties) {
	set(Commentname,properties);
}
Comment.deleteComment = function(Commentname) {
	if (get("Comments")==Commentname) {
		set("Comments",null);
	} else {
		set("Comments",get("Comments").replace(","+Commentname,""));
	}
	erase(Commentname);
}
//MESSAGES
var Message = new Object();
function AMessage(properties) {
	properties = properties.split("|");
	this.c_body = properties[0]; //The main Message text
	this.c_date = properties[1]; //When the Message was made
	this.c_from = properties[2]; //Who it was made by
	this.c_to = properties[3]; //Who it was made for
}
Message.addMessage = function(Messagename,properties) {
	if (get("Messages")==null) {
		set("Messages",Messagename);
	} else {
		set("Messages",get("Messages")+","+Messagename);
	}
	set(Messagename,properties);
}
Message.getMessage = function(Messagename) {
 	var list = get(Messagename);
 	return new AMessage(list);
}
Message.listMessages = function(to,from) {
	var Messages = get("Messages");
	Messages = Messages.split(",");
	var allMessages = new Array();
	for (var i = 0; i < Messages.length; i++) {
		var Message = Message.getMessage(Messages[i]);
		if (Message.m_to == to&&Message.m_from ==from) {
			allMessages[allMessages.length++] = Message;
		};
	};
	return allMessages;
}
Message.updateMessage = function(Messagename,properties) {
	set(Messagename,properties);
}
Message.deleteMessage = function(Messagename) {
	if (get("Messages")==Messagename) {
		set("Messages",null);
	} else {
		set("Messages",get("Messages").replace(","+Messagename,""));
	}
	erase(Messagename);
}

function runSmartTags() {
	for (var i = 0; i < Tags.length; i++) {
		var tag = Tags[i].split("|");
		var x = document.getElementsByTagName(tag[0]);
		for (var y = 0; y < x.length; y++) {
			x[y].innerHTML = tag[1];
		}
	}
}