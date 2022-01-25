<head>
  <title>Luck of the Sea</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.2.3/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.0.2/firebase-database.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.min.js"></script>
  <script type="text/javascript" src="slotmachine.min.js"></script>
  <script type="text/javascript" src="introCode.js"></script>
  <script type="text/javascript" src="fishCode.js"></script>
</head>

<body>
  <style>
  <?php include 'main.css'; ?>
  </style>

  <div id="titleScreen" class="container" style="text-align:center;">
    <p class="title">Luck of the Sea</p>
    <p class="subtitle">A Fish Gambling Service</p>
    <hr>

    <div id="intro">
      <br>
      <button class="introButton" onclick="return createNewGame()">Create Game</button>
      <br>
      <button class="introButton" onclick="return createJoinGame()">Join Game</button>
      <br>
    </div>

    <div id="username" style="display:none; text-align:center;">
      <br>
      <input class="input" id="usernameText" placeholder="Username" maxlength="20" autocomplete="off"></input>
      <br>
    </div>

    <div id="roomCodeInput" style="display:none; text-align:center;">
      <br>
      <input class="input" id="roomCodeText" placeholder="Room Code" maxlength="5" autocomplete="off"></input>
      <br>
    </div>

    <div id="navigation" style="display:none; text-align:center;">
      <select class="input" id="maxTurnSelection">
        <option value="30" selected>30 Turns</option>
        <option value="45">45 Turns</option>
        <option value="60">60 Turns</option>
      </select>
      <button class="backButton" style="width: fit-content; text-decoration:underline; display: inline-block;" onclick="return backNewGame()">Back</button>
      <button class="introButton" id="createButton" style="width: fit-content; display: inline-block;" onclick="return startNewGame()">Create</button>
    </div>

    <div id="navigation2" style="display:none; text-align:center;">
      <button class="backButton" style="width: fit-content; text-decoration:underline; display: inline-block;" onclick="return backJoinGame()">Back</button>
      <button class="introButton" id="joinButton" style="width: fit-content; display: inline-block;" onclick="return startJoinGame()">Join</button>
    </div>

    <div id="gameInformation" style="display:none; text-align:center;">
      <p style="font-size:4rem">Your room code is:</p>
      <p id="roomCode" style="font-size:7rem"></p>
      <br>
      <p style="font-size:4rem" style="text-decoration: underline">Players:</p>
      <p id="playersList" style="font-size:4rem"></p>
      <br>
      <button class="backButton" style="width: fit-content; text-decoration:underline; display: inline-block;" onclick="return backToMenu()">Back</button>
      <button class="introButton" id="initiateButton" style="width: fit-content; display: inline-block;" onclick="return initiateGame()">Start</button>
    </div>

    <div id="error" style="display:none; text-align:center;">
      <br>
      <p style="font-size:4rem" id="errorText">Room could not be found.</p>
    </div>
  </div>

  <div id="game" style="display:none">

    <div class="blackOverlay" id="leaderboard" style="display:none">
      <div style="left:15vw; top:15vh; width:70vw; height:70vh; border-color:white; background-color: dimgray;" class="infoBox">
        <p class="infoText" style="left:5vw; top:4vh; width:60vw; text-align:center; text-decoration: underline;">Leaderboard</p>
        <p class="infoText" style="left:5vw; top:10vh; width:60vw; text-align:center; height:50vh; overflow-y:auto;" id="leaderboardText"></p>
        <p class="infoText" style="left:5vw; top:30vh; width:60vw; text-align:center; height:30vh; overflow-y:auto;" id="percentileText"></p>
      </div>
    </div>

    <div style="background-color:black; width:100vw; height:6vh">
      <p style="padding-left:2vw; font-size: 4vh; color: rgba(255, 221, 0, 1); font-family:'rainy hearts'; position:absolute;" id="pointCounter">Coins: 0</p>
      <p style="padding-right:2vw; text-align:right; font-size: 4vh; color: rgba(128, 128, 128, 1); font-family:'rainy hearts'; position:absolute; width:40vw; left: 60vw;" id="turnCounter">Turn 1/30</p>
      <p style="padding-right:2vw; text-align:center; font-size: 4vh; color:white; font-family:'rainy hearts'; position:absolute; width:60vw; left: 20vw;" id="nameDisplay"></p>
    </div>

    <div style="border:.4vw solid #000; z-index:3; position:absolute; left:18vw; top:40vh; width:64vw; height:8vw"></div>

    <div style="left:18vw; top:10vh; width:64vw; height:23vh;" class="infoBox">
      <img style="left:1vh; position:absolute; top:1vh; display: inline; width:8vh; height:8vh" src="transparent.png" id="infoBox"></img>
      <img style="left:1vh; position:absolute; top:1vh; display: inline; width:8vh; height:8vh" src="transparent.png" id="infoFish"></img>
      <p class="infoText" style="left:10vh; top:1vh" id="infoText"></p>
      <p class="infoText" style="left:32vw; top:16vh; width:30vw; text-align:right;" id="rarityText"></p>
    </div>

    <div id="pointTexts" style="position:absolute; left:18vw; top:40vh; width:64vw; height:8vw">
      <p class="pointText" style="left:4vw; top:0vh" id="point0">+0</p>
      <p class="pointText" style="left:12vw; top:0vh" id="point1">+0</p>
      <p class="pointText" style="left:20vw; top:0vh" id="point2">+0</p>
      <p class="pointText" style="left:28vw; top:0vh" id="point3">+0</p>
      <p class="pointText" style="left:36vw; top:0vh" id="point4">+0</p>
      <p class="pointText" style="left:44vw; top:0vh" id="point5">+0</p>
      <p class="pointText" style="left:52vw; top:0vh" id="point6">+0</p>
      <p class="pointText" style="left:60vw; top:0vh" id="point7">+0</p>
    </div>

    <div id="infoButtons" style="position:absolute; left:18vw; top:40vh; width:64vw; height:8vw">
      <button class="infoButton" style="left:0vw;" onclick="return fishInfo(0)"></button>
      <button class="infoButton" style="left:8vw;" onclick="return fishInfo(1)"></button>
      <button class="infoButton" style="left:16vw;" onclick="return fishInfo(2)"></button>
      <button class="infoButton" style="left:24vw;" onclick="return fishInfo(3)"></button>
      <button class="infoButton" style="left:32vw;" onclick="return fishInfo(4)"></button>
      <button class="infoButton" style="left:40vw;" onclick="return fishInfo(5)"></button>
      <button class="infoButton" style="left:48vw;" onclick="return fishInfo(6)"></button>
      <button class="infoButton" style="left:56vw;" onclick="return fishInfo(7)"></button>
    </div>

    <div id="playerScanNavigation" style="position:absolute; left:0vw; top:39vh; width:100vw; height:8vh">
      <button class="introButton" style="position:absolute; left:3vw; font-size: 4vw; width:auto; height:auto; margin: 0px auto;" onclick="return scanPlayers(false)" id="scanLeft">&#60;</button>
      <button class="introButton" style="position:absolute; right:3vw; font-size: 4vw; width:auto; height:auto; margin: 0px auto;" onclick="return scanPlayers(true)" id="scanRight">&#62;</button>
    </div>

    <img src="spinButton.png" style="position:absolute; left:34.625vw; top:60vh; height:3.84vw; width:30.75vw" id="spinButton"/></img>
    <button class="infoButton" style="position:absolute; left:34.625vw; top:60vh; height:3.84vw; width:30.75vw" onclick="return buttonRoll()"></button>

    <div style="overflow:hidden; position:absolute; left:18vw; top:40vh; width:64vw; height:8vw">
      <div class="slot" style="left:0vw; z-index:2" id="fishSlot">
        <ul>
          <li><img src="none.png" style="left:0vw; z-index:2" class="box" id="fish0_0"/></li>
          <li><img src="none.png" style="left:0vw; z-index:2" class="box" id="fish0_1"/></li>
          <li><img src="none.png" style="left:0vw; z-index:2" class="box" id="fish0_2"/></li>
        </ul>
        <ul>
          <li><img src="none.png" style="left:8vw; z-index:2" class="box" id="fish1_0"/></li>
          <li><img src="none.png" style="left:8vw; z-index:2" class="box" id="fish1_1"/></li>
          <li><img src="none.png" style="left:8vw; z-index:2" class="box" id="fish1_2"/></li>
        </ul>
        <ul>
          <li><img src="none.png" style="left:16vw; z-index:2" class="box" id="fish2_0"/></li>
          <li><img src="none.png" style="left:16vw; z-index:2" class="box" id="fish2_1"/></li>
          <li><img src="none.png" style="left:16vw; z-index:2" class="box" id="fish2_2"/></li>
        </ul>
        <ul>
          <li><img src="none.png" style="left:24vw; z-index:2" class="box" id="fish3_0"/></li>
          <li><img src="none.png" style="left:24vw; z-index:2" class="box" id="fish3_1"/></li>
          <li><img src="none.png" style="left:24vw; z-index:2" class="box" id="fish3_2"/></li>
        </ul>
        <ul>
          <li><img src="none.png" style="left:32vw; z-index:2" class="box" id="fish4_0"/></li>
          <li><img src="none.png" style="left:32vw; z-index:2" class="box" id="fish4_1"/></li>
          <li><img src="none.png" style="left:32vw; z-index:2" class="box" id="fish4_2"/></li>
        </ul>
        <ul>
          <li><img src="none.png" style="left:40vw; z-index:2" class="box" id="fish5_0"/></li>
          <li><img src="none.png" style="left:40vw; z-index:2" class="box" id="fish5_1"/></li>
          <li><img src="none.png" style="left:40vw; z-index:2" class="box" id="fish5_2"/></li>
        </ul>
        <ul>
          <li><img src="none.png" style="left:48vw; z-index:2" class="box" id="fish6_0"/></li>
          <li><img src="none.png" style="left:48vw; z-index:2" class="box" id="fish6_1"/></li>
          <li><img src="none.png" style="left:48vw; z-index:2" class="box" id="fish6_2"/></li>
        </ul>
        <ul>
          <li><img src="none.png" style="left:56vw; z-index:2" class="box" id="fish7_0"/></li>
          <li><img src="none.png" style="left:56vw; z-index:2" class="box" id="fish7_1"/></li>
          <li><img src="none.png" style="left:56vw; z-index:2" class="box" id="fish7_2"/></li>
        </ul>
      </div>
      <div class="slot" style="left:0vw;" id="boxSlot">
        <ul>
          <li><img src="box.png" style="left:0vw;" class="box"/></li>
          <li><img src="box.png" style="left:0vw;" class="box"/></li>
          <li><img src="box.png" style="left:0vw;" class="box"/></li>
        </ul>
        <ul>
          <li><img src="box.png" style="left:8vw;" class="box"/></li>
          <li><img src="box.png" style="left:8vw;" class="box"/></li>
          <li><img src="box.png" style="left:8vw;" class="box"/></li>
        </ul>
        <ul>
          <li><img src="box.png" style="left:16vw;" class="box"/></li>
          <li><img src="box.png" style="left:16vw;" class="box"/></li>
          <li><img src="box.png" style="left:16vw;" class="box"/></li>
        </ul>
        <ul>
          <li><img src="box.png" style="left:24vw;" class="box"/></li>
          <li><img src="box.png" style="left:24vw;" class="box"/></li>
          <li><img src="box.png" style="left:24vw;" class="box"/></li>
        </ul>
        <ul>
          <li><img src="box.png" style="left:32vw;" class="box"/></li>
          <li><img src="box.png" style="left:32vw;" class="box"/></li>
          <li><img src="box.png" style="left:32vw;" class="box"/></li>
        </ul>
        <ul>
          <li><img src="box.png" style="left:40vw;" class="box"/></li>
          <li><img src="box.png" style="left:40vw;" class="box"/></li>
          <li><img src="box.png" style="left:40vw;" class="box"/></li>
        </ul>
        <ul>
          <li><img src="box.png" style="left:48vw;" class="box"/></li>
          <li><img src="box.png" style="left:48vw;" class="box"/></li>
          <li><img src="box.png" style="left:48vw;" class="box"/></li>
        </ul>
        <ul>
          <li><img src="box.png" style="left:56vw;" class="box" /></li>
          <li><img src="box.png" style="left:56vw;" class="box"/></li>
          <li><img src="box.png" style="left:56vw;" class="box"/></li>
        </ul>
      </div>
    </div>

    <div id="cards" style="left:10vw; top:70vh; height:30vh; width:80vw; overflow:hidden; position:absolute;">
      <div class="card" id="card0" style="left:1vw;">
        <button class="infoButton" style="left:0vw; width:14vw; height:40vh" onclick="return handSelect(0)"></button>
        <p class="cardText" id="cardText0">Green Jellyfish</p>
        <img src="greenJellyfish.png" class="cardImage" id="cardImage0"></img>
      </div>
      <div class="card" id="card1" style="left:17vw">
        <button class="infoButton" style="left:0vw; width:14vw; height:40vh" onclick="return handSelect(1)"></button>
        <p class="cardText" id="cardText1">Green Jellyfish</p>
        <img src="greenJellyfish.png" class="cardImage" id="cardImage1"></img>
      </div>
      <div class="card" id="card2" style="left:33vw">
        <button class="infoButton" style="left:0vw; width:14vw; height:40vh" onclick="return handSelect(2)"></button>
        <p class="cardText" id="cardText2">Green Jellyfish</p>
        <img src="greenJellyfish.png" class="cardImage" id="cardImage2"></img>
      </div>
      <div class="card" id="card3" style="left:49vw">
        <button class="infoButton" style="left:0vw; width:14vw; height:40vh" onclick="return handSelect(3)"></button>
        <p class="cardText" id="cardText3">Green Jellyfish</p>
        <img src="greenJellyfish.png" class="cardImage" id="cardImage3"></img>
      </div>
      <div class="card" id="card4" style="left:65vw">
        <button class="infoButton" style="left:0vw; width:14vw; height:40vh" onclick="return handSelect(4)"></button>
        <p class="cardText" id="cardText4">Green Jellyfish</p>
        <img src="greenJellyfish.png" class="cardImage" id="cardImage4"></img>
      </div>
    </div>
  </div>
</body>
