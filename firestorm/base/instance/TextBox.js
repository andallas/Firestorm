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
	@param baseline				string: the baseline to be used for the text
	@param textWrap				bool: whether or not the text should wrap to the next line
*/
TextBox = function TextBox(options)
{
	if(!(this instanceof arguments.callee))
	{
		return new arguments.callee(options);
	}

	this.context = Firestorm.context;
	this.options = options;
	this.setOptions(options);
}

TextBox.prototype.setOptions = function(options)
{
	// Size & Postion
	this.width = options.width || this.width || 100;
	this.height = options.height || this.height || options.fontSize + 10 || 30;
	this.x = options.x || this.x;
	this.y = options.y || this.y;
	
	// Colors
	this.fontColor = options.fontColor || this.fontColor || {red: 255, green: 255, blue: 255, alpha: 1.0};
	this.fontColor = Firestorm.utility.getColor(this.fontColor);
	
	// Text
	this.text = options.text || this.text;
	this.fontSize = options.fontSize || this.fontSize || 20;
	this.font = options.font || this.font || 'helvetica';

	// Formatting options
	this.alignment = options.alignment || this.alignment || 'center';
	this.textWrap = options.textWrap || this.textWrap || false;
	this.baseline = options.baseline || this.baseline || 'middle';
}

TextBox.prototype.draw = function()
{
	this.context.save();
		this.context.globalAlpha = this.bgAlpha;

		// Text
		if(this.text !== undefined)
		{
			this.context.textAlign  = this.alignment;
			this.context.textBaseline = this.baseline;
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

			if(Firestorm.DEBUG)
			{
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