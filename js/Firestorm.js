// Includes
document.write('<script src="js/modules/Utility.js"></script>');
document.write('<script src="js/modules/AssetManager.js"></script>');
document.write('<script src="js/modules/Clock.js"></script>');
document.write('<script src="js/modules/Performance.js"></script>');
document.write('<script src="js/modules/Input.js"></script>');
document.write('<script src="js/modules/Vec2.js"></script>');
document.write('<script src="js/modules/Physics.js"></script>');
document.write('<script src="js/modules/Button.js"></script>');
document.write('<script src="js/modules/TabGroup.js"></script>');
document.write('<script src="js/modules/TextBox.js"></script>');
document.write('<script src="js/modules/Entity.js"></script>');
document.write('<script src="js/modules/Animation.js"></script>');
document.write('<script src="js/modules/SpriteSheet.js"></script>');
document.write('<script src="js/modules/Parallax.js"></script>');
document.write('<script src="js/modules/Background.js"></script>');
document.write('<script src="js/modules/Camera.js"></script>');

var Firestorm = (function(Firestorm)
{
	// Flags
	Firestorm.DEBUG = false;
	Firestorm.FULL_WINDOW = true;
	Firestorm.FULL_SCREEN = true;

	// Context
	Firestorm.canvas;
	Firestorm.dom;
	Firestorm.context;
	Firestorm.width;
	Firestorm.height;

	// Objects
	Firestorm.utility;
	Firestorm.assetManager;
	Firestorm.clock;
	Firestorm.performance;
	Firestorm.input;
	Firestorm.physics;

	Firestorm.scene;

	Firestorm.run = function(scene)
	{
		displayProgress(0);

		function displayProgress(percentage_complete)
		{
			if(Firestorm.context)
			{
				Firestorm.context.save();
					Firestorm.context.beginPath();
						Firestorm.context.fillStyle = 'black';
						Firestorm.context.fillRect(0, 0, Firestorm.width, Firestorm.height);
						Firestorm.context.textAlign = 'center';
						Firestorm.context.fillStyle = 'white';
						Firestorm.context.font = '15px terminal';
						Firestorm.context.fillText('Loading', Firestorm.width / 2, Firestorm.height / 2 - 30);
						Firestorm.context.font = 'bold 30px terminal';
						Firestorm.context.fillText(percentage_complete + '%', Firestorm.width / 2, Firestorm.height / 2);
					Firestorm.context.closePath();
				Firestorm.context.restore();
			}
		}

		function assetLoaded(src, percentage_complete)
		{
			displayProgress(percentage_complete);
		}

		function assetError(src)
		{
			console.error('Error loading: ' + src);
		}

		function allAssetsLoaded()
		{
			Firestorm.switchScene(scene, {});
		}

		if(Firestorm.assetManager.length() > 0)
		{
			Firestorm.assetManager.loadAll({onload: assetLoaded, onerror: assetError, onfinish: allAssetsLoaded});
		}
		else
		{
			allAssetsLoaded();
		}

		setInterval(Firestorm.update, 0);
		Firestorm.draw();
	}

	Firestorm.initialize = function(options)
	{
		$('body').css('overflow', 'hidden');

		Firestorm.canvas = document.getElementsByTagName('canvas')[0];
		if(!Firestorm.canvas)
		{
			Firestorm.dom = document.getElementById('canvas');
		}

		if(Firestorm.canvas)
		{
			Firestorm.context = Firestorm.canvas.getContext('2d');
		}
		else
		{
			Firestorm.canvas = document.createElement('canvas');
			Firestorm.context = Firestorm.canvas.getContext('2d');
			document.body.appendChild(Firestorm.canvas);
		}

		Firestorm.canvas.width = options.width ? options.width : Firestorm.canvas.width ? Firestorm.canvas.width : 800;
		Firestorm.canvas.height = options.height ? options.height : Firestorm.canvas.height ? Firestorm.canvas.height : 600;

		Firestorm.width = Firestorm.canvas.width;
		Firestorm.height = Firestorm.canvas.height;

		if(!options.cursor)
		{
			Firestorm.canvas.style.cursor = 'default';
		}

		Firestorm.initializeObjects();
		Firestorm.input.preventDefaultKeys(['`']);
	}

	Firestorm.initializeObjects = function()
	{
		Firestorm.utility = new Utility();
		Firestorm.assetManager = new AssetManager();
		Firestorm.clock = new Clock();
		Firestorm.performance = new Performance();
		Firestorm.input = new Input();
		Firestorm.input.initialize();
		Firestorm.physics = new Physics();
	}

	Firestorm.update = function()
	{
		if(Firestorm.input.pressed('`'))
		{
			Firestorm.DEBUG = !Firestorm.DEBUG;
		}
		if(!Firestorm.clock.Paused() && !Firestorm.clock.Stopped())
		{
			Firestorm.clock.update();

			// Update Scene
			if(Firestorm.scene)
			{
				Firestorm.scene.Update();
			}

			if(Firestorm.DEBUG)
			{
				Firestorm.performance.update();
			}
		}
	}

	Firestorm.draw = function()
	{
		requestAnimFrame(Firestorm.draw);
		if(!Firestorm.clock.Paused() && !Firestorm.clock.Stopped())
		{
			Firestorm.clear('black');

			// Draw Scene
			if(Firestorm.scene)
			{
				Firestorm.scene.Draw();
			}

			if(Firestorm.DEBUG)
			{
				Firestorm.performance.draw();
			}
		}
	}

	Firestorm.switchScene = function(scene, options)
	{
		// If the Clock exists, stop it
		Firestorm.clock && Firestorm.clock.stop();

		if(Firestorm.utility.isFunction(scene))
		{
			// Reinitalize the scene
			scene = new scene;

			// Set the options of the scene
			scene.setOptions(options);
		}

		Firestorm.scene = scene;
		Firestorm.clock.reset();
	}

	Firestorm.clear = function(value)
	{
		Firestorm.context.clearRect(0, 0, Firestorm.width, Firestorm.height);

		if(value)
		{
			Firestorm.context.beginPath();
				Firestorm.context.rect(0, 0, Firestorm.width, Firestorm.height);
				Firestorm.context.fillStyle = value;
				Firestorm.context.fill();
			Firestorm.context.closePath();
		}
	}

	window.onresize = function()
	{
		if(Firestorm.FULL_WINDOW || Firestorm.FULL_SCREEN)
		{
			Firestorm.width = window.innerWidth;
			Firestorm.height = window.innerHeight;
			Firestorm.canvas.width = Firestorm.width;
			Firestorm.canvas.height = Firestorm.height;
		}
	}

	window.requestAnimFrame = (function()
	{
		return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				function( callback )
				{
					window.setTimeout(callback, 1000 / 60);
				};
	})();

	return Firestorm;
})
(Firestorm || {});