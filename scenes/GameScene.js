function GameScene()
{
// Initialization
	World.init();

// Update
	this.Update = function()
	{
		World.update();
	}

// Draw
	this.Draw = function()
	{
		// Clear screen
		var color = 'rgb(' + Math.round(World.BG_Red) + ', ' + Math.round(World.BG_Green) + ', ' + Math.round(World.BG_Blue) + ')';
		Firestorm.clear(color);

		World.draw();
	}
}
GameScene.inherits(BaseScene);