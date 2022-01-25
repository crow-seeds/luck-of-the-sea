var firebaseConfig = {
  apiKey: "AIzaSyB9MbNZNRbWJ0MxvGI2Gpimna72dN5o6FM",
  authDomain: "luck-of-the-sea.firebaseapp.com",
  databaseURL: "https://luck-of-the-sea-default-rtdb.firebaseio.com",
  projectId: "luck-of-the-sea",
  storageBucket: "luck-of-the-sea.appspot.com",
  messagingSenderId: "258655335070",
  appId: "1:258655335070:web:545670614f6d01e60ac18f"
};

var roomCode;
var username = "";
var host = false;

var roomRefr;

var playerLeave;
var playerJoin;
var playerLoad;

var playerList = [];

var randomGen;

window.addEventListener("load", () => {
  if(navigator.userAgent.match(/Android/i)){
    document.body.style.minHeight = "101vh";
    window.scrollTo(0,1);
  }
});

firebase.initializeApp(firebaseConfig);

function createNewGame(){
  document.getElementById("intro").style.display = "none";
  document.getElementById("username").style.display = "block";
  document.getElementById("navigation").style.display = "block";
}

function createJoinGame(){
  document.getElementById("intro").style.display = "none";
  document.getElementById("username").style.display = "block";
  document.getElementById("roomCodeInput").style.display = "block";
  document.getElementById("navigation2").style.display = "inline-block";
}

function backNewGame(){
  document.getElementById("intro").style.display = "block";
  document.getElementById("username").style.display = "none";
  document.getElementById("navigation").style.display = "none";
  document.getElementById("error").style.display = "none";
}

function backJoinGame(){
  document.getElementById("intro").style.display = "block";
  document.getElementById("username").style.display = "none";
  document.getElementById("roomCodeInput").style.display = "none";
  document.getElementById("navigation2").style.display = "none";
  document.getElementById("error").style.display = "none";
}

function startNewGame(){
  if(document.getElementById("usernameText").value.length == 0){
    document.getElementById("error").style.display = "block";
    document.getElementById("errorText").innerHTML = "Please input a username.";
  }else{
    username = document.getElementById("usernameText").value;

    document.getElementById("error").style.display = "none";
    document.getElementById("username").style.display = "none";
    document.getElementById("navigation").style.display = "none";
    document.getElementById("gameInformation").style.display = "inline-block";

    roomCode = generateRoomCode();
    roomRefr = firebase.database().ref("rooms/" + roomCode);

    createRoom(roomRefr);
  }
}

function startJoinGame(){
  username = document.getElementById("usernameText").value;
  if(username.length > 0){
    roomCode = document.getElementById("roomCodeText").value.toUpperCase();
    roomRefr = firebase.database().ref("rooms/" + roomCode);
    joinRoom(roomRefr);
  }else{
    document.getElementById("error").style.display = "block";
    document.getElementById("errorText").innerHTML = "Please input a username.";
  }
}



function createRoom(ref){
  ref.once("value").then(function(snapshot) {
    if(snapshot.exists()){
      roomCode = generateRoomCode();
      roomRefr = firebase.database().ref("rooms/" + roomCode);
      createRoom(roomRefr);
    }else{
      turnMax = parseInt(document.getElementById("maxTurnSelection").value);
      console.log(turnMax);
      document.getElementById("roomCode").innerHTML = roomCode;
      firebase.database().ref("rooms/"+roomCode+"/"+username+"/gameState").set("off");
      firebase.database().ref("rooms/"+roomCode+"/"+username+"/coins").set("0");
      firebase.database().ref("rooms/"+roomCode+"/"+username+"/played").set("0");
      firebase.database().ref("rooms/"+roomCode+"/"+username+"/maxTurns").set(turnMax);
      firebase.database().ref("rooms/"+roomCode+"/"+username+"/starfishCount").set("0");

      randSeed = generateRoomCode();
      firebase.database().ref("rooms/"+roomCode+"/"+username+"/seed").set(randSeed);
      randomGen = new Math.seedrandom(randSeed);

      host = true;
      document.getElementById("playersList").innerHTML = username + "<br>";
      playerList.push(username);
      displayPlayers(ref);
    }
  });
}

function generateRoomCode(){
  var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  var ret = "";
  for(i = 0; i < 5; i++){
    randomInt = Math.floor(Math.random() * parseInt(alphabet.length));
    ret += alphabet[randomInt];
  }

  return ret;
}

function joinRoom(ref){
  ref.once("value").then(function(snapshot) {
    if(snapshot.exists()){
      var gameRunning = false;

      snapshot.forEach(function(childSnapshot) {
        var stateOfGame = childSnapshot.child("gameState").val();
        if(stateOfGame == "on"){
          gameRunning = true;
        }

        if(childSnapshot.hasChild("seed")){
          randomGen = new Math.seedrandom(childSnapshot.child("seed").val());
        }

        if(childSnapshot.hasChild("maxTurns")){
          maxTurns = parseInt(childSnapshot.child("maxTurns").val());
        }
      });

      if(!gameRunning){
        document.getElementById("username").style.display = "none";
        document.getElementById("roomCodeInput").style.display = "none";
        document.getElementById("navigation2").style.display = "none";
        document.getElementById("gameInformation").style.display = "inline-block";
        document.getElementById("joinButton").disabled = true;
        document.getElementById("error").style.display = "none";

        document.getElementById("roomCode").innerHTML = roomCode;

        while(snapshot.hasChild("/" + username)){
          username += " 2";
        }

        host = false;

        firebase.database().ref("rooms/"+roomCode+"/"+username+"/gameState").set("off");
        firebase.database().ref("rooms/"+roomCode+"/"+username+"/coins").set("0");
        firebase.database().ref("rooms/"+roomCode+"/"+username+"/played").set("0");
        firebase.database().ref("rooms/"+roomCode+"/"+username+"/starfishCount").set("0");

        document.getElementById("playersList").innerHTML = username + "<br>";
        playerList.push(username);
        displayPlayers(ref);
      }else{
        document.getElementById("error").style.display = "block";
        document.getElementById("errorText").innerHTML = "Room already started.";
      }
    }else{
      document.getElementById("error").style.display = "block";
      document.getElementById("errorText").innerHTML = "Room could not be found.";
    }
  });
}

function displayPlayers(ref){
  document.getElementById("error").style.display = "none";

  playerJoin = ref.on("child_added", function(snapshot, prevChildKey) {
    var otherUser = snapshot.key;
    if(otherUser != username){
      document.getElementById("playersList").innerHTML += "<p style='margin-bottom: 0px;' id='lobby_" + otherUser + "'</p>" //otherUser + "<br>";
      document.getElementById("lobby_" + otherUser).innerHTML = otherUser;
      playerList.push(otherUser);
    }
  });

  firebase.database().ref("rooms/"+roomCode+"/"+username).onDisconnect().remove();

  playerLeave = ref.on("child_removed", function(snapshot) {
    var otherUser = snapshot.key;
    document.getElementById("lobby_" + otherUser).outerHTML = "";
    var tempIndex = playerList.indexOf(otherUser)
    playerList.splice(tempIndex, 1);
  });

  playerLoad = ref.child(username + "/gameState").on("value", function(snapshot){
    var state = snapshot.val();
    if(state == "on"){
      loadGame();
    }
  });
}

function backToMenu(){
  firebase.database().ref("rooms/"+roomCode+"/").child(username).remove();

  if(playerCount == 0){
    firebase.database().ref("rooms/"+roomCode).remove();
  }

  roomRefr.off("child_added", playerJoin);
  roomRefr.off("child_removed", playerLeave);
  roomRefr.child(username + "/gameState").off("value", playerLoad);

  document.getElementById("intro").style.display = "block";
  document.getElementById("gameInformation").style.display = "none";
  playerList = [];
}

function initiateGame(){
  if(!host){
    document.getElementById("error").style.display = "block";
    document.getElementById("errorText").innerHTML = "Only the host can start a game.";
  }else{
    for(x = 0; x < playerList.length; x++){
      if(playerList[x] != username){
        roomRefr.child(playerList[x] + "/gameState").set("on");
      }
    }
    roomRefr.child(username + "/gameState").set("on");
  }
}

function loadGame(){
  document.getElementById("titleScreen").style.display = "none";
  document.getElementById("game").style.display = "block";

  if(playerList.length > 1){
    createGame();
  }else{
    createGameSingleplayer();
  }
}
