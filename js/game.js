// Scenes
document.write('<script src="scenes/BaseScene.js"></script>');
document.write('<script src="scenes/BMSSplash.js"></script>');
document.write('<script src="scenes/FirestormSplash.js"></script>');
document.write('<script src="scenes/MainMenu.js"></script>');
document.write('<script src="scenes/GameScene.js"></script>');

// Objects
document.write('<script src="js/objects/World.js"></script>');
document.write('<script src="js/objects/Chunk.js"></script>');
document.write('<script src="js/objects/Tile.js"></script>');
document.write('<script src="js/objects/Player.js"></script>');

function Start()
{
	Firestorm.initialize({width: window.innerWidth, height: window.innerHeight});

// Backgrounds
	// Splash screens
	Firestorm.assetManager.add("img/backgrounds/Splash/SplashScreen.png");
	Firestorm.assetManager.add("img/backgrounds/Splash/Firestorm.png");

	// Stars
	for(var a = 1; a <= 8; a++)
	{
		Firestorm.assetManager.add("img/stars/star_anim_00" + a + ".png");
	}

	for(var b = 1; b <= 11; b++)
	{
		if(b < 10)
		{
			Firestorm.assetManager.add("img/stars/Star_Blue_00" + b + ".png");
			Firestorm.assetManager.add("img/stars/Star_Red_00" + b + ".png");
			Firestorm.assetManager.add("img/stars/Star_White_00" + b + ".png");
			Firestorm.assetManager.add("img/stars/Star_Yellow_00" + b + ".png");
		}
		else
		{
			Firestorm.assetManager.add("img/stars/Star_Blue_0" + b + ".png");
			Firestorm.assetManager.add("img/stars/Star_Red_0" + b + ".png");
			Firestorm.assetManager.add("img/stars/Star_White_0" + b + ".png");
			Firestorm.assetManager.add("img/stars/Star_Yellow_0" + b + ".png");
		}
	}

// Player
	Firestorm.assetManager.add("img/player/player.png");

// Enemies
	Firestorm.assetManager.add("img/enemies/enemy.png");

// Particles
	Firestorm.assetManager.add("img/particles/Fire.png");
	Firestorm.assetManager.add("img/particles/Smoke.png");
	Firestorm.assetManager.add("img/particles/Beam_Red.png");
	Firestorm.assetManager.add("img/particles/Beam_Green.png");
	Firestorm.assetManager.add("img/particles/Beam_Blue.png");
	Firestorm.assetManager.add("img/particles/Spark_Red.png");
	Firestorm.assetManager.add("img/particles/Spark_Green.png");
	Firestorm.assetManager.add("img/particles/Spark_Blue.png");

	Firestorm.run(BMSSplash);
}