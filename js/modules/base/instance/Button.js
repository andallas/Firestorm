/*
	@param x 					int: the x-coordinate of the button in pixels
	@param y 					int: the y-coordinate of the button in pixels
	@param width 				int: the width of the button in pixels
	@param height 				int: the height of the button in pixels
	@param borderWidth 			int: the width of the border in pixels
	@param topLeft 				int: determines how round the corner is on the button in pixels
	@param topRight 			int: determines how round the corner is on the button in pixels
	@param bottomLeft 			int: determines how round the corner is on the button in pixels
	@param bottomRight 			int: determines how round the corner is on the button in pixels
	@param shadowOffsetX 		int: the x-offset of the shadow, from the x-coordinate of the button in pixels
	@param shadowOffsetY 		int: the y-offset of the shadow, from the y-coordinate of the button in pixels
	@param shadowBlur 			int: the amount of shadow blur, in pixels
	@param bgColor 				color: the color of the background, accepts a color
	@param gradColor 			color[]: the color of the gradient, accepts an array of colors
	@param strokeColor 			color: the color of the border, accepts a color
	@param shadowColor 			color: the color of the shadow, accepts a color
	@param bgImage 				image: the background image to be used, overrides any background colors, or gradients
	@param repeat				string: the repeat for the background image; accepts either 'repeat-x', 'repeat-y', 'repeat', or 'no-repeat'. Defaults to 'repeat'
	@param text 				string: the text string to be displayed on the button
	@param fontSize 			int: the font size for the text string
	@param font 				font: the font for the text string
	@param fontColor 			color: the color of the text string, accepts a color
*/
Button = function Button(defaultOptions, focusOptions, hoverOptions)
{
	if(!(this instanceof arguments.callee))
	{
		return new arguments.callee(defaultOptions, focusOptions, hoverOptions, mouseDownOptions);
	}

	this.context = Firestorm.context;

	// State
	this.state = 'default';
	this.active = false;
	this.toggle = defaultOptions.toggle || false;

	this.x = defaultOptions.x;
	this.y = defaultOptions.y;
	this.width = defaultOptions.width || 128;
	this.height = defaultOptions.height || 32;
	this.borderWidth = defaultOptions.borderWidth || 0;
	this.orientation = (this.width < this.height) ? 'vertical' : 'horizontal';

	// Corners
	this.topLeft = defaultOptions.topLeft || 0;
	this.topRight = defaultOptions.topRight || 0;
	this.bottomLeft = defaultOptions.bottomLeft || 0;
	this.bottomRight = defaultOptions.bottomRight || 0;

	// Shadow
	this.shadowOffsetX = defaultOptions.shadowOffsetX || 0;
	this.shadowOffsetY = defaultOptions.shadowOffsetY || 0;
	this.shadowBlur = defaultOptions.shadowBlur || 0;

	// Colors
	this.bgColor = defaultOptions.bgColor || undefined;
	this.bgColor = Firestorm.utility.getColor(this.bgColor);
	this.gradColor = defaultOptions.gradColor || undefined;
	if(this.gradColor)
	{
		for(var i = 0; i < this.gradColor.length; i++)
		{
			this.gradColor[i] = Firestorm.utility.getColor(this.gradColor[i]);
		}
	}
	this.strokeColor = defaultOptions.strokeColor || undefined;
	this.strokeColor = Firestorm.utility.getColor(this.strokeColor);
	this.shadowColor = defaultOptions.shadowColor || undefined;
	this.shadowColor = Firestorm.utility.getColor(this.shadowColor);
	if(this.bgColor === undefined && this.strokeColor === undefined && this.shadowColor === undefined && this.gradColor === undefined && this.bgImage === undefined)
		this.bgColor = Firestorm.utility.getColor({red: 127, green: 127, blue: 127, alpha: 1.0});

	// Image
	this.setImage(defaultOptions.bgImage);
	this.repeat = defaultOptions.repeat || 'repeat';

	// Text
	this.text = defaultOptions.text || undefined;
	this.fontSize = defaultOptions.fontSize || 32;
	this.font = defaultOptions.font || "audiowide";
	this.fontColor = defaultOptions.fontColor || {red: 255, green: 255, blue: 255, alpha: 1.0};
	this.fontColor = Firestorm.utility.getColor(this.fontColor);

	this.setOptions(defaultOptions);
	this.defaultOptions = defaultOptions;
	this.focusOptions = focusOptions || defaultOptions;
	this.hoverOptions = hoverOptions || defaultOptions;
}

Button.prototype.update = function()
{
	var clicked = false;
	if(Firestorm.input.getMouseX() > this.x && Firestorm.input.getMouseX() < this.x + this.width)
	{
		if(Firestorm.input.getMouseY() > this.y && Firestorm.input.getMouseY() < this.y + this.height)
		{
			if(Firestorm.input.pressed('left_mouse_button'))
			{
				clicked = true;
				if(this.toggle)
				{
					this.active = !this.active;
					this.state = 'focus';
				}
			}

			if(!this.active)
			{
				this.state = 'hover';
			}
		}
	}
	else
	{
		if(!this.active)
		{
			this.state = 'default';
		}
	}
	
	switch(this.state)
	{
		case 'focus':
			this.setOptions(this.focusOptions);
		break;
		case 'hover':
			this.setOptions(this.hoverOptions);
		break;
		case 'default': default:
			this.setOptions(this.defaultOptions);
		break;
	}

	return clicked;
}

Button.prototype.setOptions = function(options)
{
	this.toggle = options.toggle || this.toggle;

	// Size/shape
	this.x = options.x || this.x;
	this.y = options.y || this.y;
	this.width = options.width || this.width;
	this.height = options.height || this.height;
	this.borderWidth = options.borderWidth || this.borderWidth;

	// Corners
	this.topLeft = options.topLeft || this.topLeft;
	this.topRight = options.topRight || this.topRight;
	this.bottomLeft = options.bottomLeft || this.bottomLeft;
	this.bottomRight = options.bottomRight || this.bottomRight;

	// Shadow
	this.shadowOffsetX = options.shadowOffsetX || this.shadowOffsetX;
	this.shadowOffsetY = options.shadowOffsetY || this.shadowOffsetY;
	this.shadowBlur = options.shadowBlur || this.shadowBlur;

	// Colors
	this.bgColor = options.bgColor || this.bgColor;
	this.bgColor = Firestorm.utility.getColor(this.bgColor);
	this.gradColor = options.gradColor || this.gradColor;
	if(this.gradColor)
	{
		for(var i = 0; i < this.gradColor.length; i++)
		{
			this.gradColor[i] = Firestorm.utility.getColor(this.gradColor[i]);
		}
	}
	this.strokeColor = options.strokeColor || this.strokeColor;
	this.strokeColor = Firestorm.utility.getColor(this.strokeColor);
	this.shadowColor = options.shadowColor || this.shadowColor;
	this.shadowColor = Firestorm.utility.getColor(this.shadowColor);
	if(this.bgColor === undefined && this.strokeColor === undefined && this.shadowColor === undefined && this.gradColor === undefined && this.bgImage === undefined)
		this.bgColor = Firestorm.utility.getColor({red: 127, green: 127, blue: 127, alpha: 1.0});

	// Image
	this.setImage(options.bgImage);
	this.repeat = options.repeat || this.repeat;

	// Text
	this.text = options.text || this.text;
	this.fontSize = options.fontSize || this.fontSize;
	this.font = options.font || this.font;
	this.fontColor = options.fontColor || this.fontColor;
	this.fontColor = Firestorm.utility.getColor(this.fontColor);

	this.orientation = (this.width < this.height) ? 'vertical' : 'horizontal';
}

Button.prototype.draw = function()
{
	this.context.save();
		// Stroke and fill
		if(this.strokeColor)
		{
			this.context.strokeStyle = this.strokeColor;
			this.context.lineWidth = this.borderWidth;
		}
		if(this.bgColor)
		{
			this.context.fillStyle = this.bgColor;
		}

		this.context.globalAlpha = this.bgAlpha;

		this.context.beginPath();
			this.context.moveTo(this.x + this.topLeft, this.y);
			

			this.context.lineTo(this.x + this.width - this.topRight, this.y);
			if(this.topRight > 0)
			{
				this.context.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + this.topRight);
			}
			else
			{
				this.context.lineTo(this.x + this.width, this.y);
				this.context.lineTo(this.x + this.width, this.y + this.topRight);
			}


			this.context.lineTo(this.x + this.width, this.y + this.height - this.bottomRight);
			if(this.bottomRight > 0)
			{
				this.context.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - this.bottomRight, this.y + this.height);
			}
			else
			{
				this.context.lineTo(this.x + this.width, this.y + this.height);
				this.context.lineTo(this.x + this.width - this.bottomRight, this.y + this.height);
			}


			this.context.lineTo(this.x + this.bottomLeft, this.y + this.height);
			if(this.bottomLeft > 0)
			{
				this.context.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - this.bottomLeft);
			}
			else
			{
				this.context.lineTo(this.x, this.y + this.height);
				this.context.lineTo(this.x, this.y + this.height - this.bottomLeft);
			}


			this.context.lineTo(this.x, this.y + this.topLeft);
			if(this.topLeft > 0)
			{
				this.context.quadraticCurveTo(this.x, this.y, this.x + this.topLeft, this.y);
			}
			else
			{
				this.context.lineTo(this.x, this.y);
				this.context.lineTo(this.x + this.topLeft, this.y);
			}
		this.context.closePath();

		// Shadow
		if(this.shadowColor)
		{
			this.context.shadowOffsetX = this.shadowOffsetX;
			this.context.shadowOffsetY = this.shadowOffsetY;
			this.context.shadowBlur = this.shadowBlur;
			this.context.shadowColor = this.shadowColor;
		}
		// Background color
		if(this.bgColor)
		{
			this.context.fillStyle = this.bgColor;
		}
		// Gradient
		if(this.gradColor)
		{
			var grd = this.context.createLinearGradient(this.x + this.width / 2, this.y, this.x + this.width / 2, this.y + this.height);
			for(var i = 0; i < this.gradColor.length; i++)
			{
				grd.addColorStop(i / this.gradColor.length, this.gradColor[i]);
			}
			this.context.fillStyle = grd;
		}
		// BG Image
		if(this.bgImage)
		{
			var image = this.context.createPattern(this.bgImage, this.repeat);
			this.context.fillStyle = image;
		}
		this.context.fill();
		// Reset Shadow
		this.context.shadowOffsetX = 0;
		this.context.shadowOffsetY = 0;
		this.context.shadowColor = 0;
		this.context.shadowBlur = 0;
		// Text
		if(this.text !== undefined)
		{
			this.context.textAlign  = "center";
			this.context.textBaseline = "middle";
			this.context.fillStyle  = this.fontColor;
			
			if(this.orientation == 'horizontal')
			{
				if(this.fontSize > this.height - 6)
				{
					this.fontSize = this.height - 6;
				}
				this.context.font = this.fontSize + "px " + this.font;

				while(this.context.measureText(this.text).width > this.width - 30)
				{
					this.text = this.text.substring(0, this.text.length - 1);
				}
			}
			else
			{
				if(this.fontSize > this.width - 6)
				{
					this.fontSize = this.width - 6;
				}
				this.context.font = this.fontSize + "px " + this.font;

				while(this.context.measureText(this.text).width > this.height - 30)
				{
					this.text = this.text.substring(0, this.text.length - 1);
				}
				this.context.rotate(Firestorm.utility.degreeToRadian(90));
			}

			this.context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
		}
		// Border
		if(this.strokeColor)
		{
			this.context.stroke();
		}
	this.context.restore();
	return this;
}

Button.prototype.setImage = function(value)
{
	if(value === undefined)
	{
		return;
	}
	var that = this;

	if(Firestorm.utility.isDrawable(value))
	{
		this.bgImage = value;
	}
	else
	{
		if(Firestorm.assetManager.isLoaded(value))
		{
			this.bgImage = Firestorm.assetManager.get(value);
		}
		else
		{
			Firestorm.assetManager.load(value, function() { that.bgImage = Firestorm.assetManager.get(value); });
		}
	}
}