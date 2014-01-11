function FirestormSplash()
{
	var alpha = 1.0;
	var lowThreshold = 0.0;
	var fadeRate = 0.001;
	var fadeIn = 0;
	var wait = 0;

	// Background
	var background = new Entity({image: "firestorm/base/images/Firestorm.png", x: 0, y: 0, depth: 0, alpha: 1});
	
	background.position.x = (Firestorm.width * 0.5) - background.width * 0.5;
	background.position.y = (Firestorm.height * 0.5) - background.height * 0.5;

	this.Update = function()
	{
		if(Firestorm.input.pressed("esc space"))
		{
			Firestorm.switchScene(this.scene, {scene: this.scene});
		}

		switch(fadeIn)
		{
			case 0:
				alpha -= fadeRate;
				if(alpha <= lowThreshold)
				{
					alpha = lowThreshold;
					fadeRate = 0.01;
					fadeIn = 1;
				}
				fadeRate += Firestorm.clock.getDelta() / 1000;
			break;
			case 1:
				wait++;
				if(wait >= 75)
				{
					fadeIn = 2;
					wait = 0;
				}
			break;
			case 2:
				alpha += fadeRate;
				if(alpha >= 1)
				{
					fadeIn = 3;
				}
				fadeRate += Firestorm.clock.getDelta() / 10000;
			break;
			case 3:
				wait++;
				if(wait >= 45)
				{
					fadeIn = 4;
					wait = 0;
				}
			break;
			case 4:
				Firestorm.switchScene(this.scene, {});
			break;
			default:
			break;
		}
	}

	this.Draw = function()
	{
		// Clear screen
		Firestorm.clear();

		// Background
		background.draw();

		Firestorm.context.save();
			Firestorm.context.globalAlpha = alpha;
			Firestorm.context.beginPath();
			Firestorm.context.rect(0, 0, Firestorm.width, Firestorm.height);
			Firestorm.context.fillStyle = 'black';
			Firestorm.context.fill();
		Firestorm.context.restore();
	}

	this.setOptions = function(options)
	{
		this.scene = options.scene;
	}
}
FirestormSplash.inherits(BaseScene);