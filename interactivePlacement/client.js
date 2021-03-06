// width and height of single map panel image
var MAPPANELWIDTH = 4096;
var MAPPANELHEIGHT = 4096;
// scale factor for game world
var SCALEFACTOR = 1.25;
var PLACEDOBJECTSCALEFACTOR = 0.5;
// width and height of game world
//	depend on map panel dimensions and scale factor
var WORLDWIDTH = MAPPANELWIDTH * 2 * SCALEFACTOR;
var WORLDHEIGHT = MAPPANELHEIGHT * 2 * SCALEFACTOR;
// height of interactive placement program's window
var WINDOWHEIGHT = 900;

// scroll and zoom speed of camera
var CAMERASCROLLSPEED = 10;
var CAMERAZOOMSPEED = 0.2;

// create Phaser game instance
var game = new Phaser.Game(WINDOWHEIGHT * (WORLDWIDTH / WORLDHEIGHT), WINDOWHEIGHT, Phaser.AUTO, '', { preload: preload, create: create, update: update});
// graphics object that will be used for drawing on the screen
var graphics;
var LINEWIDTH = 2;

var socket;

// arrays of objects that will be placed throughout the world
var obstacles = [];
var boundaries = [];
var powerUps = [];

// variables used for interactive placement system controls
var cursors;
var leftClicked = false;
var rightClicked = false;
var enterPressed = false;

// tool options
// 1 : boundaries, 2 : obstacles, 3 : power-ups
var currentTool = 1;
var tooltext;

// stores the currently edited object
var currentObject;
var PlacedObject = function () {
	var sprite;
	// raw values are for the interactive placement system
	// scaled values are for the actual game client
	var rawX = 0;
	var rawY = 0;
	var scaledX = 0;
	var scaledY = 0;
}
var Boundary = function () {
	// raw values are for the interactive placement system
	// scaled values are for the actual game client
	var rawX = 0;
	var rawY = 0;
	var scaledX = 0;
	var scaledY = 0;
	var rawWidth = 0;
	var rawHeight = 0;
	var scaledWidth = 0;
	var scaledHeight = 0;
}

function preload () {

	game.load.image('obstacle', 'trashCan.png');
	game.load.image('powerUp', 'powerUp.png');
	// total map size: 7680 x 6694
	game.load.image('mapTL', 'campusCircuit_Small_TL.png');
	game.load.image('mapTR', 'campusCircuit_Small_TR.png');
	game.load.image('mapBL', 'campusCircuit_Small_BL.png');
	game.load.image('mapBR', 'campusCircuit_Small_BR.png');
	
	//create soccket connection
	socket = io.connect({
		'reconnection': true,
		'reconnectionDelay': 1000,
		'reconnectionDelayMax': 5000});
}

function create () {
    // set world size
    game.world.setBounds(0, 0, WINDOWHEIGHT * (WORLDWIDTH / WORLDHEIGHT), WINDOWHEIGHT);

    // background (map)
    var mapTL = game.add.sprite(0, 0, 'mapTL');
    mapTL.anchor.setTo(0, 0);
    mapTL.scale.setTo(WINDOWHEIGHT / (WORLDHEIGHT / SCALEFACTOR), WINDOWHEIGHT / (WORLDHEIGHT / SCALEFACTOR));
    var mapTR = game.add.sprite(game.world.width / 2, 0, 'mapTR');
    mapTR.anchor.setTo(0, 0);
    mapTR.scale.setTo(WINDOWHEIGHT / (WORLDHEIGHT / SCALEFACTOR), WINDOWHEIGHT / (WORLDHEIGHT / SCALEFACTOR));
    var mapBL = game.add.sprite(0, game.world.height / 2, 'mapBL');
    mapBL.anchor.setTo(0, 0);
    mapBL.scale.setTo(WINDOWHEIGHT / (WORLDHEIGHT / SCALEFACTOR), WINDOWHEIGHT / (WORLDHEIGHT / SCALEFACTOR));
    var mapBR = game.add.sprite(game.world.width / 2, game.world.height / 2, 'mapBR');
    mapBR.anchor.setTo(0, 0);
    mapBR.scale.setTo(WINDOWHEIGHT / (WORLDHEIGHT / SCALEFACTOR), WINDOWHEIGHT / (WORLDHEIGHT / SCALEFACTOR));

    // create graphics object
	graphics = game.add.graphics(0, 0);
	graphics.lineStyle(4, 0xff0000, 1);

	// create tool text
	toolText = game.add.text(32, 32, "Boundaries", {
		font: "32px Arial",
		fill: "#ffffff",
		align:"left"
	});
	toolText.fixedToCamera = true;

    // controls
    cursors = game.input.keyboard.createCursorKeys();
    game.input.mouse.mouseWheelCallback = mouseWheel;

    // prevent context menu from appearing on right click
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
}

function toDegrees (angle) {
	return angle * (180 / Math.PI);
}

function update() {

	// scroll camera
	if (cursors.up.isDown) {
		game.camera.y -= CAMERASCROLLSPEED;
	}
	else if (cursors.down.isDown) {
		game.camera.y += CAMERASCROLLSPEED;
	}
	if (cursors.left.isDown) {
		game.camera.x -= CAMERASCROLLSPEED;
	}
	else if (cursors.right.isDown) {
		game.camera.x += CAMERASCROLLSPEED;
	}

	// change tools
	if (game.input.keyboard.isDown(Phaser.KeyCode.ONE)) {
		currentTool = 1;
		toolText.text = "Boundaries";
	}
	else if (game.input.keyboard.isDown(Phaser.KeyCode.TWO)) {
		currentTool = 2;
		toolText.text = "Obstacles";
	}
	else if (game.input.keyboard.isDown(Phaser.KeyCode.THREE)) {
		currentTool = 3;
		toolText.text = "Power-Ups";
	}

	// handle left click being pressed
	if (game.input.activePointer.leftButton.isDown && !leftClicked) {
		// get raw coordinates
		var rawX = game.input.activePointer.worldX / game.world.scale.x;
		var rawY = game.input.activePointer.worldY / game.world.scale.y;
		// convert to scaled coordinates
		var scaledX = rawX * (WORLDHEIGHT / WINDOWHEIGHT);
		var scaledY = rawY * (WORLDHEIGHT / WINDOWHEIGHT);
		// set leftClicked to true to register only one click
		leftClicked = true;
		// create new object based on the tool
		switch (currentTool) {
			case 1 : 	// boundary: create new boundary object and set initial coordinates
						currentObject = new Boundary();
						currentObject.rawX = rawX;
						currentObject.rawY = rawY;
						currentObject.scaledX = scaledX;
						currentObject.scaledY = scaledY;
						break;
			case 2 : 	// obstacle
						currentObject = new PlacedObject();
						currentObject.sprite = game.add.sprite(rawX, rawY, 'obstacle');
						currentObject.sprite.scale.setTo(WINDOWHEIGHT / (WORLDHEIGHT / SCALEFACTOR) * PLACEDOBJECTSCALEFACTOR,
							WINDOWHEIGHT / (WORLDHEIGHT / SCALEFACTOR) * PLACEDOBJECTSCALEFACTOR);
						currentObject.rawX = rawX;
						currentObject.rawY = rawY;
						currentObject.scaledX = scaledX;
						currentObject.scaledY = scaledY;
						break;
			case 3 : 	// power-up
						currentObject = new PlacedObject();
						currentObject.sprite = game.add.sprite(rawX, rawY, 'powerUp');
						currentObject.sprite.scale.setTo(WINDOWHEIGHT / (WORLDHEIGHT / SCALEFACTOR) * PLACEDOBJECTSCALEFACTOR,
							WINDOWHEIGHT / (WORLDHEIGHT / SCALEFACTOR) * PLACEDOBJECTSCALEFACTOR);
						currentObject.rawX = rawX;
						currentObject.rawY = rawY;
						currentObject.scaledX = scaledX;
						currentObject.scaledY = scaledY;
						break;
		}
		
	}

	// handle left click being released
	else if (game.input.activePointer.leftButton.isUp && leftClicked) {
		// get raw coordinates
		var rawX = game.input.activePointer.worldX / game.world.scale.x;
		var rawY = game.input.activePointer.worldY / game.world.scale.y;
		// convert to scaled coordinates
		var scaledX = rawX * (WORLDHEIGHT / WINDOWHEIGHT);
		var scaledY = rawY * (WORLDHEIGHT / WINDOWHEIGHT);
		// set leftClicked to false to allow another click
		leftClicked = false;
		// place new object based on current tool
		switch (currentTool) {
			case 1 : 	// boundary
						// if width or height are negative, adjust value of coordinate and
						//	flip sign of width/height
						if (currentObject.rawWidth < 0) {
							currentObject.rawX = currentObject.rawX + currentObject.rawWidth;
							currentObject.scaledX = currentObject.scaledX + currentObject.scaledWidth;
							currentObject.rawWidth *= -1;
							currentObject.scaledWidth *= -1;
						}
						if (currentObject.rawHeight < 0) {
							currentObject.rawY = currentObject.rawY + currentObject.rawHeight;
							currentObject.scaledY = currentObject.scaledY + currentObject.scaledHeight;
							currentObject.rawHeight *= -1;
							currentObject.scaledHeight *= -1;
						}
						// add the new boundary to the array
						boundaries.push(currentObject);
						break;
			case 2 : 	// obstacle
						currentObject.sprite.x = rawX;
						currentObject.sprite.y = rawY;
						currentObject.rawX = rawX;
						currentObject.rawY = rawY;
						currentObject.scaledX = scaledX;
						currentObject.scaledY = scaledY;
						obstacles.push(currentObject);
						break;
			case 3 : 	// power-up
						currentObject.sprite.x = rawX;
						currentObject.sprite.y = rawY;
						currentObject.rawX = rawX;
						currentObject.rawY = rawY;
						currentObject.scaledX = scaledX;
						currentObject.scaledY = scaledY;
						powerUps.push(currentObject);
						break;
		}
	}

	// handle right clicks
	if (game.input.activePointer.rightButton.isDown && !rightClicked) {
		rightClicked = true;
		// clear screen
		graphics.clear();
		// delete object based on current tool
		switch (currentTool) {
			case 1 : 	// boundary
						if (boundaries.length > 0) {
							boundaries.splice(boundaries.length - 1);
						}
						break;
			case 2 : 	// obstacle
						if (obstacles.length > 0) {
							obstacles[obstacles.length - 1].sprite.destroy();
							obstacles.splice(obstacles.length - 1);
						}
						break;
			case 3 : 	// power-up
						if (powerUps.length > 0) {
							powerUps[powerUps.length - 1].sprite.destroy();
							powerUps.splice(powerUps.length - 1);
						}
						break;

		}
		
		// redraw objects
		drawObjects();
	}
	else if (game.input.activePointer.rightButton.isUp && rightClicked) {
		rightClicked = false;
	}

	// left click drag
	if (leftClicked) {
		// clear screen
		graphics.clear();
		// draw all objects
		drawObjects();
		// update currently drawn object
		graphics.lineStyle(LINEWIDTH, 0xff0000, 1);
		// get raw coordinates
		var rawX = game.input.activePointer.worldX / game.world.scale.x;
		var rawY = game.input.activePointer.worldY / game.world.scale.y;
		// convert to scaled coordinates
		var scaledX = rawX * (WORLDHEIGHT / WINDOWHEIGHT);
		var scaledY = rawY * (WORLDHEIGHT / WINDOWHEIGHT);
		// update new object based on current tool
		switch (currentTool) {
			case 1 : 	// set boundary values
						currentObject.rawWidth = rawX - currentObject.rawX;
						currentObject.rawHeight = rawY - currentObject.rawY;
						currentObject.scaledWidth = scaledX - currentObject.scaledX;
						currentObject.scaledHeight = scaledY - currentObject.scaledY;
						// draw currentObject
						graphics.drawRect(currentObject.rawX, currentObject.rawY, currentObject.rawWidth, currentObject.rawHeight);
						break;
			case 2 : 	
			case 3 : 	// obstacle or power-up
						currentObject.sprite.x = rawX;
						currentObject.sprite.y = rawY;
						currentObject.rawX = rawX;
						currentObject.rawY = rawY;
						currentObject.scaledX = scaledX;
						currentObject.scaledY = scaledY;
						break;
		}
	}

	// handle enter pressed
	if (game.input.keyboard.isDown(Phaser.KeyCode.ENTER) && !enterPressed) {
		printAllObjects();
		enterPressed = true;
	}
	else if (!game.input.keyboard.isDown(Phaser.KeyCode.ENTER) && enterPressed) {
		enterPressed = false;
	}
}

// draws all objects to the screen
function drawObjects() {
	// draw boundaries
	for (var i = 0; i < boundaries.length; i++) {
		graphics.lineStyle(LINEWIDTH, 0xff0000, 1);
		graphics.drawRect(boundaries[i].rawX, boundaries[i].rawY, boundaries[i].rawWidth, boundaries[i].rawHeight);
	}
}

// mouse wheel event handler
function mouseWheel (event) {
	// if scrolling up, zoom in
	if(game.input.mouse.wheelDelta > 0) {
		game.world.scale.setTo(game.world.scale.x + CAMERAZOOMSPEED, game.world.scale.y + CAMERAZOOMSPEED);
		toolText.scale.setTo(1 / game.world.scale.x, 1 / game.world.scale.y);
	}
	// if scrolling down and you haven't zoomed out all the way, zoom out
	else if(game.input.mouse.wheelDelta < 0 && game.world.scale.x > 1) {
		game.world.scale.setTo(game.world.scale.x - CAMERAZOOMSPEED, game.world.scale.y - CAMERAZOOMSPEED);
		toolText.scale.setTo(1 / game.world.scale.x, 1 / game.world.scale.y);
		if(game.world.scale.x < 1) {
			game.world.scale.setTo(1, 1);
			toolText.scale.setTo(1, 1);
		}
	}
}

// print all objects to console in JSON format
function printAllObjects () {
	var result = '{"boundaries":';
	result += JSON.stringify(boundaries);
	result += ',"obstacles":';
	result += JSON.stringify(obstacles, function(key, value) {
	    if (key !== 'sprite' && value !== null) {
	    	return value;
	    }
	});
	result += ',"powerUps":';
	result += JSON.stringify(powerUps, function(key, value) {
	    if (key !== 'sprite' && value !== null) {
	    	return value;
	    }
	});
	result += '}';
	console.log(result);
}

// load objects from JSON string in txt file
function loadObjects (filePath) {
	var objectsString = readTextFile(filePath);
	if (objectsString) {
		var objects = JSON.parse(objectsString);
    	boundaries = objects.boundaries;
    	//obstacles = objects.obstacles;
    	//powerUps = objects.powerUps;
    	drawObjects();
    }
    else {
    	console.log("File empty");
    }
}

// read text from file
var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
var response = "";
function readTextFile(filePath) {
    reader.open('get', filePath, true); 
    reader.onreadystatechange = function () {
    	if (reader.readyState == 4) {
    		response = reader.responseText;
    		console.log("response: " + response);
    	}
    }
    reader.send(null);
    return response;
}
