// Load Scenes here
document.write('<script src="MyScene.js"></script>');

// Load Objects here

function Start()
{
	Firestorm.initialize({width: window.innerWidth, height: window.innerHeight});

// Load Assets here
	Firestorm.assetManager.add("Happy.png");

	Firestorm.run(MyScene);
}