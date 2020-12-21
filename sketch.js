//Create variables here
var dog, happyDog;
var dogImg, happyDogImg;
var milk, milkImg;
var database;
var foodS, foodStock;
var fedTime, lastFed;
var food;
var changeGameState, readGameState;
var gamestate;

function preload() {
	//load images here
    dogImg = loadImage("images/Dog.png");
    happyDogImg = loadImage("images/happydog.png");
    milkImg = loadImage("images/Milk.png");
    
}

function setup() {
    createCanvas(800, 800);

    dog = createSprite(400, 400, 20, 20);
    dog.addImage(dogImg);
    dog.scale = 0.25;

    database = firebase.database();
    foodStock = database.ref('food');
    foodStock.on("value", readStock);

    feed = createButton("Add the food!");
    feed.position(700, 195);
    feed.mousePressed(feedDog);

    fedTime = database.ref('FeedTime');
    fedTime.on("value", function (data) {
        lastFed = data.val();
    })
}


function draw() {
    background("red");

    readGameState = database.ref('gameState');
    readGameState.on("value", function (data) {
        gamestate = data.val();
    })

    displayFood();

    if (keyWentDown(UP_ARROW)) {
        writeStock(foodS);
        dog.addImage(happyDogImg);
    }

    drawSprites();

    //add styles here
    textSize(20);
    fill(0);
    text("Click the BUTTON GIVEN to add the food!", 300, 70);
    text("Press the up arrow to feed the dog!", 280, 120);

    if (lastFed >= 12) {
        text("FEED HIM I MEAN THAT'S HOW THE GAME WORKS: " + lastFed % 12 +  350, 30);
        update("sleeping");
       
    } else if (lastFed === 0) {
        text("FEED HIM I MEAN THAT'S HOW THE GAME WORKS", 350, 30);
        update("playing");
        
    } else {
        text("FEED HIM I MEAN THAT'S HOW THE GAME WORKS: " + lastFed +  350, 30);
        update("hungry");
        background("red");
           }
}

function readStock(data) {
    foods = data.val();
}

function writeStock(x) {
    if (x < 0) {
        x = 0;
    } else {
        x = x - 1;
    }
    database.ref('/').update({
        food: x
    })
}

function feedDog() {
    foodS++;
    database.ref('/').update({
        food: foodS
    })
}

function update(state) {
    database.ref('/').update({
        gameState: state
    })
}



function displayFood() {
    var x = 80;
    var y = 100;
    if (foodS !== 0) {
        for (var i = 0; i < foodS; i++) {
            if (i % 10 === 0) {
                x = 80;
                y = y + 50;
            }
            image(milkImg, x, y, 50, 50);
            x = x + 30;
        }
    }
}