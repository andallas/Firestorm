Animation = function Animation(options)
{
	if(!(this instanceof arguments.callee))
	{
		return new arguments.callee(options);
	}

	this.options = options;
	this.set(options);
}

Animation.prototype.set = function(options)
{
	this.options = options;
	this.frames = options.frames || [];
	this.frame_duration = options.frame_duration || 100;
	this.index = options.index || 0;
	this.loop = (options.loop == undefined) ? 1 : options.loop;
	this.bounce = options.bounce || 0;
	this.frame_direction = 1;
	this.frame_size = options.frame_size;
	this.orientation = options.orientation || "down";
	this.on_end = options.on_end || null;
	this.offset = options.offset || 0;

	if(options.scale_image)
	{
		var image = (Firestorm.utility.isDrawable(options.sprite_sheet) ? options.sprite_sheet : Firestorm.assetManager.get(options.sprite_sheet));
		this.frame_size[0] *= options.scale_image;
		this.frame_size[1] *= options.scale_image;
	}

	if(options.sprite_sheet)
	{
		var image = (Firestorm.utility.isDrawable(options.sprite_sheet) ? options.sprite_sheet : Firestorm.assetManager.get(options.sprite_sheet));
		var sprite_sheet = new SpriteSheet({image: image, frame_size: this.frame_size, orientation: this.orientation, offset: this.offset});
		this.frames = sprite_sheet.frames;
	}

	this.current_tick = (new Date()).getTime();
	this.last_tick = (new Date()).getTime();
	this.sum_tick = 0;
}

Animation.prototype.update = function()
{
	this.current_tick = (new Date()).getTime();
	this.sum_tick += (this.current_tick - this.last_tick);
	this.last_tick = this.current_tick;

	if(this.sum_tick > this.frame_duration)
	{
		this.index += this.frame_direction;
		this.sum_tick = 0;
	}
	if( (this.index >= this.frames.length) || (this.index < 0) )
	{
		if(this.bounce)
		{
			this.frame_direction = -this.frame_direction;
			this.index += this.frame_direction * 2;
		}
		else if(this.loop)
		{
			this.index = 0;
		}
		else
		{
			this.index -= this.frame_direction;
			if (this.on_end)
			{
				this.on_end();
				this.on_end = null;
			}
		}
	}
	return this;
}

Animation.prototype.slice = function(start, stop)
{
	var o = {};
	o.frame_duration = this.frame_duration;
	o.loop = this.loop;
	o.bounce = this.bounce;
	o.on_end = this.on_end;
	o.frame_direction = this.frame_direction;
	o.frames = this.frames.slice().slice(start, stop);
	return new Animation(o);
}

Animation.prototype.next = function()
{
	this.update();
	return this.frames[this.index];
}

Animation.prototype.atLastFrame = function()
{
	return (this.index == this.frames.length-1);
}

Animation.prototype.atFirstFrame = function()
{
	return (this.index == 0);
}

Animation.prototype.currentFrame = function()
{
	return this.frames[this.index];
}