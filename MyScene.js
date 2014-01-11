function MyScene()
{
	// Background
	var background = new Entity({image: "Happy.png", x: 0, y: 0, depth: 0, alpha: 1});
	
	background.position.x = (Firestorm.width * 0.5) - background.width * 0.5;
	background.position.y = (Firestorm.height * 0.5) - background.height * 0.5;

	this.Draw = function()
	{
		// Clear screen
		Firestorm.clear();

		// Background
		background.draw();
	}
}
MyScene.inherits(BaseScene);