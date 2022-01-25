var fishAvailable = ["tuna", "salmon", "starfish", "tubeCoral", "anchovy1", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none"];
var slots = [[],[],[],[],[],[],[],[]];
var cardHand = [];

var fishPerSlot = 3;

var pointCount = 0;
var pointsDuringRound = 0;
var duringRoll = false;
var handIndex = -1;
var selfIndex = 0;
var currentPlayerIndex = 0;

var singlePlayer = false;
var amountOfPlayersReady = 0;

var commonFish = ["tuna", "anchovy1", "greenJellyfish", "starfish", "crab", "roe", "kelp", "herring", "pleco", "commonCarp", "scallop", "goldfish", "mosquitofish"]; //sing: 65.3% 12 //multi: 54.7% 13
var uncommonFish = ["tubeCoral", "redJellyfish", "eel", "ayu", "seaSnail_1", "clam", "needlefish", "algae", "pufferfish", "blueJellyfish", "goldfish", "koi", "anchovy2", "bettafish", "fluke"]; //3x rarer than common, 14, 27.7% //multi: 2x rarer than common, 32%
var rareFish = ["salmon", "kingCrab", "eel", "seaUrchin", "mussel_3", "lionfish", "yellowJellyfish", "nematodes", "koi", "anchovy3", "swordfish_2", "sturgeon", "can", "bitterling"]; //15x rarer than common, 14, 5.54% //multi: 6x rarer than common, 10.6%
var veryRareFish = ["pearl", "rainbowfish", "photobacteria", "blackJellyfish_2", "voidfish", "tunacan", "underwatermine", "lionfish"]; //1.37%, 30x rarer than common, 7 //multi: 12x rarer than common, 2.66%

var singlePlayerRate = [.66, .935, .987];
var multiPlayerRate = [.555, .875, .975];

var typeFish = ["tuna", "salmon", "anchovy1", "anchovy2", "anchovy3", "anchovy4", "anchovy5", "eel", "roe", "ayu", "herring", "needlefish", "lionfish", "rainbowfish", "commonCarp", "pufferfish", "pleco", "koi", "goldfish", "bettafish", "swordfish", "sturgeon", "bitterling", "fluke", "mosquitofish"];
var typePlant = ["algae", "kelp"];
var typeAnchovy = ["anchovy1", "anchovy2", "anchovy3", "anchovy4", "anchovy5"];
var roeSpecies = ["tuna", "salmon", "anchovy1", "eel", "ayu", "herring", "needlefish", "lionfish", "rainbowfish", "commonCarp", "pufferfish", "pleco", "goldfish", "koi", "bettafish", "swordfish_2", "sturgeon", "bitterling", "fluke", "mosquitofish"];
var typeShell = ["crab", "starfish", "scallop", "clam", "kingCrab", "mussel", "seaSnail"];
var typeJellyfish = ["greenJellyfish", "redJellyfish", "blueJellyfish", "yellowJellyfish", "blackJellyfish"];
var typeNematodeFood = ["salmon", "tuna", "anchovy1", "anchovy2", "anchovy3", "anchovy4", "anchovy5"];

var hasMostStarfish = true;
var starfishCount = 0;

var commonIncrease = 0;
var uncommonIncrease = 0;
var rareIncrease = 0;

var turnNumber = 1;
var turnMax = 30;

var mosquitofishPoints = 0;
var hasSeenMosquito = false;

var randArray = [1,1,1,1,1,1,1,1];

fishDescriptions = new Map([
  ["salmon", "Salmon: Gives +3 coins."],
  ["tuna", "Tuna: Gives +2 coins."],
  ["greenJellyfish", "Green Jellyfish: Gives +1 coin. Gives an additional +2 coins for every color of Jellyfish in slot."],
  ["starfish", "Starfish: Gives +0 coins. Gives +5 if you have the most Starfish in slot out of any player."],
  ["tubeCoral", "Tube Coral: Gives +1 coin. Multiplies the coin output of nearby fish by x2."],
  ["anchovy1", "One Anchovy: Gives +1 coin. Combines with nearby Anchovy to form schools."],
  ["anchovy2", "Two Anchovies: Gives +2 coins. Combines with nearby Anchovy to form schools."],
  ["anchovy3", "Three Anchovies: Gives +3 coins. Combines with nearby Anchovy to form schools."],
  ["anchovy4", "Four Anchovies: Gives +4 coins. Combines with nearby Anchovy to form schools."],
  ["anchovy5", "Five Anchovies: Gives +5 coins. The biggest of Anchovy schools."],
  ["redJellyfish", "Red Jellyfish: Gives +1 coin. Gives an additional +2 coins for every color of Jellyfish in slot. Gives another +2 coins for every empty space next to it."],
  ["crab", "Crab: Gives +1 coin. Gives +3 more coins when there's a King Crab in slot. Eats Kelp, giving +6 coins."],
  ["kingCrab", "King Crab: Gives +3 coins. Makes Crabs give +3 more coins. Eats Kelp, giving +6 coins."],
  ["eel", "Eel: Gives -2 coins. Gives +5 coins instead when there's another Eel in slot."],
  ["roe", "Roe: Gives +0 coins. Has a 40% chance of hatching and becoming a random fish"],
  ["ayu", "Ayu: Gives +10 coins. Dies when in slot."],
  ["kelp", "Kelp: Gives +1 coin. 50% chance to create another Kelp when in slot. Eaten by Crabs and Snails. When eaten, gives +6 coins."],
  ["seaSnail", "Sea Snail: Gives +6 coins every 2 turns. Eats Kelp, giving +6 coins."],
  ["seaUrchin", "Sea Urchin: Gives -30 coins initially when added to hand. Gives +7 coins when in slot."],
  ["herring", "Herring: Gives +1.5 coins for every Herring in slot (Total rounded down)."],
  ["mussel", "Mussel: Gives +1 coin. Creates a Pearl after 4 turns in slot."],
  ["pearl", "Pearl: Gives +9 coins."],
  ["clam", "Clam: Gives +1 coin. Creates a Pearl when opened by a Needlefish or Swordfish"],
  ["needlefish", "Needlefish: Gives +1 coin. Opens Clams and Scallops when next to them, giving +4 coins."],
  ["lionfish", "Lionfish: Gives +0 coins. Gives +12 coins when there are exactly 2 Lionfish in slot. Gives -2 coins if there are more than 2 Lionfish."],
  ["algae", "Algae: Gives +3 coins. 70% chance to create another Algae when in slot. Gives -5 coins when there are more than 3 Algae in slot. Eaten by Pleco. When eaten, gives +8 coins."],
  ["pleco", "Pleco: Gives +1 coin. Eats Algae, giving +8 coins."],
  ["photobacteria", "Photobacteria: Gives +2 coins. Multiplies the coin output of all plants in slot by x3."],
  ["rainbowfish", "Rainbow Fish: Gives a coin amount equivalent to the sum of nearby symbols."],
  ["commonCarp", "Common Carp: Gives +1 coin. When in slot, better chance to find common fish in hand."],
  ["scallop", "Scallop: Gives +0 coins. Gives +16 coins when opened by a Needlefish or Swordfish."],
  ["goldfish", "Goldfish: Gives +1 coin. When in slot, better chance to find uncommon fish in hand."],
  ["pufferfish", "Pufferfish: Gives +4 coins. When next to two symbols, Pufferfish dies, destroying the symbols next to it and giving +6 coins. Also popped by Needlefish and Swordfish."],
  ["blueJellyfish", "Blue Jellyfish: Gives +2 coins for every shelled organism in slot. Gives an additional +2 coins for every color of Jellyfish in slot."],
  ["yellowJellyfish", "Yellow Jellyfish: Gives a coin amount equal to the average coin output of all symbols in slot."],
  ["blackJellyfish", "Black Jellyfish: Gives +8 coins. Dies after 3 turns in slot. Gives an additional +2 coins for every color of Jellyfish in slot."],
  ["nematodes", "Nematodes: Gives -1 coins. Kills Salmon, Tuna, and Anchovy in slot, killing the Nematodes while giving +12 coins."],
  ["koi", "Koi: Gives +2 coins. When in slot, better chance to find rare fish in hand."],
  ["voidfish", "Void Fish: Adds 16 empty slots to your deck, then disappears. Gives +16 coins."],
  ["bettafish", "Betta Fish: Gives +4 coins. When in slot, gives 2 empty slots to your deck."],
  ["swordfish", "Swordfish: Gives +2 coins. Kills nearby Tuna and Carp. Gives +2 more coins for every kill the Swordfish has done in its lifetime. Opens Clams and Scallops when next to them."],
  ["sturgeon", "Sturgeon: When in slot, makes every empty slot into Roe, then disappears."],
  ["can", "Can: Gives -5 coins. When next to Tuna, combines with the Tuna to turn into Can of Tuna."],
  ["tunacan", "Can of Tuna: Increases your amount of coins by 3% (20 coin maximum)"],
  ["bitterling", "Bitterling: Gives +2 coins. Gives +1 coin for every empty space in slot."],
  ["underwatermine", "Underwater Mine: Blows up, killing every fish in slot. Gives +4 coins for every fish killed."],
  ["fluke", "Fluke: Gives -2 coins. Has a 1/6 chance to give +30 coins."],
  ["mosquitofish", "Mosquitofish: Gives -2 coins if in slot. Gives +2 coins if no Mosquitofish are in slot."]
]);

fishNames = new Map([
  ["salmon", "Salmon"],
  ["tuna", "Tuna"],
  ["greenJellyfish", "Green Jellyfish"],
  ["starfish", "Starfish"],
  ["tubeCoral", "Tube Coral"],
  ["anchovy1", "Anchovy"],
  ["anchovy2", "Anchovies"],
  ["anchovy3", "Anchovies"],
  ["anchovy4", "Anchovies"],
  ["anchovy5", "Anchovies"],
  ["redJellyfish", "Red Jellyfish"],
  ["crab", "Crab"],
  ["kingCrab", "King Crab"],
  ["eel", "Eel"],
  ["roe", "Roe"],
  ["ayu", "Ayu"],
  ["kelp", "Kelp"],
  ["seaSnail", "Sea Snail"],
  ["seaUrchin", "Sea Urchin"],
  ["herring", "Herring"],
  ["pearl", "Pearl"],
  ["clam", "Clam"],
  ["mussel", "Mussel"],
  ["needlefish", "Needlefish"],
  ["lionfish", "Lionfish"],
  ["algae", "Algae"],
  ["pleco", "Pleco"],
  ["photobacteria", "Photobacteria"],
  ["rainbowfish", "Rainbow Fish"],
  ["commonCarp", "Common Carp"],
  ["scallop", "Scallop"],
  ["goldfish", "Goldfish"],
  ["pufferfish", "Pufferfish"],
  ["blueJellyfish", "Blue Jellyfish"],
  ["yellowJellyfish", "Yellow Jellyfish"],
  ["blackJellyfish", "Black Jellyfish"],
  ["nematodes", "Nematodes"],
  ["koi", "Koi"],
  ["voidfish", "Void Fish"],
  ["bettafish", "Betta Fish"],
  ["swordfish", "Swordfish"],
  ["sturgeon", "Sturgeon"],
  ["can", "Can"],
  ["tunacan", "Can of Tuna"],
  ["bitterling", "Bitterling"],
  ["underwatermine", "Underwater Mine"],
  ["fluke", "Fluke"],
  ["mosquitofish", "Mosquitofish"]
]);

fishDefaults = new Map([
  ["seaSnail", "seaSnail_1"],
  ["swordfish", "swordfish_2"],
  ["mussel", "mussel_3"],
  ["blackJellyfish", "blackJellyfish_2"],
]);

function createGame(){
  playerList.sort();
  shufflePlayerList();
  for(i = 0; i < playerList.length; i++){
    if(playerList[i] != username){
      activateListener(playerList[i]);
    }else{
      selfIndex = i;
      currentPlayerIndex = i;
    }
  }
  introduction();
}

function createGameSingleplayer(){
  singlePlayer = true;
  document.getElementById("playerScanNavigation").style.display = "none";
  introduction();
}

function scanPlayers(dir){ //false is left, true is right
  if(!dir){
    currentPlayerIndex--;
    if(currentPlayerIndex < 0){
      currentPlayerIndex = playerList.length - 1;
    }
  }else{
    currentPlayerIndex++;
    if(currentPlayerIndex >= playerList.length){
      currentPlayerIndex = 0;
    }
  }

  document.getElementById("nameDisplay").innerHTML = playerList[currentPlayerIndex];

  if(currentPlayerIndex != selfIndex){
    document.getElementById("nameDisplay").style.color = "white";
    for(m = 0; m < 8; m++){
      document.getElementById("point" + m).style.display = "none";
    }
    for(m = 0; m < 5; m++){
      document.getElementById("card" + m).style.webkitTransform = "translate(0vw,30vh)";
    }
    document.getElementById("spinButton").style.display = "none";
    document.getElementById("pointCounter").style.display = "none";

    roomRefr.child(playerList[currentPlayerIndex] + "/fishes").once("value").then(function(snapshot) {
      for(m = 0; m < 8; m++){
        fishes[m] = snapshot.child(m).val();
        document.getElementById("fish" + (m) + "_" + (randArray[m] - 1)).src = cleanFish(fishes[m]) + ".png";
      }
    });
  }else{
    document.getElementById("nameDisplay").style.color = "green";
    for(m = 0; m < 8; m++){
      document.getElementById("point" + m).style.display = "block";
    }
    for(m = 0; m < 5; m++){
      document.getElementById("card" + m).style.webkitTransform = "translate(0vw,0vh)";
    }
    document.getElementById("spinButton").style.display = "block";
    document.getElementById("pointCounter").style.display = "block";

    roomRefr.child(username + "/fishes").once("value").then(function(snapshot) {
      for(m = 0; m < 8; m++){
        fishes[m] = snapshot.child(m).val();
        document.getElementById("fish" + (m) + "_" + (randArray[m] - 1)).src = cleanFish(fishes[m]) + ".png";
      }
    });
  }
}

function activateListener(playerName){

  roomRefr.child(playerName + "/played").on("value", function(snapshot){
    if(snapshot.val() == "1"){
      amountOfPlayersReady++;
      if(amountOfPlayersReady == playerList.length){
        nextRound();
      }
    }
  });

  roomRefr.child(playerName + "/starfishCount").on("value", function(snapshot){
    if(snapshot.val() > 0){
      console.log(parseInt(snapshot.val()));
      if(parseInt(snapshot.val()) >= starfishCount){
        console.log(parseInt(snapshot.val()));
        hasMostStarfish = false;
      }
    }
  });
}

function introduction(){
  document.getElementById("nameDisplay").innerHTML = username;
  document.getElementById("nameDisplay").style.color = "green";
  document.getElementById("turnCounter").innerHTML = "Turn: 1/" + turnMax;
  fishes = ["tuna", "salmon", "none", "starfish", "anchovy1", "tubeCoral", "none", "none"];
  if(singlePlayer){
    commonFish.splice(commonFish.indexOf("starfish"), 1);
    fishAvailable[fishAvailable.indexOf("starfish")] = "none";
    fishes[3] = "none";
  }else{
    roomRefr.child(username + "/fishes").set(fishes);
  }
  for(i = 0; i < 8; i++){
    document.getElementById("fish" + i + "_0").src = fishes[i] + ".png";
  }
  newHand();
}

hasAudioBeenInstantiated = false;

function buttonRoll(){
  if(!duringRoll){
    amountOfPlayersReady++;
    roomRefr.child(username + "/played").set("1");

    if(hasAudioBeenInstantiated == false){
      instantiateAudio();
      hasAudioBeenInstantiated = true;
    }

    if(singlePlayer || amountOfPlayersReady == playerList.length){
      nextRound();
    }else{
      document.getElementById("scanLeft").disabled = true;
      document.getElementById("scanRight").disabled = true;
      document.getElementById("spinButton").src = "spinButtonWait.png";
      document.getElementById("spinButton").disabled = true;
    }
  }
}

function nextRound(){
  amountOfPlayersReady = 0;
  turnNumber++;
  if(turnNumber <= turnMax){
    document.getElementById("turnCounter").innerHTML = "Turn: " + turnNumber + "/" + turnMax;
  }
  roomRefr.child(username + "/played").set("0");
  document.getElementById("spinButton").src = "spinButtonWait.png";
  document.getElementById("spinButton").disabled = true;

  if(handIndex != -1){
    if(cardHand[handIndex] == "seaUrchin"){
      pointCount -= 30;
      document.getElementById("pointCounter").innerHTML = "Coins: " + pointCount;
    }
    if(cardHand[handIndex] == "mosquitofish"){
      mosquitofishPoints += 2;
    }
    addFish(cardHand[handIndex]);
    cardHand[handIndex] = "none";
    roomRefr.child(username + "/hand").set(cardHand);
  }else{
    handIndexRand = Math.floor(Math.random() * 5);
    cardHand[handIndexRand] = "none";
    roomRefr.child(username + "/hand").set(cardHand);
  }

  endOfRoll();
  roll();
}

function endOfRoll(){
  var tempArray = [...fishAvailable];
  emptyCount = 0;
  pointsDuringRound = 0;
  shuffleArray(tempArray);
  hasMostStarfish = true;
  hasSeenMosquito = false;
  starfishCount = 0;
  for(i = 0; i < 8; i++){
    document.getElementById("point" + i).style.webkitTransform = "translate(-50%,0vh)";
    document.getElementById("point" + i).style.color = "rgba(255, 221, 0, 0)";
    slots[i] = tempArray.splice(0, fishPerSlot);
    for(j = 0; j < fishPerSlot; j++){
      document.getElementById("fish" + i + "_" + j).src = cleanFish(slots[i][j]) + ".png";
    }
  }
}

function roll(){
  roomRefr.child(username + "/starfishCount").set(-1);
  slotMachineSound.play();
  handSelect(-1);
  fishInfoIndex = -1;
  newHand();
  duringRoll = true;
  randArray = randomArray();
  $('#fishSlot ul').playSpin({
    endNum: randArray,
    onFinish: function(num) {
      compute(num);
      slotMachineSound.pause();
    },
    time: 1000
  });
  $('#boxSlot ul').playSpin({
    endNum: randArray,
    time: 1000
  });
}

var fishes = [];
var emptyCount = 0;

function compute(string){
  pointTotals = [0,0,0,0,0,0,0,0];
  fishes = [];

  for(i = 0; i < 8; i++){
    fishes[i] = slots[i][string[i]-1];
  }

  //TODO: work out the roomRefr in the introcode segment
  //roomRefr.child(username + "/fishes").set(fishes.join());

  for(j = 0; j < 8; j++){
    fishAbilities(j, fishes[j], string, 1, 0);
  }

  starfishCount = countOccurrences(fishes,"starfish");

  setTimeout(() => {
    roomRefr.child(username + "/fishes").set(fishes);
    roomRefr.child(username + "/starfishCount").set(starfishCount);
    if(!hasSeenMosquito){
      pointsDuringRound += mosquitofishPoints;
      pointCount += mosquitofishPoints;
      document.getElementById("pointCounter").innerHTML = "Coins: " + pointCount + " (+" + pointsDuringRound + ")";
    }
  }, 300);

  setTimeout(() => {
    duringRoll = false;
    document.getElementById("scanLeft").disabled = false;
    document.getElementById("scanRight").disabled = false;
    document.getElementById("spinButton").src = "spinButton.png";
    document.getElementById("spinButton").disabled = false;
    roomRefr.child(username + "/fishes").set(fishes);

    if(turnNumber > turnMax){
      roomRefr.child(username + "/coins").set(pointCount);
      duringRoll = true;
      setTimeout(() => {
        gameEnd();
      }, 200);
    }
  }, 1050);
}

function fishAbilities(index, name, slotString, multiplier, addition){
  var cleanName = cleanFish(name);
  switch(cleanName){
    case "none":
      emptyCount++;
      if(emptyCount == 8){
        emptySound.currentTime = 0;
        emptySound.play();
      }
      break;
    case "tuna":
      setTimeout(() => {
        if(fishes[index] == "tuna"){
          gainPoints(index, (2 + addition) * multiplier);
        }
      }, 100);
      break;
    case "salmon":
      setTimeout(() => {
        if(fishes[index] == "salmon"){
          gainPoints(index, (3 + addition) * multiplier);
        }
      }, 100);
      break;
    case "greenJellyfish":
      //+1 for every color of jellyfish
      setTimeout(() => {
        var temp = (jellyfishCount()*2) - 1;
        gainPoints(index, (addition + temp) * multiplier);
      }, 150);
      break;
    case "starfish":
      //whoever has the most starfish get +5
      setTimeout(() => {
        if(hasMostStarfish){
          gainPoints(index, (5 + addition) * multiplier);
        }else{
          gainPoints(index, (0 + addition) * multiplier);
        }
        console.log(hasMostStarfish);
      }, 950);
      break;
    case "tubeCoral":
      //multiplies the point value of nearby fish by 2
      setTimeout(() => {
        if(index != 0 && typeFish.includes(fishes[index - 1])){
          fishAbilities(index - 1, fishes[index - 1], slotString, 2, 0);
          tubeCoralSound.currentTime = 0;
          tubeCoralSound.play();
        }
        if(index != 7 && typeFish.includes(fishes[index + 1])){
          fishAbilities(index + 1, fishes[index + 1], slotString, 2, 0);
          tubeCoralSound.currentTime = 0;
          tubeCoralSound.play();
        }
        gainPoints(index,(1+addition)* multiplier);
      }, 450);
      break;
    case "anchovy1":
      //nearby anchovy combine
      anchovy(1, slotString, multiplier, index, addition);
      break;
    case "anchovy2":
      anchovy(2, slotString, multiplier, index, addition);
      break;
    case "anchovy3":
      anchovy(3, slotString, multiplier, index, addition);
      break;
    case "anchovy4":
      anchovy(4, slotString, multiplier, index, addition);
      break;
    case "anchovy5":
      anchovy(5, slotString, multiplier, index, addition);
      break;
    case "redJellyfish":
      //+2 on empty nearby, +1 for every color of jellyfish
      setTimeout(() => {
        var temp = (jellyfishCount()*2) - 1;
        if(index != 0 && fishes[index - 1] == "none"){
          temp += 2;
        }
        if(index != 7 && fishes[index + 1] == "none"){
          temp += 2;
        }
        gainPoints(index, (temp+addition) * multiplier);
      }, 150);
      break;
    case "crab":
      setTimeout(() => {
        var temp = 1;
        if(fishes.includes("kingCrab")){
          temp = 4;
        }

        if(index != 0 && fishes[index - 1] == "kelp"){
          document.getElementById("fish" + (index-1) + "_" + (slotString[index-1] - 1)).src = "none.png";
          removeFish("kelp");
          fishes[index-1] = "none";
          temp += 6;
          chompSound.currentTime = 0;
          chompSound.play();
        }
        if(index != 7 && fishes[index + 1] == "kelp"){
          document.getElementById("fish" + (index+1) + "_" + (slotString[index+1] - 1)).src = "none.png";
          removeFish("kelp");
          fishes[index+1] = "none";
          temp += 6;
          chompSound.currentTime = 0;
          chompSound.play();
        }
        gainPoints(index, (temp+addition) * multiplier);
      }, 150);
      break;
    case "kingCrab":
      var temp = 3;
      if(index != 0 && fishes[index - 1] == "kelp"){
        document.getElementById("fish" + (index-1) + "_" + (slotString[index-1] - 1)).src = "none.png";
        removeFish("kelp");
        fishes[index-1] = "none";
        temp += 6;
        chompSound.currentTime = 0;
        chompSound.play();
      }
      if(index != 7 && fishes[index + 1] == "kelp"){
        document.getElementById("fish" + (index+1) + "_" + (slotString[index+1] - 1)).src = "none.png";
        removeFish("kelp");
        fishes[index+1] = "none";
        temp += 6;
        chompSound.currentTime = 0;
        chompSound.play();
      }
      gainPoints(index, (temp+addition) * multiplier);
      break;
    case "eel":
      setTimeout(() => {
        var count = 0;
        for(v = 0; v < 8; v++){
          if(fishes[v] == "eel"){
            count++;
          }
        }
        if(count >= 2){
          gainPoints(index, (5+addition) * multiplier);
        }else{
          gainPoints(index, -2+addition);
        }
      }, 150)
      break;
    case "roe":
      setTimeout(() => {
        if(Math.random() < .40){
          roeSound.currentTime = 0;
          roeSound.play();
          fishes[index] = roeSpecies[Math.floor(Math.random()*roeSpecies.length)];
          document.getElementById("fish" + (index) + "_" + (slotString[index] - 1)).src = cleanFish(fishes[index]) + ".png";
          ind = fishAvailable.indexOf("roe");
          fishAvailable[ind] = fishes[index];
          fishAbilities(index, fishes[index], slotString, multiplier, 0);
        }else{
          gainPoints(index, (0+addition)*multiplier);
        }
      }, 75);
      break;
    case "ayu":
      setTimeout(() => {
        document.getElementById("fish" + (index) + "_" + (slotString[index] - 1)).src = "none.png";
        removeFish("ayu");
        gainPoints(index, (10+addition)*multiplier);
      }, 450)
      break;
    case "kelp":
      setTimeout(() => {
        if(fishes[index] == "kelp"){
          if(Math.random() < 0.5){
            temp = fishes.indexOf("none");
            if(temp != -1){
              fishes[temp] = "kelp";
              addFish("kelp");
              document.getElementById("fish" + (temp) + "_" + (slotString[temp] - 1)).src = "kelp.png";
              kelpSound.currentTime = 0;
              kelpSound.play();
            }
          }
          gainPoints(index, (1+addition)*multiplier);
        }
      }, 200)
      break;
    case "seaSnail":
      var temp = name.substring(9);
      var ind = fishAvailable.indexOf(name);
      var coinAmount = 0;
      if(index != 0 && fishes[index - 1] == "kelp"){
        document.getElementById("fish" + (index-1) + "_" + (slotString[index-1] - 1)).src = "none.png";
        removeFish("kelp");
        fishes[index-1] = "none";
        coinAmount += 6;
        chompSound.currentTime = 0;
        chompSound.play();
      }
      if(index != 7 && fishes[index + 1] == "kelp"){
        document.getElementById("fish" + (index+1) + "_" + (slotString[index+1] - 1)).src = "none.png";
        removeFish("kelp");
        fishes[index+1] = "none";
        coinAmount += 6;
        chompSound.currentTime = 0;
        chompSound.play();
      }
      if(temp == 0){
        coinAmount += 6;
        fishes[index] = "seaSnail_1";
      }else{
        fishes[index] = "seaSnail_0";
      }
      fishAvailable[ind] = fishes[index];
      gainPoints(index, (coinAmount+addition)*multiplier);
      break;
    case "seaUrchin":
      gainPoints(index, (7 + addition) * multiplier);
      break;
    case "herring":
      setTimeout(() => {
        var count = 0;
        for(v = 0; v < 8; v++){
          if(fishes[v] == "herring"){
            count++;
          }
        }
        count = Math.floor(count * 1.5);
        gainPoints(index, (count+addition) * multiplier);
      }, 150)
      break;
    case "mussel":
      var tempCount = name.substring(7);
      var ind = fishAvailable.indexOf(name);
      if(tempCount == 0){
        addFish("pearl");
        temp = fishes.indexOf("none");
        fishes[index] = "mussel_3";
        if(temp != -1){
          fishes[temp] = "pearl";
          document.getElementById("fish" + (temp) + "_" + (slotString[temp] - 1)).src = "pearl.png";
        }
        pearlSound.currentTime = 0;
        pearlSound.play();
      }else{
        var tempNum = parseInt(tempCount);
        tempNum = tempNum - 1;
        fishes[index] = "mussel_" + (tempNum);
      }
      fishAvailable[ind] = fishes[index];
      gainPoints(index, (1+addition)*multiplier);
      break;
    case "pearl":
      gainPoints(index, (9+addition)*multiplier);
      break;
    case "clam":
      gainPoints(index, (1+addition)*multiplier);
      break;
    case "needlefish":
    setTimeout(() => {
      var temp = 1;
      if(index != 0 && (fishes[index - 1] == "clam" || fishes[index - 1] == "scallop")){
        temp = 4;
        unlockSound.currentTime = 0;
        unlockSound.play();
        if(fishes[index - 1] == "clam"){
          document.getElementById("fish" + (index-1) + "_" + (slotString[index-1] - 1)).src = "pearl.png";
          fishes[index-1] = "pearl";
          addFish("pearl");
          removeFish("clam");
        }else{
          document.getElementById("fish" + (index-1) + "_" + (slotString[index-1] - 1)).src = "none.png";
          fishes[index-1] = "none";
          gainPoints(index-1, 16);
          removeFish("scallop");
        }
      }
      if(index != 7 && (fishes[index + 1] == "clam" || fishes[index + 1] == "scallop")){
        temp = 4;
        unlockSound.currentTime = 0;
        unlockSound.play();
        if(fishes[index + 1] == "clam"){
          document.getElementById("fish" + (index+1) + "_" + (slotString[index+1] - 1)).src = "pearl.png";
          fishes[index+1] = "pearl";
          addFish("pearl");
          removeFish("clam");
        }else{
          document.getElementById("fish" + (index+1) + "_" + (slotString[index+1] - 1)).src = "none.png";
          fishes[index+1] = "none";
          gainPoints(index+1, 16);
          removeFish("scallop");
        }
      }
      gainPoints(index, (temp+addition)*multiplier);
    }, 150);
      break;
    case "lionfish":
      setTimeout(() => {
        var count = 0;
        for(v = 0; v < 8; v++){
          if(fishes[v] == "lionfish"){
            count++;
          }
        }

        if(count == 2){
          gainPoints(index, (12+addition) * multiplier);
        }else if(count == 1){
          gainPoints(index, (0+addition) * multiplier);
        }else{
          gainPoints(index, (-2+addition));
        }
      }, 150);
      break;
    case "algae":
      setTimeout(() => {
        if(fishes[index] == "algae"){
          if(Math.random() < 0.7){
            temp = fishes.indexOf("none");
            if(temp != -1){
              fishes[temp] = "algae";
              addFish("algae");
              document.getElementById("fish" + (temp) + "_" + (slotString[temp] - 1)).src = "algae.png";
              kelpSound.currentTime = 0;
              kelpSound.play();
            }
          }

          var count = 0;
          for(v = 0; v < 8; v++){
            if(fishes[v] == "algae"){
              count++;
            }
          }

          if(count > 3){
            gainPoints(index, (-5+addition));
          }else{
            gainPoints(index, (3+addition) * multiplier);
          }
        }
      }, 200);
      break;
    case "pleco":
      setTimeout(() => {
        var temp = 1;
        if(index != 0 && fishes[index - 1] == "algae"){
          document.getElementById("fish" + (index-1) + "_" + (slotString[index-1] - 1)).src = "none.png";
          removeFish("algae");
          fishes[index-1] = "none";
          temp += 8;
          chompSound.currentTime = 0;
          chompSound.play();
        }
        if(index != 7 && fishes[index + 1] == "algae"){
          document.getElementById("fish" + (index+1) + "_" + (slotString[index+1] - 1)).src = "none.png";
          removeFish("algae");
          fishes[index+1] = "none";
          temp += 8;
          chompSound.currentTime = 0;
          chompSound.play();
        }
        gainPoints(index, (temp+addition) * multiplier);
      }, 150);
      break;
    case "photobacteria":
      setTimeout(() => {
        for(l = 0; l < 8; l++){
          if(typePlant.includes(fishes[l])){
            fishAbilities(l, fishes[l], slotString, 3, 0);
          }
        }
        photoSound.currentTime = 0;
        photoSound.play();
        gainPoints(index,(2+addition)* multiplier);
      }, 450);
      break;
    case "rainbowfish":
      setTimeout(() => {
        var temp = 0;
        if(index != 0){
          temp += pointTotals[index-1];
        }
        if(index != 7){
          temp += pointTotals[index+1];
        }
        gainPoints(index,(temp+addition)* multiplier);
      }, 1000);
      break;
    case "commonCarp":
      setTimeout(() => {
        if(fishes[index] == "commonCarp"){
          commonIncrease += 0.2;
          gainPoints(index,(1+addition)* multiplier);
        }
      }, 100);
      break;
    case "scallop":
      gainPoints(index, (0+addition)*multiplier);
      break;
    case "goldfish":
      uncommonIncrease += 0.2;
      gainPoints(index, (1+addition)*multiplier);
      break;
    case "pufferfish":
      if(index != 0 && index != 7 && fishes[index + 1] != "none" && fishes[index - 1] != "none"){
        document.getElementById("fish" + (index-1) + "_" + (slotString[index-1] - 1)).src = "none.png";
        removeFish(fishes[index - 1]);
        fishes[index-1] = "none";
        document.getElementById("fish" + (index+1) + "_" + (slotString[index+1] - 1)).src = "none.png";
        removeFish(fishes[index + 1]);
        fishes[index+1] = "none";
        document.getElementById("fish" + (index) + "_" + (slotString[index] - 1)).src = "none.png";
        removeFish(fishes[index]);
        fishes[index] = "none";
        gainPoints(index, (6+addition)*multiplier);
        pufferSound.currentTime = 0;
        pufferSound.play();
      }else if(fishes[index + 1] == "needlefish" || fishes[index + 1] == "swordfish" || fishes[index - 1] == "needlefish" || fishes[index + 1] == "swordfish"){
        if(index != 0){
          document.getElementById("fish" + (index-1) + "_" + (slotString[index-1] - 1)).src = "none.png";
          removeFish(fishes[index - 1]);
          fishes[index-1] = "none";
        }
        if(index != 7){
          document.getElementById("fish" + (index+1) + "_" + (slotString[index+1] - 1)).src = "none.png";
          removeFish(fishes[index + 1]);
          fishes[index+1] = "none";
        }
        document.getElementById("fish" + (index) + "_" + (slotString[index] - 1)).src = "none.png";
        removeFish(fishes[index]);
        fishes[index] = "none";
        gainPoints(index, (6+addition)*multiplier);
        pufferSound.currentTime = 0;
        pufferSound.play();
      }else{
        gainPoints(index, (4+addition)*multiplier);
      }
      break;
    case "blueJellyfish":
      setTimeout(() => {
        var temp = (jellyfishCount()-1)*2;
        for(l = 0; l < 8; l++){
          if(typeShell.includes(fishes[l])){
            temp+=2;
          }
        }
        gainPoints(index, (temp+addition)*multiplier);
      }, 150);
      break;
    case "yellowJellyfish":
      setTimeout(() => {
        var tempCount = 0;
        for(l = 0; l < 8; l++){
          tempCount += pointTotals[l];
        }
        tempCount = Math.ceil(tempCount/7);
        tempCount += (jellyfishCount()-1)*2;
        gainPoints(index, (tempCount+addition)*multiplier);
      }, 980);
      break;
    case "blackJellyfish":
      setTimeout(() => {
        var temp = name.substring(15);
        var ind = fishAvailable.indexOf(name);
        if(temp == 0){
          document.getElementById("fish" + (index) + "_" + (slotString[index] - 1)).src = "none.png";
          removeFish(fishes[index]);
          fishes[index] = "none";
        }else{
          var tempNum = parseInt(temp);
          tempNum = tempNum - 1;
          fishes[index] = "blackJellyfish_" + (tempNum);
          fishAvailable[ind] = fishes[index];
        }
        coinAmount = (jellyfishCount()-1)*2 + 8;
        gainPoints(index, (coinAmount+addition)*multiplier);
      }, 150);
      break;
    case "nematodes":
      var temp = 0;
      for(i = 0; i < 8; i++){
        if(typeNematodeFood.indexOf(fishes[i]) != -1){
          if(typeAnchovy.indexOf(fishes[i]) != -1){
            temp += parseInt(fishes[i][7])*12;
          }else{
            temp += 12;
          }
          document.getElementById("fish" + (i) + "_" + (slotString[i] - 1)).src = "none.png";
          removeFish(fishes[i]);
          fishes[i] = "none";
          document.getElementById("fish" + (index) + "_" + (slotString[index] - 1)).src = "none.png";
          removeFish(fishes[index]);
          fishes[index] = "none";
          chompSound.currentTime = 0;
          chompSound.play();
          break;
        }
      }
      if(temp == 0){
        temp = -1;
      }
      gainPoints(index, (temp+addition)*multiplier);
      break;
    case "koi":
      rareIncrease += 0.15;
      gainPoints(index, (2+addition)*multiplier);
      break;
    case "voidfish":
      setTimeout(() => {
        for(f = 0; f < 16; f++){
          fishAvailable.push("none");
        }
        voidSound.currentTime = 0;
        voidSound.play();
        document.getElementById("fish" + (index) + "_" + (slotString[index] - 1)).src = "none.png";
        removeFish(fishes[index]);
        fishes[index] = "none";
        gainPoints(index, 16);
      }, 100);
      break;
    case "bettafish":
      gainPoints(index, (4+addition)*multiplier);
      fishAvailable.push("none");
      fishAvailable.push("none");
      bubbleSound.currentTime = 0;
      bubbleSound.play();
      break;
    case "swordfish":
      var temp = parseInt(name.substring(10));
      console.log(temp);

      if(index != 0 && (fishes[index-1] == "commonCarp" || fishes[index-1] == "tuna")){
        document.getElementById("fish" + (index-1) + "_" + (slotString[index-1] - 1)).src = "none.png";
        removeFish(fishes[index-1]);
        fishes[index-1] = "none";
        chompSound.currentTime = 0;
        chompSound.play();
        temp += 2;
      }
      if(index != 7 && (fishes[index+1] == "commonCarp" || fishes[index+1] == "tuna")){
        document.getElementById("fish" + (index+1) + "_" + (slotString[index+1] - 1)).src = "none.png";
        removeFish(fishes[index+1]);
        fishes[index+1] = "none";
        chompSound.currentTime = 0;
        chompSound.play();
        temp += 2;
      }
      if(index != 0 && (fishes[index - 1] == "clam" || fishes[index - 1] == "scallop")){
        unlockSound.currentTime = 0;
        unlockSound.play();
        if(fishes[index - 1] == "clam"){
          document.getElementById("fish" + (index-1) + "_" + (slotString[index-1] - 1)).src = "pearl.png";
          fishes[index-1] = "pearl";
          addFish("pearl");
          removeFish("clam");
        }else{
          document.getElementById("fish" + (index-1) + "_" + (slotString[index-1] - 1)).src = "none.png";
          fishes[index-1] = "none";
          gainPoints(index-1, 16);
          removeFish("scallop");
        }
      }
      if(index != 7 && (fishes[index + 1] == "clam" || fishes[index + 1] == "scallop")){
        unlockSound.currentTime = 0;
        unlockSound.play();
        if(fishes[index + 1] == "clam"){
          document.getElementById("fish" + (index+1) + "_" + (slotString[index+1] - 1)).src = "pearl.png";
          fishes[index+1] = "pearl";
          addFish("pearl");
          removeFish("clam");
        }else{
          document.getElementById("fish" + (index+1) + "_" + (slotString[index+1] - 1)).src = "none.png";
          fishes[index+1] = "none";
          gainPoints(index+1, 16);
          removeFish("scallop");
        }
      }
      var ind = fishAvailable.indexOf(name);
      fishes[index] = "swordfish_" + (temp);
      fishAvailable[ind] = fishes[index];
      gainPoints(index, (temp+addition)*multiplier);
      break;
    case "sturgeon":
      setTimeout(() => {
        for(f = 0; f < 8; f++){
          if(fishes[f] == "none"){
            fishes[f] = "roe";
            document.getElementById("fish" + (f) + "_" + (slotString[f] - 1)).src = "roe.png";
            addFish("roe");
          }
        }
        document.getElementById("fish" + (index) + "_" + (slotString[index] - 1)).src = "roe.png";
        removeFish(fishes[index]);
        addFish("roe")
        fishes[index] = "roe";
      }, 250);
      break;
    case "can":
      if(index != 0 && fishes[index-1] == "tuna"){
        removeFish("can");
        removeFish("tuna");
        addFish("tunacan");
        document.getElementById("fish" + (index-1) + "_" + (slotString[index-1] - 1)).src = "none.png";
        document.getElementById("fish" + (index) + "_" + (slotString[index] - 1)).src = "tunacan.png";
        gainPoints(index, Math.min(Math.ceil(0.03*pointCount), 20));
      }else if(index != 7 && fishes[index+1] == "tuna"){
        removeFish("can");
        removeFish("tuna");
        addFish("tunacan");
        document.getElementById("fish" + (index+1) + "_" + (slotString[index+1] - 1)).src = "none.png";
        document.getElementById("fish" + (index) + "_" + (slotString[index] - 1)).src = "tunacan.png";
        gainPoints(index, Math.min(Math.ceil(0.03*pointCount), 20));
      }else{
        gainPoints(index, -5);
      }
      break;
    case "tunacan":
      gainPoints(index, Math.min(Math.ceil(0.03*pointCount), 20));
      break;
    case "bitterling":
      setTimeout(() => {
        temp = 2;
        for(f = 0; f < 8; f++){
          if(fishes[f] == "none"){
            temp++;
          }
        }
        gainPoints(index, (temp+addition)*multiplier)
      }, 400);
      break;
    case "underwatermine":
      setTimeout(() => {
        temp = -4;
        for(f = 0; f < 8; f++){
          if(fishes[f] != "none"){
            document.getElementById("fish" + (f) + "_" + (slotString[f] - 1)).src = "none.png";
            removeFish(fishes[f]);
            fishes[f] = "none";
            temp += 4;
          }
        }
        explosionSound.currentTime = 0;
        explosionSound.play();
        gainPoints(index, temp);
      }, 975);
      break;
    case "fluke":
      setTimeout(() => {
        if(Math.random() < .166){
          gainPoints(index, (30+addition)*multiplier);
        }else{
          gainPoints(index, -2);
        }
      }, 125);
      break;
    case "mosquitofish":
      setTimeout(() => {
        hasSeenMosquito = true;
        gainPoints(index, -2);
      }, 125);
      break;
  }
}

function anchovy(points, slotString, multiplier, index, addition){
  removeFish("anchovy" + points);
  var temp = points;
  var indexOffset = 1;
  while(index + indexOffset < 8 && typeAnchovy.includes(fishes[index + indexOffset])){
    anchovySound.currentTime = 0;
    anchovySound.play();
    temp += parseInt(fishes[index + indexOffset][7]);
    document.getElementById("fish" + (index + indexOffset) + "_" + (slotString[index + indexOffset] - 1)).src = "none.png";
    removeFish(fishes[index+indexOffset]);
    fishes[index + indexOffset] = "none";
    indexOffset++;
  }
  var indexOffset2 = 0;
  var pointsAdded = points;
  while(temp > 0 && index+indexOffset2 < 8){
    var temp2 = temp % 5;
    if(temp2 == 0){
      temp2 = 5;
    }
    document.getElementById("fish" + (index + indexOffset2) + "_" + (slotString[index + indexOffset2] - 1)).src = "anchovy" + (temp2) + ".png";
    fishes[index + indexOffset2] = "anchovy" + (temp2);
    if(indexOffset2 == 0){
      pointsAdded = temp2;
      gainPoints(index, (pointsAdded+addition) * multiplier);
    }else{
      gainPoints(index + indexOffset2, (temp2+addition) * multiplier)
    }
    temp -= 5;
    indexOffset2++;
    addFish("anchovy" + temp2);
  }
}

function jellyfishCount(){
  var jellyArray = [false, false, false, false, false];
  for(j = 0; j < 8; j++){
    if(typeJellyfish.indexOf(cleanFish(fishes[j])) != -1){
      jellyArray[typeJellyfish.indexOf(cleanFish(fishes[j]))] = true;
    }
  }
  var ret = 0;
  for(m = 0; m < jellyArray.length; m++){
    if(jellyArray[m]){
      ret++;
    }
  }
  return ret;
}

var pointTotals = [];

function gainPoints(index, points){
  pointsDuringRound -= pointTotals[index];
  pointsDuringRound += points;
  pointCount -= pointTotals[index];
  pointCount += points;
  pointTotals[index] = points;
  coinSound.currentTime = 0;
  coinSound.play();
  document.getElementById("point" + index).style.webkitTransform = "translate(-50%,-5vh)";
  if(points >= 0){
    document.getElementById("point" + index).innerHTML = "+" + points;
  }else{
    document.getElementById("point" + index).innerHTML = points;
  }

  document.getElementById("point" + index).style.color = "rgba(255, 221, 0, 1)";
  document.getElementById("pointCounter").innerHTML = "Coins: " + pointCount + " (+" + pointsDuringRound + ")";
}

var fishInfoIndex = -1;

function fishInfo(buttonIndex){
  if(!duringRoll){
    if(fishInfoIndex == buttonIndex){
      fishInfoIndex = -1;
      document.getElementById("infoText").innerHTML = "";
      document.getElementById("rarityText").innerHTML = "";
      document.getElementById("infoFish").src = "transparent.png";
      document.getElementById("infoBox").src = "transparent.png";
    }else if(buttonIndex > 7){
      fishInfoIndex = buttonIndex;
      fishName = cleanFish(cardHand[buttonIndex - 8]);
      document.getElementById("infoText").innerHTML = fishDescriptions.get(fishName);
      document.getElementById("rarityText").innerHTML = getRarity(fishName);
      document.getElementById("infoFish").src = fishName + ".png";
      document.getElementById("infoBox").src = "box.png";
    }else{
      handSelect(-1);
      fishInfoIndex = buttonIndex;
      fishName = cleanFish(fishes[buttonIndex]);
      if(fishName == "none"){
        document.getElementById("infoText").innerHTML = "";
        document.getElementById("rarityText").innerHTML = "";
        document.getElementById("infoFish").src = "transparent.png";
        document.getElementById("infoBox").src = "transparent.png";
      }else{
        document.getElementById("infoText").innerHTML = fishDescriptions.get(fishName);
        document.getElementById("rarityText").innerHTML = getRarity(fishName);
        document.getElementById("infoFish").src = fishName + ".png";
        document.getElementById("infoBox").src = "box.png";
      }
    }
  }
}

function cleanFish(fishName){
  var temp = fishName;
  if(fishName.indexOf("_") != -1){
    temp = fishName.substring(0, fishName.indexOf("_"));
  }
  return temp;
}

function addFish(fishName){
  if(fishAvailable.indexOf("none") != -1){
    var noneIndex = fishAvailable.indexOf("none");
    fishAvailable[noneIndex] = fishName;
  }else{
    fishAvailable.push(fishName);
  }
}

function removeFish(fishName){
  var fishIndex = fishAvailable.indexOf(fishName);
  if(fishIndex >= 0){
    if(fishName == "mosquitofish"){
      mosquitofishPoints -= 2;
    }
    fishAvailable.splice(fishIndex, 1);
    if(fishAvailable.length < 24){
      fishAvailable.push("none");
    }
  }
}

function getRarity(fishName){
  if(fishDefaults.has(cleanFish(fishName))){
    fishName = fishDefaults.get(cleanFish(fishName));
  }
  ret = "[Unnatural]";
  if(commonFish.includes(fishName)){
    ret = "[Common]";
  }else if(uncommonFish.includes(fishName)){
    ret = "[Uncommon]";
  }else if(rareFish.includes(fishName)){
    ret = "[Rare]";
  }else if(veryRareFish.includes(fishName)){
    ret = "[Very Rare]";
  }
  return ret;
}

function newHand(){
  for(k = 0; k < 5; k++){
    document.getElementById("card" + k).style.webkitTransform = "translate(0vw,30vh)";
  }
  setTimeout(() => {
    if(singlePlayer){
      setHand();
    }else{
      setHandMultiplayer();
    }

    for(k = 0; k < 5; k++){
      document.getElementById("card" + k).style.webkitTransform = "translate(0vw,0vh)";
    }
  }, 200);
}

function setHand(){
  for(i = 0; i < 5; i++){
    setCard(i);
  }
  commonIncrease = 0;
  uncommonIncrease = 0;
  rareIncrease = 0;
}

function setHandMultiplayer(){
  var nextPlayer = selfIndex + 1;
  if(selfIndex == playerList.length - 1){
    nextPlayer = 0;
  }

  roomRefr.child(playerList[nextPlayer] + "/hand").once("value").then(function(snapshot) {
    if(!snapshot.exists()){
      setHand();
    }else{
      for(m = 0; m < 5; m++){
        fishInHand = snapshot.child(m).val();
        if(fishInHand != "none"){
          cardHand[m] = fishInHand;
          document.getElementById("cardImage" + m).src = cleanFish(fishInHand) + ".png";
          document.getElementById("cardText" + m).innerHTML = fishNames.get(cleanFish(fishInHand));
        }else{
          setCard(m);
        }
      }
    }
  });

  commonIncrease = 0;
  uncommonIncrease = 0;
  rareIncrease = 0;
}

function setCard(cardIndex){
  var randomNum = Math.random();

  var instantCommon = false;
  var instantUncommon = false;
  var instantRare = false;
  if(Math.random() < rareIncrease){
    instantRare = true;
    randomNum = 1;
  }else if(Math.random() < uncommonIncrease){
    instantUncommon = true;
    randomNum = 1;
  }else if(Math.random() < commonIncrease){
    instantCommon = true;
  }

  rates = multiPlayerRate;
  if(singlePlayer){
    rates = singlePlayerRate;
  }

  if(randomNum < rates[0] || instantCommon){ //common
    var randomNum2 = Math.floor(Math.random() * commonFish.length);
    cardHand[cardIndex] = commonFish[randomNum2];
    document.getElementById("cardImage" + cardIndex).src = cleanFish(commonFish[randomNum2]) + ".png";
    document.getElementById("cardText" + cardIndex).innerHTML = fishNames.get(cleanFish(commonFish[randomNum2]));
  }else if(randomNum < rates[1] || instantUncommon){ //uncommon
    var randomNum2 = Math.floor(Math.random() * uncommonFish.length);
    cardHand[cardIndex] = uncommonFish[randomNum2];
    document.getElementById("cardImage" + cardIndex).src = cleanFish(uncommonFish[randomNum2]) + ".png";
    document.getElementById("cardText" + cardIndex).innerHTML = fishNames.get(cleanFish(uncommonFish[randomNum2]));
  }else if(randomNum < rates[2] || instantRare){ //rare
    var randomNum2 = Math.floor(Math.random() * rareFish.length);
    cardHand[cardIndex] = rareFish[randomNum2];
    document.getElementById("cardImage" + cardIndex).src = cleanFish(rareFish[randomNum2]) + ".png";
    document.getElementById("cardText" + cardIndex).innerHTML = fishNames.get(cleanFish(rareFish[randomNum2]));
  }else{ //very rare
    var randomNum2 = Math.floor(Math.random() * veryRareFish.length);
    cardHand[cardIndex] = veryRareFish[randomNum2];
    document.getElementById("cardImage" + cardIndex).src = cleanFish(veryRareFish[randomNum2]) + ".png";
    document.getElementById("cardText" + cardIndex).innerHTML = fishNames.get(cleanFish(veryRareFish[randomNum2]));
  }
}

function handSelect(ind){
  if(!duringRoll){
    if(ind == -1){
      if(handIndex != -1){
        fishInfo(handIndex + 8);
        document.getElementById("card" + handIndex).style.webkitTransform = "translate(0vw,0vh)";
      }
      handIndex = -1;
    }else if(handIndex == ind){
      handIndex = -1;
      document.getElementById("card" + ind).style.webkitTransform = "translate(0vw,0vh)";
      fishInfo(ind + 8);
    }else{
      if(handIndex != -1){
        document.getElementById("card" + handIndex).style.webkitTransform = "translate(0vw,0vh)";
      }
      handIndex = ind;
      document.getElementById("card" + ind).style.webkitTransform = "translate(0vw,-4vh)";
      fishInfo(ind + 8);
    }
  }
}

function gameEnd(){
  document.getElementById("leaderboard").style.display = "block";

  document.getElementById("turnCounter").innerHTML = "Turn: " + turnMax + "/" + turnMax;

  if(!singlePlayer){
    scores = [];
    roomRefr.once("value").then(function(snapshot) {
      for(j = 0; j < playerList.length; j++){
        scores.push([playerList[j], snapshot.child(playerList[j] + "/coins").val()]);
      }

      scores.sort(function(a,b){
        return b[1] - a[1];
      });

      for(j = 0; j < scores.length; j++){
        document.getElementById("leaderboardText").innerHTML += scores[j][0] + " (" + scores[j][1] + " coins):  " + generateCardinal(j+1) + "<br>";
      }
    });
  }else{
    document.getElementById("leaderboardText").innerHTML = username + ": " + pointCount + " coins";
    firebase.database().ref("stats").once("value").then(function(snapshot) {
      mn = parseInt(snapshot.child(turnMax + "mean").val());
      ct = parseInt(snapshot.child(turnMax + "count").val());
      st = parseInt(snapshot.child(turnMax + "std").val());
      percentile = calculatePercentile(mn, st, pointCount);
      writeStats(mn, st, ct, pointCount);
      document.getElementById("percentileText").innerHTML = "Better than " + (percentile*100).toFixed(2) + "% of people!";

      if(pointCount > turnMax * 15){
        document.getElementById("percentileText").innerHTML += "<br> VIGENERE KEY: SWORDFISH"
      }
    });
  }
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function shufflePlayerList() {
    for (var i = playerList.length - 1; i > 0; i--) {
        var j = Math.floor(randomGen.quick() * (i + 1));
        var temp = playerList[i];
        playerList[i] = playerList[j];
        playerList[j] = temp;
    }
}

function randomArray(){
  var ret = [Math.ceil(Math.random()*fishPerSlot),Math.ceil(Math.random()*fishPerSlot),Math.ceil(Math.random()*fishPerSlot),Math.ceil(Math.random()*fishPerSlot),Math.ceil(Math.random()*fishPerSlot),Math.ceil(Math.random()*fishPerSlot),Math.ceil(Math.random()*fishPerSlot),Math.ceil(Math.random()*fishPerSlot)];
  return ret;
}

function generateCardinal(x){
  r = Math.floor(x);
  if(r % 10 == 1){
    return x.toString() + "st";
  }
  if(r % 10 == 2){
    return x.toString() + "nd";
  }
  if(r % 10 == 3){
    return x.toString() + "rd";
  }
  return x.toString() + "th";
}

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

function calculatePercentile(mean, std, x){
  z = (x - mean)/std;

  if (z < -6.5) {
    return 0.0;
  }

  if (z > 6.5) {
    return 1.0;
  }

  var factK = 1;
  var sum = 0;
  var term = 1;
  var k = 0;
  var loopStop = Math.exp(-23);

  while(Math.abs(term) > loopStop) {
    term = .3989422804 * Math.pow(-1,k) * Math.pow(z,k) / (2 * k + 1) / Math.pow(2,k) * Math.pow(z,k+1) / factK;
    sum += term;
    k++;
    factK *= k;
  }

  sum += 0.5;

  return sum;
}

function writeStats(mean, std, n, x){
  newN = n + 1;
  a = 1/newN;
  b = 1 - a;
  newMean = a * x + b * mean;
  firebase.database().ref("stats/" + turnMax + "mean").set(newMean);
  firebase.database().ref("stats/" + turnMax + "count").set(newN);
  newVariance = (n-1)/n * (std*std) + (1/n)*(x - newN)*(x - mean);
  newStd = Math.sqrt(newVariance);
  firebase.database().ref("stats/" + turnMax + "std").set(newStd);
}

function instantiateAudio(){
  for(a = 0; a < audios.length; a++){
    audios[a].play();
    audios[a].src = audioFileNames[a];
  }
}

var slotMachineSound = new Audio('slotMachine.mp3');
var coinSound = new Audio();
var anchovySound = new Audio();
var tubeCoralSound = new Audio();
var kelpSound = new Audio();
var chompSound = new Audio();
var emptySound = new Audio();
var pearlSound = new Audio();
var photoSound = new Audio();
var pufferSound = new Audio();
var unlockSound = new Audio();
var roeSound = new Audio();
var voidSound = new Audio();
var explosionSound = new Audio();
var bubbleSound = new Audio();

var audios = [coinSound,anchovySound,tubeCoralSound,kelpSound,chompSound,emptySound,pearlSound,photoSound,pufferSound,unlockSound,roeSound,voidSound,explosionSound,bubbleSound];
var audioFileNames = ['coin.wav', 'anchovy.wav', 'tubeCoral.wav', 'kelp.wav', 'chomp.wav', 'empty.wav', 'pearl.wav', 'photobacteria.wav', 'puffer.wav', 'unlock.wav', 'roe.wav', 'void.wav', 'explosion.wav', 'bubble.wav'];


slotMachineSound.addEventListener('ended', function() {
  this.currentTime = 0;
  this.play();
}, false);
