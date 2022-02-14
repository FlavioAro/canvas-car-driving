// Configuration.

	var startX = 50;
	var startY = 200;

	var topSpeed = 20;
	var acceleration = 0.25;

	var friction = 0.5;
	var brakeFriction = 1;

	// End configuration.



	// Some math functions.
	function toDegrees (angle){

 		return angle * (180 / Math.PI);
	}
	function toRadians (angle){

  		return angle * (Math.PI / 180);
	}
	function sinDegree(degrees){

		return Math.round(Math.sin(toRadians(degrees)) * 1000) / 1000;
	}
	function cosDegree(degrees){

		return Math.round(Math.cos(toRadians(degrees)) * 1000 ) / 1000;
	}

	window.onload = function(){

		var theCanvas = document.getElementById("theCanvas");
		theCanvas.width = document.body.clientWidth;
		theCanvas.height = document.body.clientHeight;

		var stage = new createjs.Stage(theCanvas);

		var carImage = new Image;
		carImage.src = "http://www.clker.com/cliparts/b/E/S/r/1/r/car-top-view-2-md.png";


		carImage.onload = function(){

			var car = new createjs.Bitmap(carImage);

			car.scaleX = 0.5;
			car.scaleY = 0.5;

			car.x = startX;
			car.y = startY;

			console.log("car.image.width: " + car.image.width);

			car.regX = car.image.width * 0.5 * car.scaleX;
			car.regY =  car.image.height  * car.scaleY;

			car.rotation = 0;

			stage.addChild(car);

			stage.update();

			console.log("car.rotation: " + car.rotation);

			// Order of keys: left, up, right, down.
			var keysDown = [0, 0, 0, 0];

			document.onkeydown = function(e){

				var keyCode = e.keyCode - 37;

				keysDown[keyCode] = 1;
				
				if(keyCode > -1 && keyCode < 5) e.preventDefault();
			};

			document.onkeyup = function(e){

				var keyCode = e.keyCode - 37;

				keysDown[keyCode] = 0;

				if(keyCode > -1 && keyCode < 5)	e.preventDefault();
			};

			createjs.Ticker.setFPS(30);

			var speed = 0;
			var oldRotation;
			var oldY = 0, oldX = 0;

			createjs.Ticker.addEventListener("tick", function(){

				if(keysDown[1])
				{
					// If the up key is down.

					speed += acceleration;
					if(speed > topSpeed)
					{
						speed = topSpeed;
					}
				}
				else
				{
					speed -= (keysDown[3]) ? brakeFriction : friction;
					if(speed < 0)
					{
						speed = 0;
					}
				}

				if(car.rotation !== oldRotation)
				{
					// If the rotation changed, calculate new speeds.

					oldCos = cosDegree(car.rotation);
					oldSin = sinDegree(car.rotation);
				}
				
				car.y -= speed * oldCos;
				car.x += speed * oldSin;

				oldRotation = car.rotation;


				var recX = car.x;
				var recY = car.y;

				if(recX > theCanvas.width){car.x = 0;}
				if(recX < 0){car.x = theCanvas.width;}

				if(recY > theCanvas.height){car.y = 0;}
				if(recY < 0){car.y = theCanvas.height;}
				
				// Little performance improvement.
				var checkSpeed = speed;

				if(keysDown[0] && checkSpeed != 0)
				{
					// If the left key is pressed.
					car.rotation -= 1 * (checkSpeed / 3);
				}
				if(keysDown[2] && checkSpeed != 0)
				{
					// If the right key is pressed.
					car.rotation += 1 * (checkSpeed / 3);
				}

				stage.update();
			});
		}
	};