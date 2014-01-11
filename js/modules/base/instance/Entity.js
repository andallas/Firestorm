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
	this.flipped = options.flipped || false;
	this.mirrored = options.mirrored || false;
	this.anchor(options.anchor || 'center');
	this.blendMode = options.blendMode;
	this.animation = options.animation;
	options.image && this.setImage(options.image);
	this.imagePath = options.image;
	
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

Entity.prototype.flip =          function()      { this.flipped = this.flipped ? false : true; return this };
Entity.prototype.flipTo =        function(value) { this.flipped = value; return this };
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
	this.leftOffset = this.height * (1.0 - this.anchor_y);

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

		this.context.translate(this.position.x, this.position.y);
		if(this.mirrored == "horizontal")
		{
			this.context.scale(1, -1);
		}
		else if(this.mirrored == "vertical")
		{
			this.context.scale(-1, 1);
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
		this.flipped && this.context.scale(-1, 1);
		this.context.globalAlpha = this.alpha;
		this.context.translate(-this.left_offset, -this.top_offset);
		this.context.drawImage(this.image, 0, 0, this.width, this.height);

		// Debug
		if(Firestorm.DEBUG_ENTITY)
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