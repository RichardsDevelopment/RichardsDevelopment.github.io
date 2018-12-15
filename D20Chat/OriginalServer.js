// NPM Module instances
const port = 5000;
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const mysql = require('mysql');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://dbUser:LJ9UaQsS4ZxDYSG@cluster0-shard-00-00-lnyfj.mongodb.net:27017,cluster0-shard-00-01-lnyfj.mongodb.net:27017,cluster0-shard-00-02-lnyfj.mongodb.net:27017/?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";
var dbo;

const path = require('path');
const AES = require("crypto");
const SHA256 = require("crypto-js/sha256");
const validator = require('validator');

/* WARNING: THERE IS ONLY ONE INSTANCE OF THESE. REEVALUATE HOW YOU ARE DOING THIS. MAYBE USE SOCKET.VARIABLES? */
// Variables
const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const characters = "~`!@#%^&*()_+-=\\|][}{'\";:<>,./?";
var charUserID;
var emailSU;
var pwdSU;
var fnameSU;
var lnameSU;
var roomArray = new Array();
var roomNameArray = new Array();
var msgByRoom = new Array();
var roomCreate;

// create MySQL connection
var conn = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'chattestdb'
});

MongoClient.connect(url, function(err, db){
	if (err) throw err;
	dbo = db.db("chatDB");
	console.log("MongoDB Connected!");
});

// connect to database
conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

console.log("Listening on port " + port);
server.listen(port);

// Express serving index.html to client computer
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/chat.html');
});

// Express serving directory /public to client 
app.use(express.static(__dirname + '/public'));

/* GLOBAL FUNCTIONS */
// Function to sanitize basic text
function sanitizeInput(text){
	text = validator.escape(text);
	text = text.replace("=", "");
	text = text.replace(";", "");
	return text;
}

// Function to sanitize input, including whitespaces
function sanitizeInputWS(text){
	text = validator.escape(text);
	text = text.replace(" ", "");
	text = text.replace("=", "");
	text = text.replace(";", "");
	return text;
}

// Function to sanitize emails
function sanitizeEmail(email){
	email = validator.escape(email);
	email = email.replace(" ", "");
	email = email.replace("=", "");
	email = email.replace(";", "");
	email = validator.normalizeEmail(email);
	return email;
}

// on user connect
io.on('connect', function(socket){
	
	/* FUNCTIONS */
	// General function to return documents from Mongo findOne
	function mongoFind(collection, field, value, extra, callback){
		var searchobj = {};
		searchobj[field] = value;
		//console.log(searchobj);
		
		dbo.collection(collection).findOne(searchobj, function(err, result){
			if (err) throw err;
			callback(result, extra);
		});
	}
	
	// General function to find all documents with matching values for field given
	function mongoFindAll(collection, field, value, extra, callback){
		var searchobj = {field : value};
			
		console.log("Finding all records where " + searchobj);
			
		dbo.collection(collection).find(searchobj).toArray(function(err, result){
			if (err) throw err;
			//console.log(result);
			callback(result, extra);
		});
	}
	
	// General function to find all documents given collection, field, value, sorted and limited
	function mongoFindAllSortLimit(collection, field, value, sort, limit, extra, callback){
		var searchobj = {};
		searchobj[field] = value;
		var sortby = {};
		sortby[sort] = 1;
			
		dbo.collection(collection).find(searchobj).sort(sortby).limit(limit).toArray(function(err, result){
			if (err) throw err;
			callback(result, extra);
		});
	}
	
	// General function to insert documents into Mongo collection
	function mongoInsert(collection, doc, extra, callback){
		dbo.collection(collection).insertOne(doc, function(err, res){
			if (err) throw err;
			console.log("Insert Result: " + res);
			callback("success", extra);
		});
	}
	
	// General function to delete document in Mongo collection
	function mongoDeleteOne(collection, field, value, extra, callback){
		var deleteobj = {field : value};
		dbo.collection(collection).deleteOne(deleteobj, function(err, obj){
			if (err) throw err;
			callback("success", extra);
		});
	}
	
	// Function to retrieve room names given roomID
	function getRoomNames(roomID, callback){
		console.log("Finding roomid: " + roomID);
		mongoFind("roomid", "roomID", roomID.toString(), null, function(result, extra){
			//console.log(result.room_name);
			callback(result);
		});
		
		/* conn.query('SELECT room_name FROM roomid WHERE roomID = ?', [roomID], function(err, result){
			if (err) throw err;
			else if (result.length > 0){
				callback(result[0].room_name);
			}
			else{
				callback("");
			}
		}); */
	}

	// Function to insert character information into 'chars' table
	function charToDB(name, roomID, userID, langs, callback){
		var insertobj = {};
		insertobj["userID"] = userID;
		insertobj["roomID"] = roomID;
		insertobj["char_name"] = name;
		insertobj["char_langs"] = langs;

		mongoInsert("chars", insertobj, function(result, extra){
			if(result == "success"){
				callback(null, "success");
			}
			else{
				callback("Error inserting character!", null);
			}
			
		});
		
		/* conn.query('INSERT INTO chars (userID, roomID, char_name, char_langs) VALUES (\'' + userID + '\', \'' + roomID + '\', \'' + name + '\', \'' + langs + '\')', function(err, result){
			if (err){
				callback(err, null);
			}
			else{
				callback(null, "success");
			}
		}); */
	}

	// Parse languages and create character information array
	function trimmedLangs(rmID, chrName, chrLangs, callback){
		var tempLangs = chrLangs.split(",");
		var langs = new Array();
  
		for( var i = 0; i < tempLangs.length; i++){
			langs.push(tempLangs[i].split()); 
		}
		
		var charInfo = [rmID, chrName, langs];
		callback(charInfo);
	}

	// Function to delete entire room if necessary
	function deleteEntireRoom(room, callback){
		
		conn.query('DELETE FROM roomid WHERE roomID=?', [room], function(err, result){
			if (err) {
				callback(err, null);	
			}
			else{
				callback(null, "success")
			}
		});
	}	

	// Function to delete all messages from a deleted room
	function deleteRoomMessages(room, callback){
		conn.query('DELETE FROM messages WHERE roomID=?', [room], function(err, result){
			if (err){
				callback(err, null);
			}
			else{
				callback(null, "success");
			}
		});
	}
	
	// Function to create an array of message information arrays
	function storeMsgs(result, callback){
		msgByRoom = [];
		
		for(var i = 0; i < result.length; ++i){
			msgByRoom.push([result[i].username, result[i].Message, result[i].encMessage, result[i].roomID, result[i].language]);
			if (i == result.length - 1){
				callback(msgByRoom);
			}
		}
	}
	
	function storeMsgsMongo(result, callback){
		var msgsByRoom = [];
		
		result.forEach(function(result){
			msgsByRoom.push([result.username, result.Message, result.encMessage, result.roomID, result.language]);
		});
		
		callback(msgsByRoom);
	}

	// Retrieve all messages from a particular room and store them in an array
	function getRoomMsgs(roomID, callback){
		mongoFindAllSortLimit("messages", "roomID", roomID, "Datetime", 20, function(result){
			storeMsgsMongo(result, function(data){
				callback("success");
			});
		});
		/* conn.query('SELECT * FROM messages WHERE roomID=? ORDER BY Datetime ASC LIMIT 20', [roomID], function(err, result){
			if (err){
				callback(err, null);
			}	
			else{
				storeMsgs(result, function(data){
					callback("success");
				});
			}
		}); */
	}

	// Delete room from database if GM, otherwise delete character
	function deleteRoomChars(room, char, callback){
		if (char == "GM"){
			conn.query('DELETE FROM chars WHERE roomid=?', [room], function(err, result){
				if(err){
					callback(err, null);
				}
				else{
					callback(null, "success");
				}
			});
		}
		else{
			conn.query('DELETE FROM chars WHERE roomid=? AND char_name=?', [room, char], function(err, result){
				if(err){
					callback(err, null);
				}
				else{
					callback(null, "success");
				}
			});
		}
	}
	
	// Function to insert room into roomid table, callback status message and set the socket.roomID variable
	function addRoom(userID, callback){
		var today = new Date();
		var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
		
		var insertobj = {};
		insertobj["roomID"] = 16;
		insertobj["userID"] = userID;
		insertobj["room_name"] = socket.roomCreate;
		insertobj["lastMsg"] = date;
		
		mongoInsert("roomid", insertobj, function(result){
			if(result == "success"){
				mongoFind("roomid", "room_name", socket.roomCreate, null, function(result, extra){
					// socket.roomID = result.roomID;
					// callback("success");
				});
			}
		});
		conn.query('INSERT INTO roomid (userID, room_name, lastMsg) VALUES (\'' + socket.userID + '\', \'' + roomCreate + '\', \'' + date + '\')' , function(err, result){
			if (err) throw err;
			else{
				conn.query('SELECT * FROM roomid WHERE room_name=\'' + roomCreate + '\'', function(err, result){
					if (err) throw err;
					socket.roomID = result[0].roomID;
					callback(null, "yes");
				});
			}
		});
	}
	
	// Function to sanitize all input data for every character
	function sanitizeAllChars(numChars, roomChars, callback){
		for (var i = 0; i < numChars; i++){
			var charName = sanitizeInput(roomChars[i][0]);
			var charEmail = sanitizeEmail(roomChars[i][1]);
			var charLangs = sanitizeInput(roomChars[i][2]);
			charLangs = charLangs.toLowerCase();
			
			// TODO() : check this for SQL statements
			addChar(charName, socket.roomID, charEmail, charLangs, function(err, result){
				if (err) throw err;					
				else{
					//console.log(charName + " stored in db!");
				}
			});
		}
		callback(null, "success");
	}

	// Function to make sure no users are given GM name or ALL languages value
	function checkNamesLangs(numChars, roomChars, callback){
		var nameErrors = 0;
		var langErrors = 0;
		for (var i = 0; i < numChars; i++){
			var charName = sanitizeInput(roomChars[i][0]);
			var charEmail = sanitizeEmail(roomChars[i][1]);
			var charLangs = sanitizeInput(roomChars[i][2]);
			
			if (charName == "GM"){
				nameErrors++;
			}
			if (charLangs.indexOf("ALL") >= 0){
				langErrors++;
			}
			
			if (i == numChars - 1){
				callback(nameErrors, langErrors, "success");
			}
			else{
				continue;
			}
		}
	}

	// Function to add character to characters table if a user with that email address exists
	function addChar(name, roomID, email, langs, callback){ 
		var userID;
		conn.query('SELECT * FROM appusers WHERE email=\'' + email + '\'', function(err, result){
			if (err) {
				callback(err, null);
			}
			else if (result.length > 0){
				userID = result[0].userID;
				charToDB(name, roomID, userID, langs, function(err, result){
					if (err){
						callback(err, null);
					}
					else{
						callback(null, "success");
					}
				});
			}
			else{
				userID = 0;
				callback(null, "");
			}
		});
	}
	
	/* SOCKET MESSAGE FUNCTIONS */
	// When message received from client, retrieve all message for a given room and send back to client
	socket.on('get messages', function(room){
		getRoomMsgs(room, function(data){
			if(data == "success"){
				//console.log("Got messages...");
				//for (var i = 0; i < socket.msgByRoom.length; i++){
					//console.log(socket.msgByRoom[i]);
				//}
				socket.emit('add room messages', socket.msgByRoom);    
			}
			else{
				throw ("Something went wrong");
			}
		});
	});

	// Email and Password received from client, chect if correct
	socket.on('check login', function(email, password){
		socket.email = sanitizeEmail(email);
		var check_pass = sanitizeInputWS(password);
  
		//console.log(socket.email);
		//console.log("[" + check_pass + "]");
  
		// Retrieve users with matching email
		mongoFind("appusers", "email", socket.email, check_pass, function(result, check_pass){
			if(result == null){
				//console.log("no user " + socket.email + " found!");
				socket.emit('login status', "fail", "null", "null", "null", "null");
			}
			else{
				var result_p = result.password;
				var sec = result.sec;
				var checkPass = SHA256(sec.substring(0, 15) + check_pass + sec.substring(16));
				
				// IF users password matches on on file, retrieve all rooms, characters and languages for the user
				if (result_p == checkPass){
					//console.log("Passwords Match!");
					
					socket.userID = result._id;
					//console.log(socket.userID);
					sec = checkPass = result_p = check_pass = "";
					
					mongoFindAll("roomid", "userID", socket.userID, function(result){
						if (result == null){
							// leave arrays empty
							//console.log("No rooms for user " + socket.userID);
						}
						else{
							//console.log("Rooms found for user.");

							result.forEach(function(data){
								//console.log("Room " + data.roomID + " found for user " + socket.userID);
								var row = data;
								roomArray.push([row.roomID, "GM", "ALL"]);
							});
						}
						mongoFindAll("chars", "userID", socket.userID, function(result){
							if (result == null){
								//console.log("No characters for user " + socket.userID);
								// leave arrays empty
							}
							else{
								result.forEach(function(result){
									var row = result;
									trimmedLangs(row.roomID, row.char_name, row.char_langs, function(data){
										roomArray.push(data);
									});
								});
							}
							if (roomArray.length > 0){
								for (var i = 0; i < roomArray.length; i++){
									getRoomNames(socket.userID, roomArray[i][0], function(data){
										if(data == null){
											//console.log("result is null");
											// Do nothing, no rooms exist for user
										}
										else{
											//console.log(data.room_name);
											roomNameArray.push(data.room_name);
										}
										if (roomNameArray.length == roomArray.length){
											socket.emit('login status', "success", socket.email, socket.userID, roomArray, roomNameArray);
										}	
									});
								}
							}
							else{
								socket.emit('login status', "success", socket.email, socket.userID, roomArray, roomNameArray);
							}			
						});
					});
				}
				else{
					socket.emit('login status', "fail", "null", "null", "null", "null");
				}	
			}
		});
		/* conn.query('Select * FROM appusers WHERE email=\'' + socket.email + '\'', function(err, result){
			if (err) throw err;
			
			// IF user is found, check password
			if (result.length > 0){	
				var result_p = result[0].password;
				var sec = result[0].sec;
				var checkPass = SHA256(sec.substring(0, 15) + check_pass + sec.substring(16));
				
				// IF users password matches on on file, retrieve all rooms, characters and languages for the user
				if (result_p == checkPass){
					socket.userID = result[0].userID;
					sec = checkPass = result_p = check_pass = "";
					conn.query('SELECT * FROM roomid WHERE userID=\'' + socket.userID + '\'', function(err, result){
						if (err) throw err;
						else{
							if (result.length > 0){
								for (var i = 0; i < result.length; i++){
									var row = result[i];
									roomArray.push([row.roomID, "GM", "ALL"]);
								}
							}
							else{
								// leave arrays empty
							}
							conn.query('SELECT * FROM chars WHERE userID=\'' + socket.userID + '\'', function(err, result){
								if (err) throw err;
								else{
									if (result.length > 0){
										for (var i = 0; i < result.length; i++){
											var row = result[i];
											trimmedLangs(row.roomID, row.char_name, row.char_langs, function(err, data){
												if (err) throw err;
												roomArray.push(data);
											});
										}
									}
									else{
										// leave arrays empty
									}

									if (roomArray.length > 0){
										for (var i = 0; i < roomArray.length; i++){
											getRoomNames(socket.userID, roomArray[i][0], function(err, data){
												if (err) throw err;
												else{
													roomNameArray.push(data);
													if (roomNameArray.length == roomArray.length){
														socket.emit('login status', "success", socket.email, socket.userID, roomArray, roomNameArray);
													}	

												}
											});

										}
									}
									else{
										socket.emit('login status', "success", socket.email, socket.userID, roomArray, roomNameArray);
									}									
								}				
							});
						}
					});
				}
				// ELSE incorrect login, send message back to client
				else{
					socket.emit('login status', "fail", "null", "null", "null", "null");
				}	
			}
			// ELSE incorrect login, send message back to client
			else{
				socket.emit('login status', "fail", "null", "null", "null", "null");
			}
		}); */
	});
  
	// Connects user to single room
	socket.on('join room', function(room) { 
		socket.join(room); 
	})

	// reload room button list 
	socket.on('reload rooms', function(userID, email){
		roomArray = [];
		roomNameArray = [];
		socket.email = email;
		
		mongoFindAll("roomid", "userID", socket.userID, function(result){
						if (result == null){
							// leave arrays empty
							//console.log("No rooms for user " + socket.userID);
						}
						else{
							//console.log("Rooms found for user.");
							//console.log(result);
							result.forEach(function(data){
								//console.log("Room " + data.roomID + " found for user " + socket.userID);
								var row = data;
								roomArray.push([row.roomID, "GM", "ALL"]);
							});
						}
						mongoFindAll("chars", "userID", socket.userID, function(result){
							if (result == null){
								//console.log("No characters for user " + socket.userID);
								// leave arrays empty
							}
							else{
								result.forEach(function(result){
									var row = result;
									trimmedLangs(row.roomID, row.char_name, row.char_langs, function(data){
										roomArray.push(data);
									});
								});
							}
							if (roomArray.length > 0){
								for (var i = 0; i < roomArray.length; i++){
									getRoomNames(socket.userID, roomArray[i][0], function(data){
										if(data == null){
											//console.log("result is null");
											// Do nothing, no rooms exist for user
										}
										else{
											//console.log(data.room_name);
											roomNameArray.push(data.room_name);
										}
										if (roomNameArray.length == roomArray.length){
											socket.emit('login status', "success", socket.email, socket.userID, roomArray, roomNameArray);
										}	
									});
								}
							}
							else{
								socket.emit('login status', "success", socket.email, socket.userID, roomArray, roomNameArray);
							}			
						});
					});
		
		/* conn.query('SELECT * FROM roomid WHERE userID=\'' + socket.userID + '\'', function(err, result){
			if (err) throw err;
			else{
				if (result.length > 0){
					for (var i = 0; i < result.length; i++){
						var row = result[i];
						roomArray.push([row.roomID, "GM", "ALL"]);
					}
				}
				else{
					// leave arrays empty
				}
				conn.query('SELECT * FROM chars WHERE userID=\'' + socket.userID + '\'', function(err, result){
					if (err) throw err;
					else{
						if (result.length > 0){
							for (var i = 0; i < result.length; i++){
								var row = result[i];
								trimmedLangs(row.roomID, row.char_name, row.char_langs, function(err, data){
									if (err) throw err;
									roomArray.push(data);
								});
							}
						}
						else{
							// leave arrays empty
						}
						if (roomArray.length > 0){
							for (var i = 0; i < roomArray.length; i++){
								getRoomNames(socket.userID, roomArray[i][0], function(data){
										if(data == null){
											//console.log("result is null");
											// Do nothing, no rooms exist for user
										}
										else{
											//console.log(data.room_name);
											roomNameArray.push(data.room_name);
										}
										if (roomNameArray.length == roomArray.length){
											socket.emit('login status', "success", socket.email, socket.userID, roomArray, roomNameArray);
										}	
									});
							}
						}
						else{
							socket.emit('login status', "success", socket.email, socket.userID, roomArray, roomNameArray);
						}									
					}				
				});
			}
		}); */
	});
 
	// Message received from client that user signed up
	socket.on('create account', function(fnameSU1, lnameSU1, emailSU1, pwdSU1, conpwdSU){
		var upperLettersNum = 0;
		var numberNum = 0;
		var specCharsNum = 0;
		pwdSU = sanitizeInputWS(pwdSU1);
		conpwdSU = sanitizeInputWS(conpwdSU);
		emailSU = sanitizeEmail(emailSU1);
		fnameSU = sanitizeInput(fnameSU1);
		lnameSU = sanitizeInput(lnameSU1);

		// Check that password contains proper number of characters, capitals and numbers
		for (var i = 0; i < pwdSU.length; i++){
			var chrChk = pwdSU[i];
			if (uppers.includes(chrChk)){
				upperLettersNum++;
			}
			else if(numbers.includes(chrChk)){
				numberNum++;	
			}
			else if(characters.includes(chrChk)){
				specCharsNum++;	
			}
			if(i == pwdSU.length - 1){
				//IF formatting is correct, check password match and add to users table if valid
				if (upperLettersNum > 0 && numberNum > 0 && specCharsNum > 0 && pwdSU.length >= 8){
					if (pwdSU != conpwdSU){
						socket.emit('create account status', '!match');
					}
					else {
						mongoFind("appusers", "email", emailSU, null, function(result, extra){
							if (result != null){
								console.log("Account exists!");
								socket.emit('create account status', 'exists');
							}
							else{
								var sec = AES.randomBytes(16).toString('hex');
								var hashedpwd = SHA256(sec.substring(0, 15) + pwdSU + sec.substring(16)).toString();
								var insertobj = {"firstName" : fnameSU, "lastName" : lnameSU, "email" : emailSU, "password" : hashedpwd, "sec" : sec};
								console.log(insertobj);
								mongoInsert("appusers", insertobj, function(result){
									fnameSU = lnameSU = emailSU = pwdSU = "";
									socket.emit('create account status', 'success');
								});
							}
						});
						
						/* conn.query('SELECT * FROM appusers WHERE email=\'' + emailSU + '\'', function(err, result){
							if (err) throw err;
							else if (result.length > 0){
								socket.emit('create account status', 'exists');
							}
							else {
								var sec = AES.randomBytes(16).toString('hex');
								var hashedpwd = SHA256(sec.substring(0, 15) + pwdSU + sec.substring(16));
								conn.query('INSERT INTO appusers (firstName, lastName, email, password, sec) VALUES (\'' + fnameSU + '\', \'' + lnameSU + '\', \'' + emailSU + '\', \'' + hashedpwd + '\', \'' + sec + '\')', function(err,result){
									if (err) throw err;
									else{
										fnameSU = lnameSU = emailSU = pwdSU = "";
										socket.emit('create account status', 'success');
									}
								});
							}
						}); */
					}
				}
				// ELSE format is incorrect
				else{
					socket.emit('create account status', 'passwordFormat');
				}
			}
		}
	});

	// check for matches. If none, store in table
	socket.on('create room', function(roomName){
		roomName = sanitizeInput(roomName);
		socket.roomCreate = roomName;
		roomCreate = roomName;
		console.log(socket.userID);
		
		mongoFind("roomid", "room_name", roomName, null, function(result, extra){
			if (result == null){
				socket.emit('create room status', "badname");
			}	
			else{
				socket.emit('create room status', "success");
			}
		});
		
		/* conn.query('SELECT * FROM roomid WHERE room_name=\'' + roomName + '\'' , function(err, result){
			if (err) throw err;
			if (result.length > 0){
				socket.emit('create room status', "badname");
			}
			else{
				socket.emit('create room status', "success");
			}
		}); */
	});

	// Check all sent character names and errors, returning the apprporiate status message
	socket.on('create room chars', function(numChars, roomChars){
		checkNamesLangs(numChars, roomChars, function(nameerr, langerr, result){
			if (nameerr == 0 && langerr == 0){
				console.log(socket.userID);
				addRoom(socket.userID, function(err, result){
					if (err) throw err;
					sanitizeAllChars(numChars, roomChars, function(err, result){
						socket.emit('char creation status', "success");        
					});
				});
			}
			else{
				if (nameerr > 0){
					socket.emit('char creation status', "nameErr");
				}
				else if (langerr > 0){
					socket.emit('char creation status', "langErr");
				}
				else{
					socket.emit('char creation status', "fail");
				}
			}
		});
	});

	// Delete created room if creation is cancelled during the process
	socket.on('cancel room creation', function(roomName){
		roomName = sanitizeInput(roomName);
		mongoDeleteOne("roomid", "room_name", roomName, function(){
			// write code to check if actually deleted
			mongoDeleteOne("chars", "roomID", socket.roomID, function(){
				// write code to check if actually deleted
				socket.roomID = null;
			});
		});
		
		/* conn.query('DELETE FROM roomid WHERE room_name=\'' + roomName + '\'', function(err, result){
			if (err) throw err;
			else{
				conn.query('DELETE FROM chars WHERE roomID=\'' + socket.roomID + '\'', function(err, result){
					if (err) throw err;
					else{
						socket.roomID = null;
					}
				});
			}
		}); */
	});

	// on 'chat message', save message in database and emit to everyone in chat
	socket.on('chat message', function(msg, room, char, lang){
		msg = sanitizeInput(msg);
		lang = lang.toLowerCase();
		var encMsg = msg.split('').sort(function(){return 0.5-Math.random()}).join('');
		conn.query('INSERT INTO messages (userID, username, roomID, Message, encMessage, language) VALUES(\'' + socket.userID + '\', \'' + char + '\', \'' + room + '\', \'' + msg + '\', \'' + encMsg + '\', \'' + lang + '\')', function(err, result){  
			if (err) throw err;  
			io.sockets.in(room).emit('chat message', char, msg, encMsg, room, lang);
		});  
	});

	// When message is received to delete a room, call function depending on character name of user
	socket.on('delete room', function(room, character){
		if(character == "GM"){
			deleteEntireRoom(room, function(err, result){
				if (err) throw err;
				else{
					deleteRoomChars(room, character, function(err, result){
						if(err) throw err;
						else{
							deleteRoomMessages(room, function(err, result){
								if (err) throw err;
								else{
									socket.emit('deletion successful');
								}
							});
						}
					});
				}
			});
		}
		else{
			deleteRoomChars(room, character, function(err, result){
				if(err) throw err;
				else{
					socket.emit('deletion successful');
				}
			});
		}
	});

	// on 'disconnect' set all vars to null
	// WARNING: THIS CAN CAUSE SERIOUS PROBLEMS. LOOK INTO CHANGING THESE TO SOCKET.VARIABLES
	socket.on('disconnect', function(){
		roomArray = [];
		roomNameArray = [];
	});
});

