/*
	@param context 				Context: this is an optional context to use for rendering. Defaults to Firestorm.context
	@param scale 				int: an integer that determines how much to scale this entity on the x and y axis. Defaults to 1
	@param x 					int: the world x coordinate for this object. Defaults to 0
	@param y 					int: the world y coordinate for this object. Defaults to 0
	@param alpha 				float: the alpha level that represents the opacity of this object. The range should be from 0.0 to 1.0 where 1.0 is full opacity. Defaults to 1.0
	@param angle 				int: the amount, in radians, to rotate this entity. Defaults to 0
	@param mirrored 			string: this is either horizontal or vertical and indicates the axis to mirror the image on. Defaults to null
	@param anchor 				string: a string that represents the anchor point on this object. Defaults to top_left
	@param blendMode 			string: the blending mode for transparent layers. No defaults
	@param animation 			animaiton: the animation frames if this object should be animated. Either this or image is required. No defaults
	@param image 				image: the image to use for this object. Either this or animation is required. No defaults
	@param offset 				int[]: an array of two integers that indicates how many pixels to offset in the x and y direction. No defaults
*/
Entity = function Entity(options)
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

Entity.prototype.set = function(options)
{
	this.scale_x = this.scale_y = (options.scale || 1);
	this.position = new Vec2({x: options.x || 0, y: options.y || 0});
	this.alpha = (options.alpha === undefined) ? 1 : options.alpha;
	this.angle = options.angle || 0;
	this.mirrored = options.mirrored || null;
	this.anchor(options.anchor || 'top_left');
	this.blendMode = options.blendMode;
	this.animation = options.animation;
	options.image && this.setImage(options.image);
	this.imagePath = options.image;
	this.offset = options.offset
	
	this.cacheOffsets();

	return this;
}

Entity.prototype.setImage = function(image)
{
	var that = this;
	if(Firestorm.utility.isDrawable(image))
	{
		this.image = image;
		return this.cacheOffsets();
	}
	else
	{
		if(Firestorm.assetManager.isLoaded(image))
		{
			this.image = Firestorm.assetManager.get(image);
			this.cacheOffsets();
		}
		else
		{
			Firestorm.assetManager.load(image, function()
			{
				that.image = Firestorm.assetManager.get(value); that.cacheOffsets();
			});
		}
	}
	return this;
}

Entity.prototype.mirror =		 function(value) { this.mirrored = value; return this };
Entity.prototype.rotate =        function(value) { this.angle += value; return this };
Entity.prototype.rotateTo =      function(value) { this.angle = value; return this };

Entity.prototype.anchor = function(value)
{
	var anchors =
	{
		top_left: 		[  0,   0],
		middle_left: 	[  0, 0.5],
		bottom_left: 	[  0,   1],
		top_middle: 	[0.5,   0],
		center: 		[0.5, 0.5],
		bottom_middle: 	[0.5,   1],
		top_right: 		[  1,   0],
		middle_right: 	[  1, 0.5],
		bottom_right: 	[  1,   1],
	};

	if(a = anchors[value])
	{
		this.anchor_x = a[0];
		this.anchor_y = a[1];
		if(this.image)
		{
			this.cacheOffsets();
		}
	}

	return this;
}

Entity.prototype.cacheOffsets = function()
{
	if(!this.image)
	{
		return;
	}

	this.width = this.image.width * this.scale_x;
	this.height = this.image.height * this.scale_y;
	this.leftOffset = this.width * this.anchor_x;
	this.topOffset = this.height * this.anchor_y;
	this.rightOffset = this.width * (1.0 - this.anchor_x);
	this.bottomOffset = this.height * (1.0 - this.anchor_y);

	return this;
}

Entity.prototype.draw = function()
{
	if(!this.image)
	{
		return this;
	}

	this.context.save();
		if(this.blendMode != undefined)
		{
			Firestorm.context.globalCompositeOperation = this.blendMode;
		}

		this.context.translate(this.position.x - this.leftOffset, this.position.y - this.topOffset);
		if(this.mirrored == "horizontal")
		{
			this.context.scale(1, -1);
			if(this.offset)
			{
				this.context.translate(this.offset[0], this.offset[1]);
			}
		}
		else if(this.mirrored == "vertical")
		{
			this.context.scale(-1, 1);
			if(this.offset)
			{
				this.context.translate(this.offset[0], this.offset[1]);
			}
		}

		if(this.angle != 0)
		{
			if(this.rotatePoint)
			{
				Firestorm.context.translate(this.rotatePoint.x, this.rotatePoint.y);
				Firestorm.context.rotate(this.angle * Math.PI / 180);
				Firestorm.context.translate(-this.rotatePoint.x, -this.rotatePoint.y);
			}
			else
			{
				Firestorm.context.rotate(this.angle * Math.PI / 180);
			}
		}
		this.context.globalAlpha = this.alpha;
		this.context.translate(-this.left_offset, -this.top_offset);
		this.context.drawImage(this.image, 0, 0, this.width, this.height);

		// Debug
		if(Firestorm.DEBUG)
		{
			Firestorm.context.globalCompositeOperation = 'lighter';
			this.context.beginPath();
				this.context.moveTo(0, 0);
				this.context.lineTo(this.width, 0);
				this.context.lineTo(this.width, this.height);
				this.context.lineTo(0, this.height);
				this.context.lineTo(0, 0);
				this.context.lineWidth = 1;
				this.context.strokeStyle = "#FF0000";
				this.context.stroke();
			this.context.closePath();
		}
	this.context.restore();
	return this;
}