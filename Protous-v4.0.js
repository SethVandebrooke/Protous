/*
The MIT License (MIT)

  Copyright (c) 2016 Seth Vandebrooke

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

  ----------------------------------------------------------------------------

Protous 4.0 (The Modulue Based, Object Oriented, Client Side Backend API) : Developed by Seth Vandebrooke

                     Build Data Driven Prototypes
                    			Easily

FYI:
 - Protous logs errors in the console.
 - Protous stores users as JSON encoded objects using the localStorage API.
 - Protous remembers logged in users using the sessionStorage API.
 - Protous dataSections are for storing elements as JavaScript objects in a database-like system.
 - Protous dataSections can be used entirely seperate from the UserAccountSystem.
 - Protous dataSections have a debug mode which can be switched on or off by setting the dataSection's debug property to true or false.
 - The Protous application constructor (protousApp) is used for constructing multiple dataSections and or multiple (or one) Protous userAccountSystem.
 - Protous comes with a dsLogic, dataLooper, and ProtousLogic function for looping through sets of data and displaying markup in accordence to the data.
*/
	//form functions
	function getFormValues(ids) { //returns an object of form elements with the IDs as property names.
		ids = ids.split(",");
		var response = {};
		for (var i = 0; i < ids.length; i++) {
			response[ids[i]] = document.getElementById(ids[i]).value;
		}
		return response;
	}
	function getWholeForm(form) { //returns an object of form elements with names (or IDs) as property names and the values of the elements as the values of the properties.
		var response = {};
		var elements = document.getElementById(form).elements;
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].tagName=="INPUT"||elements[i].tagName=="SELECT"||elements[i].tagName=="TEXTAREA") {
				var backup = elements[i].tagName + Math.floor(Math.random()*500);
				var title = elements[i].name != "" ? elements[i].name : ( elements[i].id != "" ? elements[i].id : backup );
				response[title] = elements[i].value;
			}
		}
		return response;
	}
	//Example: validateForm(getWholeForm("myform"),["password==passwordConfirm","email.includes('@')"]);
	function validateForm(Form,expressions) { // the expressions parameter is an array of expressions as strings. In order to grab values from the form use the folowwing syntax: Form.PROPERTY
		var valid;
		if (Form!==null&&Form!==undefined) {
			for (var i = 0; i < expressions.length; i++) {
				if (eval(expressions[i])) {
					valid = true;
					continue;
				} else {
					valid = false;
					break;
				}
			}
			return valid;
		}
	}
var PROTOUS_MODULE = (function() {
	//localStorage functions
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
	//The UserAccountSystem constructor creates an object for handling users, user properties, and profile pictures.
	function UserAccountSystem(name) {
		this.name = name;
		this.data = function() {
			var output = get(this.name)+"\n";
			var user = JSON.parse(get(this.name));
			for (var i = 0; i < user.length; i++) {
				output += user[i]+": "+get(user[i])+"\n";
			}
			return output;
		};
		//SignUp a user by providing a username (as a string) and the user's properties (as an object).
		//Optionally...If you want to perform a specific operation when the username was already used: You can fill in the "used" parameter with a function.
		this.SignUp = function(username,properties,used) {
			if (get(username)===null) {
				if (get(this.name)===null) {
					var setup = [];
					setup.push(username);
					set(this.name,JSON.stringify(setup));
					if (properties!==null) {
						if (typeof properties == "object") {
							if (properties.password===null) {
								console.log("Protous Error: Password property is required");
							} else if (typeof properties.password == "string") {
								set(username,JSON.stringify(properties));
							} else {
								console.log("Protous Error: Password property must be a string");
							}
						} else {
							console.log("Protous Error: The properties parameter must be an object");
						}
					} else {
						console.log("Protous Error: The properties parameter is required");
					}
				} else {
					var users = JSON.parse(get(this.name));
					users.push(username);
					set(JSON.stringify(users));
					if (properties!==null) {
						if (typeof properties == "object") {
							if (properties.password===null) {
								console.log("Protous Error: Password property is required");
							} else if (typeof properties.password == "string") {
								set(username,JSON.stringify(properties));
							} else {
								console.log("Protous Error: Password property must be a string");
							}
						} else {
							console.log("Protous Error: The properties parameter must be an object");
						}
					} else {
						console.log("Protous Error: The properties parameter is required");
					}
				}
			} else if (typeof used == "object"){
				used();
			} else {
				console.log("Protous Error: That username was already used!");
			}
		};
		//To Login a user: pass the username, password, and functions defining what to do when the user does not exist or the password doesn't match
		this.Login = function(username,password,wrongPass,noSuchUser) {
			if (get(username)!==null) {
				var user = JSON.parse(get(username));
				if (user.password==password) {
					sessionStorage.setItem(this.name+"-Logged-in",username);
				} else {
					wrongPass();
				}
			} else {
				noSuchUser();
			}
		};
		//To Login a user using email... I think you can guess the difference from the last function
		this.LoginWEmail = function(email,password,wrongPass,noEmail) {
			var users = JSON.parse(get(this.name));
			for (var i = 0; i < users.length; i++) {
				var user = JSON.parse(get(users[i]));
				if (user.email===null) {
					console.log("Protous Error: The email property does not exist");
				} else {
					if (user.password===null) {
						console.log("Protous Error: The password property does not exist");
					} else {
						if (user.email==email) {
							if (user.password==password) {
								sessionStorage.setItem(this.name+"-Logged-in",users[i]);
							}
						} else if (wrongPass!==null){
							wrongPass();
						}
					}
				}
			}
		};
		//There is nothing to explain here
		this.Logout = function(){
			if (sessionStorage.getItem(this.name+"-Logged-in")!==null) {
				sessionStorage.removeItem(this.name+"-Logged-in");
			}
		};
		//To delete a user: pass the username of the user to delete
		this.deleteUserAccount = function(username) {
			var users = JSON.parse(get(this.name));
			for (var i = 0; i < users.length; i++) {
				if (users[i]==username) {
					delete users[i];
					erase(username);
				}
			}
		};
		//This function returns the username of the user that is logged in
		this.getUsername = function() {
			if (sessionStorage.getItem(this.name+"-Logged-in")===null) {
				console.log("Protous Error: No one is logged in");
			} else {
				return sessionStorage.getItem(this.name+"-Logged-in");
			}
		};
		//This function returns the user (specified with the parameter) as an object
		this.getUser = function(username) {
			var user = JSON.parse(get(username));
			return user;
		};
		//To update a user as a whole object: pass the username and the properties (as an object)
		this.updateUser = function(username,properties) {
			if (get(username)!==null) {
				if (properties!==null) {
					set(username,JSON.stringify(properties));
				} else {
					console.log("Protous Error: properties parameter is required");
				}
			} else {
				console.log("Protous Error: User ["+username+"] does not exist");
			}
		};//In order to update a specific property of a user: pass the username, the property you want to change, and what you want to change the property to
		this.updateUserProperty = function(username,propertyFrom,propertyTo) {
			if (get(username)!==null) {
				var user = JSON.parse(get(username));
				if (propertyFrom!==null) {
					if (user[propertyFrom]!==null) {
						if (propertyTo!==null) {
							user[propertyFrom] = propertyTo;
							set(username,JSON.stringify(user));
						} else {
							console.log("Protous Error: The propertyTo parameter is required");
						}
					} else {
						console.log("Protous Error: The user property ["+propertyFrom+"] does not exist.");
					}
				} else {
					console.log("Protous Error: The propertyFrom parameter is required");
				}
			} else {
				console.log("Protous Error: User ["+username+"] does not exist");
			}
		};
	}

	//To show a profile picture: give the id of the img tag that you want to set to the profile picture, and provide the corresponding username
	getProfilePicture = function(id,username,UA) {
		var url = get(UA+"-profilepic-"+username);
		document.getElementById(id).src = url;
	};
	//HTML: <input type="file" accept="image/*" onchange="uploadProfilePic('ImageTagId',event,"username","userAccountSystemName");">
	//This function uploads an image and saves it as the profile picture for the user that is logged in, and then it sets an image tag to the profile picture (in order to update the current profile picture)
	uploadProfilePic = function(id,event,username,UA) {
	    var input = event.target;
	    var reader = new FileReader();
	    reader.onload = function(){
	        var dataURL = reader.result;
	        set(UA+"-profilepic-"+username,dataURL);
	        var output = document.getElementById(id);
	        output.src = dataURL;
	    };
	    reader.readAsDataURL(input.files[0]);
	};

	//DataSection object constructor
	//This constructor allows you to store and manage objects as elements such as posts, comments, or likes
	/*
	The DataSections constructor was invented by Seth Vandebrooke on the 15th of April 2016 at 12:04pm 
	The dataSection constructor creates an object for storing and handling data.
	Think of it as a table in a database. You can add, edit, remove, view, list,
	and search threw objects (or rows) in your dataSection (or table). The 
	objects are encoded as JSON strings and stored in your dataSection property
	using the localStorage API. The strings are then decoded back into JavaScript
	objects when retrieved from the dataSection.
	DataSectioning can be used to create web applications that store posts, comments
	 and even users on the client side.
	Why is it called the dataSections constructor? Because it literally creates
	a section in the localStorage of your browser just for storing your data.

	To use the constructor...

	Simply create an object: var postSystem = new dataSection("posts");

	And apply any of the methods to the object: postSystem.add({title:"DataSections",body:"I invented this!",by:"Seth Vandebrooke";});

	*/

	function dataSection(name) {
		this.name = name;
		if (localStorage.getItem(name)===null) {
			var setup = [];
			localStorage.setItem(name,JSON.stringify(setup));
		}
		this.debug = false;
		//Add an element and assign a value (which must be an object)
		this.add = function(value) {
			var rows = JSON.parse(localStorage.getItem(this.name));
			rows.push(value);
			localStorage.setItem(this.name, JSON.stringify(rows));
			if(this.debug===true){console.log(this.name+" -> add: Object successfully added!");}
		};
		//Change a specific property of an element where a property equals a certain value: where BY equals "user4" set TITLE to "hello there"
		this.edit = function(whereThis,equalsThis,setThis,ToThis) {
			var rows = JSON.parse(localStorage.getItem(this.name));
			if (rows.length>0){
				for (var i = 0; i < rows.length; i++) {
					var row = rows[i];
					if (row[whereThis]==equalsThis) {
						if(this.debug===true){console.log(this.name+" -> edit: Object before - ");console.log(row);}
						row[setThis]=ToThis;
						if(this.debug===true){console.log(this.name+" -> edit: Object after - ");console.log(row);}
						rows[i] = row;
						if(this.debug===true){console.log(this.name+" -> edit: Object saved!");}
					}
				}
				localStorage.setItem(this.name, JSON.stringify(rows));
			} else {
				if(this.debug===true){console.log(this.name+" -> edit: No objects are stored!");}
			}
		};

		//Remove an element where a specific property equals a certian value
		this.remove = function(whereThis,equalsThis) {
			var rows = JSON.parse(localStorage.getItem(this.name));
			if (rows.length>0){
				for (var i = 0; i < rows.length; i++) {
					var row = rows[i];
				    if (row[whereThis]==equalsThis) {
				    	if(this.debug===true){console.log(this.name+" -> remove: Object matched for removal -");console.log(row);}
				    	rows.splice(i,1);
				    	if(this.debug===true){console.log(this.name+" -> remove: Object deleted!");}
				    }
				}
				localStorage.setItem(this.name, JSON.stringify(rows));
			} else {
				if(this.debug===true){console.log(this.name+" -> remove: No objects are stored!");}
			}
		};

		//Return an element as an object where a property equals a value
		this.get = function(whereThis,equalsThis) {
			var rows = JSON.parse(localStorage.getItem(this.name));
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				if (row[whereThis]==equalsThis) {
					if(this.debug===true){console.log(this.name+" -> get: Object found! ");console.log(row);}
					return row;
				}    
			}
			if(this.debug===true){console.log(this.name+" -> get: Object not found!");}
			if (rows.length<1&&this.debug===true){
				console.log(this.name+" -> get: No objects, with the property of "+whereThis+", matched "+equalsThis);
			}
			return null;
		};

		//Return an array of all the elements as objects
		this.listAll = function() {
			var rows = JSON.parse(localStorage.getItem(this.name));
			if (rows.length<1&&this.debug===true) {
				console.log(this.name+" -> listAll: There are no stored objects to return!");
			}
			if(this.debug===true){console.log(this.name+" -> listAll: Objects were found!");console.log(rows);}
			return rows;
		};

		//Return an array of elements as objects that all have a specific property that is equal to a certain value
		this.search = function(whereThis,equalsThis) {
			var result = [];
			var rows = JSON.parse(localStorage.getItem(this.name));
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				if (row[whereThis]==equalsThis) {
					if(this.debug===true){console.log(this.name+" -> search: Object matched - ");console.log(row);}
					result.push(row);
				}    
			}
			if (result.length<1&&this.debug===true) {
				console.log(this.name+" -> search: No objects, with the property of "+whereThis+", matched "+equalsThis);
			}
			if(this.debug===true){console.log(this.name+" -> search: Final result - ");console.log(result);}
			return result;
		};
		this.filter = function(whereThese,equalThese) {
			var result = new Array();
			var check = null;
			var rows = JSON.parse(localStorage.getItem(this.name));
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				for (var x = whereThese.length - 1; x >= 0; x--) {
					if (row[whereThese[x]]==equalThese[x]) {
						check = true;
						continue;
					} else {
						check = false;
						break;
					}
				}
			    if (check===true) {
			    	if(this.debug===true){console.log(this.name+" -> filter: Object matched - ");console.log(row);}
					result.push(row);
				}
			}
			if (result.length<1&&this.debug===true) {
				console.log(this.name+" -> filter: No objects matched your all values");
			}
			if(this.debug===true){console.log(this.name+" -> filter: Final result - ");console.log(result);}
			return result;
		};
		this.filterE = function(evaluations) {
			var result = new Array();
			var check = null;
			var rows = JSON.parse(localStorage.getItem(this.name));
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				if(eval(evaluations[i].split("object").join("row"))) {
					if(this.debug===true){console.log(this.name+" -> filterE: Object matched evaluations - ");console.log(row);}
					result.push(row);
				}
			}
			if (result.length<1&&this.debug===true) {
				var evals = evaluations.length>1?"evaluations":"evaluation";
				console.log(this.name+" -> filter: No objects matched your "+evals);
			}
			if(this.debug===true){console.log(this.name+" -> filterE: Final result - ");console.log(result);}
			return result;
		};
		this.debugFunction = function(func,parameters,oops,catchAs) { 
		  	if(oops!==undefined&&catchAs!==undefined){ 
		    	try{
		    		this[func](parameters);
		    	}
		    	catch(catchAs){
		      		oops();
		    	} 
		    } else{ 
		    	try{
		      		this[func](parameters);
		    	}
		    	catch(err){
		      		console.log(err);
		    	} 
		  	} 
		};
	}
	function protousApp(dataSections,userAccounts) {
		if (userAccounts!==null&&userAccounts!==undefined) {
			var accountSystems = userAccounts.split(" ").join("").split(",");
			for (var i = accountSystems.length - 1; i >= 0; i--) {
				this[accountSystems[i]] = new UserAccountSystem(accountSystems[i]);
				console.log("User Account System "+accountSystems[i]+" was successfully created!");
			}
		}
		if (dataSections!==null) {
		var sections = dataSections.split(" ").join("").split(",");
			for (var i = sections.length - 1; i >= 0; i--) {
				this[sections[i]] = new dataSection(sections[i]);
				console.log("DataSection "+sections[i]+" was successfully created!");
			}
		}
		this.dataSections = dataSections;
		this.getProfilePicture = getProfilePicture;
		this.uploadProfilePic = uploadProfilePic;
		this.debug = function(set) { //true or false
			var sections = this.dataSections.split(",");
			for (var i = 0; i < sections.length; i++) {
				this[sections[i]].debug = set;
			}
			console.log("Debug mode status: "+set);
		};
		console.log("Done!");
		console.log(this);
	}
	/*
	Protous Application Syntax

	app[DATASECTION][FUNCTION](PARAMETERS);

	app[USERACCOUNTSYSTEM][FUNCTION](PARAMETERS);

	If you aren't sure what functions are available for a dataSection or UserAccountSystem 
	then simply type the following syntax into the javaScript console:

	app[DATASECTION]

	Likewise, if you want to know what parameters are required or optional for a function then simple add the function name:

	app[DATASECTION][FUNCTION]

	The same methods apply to UserAccountSystems :)

	------------------------------------------------------------------
	EXAMPLE CODE:

	var application = new protousApp("posts,comments,likes","Users");

	application["Users"]["SignUp"]("sethV",{
		name:"seth",
		email:"myemail",
		password:"mypass"
	}, function() {
		alert("That username has already been used!");
	});

	application["posts"]["add"]({
		title:"mypost",
		body:"first post ever!",
		by:"sethV"
	});
	*/
	//Looper logic functions
	function ProtousLogic() {
		var loops = document.getElementsByTagName("users");
		var output = "";
		for (var i = 0; i < loops.length; i++) {
			if (loops[i].getAttribute("protous-name")!==undefined&&loops[i].getAttribute("protous-name")!==null) {
				var users = JSON.parse(get(loops[i].getAttribute("protous-name")));
				var userArray = [];
				for (var o = 0; o < users.length; o++) {
					userArray.push(users[o]);
				}
				if (loops[i].getAttribute("show-all")!==undefined&&loops[i].getAttribute("show-all")!==null&&loops[i].getAttribute("show-all")=="true") {
					for (var w = 0; w < userArray.length; w++) {
						var html = loops[i].innerHTML;
						var obj = JSON.parse(get(userArray[w]));
						for(var prop in obj) {
							html = html.split("(-"+prop+"-)").join(obj[prop]);
							output += html;
						}
					}
					loops[i].innerHTML = output;
				} else if (loops[i].getAttribute("show-where")!==undefined&&loops[i].getAttribute("show-where")!==null) {
					var whereThis = loops[i].getAttribute("show-where").split("=")[0];
					var equalsThis = loops[i].getAttribute("show-where").split("=")[1];
					if (equalsThis=="USER") {
						equalsThis = sessionStorage.getItem(loops[i].getAttribute("protous-name")+"-Logged-in");
					}
					var result = [];
					var rows = userArray;
					for (var x = 0; x < rows.length; x++) {
						var row = rows[x];
					    if (row[whereThis]==equalsThis) {
					    	result.push(row);
					    }
					}
					if (result.length<1) {
						loops[i].innerHTML = "";
						console.log(loops[i]+" resulted in 0 entries.");
					}
					for (var y = 0; y < result.length; y++) {
						var html = loops[i].innerHTML;
						var obj = JSON.parse(get(result[y]));
						for(prop in obj) {
							html = html.split("(-"+pname+"-)").join(obj[prop]);
						}
						output += html;
					}
					loops[i].innerHTML = output;
				}
			}
		}
		var view = document.getElementsByTagName("user");
		for (var i = 0; i < view.length; i++) {
			var ds = view[i].getAttribute("protous-name");
			var whereThis = view[i].getAttribute("logic-where").split("=")[0];
			var equalsThis = view[i].getAttribute("logic-where").split("=")[1];
			if (equalsThis=="USER"&&loops[i].getAttribute("uas-name")!==undefined&&loops[i].getAttribute("uas-name")!==null) {
				equalsThis = sessionStorage.getItem(loops[i].getAttribute("uas-name")+"-Logged-in");
			}
			var result = [];
			var users = get(view[i].getAttribute("protous-name"));
			var userArray = [];
			for (var i = 0; i < users.length; i++) {
				var CurrentUser = get(users[i]);
				userArray.push(CurrentUser);
			}
			for (var x = 0; x < userArray.length; x++) {
				var row = userArray[x];
			    for(var key in row){
			    	if (key==whereThis && row[key]==equalsThis) {
			    		result.push(row);
			    	}
			    }
			}
			if (result.length<1) {
				view[i].innerHTML = "";
				console.log(view[i]+" resulted in 0 entries.");
			}
			var html = view[i].innerHTML;
			var obj = JSON.parse(get(result[0]));
			for(prop in obj) {
				html = html.split("(-"+pname+"-)").join(obj[prop]);
			}
			view[i].innerHTML = html;
		}
	}
	function generateWhereLoop(datasection,expression,markup) {
		var loop = document.createElement("loop");
		loop.setAttribute("ds-name",datasection);
		loop.setAttribute("logic-where",expression);
		loop.innerHTML = markup;
		return loop;
	}

	function generateAllLoop(datasection,markup) {
		var loop = document.createElement("loop");
		loop.setAttribute("ds-name",datasection);
		loop.setAttribute("logic-all","true");
		loop.innerHTML = markup;
		return loop;
	}

	function addWhereLoop(id,datasection,expression,markup) {
		var loop = document.createElement("loop");
		loop.setAttribute("ds-name",datasection);
		loop.setAttribute("logic-where",expression);
		loop.innerHTML = markup;
		document.getElementById(id).appendChild(loop);
	}

	function addAllLoop(id,datasection,markup) {
		var loop = document.createElement("loop");
		loop.setAttribute("ds-name",datasection);
		loop.setAttribute("logic-all","true");
		loop.innerHTML = markup;
		document.getElementById(id).appendChild(loop);
	}
	function dsLogic() {
		var loops = document.getElementsByTagName("loop");
		var output = "";
		for (var i = 0; i < loops.length; i++) {
			if (loops[i].getAttribute("ds-name")!==undefined&&loops[i].getAttribute("ds-name")!==null) {
				var ds = loops[i].getAttribute("ds-name");
				if (loops[i].getAttribute("logic-all")!==undefined&&loops[i].getAttribute("logic-all")!==null&&loops[i].getAttribute("logic-all")=="true") {
					var result = JSON.parse(localStorage.getItem(ds));
					for (var w = 0; w < result.length; w++) {
						var html = loops[i].innerHTML;
						for(var prop in result[w]) {
							var obj = result[w];
							html = html.replace("(-"+prop+"-)",obj[prop]);
						}
						output += html;
					}
					loops[i].innerHTML = output;
				} else if (loops[i].getAttribute("logic-where")!==undefined&&loops[i].getAttribute("logic-where")!==null) {
					var whereThis = loops[i].getAttribute("logic-where").split("=")[0];
					var equalsThis = loops[i].getAttribute("logic-where").split("=")[1];
					if (equalsThis=="USER"&&loops[i].getAttribute("uas-name")!==undefined&&loops[i].getAttribute("uas-name")!==null) {
						equalsThis = sessionStorage.getItem(loops[i].getAttribute("uas-name")+"-Logged-in");
					}
					var result = [];
					var rows = JSON.parse(localStorage.getItem(ds));
					for (var x = 0; x < rows.length; x++) {
						var row = rows[x];
					    if (row[whereThis]==equalsThis) {
					   		result.push(row);
					    }
					}
					if (result.length<1) {
						loops[i].innerHTML = "";
						console.log(loops[i]+" resulted in 0 entries.");
					}
					for (var y = 0; y < result.length; y++) {
						var html = loops[i].innerHTML;
						for(prop in result[y]) {
							var obj = result[y];
							var pname = prop;
							html = html.replace("(-"+pname+"-)",obj[pname]);
						}
						output += html;
					}
					loops[i].innerHTML = output;
				}
			}
		}
		var view = document.getElementsByTagName("view");
		for (var i = 0; i < view.length; i++) {
			var ds = view[i].getAttribute("ds-name");
			var whereThis = view[i].getAttribute("logic-where").split("=")[0];
			var equalsThis = view[i].getAttribute("logic-where").split("=")[1];
			if (equalsThis=="USER"&&loops[i].getAttribute("uas-name")!==undefined&&loops[i].getAttribute("uas-name")!==null) {
				equalsThis = sessionStorage.getItem(loops[i].getAttribute("uas-name")+"-Logged-in");
			}
			var result = [];
			var rows = JSON.parse(localStorage.getItem(ds));
			for (var x = 0; x < rows.length; x++) {
				var row = rows[x];
			    for(var key in row){
			    	if (key==whereThis && row[key]==equalsThis) {
			    		result.push(row);
			    	}
			    }
			}
			if (result.length<1) {
				view[i].innerHTML = "";
				console.log(view[i]+" resulted in 0 entries.");
			}
			var html = view[i].innerHTML;
			for(prop in result[0]) {
				var obj = result[0];
				var pname = prop;
				html = html.replace("(-"+pname+"-)",obj[pname]);
			}
			view[i].innerHTML = html;
		}
	}
	/* Example HTML for dsLogic

	Attributes:
	 - ds-name = the name of the dataSection you want to grab data from
	 - logic-where = the objects must have a specific property equal the given value
	 - logic-all = loop through all of the objects in the dataSection

	       Grab from this data   Where this equals this
	                 |                    |
	<loop ds-name="posts" logic-where="by=Seth">
	    <div class="post">
	        <p class="user"> (-by-) </p> //Output the value of the by property here
		<h2 class="title"> (-title-) </h2> //Output the value of the title property here
		<p class="body"> (-body-) </p> //Output the value of the body property here
	    </div>
	</loop>

	       Grab from this data     Where this equals this
	                 |                       |
	<view ds-name="posts" logic-where="title=New post">
	<h1>(-by-)</h1> //Output the value of the by property here
	</view>
	*/

	function logicLoop(tagname,array,constants,extend) { //takes arrays of objects and filters them through the inner markup of the specified tags
		var loops = document.getElementsByTagName(tagname);
		var output = "";
		for (var i = 0; i < loops.length; i++) {
			if (loops[i].getAttribute("include-where")!==undefined&&loops[i].getAttribute("include-where")!==null&&loops[i].getAttribute("include-where")=="READALL") {
				var result = array;
				for (var w = 0; w < result.length; w++) {
					var html = loops[i].innerHTML;
					for(var prop in result[w]) {
						var obj = result[w];
						html = html.split("[-"+prop+"-]").join(obj[prop]);
						html = processConstants(html,constants);
					}
					output += html;
				}
				loops[i].innerHTML = output;
			} else if (loops[i].getAttribute("include-where")!==undefined&&loops[i].getAttribute("include-where")!==null) {
				var expression = loops[i].getAttribute("include-where");
				if (constants!==undefined&&constants!==null) {
					for (var c in constants) {
						var val = typeof(constants[c])=="function"?constants[c]():(typeof(constants[c])=="string"?constants[c]:JSON.stringify(constants[c]));
						expression = expression.split("$["+c+"]").join('"'+val+'"');
					}
				}
				var result = [];
				for (var x = 0; x < array.length; x++) {
					var obj = array[x];
					var Teval = expression;
					for(var key in obj){
						Teval = Teval.split("[-"+key+"-]").join('"'+obj[key]+'"');
				    }
				    if (eval(Teval)) {
				    	result.push(obj);
				    }
				}
				for (var y = 0; y < result.length; y++) {
					var html = loops[i].innerHTML;
					for(prop in result[y]) {
						var obj = result[y];
						var pname = prop;
						html = html.split("[-"+pname+"-]").join(obj[pname]);
						html = processConstants(html,constants);
					}
					output += html;
				}
				loops[i].innerHTML = output;
			}
		}
		//Process Constant usage in HTML
		if (constants!==undefined&&constants!==null&&extend==true) {
			var generatedHTML = document.body.innerHTML;
			document.body.innerHTML = processConstants(document.body.innerHTML,constants);;
		}
		//Load included files
		var z, i, a, file, xhttp;
		  z = document.getElementsByTagName("*");
		  for (i = 0; i < z.length; i++) {
		    if (z[i].getAttribute("include-file")) {
		      a = z[i].cloneNode(false);
		      file = z[i].getAttribute("include-file");
		      var xhttp = new XMLHttpRequest();
		      xhttp.onreadystatechange = function() {
		        if (xhttp.readyState == 4 && xhttp.status == 200) {
		          a.removeAttribute("include-file");
		          a.innerHTML = xhttp.responseText;
		          z[i].parentNode.replaceChild(a, z[i]);
		        }
		      }      
		      xhttp.open("GET", file, true);
		      xhttp.send();
		      return;
		    }
		}
	}

	/*
	----------THE JAVASCRIPT----------
	var now = new Date();
	logicLoop("posts",[
		  {
			title:"first post",
			body:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
			by:"ME!",
			when:now
		  }, {
			title:"second post",
			body:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
			by:"ME!",
			when:now
		  }, {
			title:"third post",
			body:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
			by:"ME!",
			when:now
		  }
		], {
			USER:"ME!"
		});

	---------THE HTML----------------
	<posts include-where="[-by-]==$[USER]">
	      <div class="post">
	        <h1>[-title-]</h1>
	        <p>[-body-] <br><br> <span class="info">by [-by-] on<br> [-when-]</span><br></p>
	      </div>
	    </posts>
	*/
	return {
		app: protousApp,
		protousLogic: ProtousLogic,
		generateAllLoop: generateAllLoop,
		generateWhereLoop: generateWhereLoop,
		addAllLoop: addWhereLoop,
		addWhereLoop: addWhereLoop,
		dsLogic: dsLogic,
		logicLoop: logicLoop
	};
})();
var events = {
  events: {},
  respond: function (eventName, func) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(func);
  },
  neglect: function(eventName, func) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === func) {
          this.events[eventName].splice(i, 1);
          break;
        }
      };
    }
  },
  trigger: function (eventName, data) {
    if (this.events[eventName]) {
      for (var func in this.events[eventName]) {
        func(data);
      }
    }
  }
};
/*
//Setup Your App
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

var alertM = (function(){
	function sendAlert(message) {
		alert(message);
	}
	events.respond('submitProduct', sendAlert(data));
})();

//Sign Up User:
var props = getWholeForm("myform");
var user = props.username;
events.trigger('userRegistered', {
	username: user,
	properties: props,
	used: function() {
		alert("That username has already been used!");
	}
});
events.trigger('submitProduct', getWholeForm("form"));
*/
