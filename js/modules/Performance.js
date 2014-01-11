function Performance()
{
	var _FPS = [];
	var _AVERAGE_FPS = 0;

	this.update = function()
	{
		_FPS.unshift(Firestorm.clock.getFPS());
		if(_FPS.length > 240)
		{
			_FPS.length = 240;
		}

		for(var i = 0; i < _FPS.length; i++)
		{
			_AVERAGE_FPS += _FPS[i];
		}
		_AVERAGE_FPS = Firestorm.utility.roundToDec(_AVERAGE_FPS / _FPS.length, 1);
	}

	this.draw = function()
	{
		// Rect
		Firestorm.context.fillStyle = "rgba(255, 255, 255, 0.25)";
		Firestorm.context.fillRect(10, 10, 250, 120);

		// Text
		Firestorm.context.font = '14pt Calibri';
		Firestorm.context.textBaseline = 'top';
		Firestorm.context.fillStyle = 'red';
		Firestorm.context.fillText('FPS: ' + _AVERAGE_FPS, 15, 15);

		// Line
		Firestorm.context.beginPath();
			Firestorm.context.strokeStyle = 'red';
			Firestorm.context.moveTo(15, 40);
			Firestorm.context.lineTo(255, 40);
			Firestorm.context.stroke();
		Firestorm.context.closePath();

		// Wave
		Firestorm.context.beginPath();
			Firestorm.context.strokeStyle = 'red';
			Firestorm.context.moveTo(255, 60);
			for(var i = 0; i < 240; i++)
			{
				Firestorm.context.lineTo(255 - i, 120 - _FPS[i]);
			}
			Firestorm.context.stroke();
		Firestorm.context.closePath();
	}
}