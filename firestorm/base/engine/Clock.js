function Clock()
{
	var self = this;
	var _delta = 0;
	var _prevTime = Date.now();
	var _elapsedTime = 0;
	var _FPS = 0;
	var _tickTime = 0;
	var _ticks = 1;
	var _seconds = 0;
	var _minutes = 0;
	var _hours = 0;
	var _days = 0;
	var _isPaused = false;
	var _isStopped = false;

	this.update = function()
	{
		var curTime = Date.now();
		_elapsedTime = curTime - _prevTime;
		_elapsedTime = _elapsedTime == 0 ? 16.7 : _elapsedTime;
		_prevTime = curTime;

		_delta = _elapsedTime / 1000;

		_tickTime += _delta;
		if(_tickTime >= (_ticks / 20))
		{
			_ticks++;
			if(_ticks >= 20)
			{
				_tickTime = 0;
				_ticks = 0;
				_seconds++;
				if(_seconds == 60)
				{
					_seconds = 0;
					_minutes++;
					if(_minutes == 60)
					{
						_minutes = 0;
						_hours++;
						if(_hours == 24)
						{
							_hours = 0;
							_days++;
						}
					}
				}
			}
		}

		_FPS = Math.floor(1 / _delta);
	}

// Mutators
	this.pause = function()
	{
		_isPaused = true;
	}

	this.unpause = function()
	{
		_isPaused = false;
	}

	this.stop = function()
	{
		_isStopped = true;
	}

	this.reset = function()
	{
		_delta = 0;
		_prevTime = Date.now();
		_elapsedTime = 0;
		_FPS = 0;
		_tickTime = 0;
		_ticks = 1;
		_seconds = 0;
		_minutes = 0;
		_hours = 0;
		_days = 0;
		_isPaused = false;
		_isStopped = false;
	}
	
// Accessors
	this.getDelta = function()
	{
		 return _delta;
	}

	this.getFPS = function()
	{
		 return _FPS;
	}

	this.getTicks = function()
	{
		 return _ticks;
	}

	this.getTime = function()
	{
		 return {s: _seconds, m: _minutes, h: _hours, d: _days};
	}
	
	this.Paused = function()
	{
		 return _isPaused;
	}

	this.Stopped = function()
	{
		 return _isStopped;
	}

	window.onfocus = self.unpause;
	window.onblur = self.pause;
}