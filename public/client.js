window.onload = function() {

		var MAPPANELWIDTH = 3840;
		var MAPPANELHEIGHT = 3347;
		var SCALEFACTOR = 3;
		var WORLDWIDTH = MAPPANELWIDTH * 2 * SCALEFACTOR;
    	var WORLDHEIGHT = MAPPANELHEIGHT * 2 * SCALEFACTOR;
    	var WINDOWWIDTH = 1280;
    	var WINDOWHEIGHT = 720;

    	var PLAYERSTARTX = 2904;
    	var PLAYERSTARTY = 16102;

        var game = new Phaser.Game(WINDOWWIDTH, WINDOWHEIGHT, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

		var socket;
		var otherPlayers;
        var player;

        // player attributes
		var angle = 0;
    	var cursors;
    	var speed = 0;
    	var maxSpeed = 700;
    	var acceleration = 5;
    	var braking = 15;
    	var reversing = false;
    	var turnSpeed = 0.05;
		var cooldown = 0;

		// UI attributes
		var endText;

		// world attributes
    	var obstacles;
    	var boundaries;

    	// physics attributes
    	// create collision groups
        var playerCollisionGroup;
        var boundaryCollisionGroup;
        var obstacleCollisionGroup;

		function preload () {
			game.load.image('logo', 'phaser.png');
			game.load.image('bluebike', 'bluebike.png');
			game.load.image('trashCan', 'trashCan.png');
			game.load.image('powerUp', 'powerUp.png');
			game.load.image('arrow', 'arrow.png');
			// total map size: 7680 x 6694
			game.load.image('mapTL', 'campusCircuit_TL.png');
			game.load.image('mapTR', 'campusCircuit_TR.png');
			game.load.image('mapBL', 'campusCircuit_BL.png');
			game.load.image('mapBR', 'campusCircuit_BR.png');
			
			game.load.image('finish', 'finishline.png');
			
			otherPlayers = [];	//hold list of other players connected
			create();			//load all of the objects onto the screen
			
			//create soccket connection
			socket = io.connect({
				'reconnection': true,
				'reconnectionDelay': 1000,
				'reconnectionDelayMax': 5000});
			setEventHandlers();
        }

        function createObjects () {
        	var objectsString = readTextFile("objects.txt");
			if (!objectsString) {
				objectsString = readTextFile("objects.txt");
			}
			if (!objectsString) {
				objectsString = readTextFile("objects.txt");
			}
			if (objectsString) {
				console.log("successful reading object file");
				var objects = JSON.parse(objectsString);
				var boundaryArray = objects.boundaries;
				var obstacleArray = objects.obstacles;
				var powerUpArray = objects.powerUps;
        		createBoundaries(boundaryArray);
        		createObstacles(obstacleArray);
        		createPowerUps(powerUpArray);
        	}        	
			else {
				console.log("error reading object file");
			}
        }

		function createObs(){
			obstacles = game.add.group();
			obstacles.enableBody = true;
			var staticObstacle1 = obstacles.create(3072, 15052, 'trashCan');
			staticObstacle1.anchor.setTo(0.5, 0.5);
			staticObstacle1.body.immovable = true;
			var staticObstacle2 = obstacles.create(2972, 13425, 'trashCan');
			staticObstacle2.anchor.setTo(0.5, 0.5);
			staticObstacle2.body.immovable = true;
			var staticObstacle3 = obstacles.create(3022, 11101, 'trashCan');
			staticObstacle3.anchor.setTo(0.5, 0.5);
			staticObstacle3.body.immovable = true;
			var staticObstacle4 = obstacles.create(2970, 8763, 'trashCan');
			staticObstacle4.anchor.setTo(0.5, 0.5);
			staticObstacle4.body.immovable = true;
			var staticObstacle5 = obstacles.create(2932, 6462, 'trashCan');
			staticObstacle5.anchor.setTo(0.5, 0.5);
			staticObstacle5.body.immovable = true;
			var staticObstacle5 = obstacles.create(3013, 3007, 'trashCan');
			staticObstacle5.anchor.setTo(0.5, 0.5);
			staticObstacle5.body.immovable = true;
			var staticObstacle6 = obstacles.create(2903, 2974, 'trashCan');
			staticObstacle6.anchor.setTo(0.5, 0.5);
			staticObstacle6.body.immovable = true;
			var staticObstacle7 = obstacles.create(3673, 1382, 'trashCan');
			staticObstacle7.anchor.setTo(0.5, 0.5);
			staticObstacle7.body.immovable = true;
			var staticObstacle7 = obstacles.create(3673, 1335, 'trashCan');
			staticObstacle7.anchor.setTo(0.5, 0.5);
			staticObstacle7.body.immovable = true;
			var staticObstacle7 = obstacles.create(3673, 1450, 'trashCan');
			staticObstacle7.anchor.setTo(0.5, 0.5);
			staticObstacle7.body.immovable = true;
			var staticObstacle8 = obstacles.create(4996, 1451, 'trashCan');
			staticObstacle8.anchor.setTo(0.5, 0.5);
			staticObstacle8.body.immovable = true;
			var staticObstacle9 = obstacles.create(6469, 1377, 'trashCan');
			staticObstacle9.anchor.setTo(0.5, 0.5);
			staticObstacle9.body.immovable = true;
			var staticObstacle10 = obstacles.create(7324, 1513, 'trashCan');
			staticObstacle10.anchor.setTo(0.5, 0.5);
			staticObstacle10.body.immovable = true;
			var staticObstacle11 = obstacles.create(7324, 1434, 'trashCan');
			staticObstacle11.anchor.setTo(0.5, 0.5);
			staticObstacle11.body.immovable = true;
			var staticObstacle12 = obstacles.create(9517, 1573, 'trashCan');
			staticObstacle12.anchor.setTo(0.5, 0.5);
			staticObstacle12.body.immovable = true;
			var staticObstacle13 = obstacles.create(9479, 1473, 'trashCan');
			staticObstacle13.anchor.setTo(0.5, 0.5);
			staticObstacle13.body.immovable = true;
			var staticObstacle14 = obstacles.create(12853, 1535, 'trashCan');
			staticObstacle14.anchor.setTo(0.5, 0.5);
			staticObstacle14.body.immovable = true;
			var staticObstacle15 = obstacles.create(12853, 1463, 'trashCan');
			staticObstacle15.anchor.setTo(0.5, 0.5);
			staticObstacle15.body.immovable = true;
			var staticObstacle16 = obstacles.create(19820, 1599, 'trashCan');
			staticObstacle16.anchor.setTo(0.5, 0.5);
			staticObstacle16.body.immovable = true;
			var staticObstacle17 = obstacles.create(16500, 1463, 'trashCan');
			staticObstacle17.anchor.setTo(0.5, 0.5);
			staticObstacle17.body.immovable = true;
			var staticObstacle18 = obstacles.create(20044, 3986, 'trashCan');
			staticObstacle18.anchor.setTo(0.5, 0.5);
			staticObstacle18.body.immovable = true;
			var staticObstacle19 = obstacles.create(15171, 9436, 'trashCan');
			staticObstacle19.anchor.setTo(0.5, 0.5);
			staticObstacle19.body.immovable = true;
			var staticObstacle20 = obstacles.create(15171, 9436, 'trashCan');
			staticObstacle20.anchor.setTo(0.5, 0.5);
			staticObstacle20.body.immovable = true;
			var staticObstacle20 = obstacles.create(15171, 9436, 'trashCan');
			staticObstacle20.anchor.setTo(0.5, 0.5);
			staticObstacle20.body.immovable = true;
			var staticObstacle21 = obstacles.create(19176, 9866, 'trashCan');
			staticObstacle21.anchor.setTo(0.5, 0.5);
			staticObstacle21.body.immovable = true;
			var staticObstacle22 = obstacles.create(19176, 9866, 'trashCan');
			staticObstacle22.anchor.setTo(0.5, 0.5);
			staticObstacle22.body.immovable = true;
			staticObstacle22.scale.setTo(5,5);
			var staticObstacle23 = obstacles.create(19493, 7349, 'trashCan');
			staticObstacle23.anchor.setTo(0.5, 0.5);
			staticObstacle23.body.immovable = true;
			staticObstacle23.scale.setTo(5,5);
			var staticObstacle24 = obstacles.create(18410, 10766, 'trashCan');
			staticObstacle24.anchor.setTo(0.5, 0.5);
			staticObstacle24.body.immovable = true;
			staticObstacle24.scale.setTo(5,5);
			var staticObstacle25 = obstacles.create(13696, 10830, 'trashCan');
			staticObstacle25.anchor.setTo(0.5, 0.5);
			staticObstacle25.body.immovable = true;
			staticObstacle25.scale.setTo(10,10);
			var staticObstacle26 = obstacles.create(12992, 14569, 'trashCan');
			staticObstacle26.anchor.setTo(0.5, 0.5);
			staticObstacle26.body.immovable = true;
			var staticObstacle27 = obstacles.create(12826, 18547, 'trashCan');
			staticObstacle27.anchor.setTo(0.5, 0.5);
			staticObstacle27.body.immovable = true;
			var staticObstacle27 = obstacles.create(4502, 16125, 'trashCan');
			staticObstacle27.anchor.setTo(0.5, 0.5);
			staticObstacle27.body.immovable = true;
		}
		
		function createArrows(){
			var arrow = game.add.sprite(2856, 16022, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = -90;
	        arrow = game.add.sprite(2878, 13332, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = -90;
	        arrow = game.add.sprite(2789, 8872, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = -90;
	        arrow = game.add.sprite(2896, 4725, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = -90;
	        arrow = game.add.sprite(2896, 1316, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow = game.add.sprite(8869, 1316, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow = game.add.sprite(12192, 1316, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow = game.add.sprite(18124, 1316, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow = game.add.sprite(20113, 1440, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 90;
	        arrow = game.add.sprite(19721, 5366, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 90;
	        arrow = game.add.sprite(20053, 7105, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 135;
	        arrow = game.add.sprite(19055, 7962, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 90;
	        arrow = game.add.sprite(19093, 8894, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 90;
	        arrow = game.add.sprite(19429, 8894, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 90;
	        arrow = game.add.sprite(19188, 10409, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 135;
	        arrow = game.add.sprite(18498, 11000, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 180;
	        arrow = game.add.sprite(17242, 10245, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 135;
	        arrow = game.add.sprite(16449, 11225, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 180;
	        arrow = game.add.sprite(16449, 10428, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 180;
	        arrow = game.add.sprite(15552, 11225, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 180;
	        arrow = game.add.sprite(15552, 10428, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 180;
	        arrow = game.add.sprite(14344, 11225, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 180;
	        arrow = game.add.sprite(14244, 10428, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 180;
	        arrow = game.add.sprite(13357, 10517, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 135;
	        arrow = game.add.sprite(12772, 10821, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 90;
	        arrow = game.add.sprite(13251, 13685, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 90;
	        arrow = game.add.sprite(13235, 16722, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 90;
	        arrow = game.add.sprite(13020, 18800, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 180;
	        arrow = game.add.sprite(9628, 18800, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 180;
	        arrow = game.add.sprite(8520, 18668, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = -90;
	        arrow = game.add.sprite(8770, 16183, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = -135;
	        arrow = game.add.sprite(5654, 16263, 'arrow');
	        arrow.anchor.setTo(0.5, 0.5);
	        arrow.scale.setTo(0.1, 0.1);
	        arrow.angle = 180;
		}

		function createBoundaries (boundaryArray) {
			var boundaryObjects = [];
			var boundaryObject;
			for (var i = 0; i < boundaryArray.length; i++) {
				console.log("creating boundary at: " + boundaryArray[i].scaledX + ", " + boundaryArray[i].scaledY);
				boundaryObject = boundaries.create(boundaryArray[i].scaledX, boundaryArray[i].scaledY, 'logo');
				boundaryObject.width = boundaryArray[i].scaledWidth;
				boundaryObject.height = boundaryArray[i].scaledHeight;				
				boundaryObject.anchor.setTo(0, 0);
				boundaryObject.body.setRectangle(boundaryArray[i].scaledWidth, boundaryArray[i].scaledHeight, boundaryArray[i].scaledWidth / 2, boundaryArray[i].scaledHeight / 2);
				boundaryObject.body.static = true;
				boundaryObject.body.setCollisionGroup(boundaryCollisionGroup);
				boundaryObject.body.collides(playerCollisionGroup);
			}
		}

		function createObstacles (obstacleArray) {
			var obstacleObjects = [];
			var obstacleObject;
			for (var i = 0; i < obstacleArray.length; i++) {
				console.log("creating obstacle at: " + obstacleArray[i].scaledX + ", " + obstacleArray[i].scaledY);
				obstacleObject = obstacles.create(obstacleArray[i].scaledX, obstacleArray[i].scaledY, 'trashCan');
				obstacleObject.anchor.setTo(0, 0);
				obstacleObject.body.setRectangleFromSprite(obstacleObject.sprite);
				obstacleObject.body.static = true;
				obstacleObject.body.setCollisionGroup(obstacleCollisionGroup);
				obstacleObject.body.collides(playerCollisionGroup);
			}
		}

		function createPowerUps (powerUpArray) {
			var powerUpObjects = [];
			var powerUpObject;
			for (var i = 0; i < powerUpArray.length; i++) {
				console.log("creating power-up at: " + powerUpArray[i].scaledX + ", " + powerUpArray[i].scaledY);
				powerUpObject = powerUps.create(powerUpArray[i].scaledX, powerUpArray[i].scaledY, 'powerUp');
				powerUpObject.anchor.setTo(0, 0);
				powerUpObject.body.immovable = true;
			}
		}
	
        function create () {
			// enable P2 Physics system
	        game.physics.startSystem(Phaser.Physics.P2JS);
	        // turn on collisions
	        game.physics.p2.setImpactEvents(true);
	        game.physics.p2.restitution = 0.8;

	        // set objects to collide with world bounds
	        game.physics.p2.updateBoundsCollisionGroup();

	        playerCollisionGroup = game.physics.p2.createCollisionGroup();
        	boundaryCollisionGroup = game.physics.p2.createCollisionGroup();
        	obstacleCollisionGroup = game.physics.p2.createCollisionGroup();

	        // set world size
	        game.world.setBounds(0, 0, WORLDWIDTH, WORLDHEIGHT);

	        // background (map)
	        var mapTL = game.add.sprite(0, 0, 'mapTL');
	        mapTL.anchor.setTo(0, 0);
	        mapTL.scale.setTo(SCALEFACTOR, SCALEFACTOR);
	        var mapTR = game.add.sprite(game.world.width / 2, 0, 'mapTR');
	        mapTR.anchor.setTo(0, 0);
	        mapTR.scale.setTo(SCALEFACTOR, SCALEFACTOR);
	        var mapBL = game.add.sprite(0, game.world.height / 2, 'mapBL');
	        mapBL.anchor.setTo(0, 0);
	        mapBL.scale.setTo(SCALEFACTOR, SCALEFACTOR);
	        var mapBR = game.add.sprite(game.world.width / 2, game.world.height / 2, 'mapBR');
	        mapBR.anchor.setTo(0, 0);
	        mapBR.scale.setTo(SCALEFACTOR, SCALEFACTOR);
			
			//finish line
			finish = game.add.sprite(3100, 16065, 'finish');
			finish.scale.setTo(0.25, .75);

	        // add arrows

	        createArrows();

	        // player
	        player = game.add.sprite(PLAYERSTARTX, PLAYERSTARTY, 'bluebike');
	        player.anchor.setTo(0.5, 0.5);
		    player.scale.setTo(0.5, 0.5);
		    player.laps = 0;
	        game.physics.p2.enable(player);
	        player.body.setCollisionGroup(playerCollisionGroup);
	        player.body.collides([boundaryCollisionGroup, obstacleCollisionGroup]);
	        player.body.fixedRotation = true;
	        //player.body.collideWorldBounds = true;
	        console.log(player.body.debug);

	        // set up objects physics	        
			boundaries = game.add.group();			
			obstacles = game.add.group();			
			powerUps = game.add.group();
	        boundaries.enableBody = true;
	        obstacles.enableBody = true;
	        powerUps.enableBody = true;
	        boundaries.physicsBodyType = Phaser.Physics.P2JS;
	        obstacles.physicsBodyType = Phaser.Physics.P2JS;
	        powerUps.physicsBodyType = Phaser.Physics.P2JS;

	        // create objects
	        createObjects();
			
	        // set up camera size
	        game.camera.width = 1280;
	        game.camera.height = 720;

	        // controls
	        cursors = game.input.keyboard.createCursorKeys();
			
			//endText
			endText = game.add.text(player.x, player.y, "", {
						font: "65px Arial",
						fill: "#ff0044",
						align: "center"
			});
			endText.anchor.setTo(0.5, 0.5);

        }

        function toDegrees (angle) {
        	return angle * (180 / Math.PI);
	    }
		
		function forward() {		//forward function
			if (speed < 0) {		// if going backwards, brake and move forward
				speed += (acceleration + braking);
			}
			else if(speed < maxSpeed){	//max speed
				speed += acceleration;
			}
			if (speed > maxSpeed) {
				speed = maxSpeed;
			}
		}

		function reverse() {	//reverse function
			if (speed > 0) {		// if going forward, brake and reverse
				speed -= (acceleration + braking);
			}
			else if(speed > (-maxSpeed / 2)) {	// min speed
				speed -= acceleration;
			}
			else if (speed < (-maxSpeed / 2)) {
				speed = -maxSpeed / 2;
			}
		}

		function decelerate() {
			if (speed > 0) {
				speed -= braking;
			}
			else if (speed < 0) {
				speed += braking;
				reversing = true;
			}
			if ((speed < 0 && !reversing) || (speed > 0 && reversing)) {
				speed = 0;
				reversing = false;
			}
		}
		
		var setEventHandlers = function() {//set all of the callback functions for socket events
			socket.on('connect', onSocketConnected);//new connection
			
			socket.on('newPlayer', onNewPlayer);//new player
			
			socket.on('movePlayer', onMovePlayer);//send a new id to the new player
			socket.on('disconnect', onSocketDisconnect);//one of the players has moved
			socket.on('removePlayer', onRemovePlayer);//player disconnected
			socket.on('playerID', function(data) {
				player.id = data.id;
				player.playerNum = data.playerNum;
				player.x += (player.playerNum*35); 
			});
			socket.on('gameFinish', onGameFinish);//remove player from game

		}
		
		function onSocketConnected() {
			console.log('Connected to socket server');
			
			socket.emit('newPlayer', { x: player.x, y: player.y, angle: player.angle });	//send server info to create new player
	
		}

		function onSocketDisconnect () {
 			console.log('Disconnected from socket server');
		}
		
		function setPlayerId(data) {
			player.id = data.id;
			player.playerNum = data.playerNum;	//index in the servers player list
			player.x += (player.playerNum*35);	//set starting position based on how many people are connected
		}
		
		function onNewPlayer (data) {
			console.log('New player connected:', data.id);

			// Avoid possible duplicate players
			var duplicate = playerById(data.id);
			if (duplicate) {
				console.log('Duplicate player!');
				return;
			}
			if (player.id == data.id){
				return;
			}
			
			// Add new player to the remote players array
			otherPlayers.push(new OtherPlayer(data.id, game, player, data.playerNum, data.x, data.y, data.angle));	//create new player and put it into list of current players
			console.log(otherPlayers);	//debugging
		}
		
		function onMovePlayer (data) {
			var movePlayer = playerById(data.id);	//get the player that is currently being moved

		  // Player not found
			if (!movePlayer) {
				console.log('Player not found: ', data.id);
				return
			}

			// Update player position
			movePlayer.player.x = data.x;
			movePlayer.player.y = data.y;
			movePlayer.player.angle = data.angle;
			movePlayer.player.laps = data.laps;
		}
		
		function onGameFinish (data) {
			endText.setText("You Lose!");
			endText.anchor.setTo(0.5, 0.5);
		}
		
		function checkOverlap(spriteA, spriteB) {

			var boundsA = spriteA.getBounds();
			var boundsB = spriteB.getBounds();

			return Phaser.Rectangle.intersects(boundsA, boundsB);

		}
		
		function update() {

			// player controls

	        if (cursors.up.isDown) {	//forward and backward movement
				forward();
				reversing = false;
	            player.body.velocity.x = (speed * Math.sin(angle));
	            player.body.velocity.y = (-speed * Math.cos(angle));
	        }
	        else if (cursors.down.isDown) {
	            reverse();
	            reversing = true;
				player.body.velocity.x = (speed * Math.sin(angle));
	            player.body.velocity.y = (-speed * Math.cos(angle));
	        }
	        else {
	        	decelerate();
	        	player.body.velocity.x = (speed * Math.sin(angle));
	        	player.body.velocity.y = (-speed * Math.cos(angle));
	        }

	        if (cursors.left.isDown) {			//left and right angled movement
	            if (cursors.down.isDown) {		//two buttons pressed simultaneously 
	                angle -= turnSpeed * 0.5;
	            }
	            else if (cursors.up.isDown) {
	                angle -= turnSpeed;
	            }
	            player.angle = toDegrees(angle);
	        }
	        else if (cursors.right.isDown) {
	            if (cursors.down.isDown) {
	                angle += turnSpeed * 0.5;
	            }
	            else if (cursors.up.isDown) {
	                angle += turnSpeed;
	            }
	            player.angle = toDegrees(angle);
	        }

	        // update camera position
	        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);
			endText.x = player.x;
			endText.y = player.y;
			
			//check for finish line
			if (checkOverlap(player, finish)&& cooldown < 0)
			{
				player.laps++;
				cooldown = 2400;//resets cooldown to prevent multiple lap increments
				if(player.laps >= 3){
					socket.emit('gameWin', { id:player.id});
					endText.setText("You Win!")
				}
			}
			cooldown--;//decrement cooldown
			game.debug.text("player laps: "+ player.laps + "/3", 32, 32);
	
	        // check for collisions
	        //var hitArrows = game.physics.p2.collide(player, arrow);
			//var hitObstacle = game.physics.p2.collide(player, obstacles);

			//var hitBoundaries = game.physics.p2.collide(player, boundaries);
			
			// if(hitObstacle == true){
			// 	speed = 0;
			// }
			socket.emit('movePlayer', { x: player.x, y: player.y, angle: player.angle, laps: player.laps});
		}

		function render () {
			game.debug.spriteInfo(player, 32, 32);
			game.debug.body(player);
		}

		function onRemovePlayer (data) {					//remove player from client screen
			var removePlayer = playerById(data.id)

			// Player not found
			if (!removePlayer) {
			  	console.log('Player not found: ', data.id)
				return
			}
			
			//remove from screen
			removePlayer.player.kill();

			// Remove player from array
			otherPlayers.splice(otherPlayers.indexOf(removePlayer), 1);
		}

		function playerById (id) {								//returns player from given id
			for (var i = 0; i < otherPlayers.length; i++) {
				if (otherPlayers[i].player.id === id) {
					return otherPlayers[i];
				}
			}

			return false;
		}

		var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
		var response = "";
		function readTextFile(filePath) {
		    reader.open('get', filePath, true); 
		    reader.onreadystatechange = function () {
		    	if (reader.readyState == 4) {
		    		response = reader.responseText;
		    	}
		    }
		    reader.send(null);
		    return response;
		}
		
    };

