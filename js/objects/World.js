var World = (function(World)
{
	World.camera;

// Initialization
	World.init = function()
	{
		Firestorm.input.preventDefaultKeys(['f1', 'f2', 'f3', 'f4', 'w', 'a', 's', 'd', 'space', 'up', 'down', 'left', 'right']);

	// Camera
		World.camera = new Camera();
	}

// Update
	World.update = function()
	{
		// Move camera
		//World.camera.update(World.player.position);
	}

// Draw
	World.draw = function()
	{
		Firestorm.context.save();
		// Camera
			World.camera.draw();
		Firestorm.context.restore();
	}

	return World;
})
(World || {});