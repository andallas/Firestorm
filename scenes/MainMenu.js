function MainMenu()
{
	var button = new Button({	x: Firestorm.canvas.width / 2 - 128 / 2, y: Firestorm.canvas.height / 2 - 32 / 2, width: 128, height: 32, borderWidth: 2,
								topLeft: 10, topRight: 10, bottomLeft: 10, bottomRight: 10, shadowOffsetX: 2, shadowOffsetY: 2, shadowBlur: 10,
								shadowColor: "#606060", gradColor: ["#8ED6FF", "#004CB3"], strokeColor: "#003DB3", fontColor: "#FFFFFF", text: "Play"},
								// Focus
								{},
								// Hover
								{y: Firestorm.canvas.height / 2 - 32 / 2, gradColor: ["#87CBF2", "#0045A3"], fontColor: "#DFDFDF"}
							);

	this.Update = function()
	{
		if(button.update())
		{
			Firestorm.switchScene(GameScene, {});
		}
	}

	this.Draw = function()
	{
		// Clear screen
		Firestorm.clear('black');

		// Draw GUI
		button.draw();
	}
}
MainMenu.inherits(BaseScene);