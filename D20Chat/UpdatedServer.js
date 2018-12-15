// NPM Module instances
const port = 5000;
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const path = require('path');
const AES = require("crypto");
const SHA256 = require("crypto-js/sha256");
const validator = require('validator');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = "mongodb://dbUser:LJ9UaQsS4ZxDYSG@cluster0-shard-00-00-lnyfj.mongodb.net:27017,cluster0-shard-00-01-lnyfj.mongodb.net:27017,cluster0-shard-00-02-lnyfj.mongodb.net:27017/?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

// Global variables for the server
const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const characters = "~`!@#%^&*()_+-=\\|][}{'\";:<>,./?";
var dbo;

// Connect to MongoDB client
MongoClient.connect(url, function(err, db){
	if (err) throw err;
	dbo = db.db("chatDB");
	console.log("MongoDB Connected!");
});

// Listen on port 5000
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
	// Function to return documents from Mongo findOne
	function mongoFind(collection, field, value, extra, callback){
		var searchobj = {};
		searchobj[field] = value;

		dbo.collection(collection).findOne(searchobj, function(err, result){
			if (err) throw err;
			callback(result, extra);
		});
	}
	
	// Function to find all documents with matching values for field given
	function mongoFindAll(collection, field, value, extra, callback){
		var searchobj = {};
		searchobj[field] = value;
		
		dbo.collection(collection).find(searchobj).toArray(function(err, result){
			if (err) throw err;
			callback(result, extra);
		});
	}

	// Function to find all documents with matching values for field given
	function mongoFindAllRooms(collection, field, value, extra, callback){
		var searchobj = {};
		searchobj[field] = value;
		
		dbo.collection(collection).find(searchobj).sort().toArray(function(err, result){
			if (err) throw err;
			callback(result, extra);
		});
	}

	
	// Function to find all documents given collection, field, value, sorted and limited
	function mongoFindAllSortLimit(collection, field, value, sort, limit, callback){
		var searchobj = {field : value};
		var sortby = {sort : 1};
		
		dbo.collection(collection).find(searchobj).sort(sortby).limit(limit).toArray(function(err, result){
			if (err) throw err;
			callback(result);
		});
	}
	
	// Function to insert documents into Mongo collection
	function mongoInsert(collection, doc, extra, callback){

		dbo.collection(collection).insertOne(doc, function(err, res){
			if (err) throw err;
			callback("success", extra);
		});
	}
	
	// Function to insert document into collection and return inserted document
	function mongoInsertForResult(collection, doc, extra, callback){

		dbo.collection(collection).insertOne(doc, function(err, res){
			if (err) throw err;
			callback(res.ops[0], extra);
		});
	}
	
	// Function to delete document in Mongo collection
	function mongoDeleteOne(collection, field, value, extra, callback){
		var deleteobj = {};
		deleteobj[field] = value;

		dbo.collection(collection).deleteOne(deleteobj, function(err, obj){
			if (err) throw err;
			if(obj.result.n == 1){
				callback("success", extra);
			}
			else{
				callback("fail", extra);
			}
		});
	}
	
	// Function to delete document in Mongo collection passing in object
	function mongoDeleteOneWithDoc(collection, doc, extra, callback){

		dbo.collection(collection).deleteOne(doc, function(err, obj){
			if (err) throw err;
			callback("success", extra);
		});		
	}
	
	// Function to delete many documents in Mongo collection
	function mongoDeleteMany(collection, field, value, extra, callback){
		var deleteobj = {};
		deleteobj[field] = value;

		dbo.collection(collection).deleteMany(deleteobj, function(err, obj){
			if (err) throw err;
			callback("success", extra);
		});
	}
	
	// Function to get room name given room id
	function getRoomNames(roomID, callback){

			mongoFind("roomid", "_id", new ObjectID(roomID), null, function(result, extra){
				callback(result);
			});
	}
	
	// Function to insert character information into 'chars' table
	function charToDB(name, roomID, userID, langs, callback){
		var insertobj = {};
		insertobj["userID"] = new ObjectID(userID);
		insertobj["roomID"] = new ObjectID(roomID);
		insertobj["char_name"] = name;
		insertobj["char_langs"] = langs;

		mongoInsert("chars", insertobj, null, function(result, extra){
			callback(result);			
		});
	}
	
	// Parse languages and create character information array
	function createCharacter(roomID, charName, charLangs, callback){
		var saniLangs = charLangs.split(",");
  
		for( var i = 0; i < saniLangs.length; i++){
			saniLangs[i] = saniLangs[i].trim(); 
		}
		
		callback([roomID, charName, saniLangs]);
	}
	
	// Function to delete entire room if necessary
	function deleteEntireRoom(roomID, callback){

		mongoDeleteOne("roomid", "_id", new ObjectID(roomID), null, function(result, extra){
			callback(result);
		});
	}	
	
	// Function to delete all messages from a deleted room
	function deleteRoomMessages(roomID, callback){

		mongoDeleteMany("messages", "roomID", new ObjectID(roomID), null, function(result, extra){
			callback(result);
		});
	}
	
	// Delete room from database if GM, otherwise delete character
	function deleteRoomChars(roomID, charName, callback){
		if (charName == "GM"){
			mongoDeleteMany("chars", "roomID", new ObjectID(roomID), null, function(result, extra){
				callback(result);
			});
		}
		else{
			var doc = {};
			doc["$and"] = [{"roomID" : new ObjectID(roomID)}, {"char_name" : charName}];
			
			mongoDeleteOneWithDoc("chars", doc, null, function(result, extra){
				callback(result);
			});
		}
	}
	
	// Function to create an array of message information arrays
	function storeMsgs(result, callback){
		var msgByRoom = [];

		result.forEach(function(message){
			msgByRoom.push([message.username, message.message, message.encMessage, message.roomID.tostring(), message.language]);
		});

		callback(msgByRoom);
	}
	
	// Retrieve all messages from a particular room and store them in an array
	function getRoomMsgs(roomID, callback){
		mongoFindAllSortLimit("messages", "roomID", ObjectID(roomID), "Datetime", 20, function(result){
			storeMsgs(result, function(data){
				callback(data);
			});
		});
	}
	
	// Function to insert room into roomid table, callback status message and set the socket.roomID variable
	function addRoom(userID, roomName, callback){		
		var insertobj = {};
		var today = new Date();
		var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
		
		insertobj["userID"] = new ObjectID(userID);
		insertobj["room_name"] = roomName;
		insertobj["lastMsg"] = date;
		
		mongoInsertForResult("roomid", insertobj, null, function(result, extra){
			callback(result._id.toString());
		});
	}
	
	// Function to sanitize all input data for every character
	function sanitizeAllChars(numChars, roomChars, roomID, callback){
		for (var i = 0; i < numChars; i++){
			var saniName = sanitizeInput(roomChars[i][0]);
			var saniEmail = sanitizeEmail(roomChars[i][1]);
			var saniLangs = sanitizeInput(roomChars[i][2]);
			saniLangs = saniLangs.toLowerCase();
			
			addChar(saniName, roomID, saniEmail, saniLangs, function(result){				
				if(result == "addCharError"){
					callback("error");
				}
			});
			
			if(i == (numChars - 1)){
				callback("success");
			}
		}
	}
	
	// Function to make sure no users are given GM name or ALL languages value
	function checkNamesLangs(numChars, roomChars, callback){
		var nameErrors = 0;
		var langErrors = 0;
		
		for (var i = 0; i < numChars; i++){
			var charName = sanitizeInput(roomChars[i][0]);
			var charEmail = sanitizeEmail(roomChars[i][1]);
			var charLangs = sanitizeInput(roomChars[i][2]);
			
			if (charName == "GM" || charName == "gm"){
				nameErrors++;
			}
			if (charLangs.indexOf("all") >= 0){
				langErrors++;
			}
			if (i == (numChars - 1)){
				callback(nameErrors, langErrors, "done");
			}
		}
	}
	
	// Function to add character to characters table if a user with that email address exists
	function addChar(charName, roomID, email, langs, callback){ 
		var userID;
		
		mongoFind("appusers", "email", email, null, function(result, extra){
			if(result != null){
				userID = result._id.toString();
				charToDB(charName, roomID, userID, langs, function(result){
					if(result == "success"){
						callback("success");
					}
					else{
						callback("addCharError");
					}
				});
			}
			else{
				callback("addCharError");
			}
		});
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
	
	/* SOCKET MESSAGE FUNCTIONS */
	// When message received from client, retrieve all message for a given room and send back to client
	socket.on('get messages', function(roomID){
		getRoomMsgs(roomID, function(messages){
			if(messages == null){
				socket.emit('add room messages', messages);    
			}
			else{
				socket.emit('add room messages', []);
			}
		});
	});
	
	// Email and Password received from client, chect if correct
	socket.on('check login', function(email, password){
		email = sanitizeEmail(email);
		var check_pass = sanitizeInputWS(password);

		// Retrieve users with matching email
		mongoFind("appusers", "email", email, check_pass, function(result, check_pass){
			if(result == null){
				socket.emit('login status', "fail", "null", "null", "null", "null");
			}
			else{
				var result_p = result.password;
				var sec = result.sec;
				var checkPass = SHA256(sec.substring(0, 15) + check_pass + sec.substring(16));
				
				// IF users password matches on on file, retrieve all rooms, characters and languages for the user
				if (result_p == checkPass){
					mongoFindAllRooms("roomid", "userID", result._id, [result._id.toString(), result.email], function(result, extra){
						var roomArray = new Array();
						var retRoomArray = new Array();
						var roomNameArray = new Array();
							
						if (result.length == 0){
							// leave arrays empty
						}
						else{
							result.forEach(function(doc){
								roomArray.push([doc._id.toString(), "GM", "ALL"]);
							});
						}
						mongoFindAll("chars", "userID", new ObjectID(extra[0]), extra, function(result, extra){							
							if (result == null){
								// leave arrays empty
							}
							else{
								result.forEach(function(doc){
									trimmedLangs(doc.roomID.toString(), doc.char_name, doc.char_langs, function(data){
										roomArray.push(data);
									});
								});
							}
							if (roomArray.length > 0){
								roomArray.forEach(function(room){
									getRoomNames(new ObjectID(room[0]), function(data){
										if(data == null){
											// Do nothing, no rooms exist for user
										}
										else{
											retRoomArray.push(room);
											roomNameArray.push(data.room_name);
										}
										if (roomNameArray.length == roomArray.length){	
											socket.emit('login status', "success", extra[1], extra[0], retRoomArray, roomNameArray);
										}	
									});
								});
							}
							else{
								socket.emit('login status', "success", extra[1], extra[0], roomArray, roomNameArray);
							}			
						});
					});
				}
				else{
					socket.emit('login status', "fail", "null", "null", "null", "null");
				}	
			}
		});
	});
	
	// Connects user to single room
	socket.on('join room', function(roomID) { 
		socket.join(roomID); 
	})
	
	// reload room button list 
	socket.on('reload rooms', function(userID, email){
		mongoFindAllRooms("roomid", "userID", new ObjectID(userID), [userID, email], function(result, extra){
			var roomArray = new Array();
			var retRoomArray = new Array();
			var roomNameArray = new Array();
							
			if (result.length == 0){
				// leave arrays empty
			}
			else{
				result.forEach(function(doc){
					roomArray.push([doc._id.toString(), "GM", "ALL"]);
				});
			}
			mongoFindAll("chars", "userID", new ObjectID(extra[0]), extra, function(result, extra){							
				if (result == null){
					// leave arrays empty
				}
				else{
					result.forEach(function(doc){
						trimmedLangs(doc.roomID.toString(), doc.char_name, doc.char_langs, function(data){
							roomArray.push(data);
						});
					});
				}
				if (roomArray.length > 0){
					roomArray.forEach(function(room){
						getRoomNames(new ObjectID(room[0]), function(data){
							if(data == null){
								// Do nothing, no rooms exist for user
							}
							else{
								retRoomArray.push(room);
								roomNameArray.push(data.room_name);
							}
							if (roomNameArray.length == roomArray.length){	
								socket.emit('login status', "success", extra[1], extra[0], retRoomArray, roomNameArray);
							}	
						});
					});
				}
				else{
					socket.emit('login status', "success", extra[1], extra[0], roomArray, roomNameArray);
				}			
			});
		});
	});
	
	// Message received from client that user signed up
	socket.on('create account', function(fnameSU1, lnameSU1, emailSU1, pwdSU1, conpwdSU){
		var upperLettersNum = 0;
		var numberNum = 0;
		var specCharsNum = 0;
		var pwdSU = sanitizeInputWS(pwdSU1);
		conpwdSU = sanitizeInputWS(conpwdSU);
		var emailSU = sanitizeEmail(emailSU1);
		var fnameSU = sanitizeInput(fnameSU1);
		var lnameSU = sanitizeInput(lnameSU1);

		// IF pass and confirm pass don't mnatch, return '!match' status
		if (pwdSU != conpwdSU){
			socket.emit('create account status', '!match');
		}
		
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
					mongoFind("appusers", "email", emailSU, null, function(result, extra){
						if (result != null){
							socket.emit('create account status', 'exists');
						}
						else{
							var sec = AES.randomBytes(16).toString('hex');
							var hashedpwd = SHA256(sec.substring(0, 15) + pwdSU + sec.substring(16)).toString();
							var insertobj = {"firstName" : fnameSU, "lastName" : lnameSU, "email" : emailSU, "password" : hashedpwd, "sec" : sec};
							mongoInsert("appusers", insertobj, null, function(result, extra){
								socket.emit('create account status', result);
							});
						}
					});
				}
				// ELSE format is incorrect
				else{
					socket.emit('create account status', 'passwordFormat');
				}
			}
		}
	});
	
	// Checks if room with roomName is taken. If so, return badname. Else, return success
	socket.on('create room', function(roomName){
		roomName = sanitizeInput(roomName);
		
		mongoFind("roomid", "room_name", roomName, null, function(result, extra){
			if (result != null){
				socket.emit('create room status', "badname");
			}	
			else{
				socket.emit('create room status', "success");
			}
		});
	});
	
	// Check all sent character names and errors, returning the apprporiate status message
	socket.on('create room chars', function(userID, roomName, numChars, roomChars){
		checkNamesLangs(numChars, roomChars, function(nameerr, langerr, result){
			if (nameerr == 0 && langerr == 0){
				addRoom(userID, roomName, function(roomID){
					sanitizeAllChars(numChars, roomChars, roomID, function(result){
						socket.emit('char creation status', result);        
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
	
	// on 'chat message', save message in database and emit to everyone in chat
	socket.on('chat message', function(userID, msg, roomID, character, lang){
		msg = sanitizeInput(msg);
		lang = lang.toLowerCase();
		var encMsg = msg.split('').sort(function(){return 0.5-Math.random()}).join('');
		
		var insertobj = {};
		insertobj["userID"] = new ObjectID(userID);
		insertobj["username"] = character;
		insertobj["roomID"] = new ObjectID(roomID);
		insertobj["Message"] = msg;
		insertobj["encMessage"] = encMsg;
		insertobj["language"] = lang;
		insertobj["Datetime"] = new Date();
		
		mongoInsertForResult("messages", insertobj, character, function(result, extra){
			if (result.username == extra){
				io.sockets.in(result.roomID.toString()).emit('chat message', result.username, result.Message, result.encMessage, result.roomID.toString(), result.language);
			}			
		});
	});
	
	// When message is received to delete a room, call function depending on character name of user
	socket.on('delete room', function(roomID, character){
		if(character == "GM"){
			mongoDeleteOne("roomid", "_id", new ObjectID(roomID), null, function(result, extra){
				if(result != "success"){
					console.log("Something went wrong deleting entire room!");
				}
				else{
					deleteRoomChars(roomID, character, function(result){
						if(result == "success"){
							deleteRoomMessages(roomID, function(res){
								if(res == "success"){
									socket.emit('deletion successful');
								}
								else{
									console.log("Error deleting messages for room.");
								}
							});
						}
						else{
							console.log("Error deleting characters for room.");
						}
					});
				}
			});
		}
		else{
			deleteRoomChars(roomID, character, function(result){
				if(result == "success"){
					socket.emit('deletion successful');
				}
				else{
					console.log("Error deleting character from room.");
				}
			});
		}
	});
	
	// on 'disconnect' set all vars to null
	socket.on('disconnect', function(){
		// Do nothing yet
	});
});