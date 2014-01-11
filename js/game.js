// Scenes
document.write('<script src="scenes/BMSSplash.js"></script>');
document.write('<script src="scenes/FirestormSplash.js"></script>');
document.write('<script src="scenes/MainMenu.js"></script>');
document.write('<script src="scenes/GameScene.js"></script>');

// Objects
document.write('<script src="js/objects/World.js"></script>');

function Start()
{
	Firestorm.initialize({width: window.innerWidth, height: window.innerHeight});

// Backgrounds
	// Splash screens
	Firestorm.assetManager.add("img/backgrounds/Splash/SplashScreen.png");
	Firestorm.assetManager.add("img/backgrounds/Splash/Firestorm.png");

	Firestorm.run(BMSSplash);
}