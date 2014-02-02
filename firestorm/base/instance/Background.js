/*
	@param context 				Context: this is an optional context to use for rendering. Defaults to Firestorm.context
	@param x 					int: the world x coordinate for this object. Defaults to 0
	@param y 					int: the world y coordinate for this object. Defaults to 0
	@param image 				image: the image to use for this object. Either this or animation is required. No defaults
	@param anchor 				string: a string that represents the anchor point on this object. Defaults to center
	@param depth 				int: the depth level of this object. This affects the draw order as well as the scrolling speed for camera effects. Defaults to 0
	@param alpha 				float: the alpha level that represents the opacity of this object. The range should be from 0.0 to 1.0 where 1.0 is full opacity. Defaults to 1.0
	@param blendMode 			string: the blending mode for transparent layers. No defaults
	@param animation 			animaiton: the animation frames if this object should be animated. Either this or image is required. No defaults
	@param scrollX 				int: this represent the horizontal velocity that this object should scroll at. Defaults to 0
	@param scrollY 				int: this represent the vertical velocity that this object should scroll at. Defaults to 0
	@param loop 				bool: a boolean value that determines if this object should loop once it scrolls to the end. Defaults to false
*/
Background = function Background(options)
{
	if(!(this instanceof arguments.callee))
	{
		return new arguments.callee(options);
	}

	this.options = options;
	this.set(options);

	if(options.context)
	{
		this.context = options.context;
	}
	else
	{
		this.context = Firestorm.context;
	}
}

Background.prototype.set = function(options)
{
	this.setImage(options.image);
	this.anchor(options.anchor || "center");
	this.position = new Vec2({x: options.x || 0, y: options.y || 0});
	this.depth = options.depth || 0;
	this.alpha = options.alpha || 1.0;
	this.blendMode = options.blendMode;
	this.animation = options.animation;
	this.scrollVelocity = new Vec2({x: options.scrollX || 0, y: options.scrollY || 0});
	this.isLoop = options.loop || false;

	return this;
}

Background.prototype.update = function()
{
	this.position = this.position.addVec(this.scrollVelocity);
	if(this.isLoop)
	{
		this.loop();
	}
	if(this.animation)
	{
		this.setImage(this.animation.next());
	}
	return this;
}

Background.prototype.loop = function()
{
	if(this.position.x > 0)
	{
		this.position.x = this.position.x - this.image.width / 2;
	}
	else if(this.position.x + this.image.width < Firestorm.canvas.width)
	{
		this.position.x = 0;
	}

	if(this.position.y > 0)
	{
		this.position.y = this.position.y - this.image.height / 2;
	}
	else if(this.position.y + this.image.height < Firestorm.canvas.height)
	{
		this.position.y = 0;
	}
}

Background.prototype.draw = function()
{
	Firestorm.context.save();
		if(this.blendMode !== undefined)
		{
			Firestorm.context.globalCompositeOperation = this.blendMode;
		}

		Firestorm.context.beginPath();
			Firestorm.context.globalAlpha = this.alpha;
			Firestorm.context.translate(this.position.x, this.position.y);
			Firestorm.context.drawImage(this.image, 0, 0, this.width, this.height);
		Firestorm.context.fill();

	Firestorm.context.restore();
	return this;
}

Background.prototype.setImage = function(value)
{
	var that = this;

	if(Firestorm.utility.isDrawable(value))
	{
		this.image = value;
	}
	else
	{
		if(Firestorm.assetManager.isLoaded(value))
		{
			this.image = Firestorm.assetManager.get(value);
		}
		else
		{
			Firestorm.assetManager.load(value, function() { that.image = Firestorm.assetManager.get(value); });
		}
	}
}

Background.prototype.anchor = function(value)
{
	var anchors =
	{
		top_left: [0,0],
		left_top: [0,0],
		center_left: [0,0.5],
		left_center: [0,0.5],
		bottom_left: [0,1],
		left_bottom: [0,1],
		top_center: [0.5,0],
		center_top: [0.5,0],
		center_center: [0.5,0.5],
		center: [0.5,0.5],
		bottom_center: [0.5,1],
		center_bottom: [0.5,1],
		top_right: [1,0],
		right_top: [1,0],
		center_right: [1,0.5],
		right_center: [1,0.5],
		bottom_right: [1,1],
		right_bottom: [1,1]
	};

	if(a = anchors[value])
	{
		this.anchor_x = a[0];
		this.anchor_y = a[1];
		if(this.image)
			this.left_offset = this.image.width * this.anchor_x;
			this.top_offset = this.image.height * this.anchor_y;
			this.right_offset = this.image.width * (1.0 - this.anchor_x);
			this.bottom_offset = this.image.height * (1.0 - this.anchor_y);
	}
	return this;
}