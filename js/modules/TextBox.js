/*
	@param x 					int: the x-coordinate of the text box in pixels
	@param y 					int: the y-coordinate of the text box in pixels
	@param width 				int: the width of the text box in pixels
	@param height 				int: the height of the text box in pixels
	@param text 				string: the text string to be displayed on the text box
	@param fontSize 			int: the font size for the text string
	@param font 				font: the font for the text string
	@param fontColor 			color: the color of the text string, accepts a color
	@param alignment			string: the alignment to be used for the text
*/
TextBox = function TextBox(options)
{
	if(!(this instanceof arguments.callee))
	{
		return new arguments.callee(options);
	}

	this.context = Firestorm.context;

	// Size & Position
	this.width = options.width || 100;
	this.height = options.height || options.fontSize + 10 || 30;
	this.x = options.x;
	this.y = options.y;
	
	// Colors
	this.fontColor = options.fontColor || {red: 255, green: 255, blue: 255, alpha: 1.0};
	this.fontColor = Firestorm.utility.getColor(this.fontColor);
	
	// Text
	this.text = options.text || undefined;
	this.fontSize = options.fontSize || 20;
	this.font = options.font || "audiowide";

	// Formatting options
	this.alignment = options.alignment || 'center';
	this.textWrap = options.textWrap;

	this.setOptions(options);
}

TextBox.prototype.setOptions = function(options)
{
	// Size & Postion
	this.width = options.width || this.width;
	this.height = options.height || this.height;
	this.x = options.x || this.x;
	this.y = options.y || this.y;
	
	// Colors
	this.fontColor = options.fontColor || this.fontColor;
	this.fontColor = Firestorm.utility.getColor(this.fontColor);
	
	// Text
	this.text = options.text || this.text;
	this.fontSize = options.fontSize || this.fontSize;
	this.font = options.font || this.font;

	// Formatting options
	this.alignment = options.alignment || 'center';
	this.textWrap = options.textWrap;
}

TextBox.prototype.draw = function()
{
	this.context.save();
		this.context.globalAlpha = this.bgAlpha;

		// Text
		if(this.text !== undefined)
		{
			this.context.textAlign  = this.alignment;
			this.context.textBaseline = 'middle';
			this.context.fillStyle  = this.fontColor;
			if(this.fontSize > this.height - 6)
			{
				this.fontSize = this.height - 6;
			}
			this.context.font = this.fontSize + "px " + this.font;
			
			if(this.textWrap)
			{
				this.wrapText(this.text);
			}
			else
			{
				while(this.context.measureText(this.text).width > this.width - 30)
				{
					this.text = this.text.substring(0, this.text.length - 1);
				}
				this.context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
			}

			this.context.beginPath();
				this.context.moveTo(this.x, this.y);
				this.context.lineTo(this.x + this.width, this.y);
				this.context.lineTo(this.x + this.width, this.y + this.height);
				this.context.lineTo(this.x, this.y + this.height);
				this.context.lineTo(this.x, this.y);
				this.context.strokeStyle = 'red';
				this.context.stroke();
			this.context.closePath();
		}
	this.context.restore();
	return this;
}

TextBox.prototype.wrapText = function(text)
{
	var charIndex = 0;
	var lineNum = 0;
	while(charIndex < text.length)
	{
		var nextLine = '';
		while(this.context.measureText(nextLine).width < this.width - 30)
		{
			if(text[charIndex] === undefined)
			{
				break;
			}
			nextLine = nextLine + text[charIndex];
			charIndex++;
		}
		this.context.fillText(nextLine, this.x + this.width / 2, (this.y + this.height / 2) + (this.fontSize * lineNum));
		lineNum++;
	}
}