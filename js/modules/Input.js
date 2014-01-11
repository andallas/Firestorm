function Input()
{
	var _pressedKeys = {};
	var _previouslyPressedKeys = {};
	var _keycodeToString = [];
	var _onKeyUpCallbacks = [];
	var _onKeyDownCallbacks = [];
	var _mouseButtonCodeToString = [];
	var _IEMouseButtonCodeToString = [];
	var _preventDefaultKeys = [];
	var _mouseWheel = 0;
	var _prevMouse_wheel = 0;
	var _mouseX = 0;
	var _mouseY = 0;

	this.getPressedKeys = function()
	{
		return _pressedKeys;
	}

	this.getPrevPressedKeys = function()
	{
		return _previouslyPressedKeys;
	}

	this.initialize = function()
	{
		var k = [];
		k[8] = 'backspace';
		k[9] = 'tab';
		k[13] = 'enter';
		k[16] = 'shift';
		k[17] = 'ctrl';
		k[18] = 'alt';
		k[19] = 'pause';
		k[20] = 'capslock';
		k[27] = 'esc';
		k[32] = 'space';
		k[33] = 'pageup';
		k[34] = 'pagedown';
		k[35] = 'end';
		k[36] = 'home';
		k[37] = 'left';
		k[38] = 'up';
		k[39] = 'right';
		k[40] = 'down' ;
		k[45] = 'insert';
		k[46] = 'delete';

		k[91] = 'left_window_key leftwindowkey';
		k[92] = 'right_window_key rightwindowkey';
		k[93] = 'select_key selectkey';
		k[106] = 'multiply *';
		k[107] = 'add plus +';
		k[109] = 'subtract minus -';
		k[110] = 'decimalpoint';
		k[111] = 'divide /';

		k[144] = 'numlock';
		k[145] = 'scrollock';
		k[186] = 'semicolon ;';
		k[187] = 'equalsign =';
		k[188] = 'comma ,';
		k[189] = 'dash -';
		k[190] = 'period .';
		k[191] = 'forwardslash /';
		k[192] = 'graveaccent `';
		k[219] = 'openbracket [';
		k[220] = 'backslash \\';
		k[221] = 'closebracket ]';
		k[222] = "singlequote '";

		var m = [];

		m[0] = 'left_mouse_button';
		m[1] = 'center_mouse_button';
		m[2] = 'right_mouse_button';
		m[3] = 'mouse_wheel_up';
		m[4] = 'mouse_wheel_down';

		var _IE_m = [];
		_IE_m[1] = 'left_mouse_button';
		_IE_m[2] = 'right_mouse_button';
		_IE_m[4] = 'center_mouse_button';

		_mouseButtonCodeToString = m;
		_IEMouseButtonCodeToString = _IE_m;

		var numpadkeys = ['numpad0','numpad1','numpad2','numpad3','numpad4','numpad5','numpad6','numpad7','numpad8','numpad9'];
		var fkeys = ['f1','f2','f3','f4','f5','f6','f7','f8','f9', 'f10', 'f11', 'f12'];
		var numbers = ['0','1','2','3','4','5','6','7','8','9'];
		var letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
		for(var i = 0; numbers[i]; i++)     { k[48+i] = numbers[i] }
		for(var i = 0; letters[i]; i++)     { k[65+i] = letters[i] }
		for(var i = 0; numpadkeys[i]; i++)  { k[96+i] = numpadkeys[i] }
		for(var i = 0; fkeys[i]; i++)       { k[112+i] = fkeys[i] }

		_keycodeToString = k;

		window.addEventListener('keyup', handleKeyUp);
		window.addEventListener('keydown', handleKeyDown);

		window.addEventListener('mousemove', setMousePosition);

		var firestormWindow = Firestorm.canvas || Firestorm.dom;
		firestormWindow.addEventListener("mousedown", handleMouseDown, false);
		firestormWindow.addEventListener("mouseup", handleMouseUp, false);
		firestormWindow.addEventListener("mousewheel", handleMouseWheel, false);
		firestormWindow.addEventListener("DOMMouseScroll", handleMouseWheel_FF, false);			
		firestormWindow.addEventListener("touchstart", handleTouchStart, false);
		firestormWindow.addEventListener("touchend", handleTouchEnd, false);

		window.addEventListener("blur", resetPressedKeys, false);

		document.oncontextmenu = function() { return false };
	}

	function resetPressedKeys(e)
	{
		_pressedKeys = {};
	}

	function handleKeyUp(e)
	{
		event = (e) ? e : window.event;
		if(_keycodeToString[event.keyCode] == undefined)
		{
			console.warn('Key not defined: ' + event.keyCode);
		}

		var humanNames = _keycodeToString[event.keyCode].split(" ");

		humanNames.forEach( function(humanName)
		{
			_pressedKeys[humanName] = false;
			if(_onKeyUpCallbacks[humanName])
			{
				_onKeyUpCallbacks[humanName](humanName);
				e.preventDefault();
			}
			if(_preventDefaultKeys[humanName]) { e.preventDefault() }
		});
	}

	function handleKeyDown(e)
	{
		event = (e) ? e : window.event;
		if(_keycodeToString[event.keyCode] == undefined)
		{
			console.warn('Key not defined: ' + event.keyCode);
		}

		var humanNames = _keycodeToString[event.keyCode].split(" ");

		humanNames.forEach( function(humanName)
		{
			_pressedKeys[humanName] = true;
			if(_onKeyDownCallbacks[humanName])
			{
				_onKeyDownCallbacks[humanName](humanName);
				e.preventDefault();
			}
			if(_preventDefaultKeys[humanName]) { e.preventDefault() }
		});
	}

	function setMousePosition(e)
	{
		_mouseX = (e.pageX || e.clientX) - Firestorm.canvas.offsetLeft;
		_mouseY = (e.pageY || e.clientY) - Firestorm.canvas.offsetTop;
	}

	function handleMouseDown(e)
	{
		event = (e) ? e : window.event;
		var humanName = _mouseButtonCodeToString[event.button];

		if (navigator.appName == "Microsoft Internet Explorer")
		{
			humanName = _IEMouseButtonCodeToString[event.button];
		}

		_pressedKeys[humanName] = true;

		if(_onKeyDownCallbacks[humanName])
		{
			_onKeyDownCallbacks[humanName](humanName);
			e.preventDefault();
		}
	}

	function handleMouseUp(e)
	{
		event = (e) ? e : window.event;
		var humanName = _mouseButtonCodeToString[event.button];

		if (navigator.appName == "Microsoft Internet Explorer")
		{
			humanName = _IEMouseButtonCodeToString[event.button];
		}

		_pressedKeys[humanName] = false;

		if(_onKeyUpCallbacks[humanName])
		{
			_onKeyUpCallbacks[humanName](humanName);
			e.preventDefault();
		}
	}

	function handleMouseWheel(e)
	{
		event = (e) ? e : window.event;
		e.preventDefault();

		_mouseWheel = e.wheelDelta / 120;

		if(_mouseWheel > 0)
		{
			_pressedKeys['mouse_wheel_up'] = true;
		}
		else if(_mouseWheel < 0)
		{
			_pressedKeys['mouse_wheel_down'] = true;
		}

		e.preventDefault();
	}

	function handleMouseWheel_FF(e)
	{
		event = (e) ? e : window.event;
		e.preventDefault();

		_mouseWheel = e.detail / 3;

		if(_mouseWheel > 0)
		{
			_pressedKeys['mouse_wheel_up'] = true;
		}
		else if(_mouseWheel < 0)
		{
			_pressedKeys['mouse_wheel_down'] = true;
		}

		e.preventDefault();
	}

	function handleTouchStart(e)
	{
		event = (e) ? e : window.event;
		_pressedKeys["left_mouse_button"] = true;
		this._mouseX = e.touches[0].pageX - Firestorm.canvas.offsetLeft;
		this._mouseY = e.touches[0].pageY - Firestorm.canvas.offsetTop;
		//e.preventDefault();
	}

	function handleTouchEnd(e)
	{
		event = (e) ? e : window.event;
		_pressedKeys["left_mouse_button"] = false;
		this._mouseX = undefined;
		this._mouseY = undefined;
		//e.preventDefault();
	}

	this.preventDefaultKeys = function(arrayOfStrings)
	{
		arrayOfStrings.forEach(function(item, index)
		{
			_preventDefaultKeys[item] = true;
		});
	}

	this.getWheel = function()
	{
		if(_mouseWheel != 0)
		{
			_prevMouse_wheel = _mouseWheel;
			_mouseWheel = 0;
			return _prevMouse_wheel;
		}
		_mouseWheel = 0;
		return _mouseWheel;
	}

	this.getPrevWheel = function()
	{
		if(_mouseWheel != 0)
		{
			_prevMouse_wheel = _mouseWheel;
		}
		else
		{
			_mouseWheel = 0;
		}
		return _prevMouse_wheel;
	}

	this.held = function(keys, logicalAnd)
	{
		if(Firestorm.utility.isString(keys))
		{
			keys = keys.split(" ");
		}

		if(logicalAnd)
		{
			return keys.every(function(key)
			{
				return _pressedKeys[key]
			});
		}
		else
		{
			return keys.some(function(key)
			{
				return _pressedKeys[key]
			});
		}
	}

	this.pressed = function(keys, logicalAnd)
	{
		if(this.held(keys, logicalAnd))
		{
			// Change to return _previouslyPressedKeys[keys] = true; Does this work??
			if(!_previouslyPressedKeys[keys])
			{
				_previouslyPressedKeys[keys] = true;
				return true;
			}
		}
		else
		{
			_previouslyPressedKeys[keys] = false;
			return false;
		}
	}

	this.onKeyDown = function(key, callback)
	{
		if(Firestorm.utility.isArray(key))
		{
			for(var i = 0; key[i]; i++)
			{
				_onKeyDownCallbacks[key[i]] = callback;
			}
		}
		else
		{
			_onKeyDownCallbacks[key[i]] = callback;
		}
	}

	this.onKeyUp = function(key, callback)
	{
		if(Firestorm.utility.isArray(key))
		{
			for(var i = 0; key[i]; i++)
			{
				_onKeyUpCallbacks[key[i]] = callback;
			}
		}
		else
		{
			_onKeyUpCallbacks[key[i]] = callback;
		}
	}

	this.clearKeyCallbacks = function()
	{
		_onKeyUpCallbacks = [];
		_onKeyDownCallbacks = [];
	}

	this.getMouseX = function()
	{
		return _mouseX;
	}

	this.getMouseY = function()
	{
		return _mouseY;
	}
}