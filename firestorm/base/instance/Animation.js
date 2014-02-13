/*
	@param frames 				image[]: an array of images representing the sliced spritesheet. Either this or a sprite sheet is required. Defaults to an empty array
	@param frame_duration 		int: the duration of a single frame in the animation, in miliseconds. Defaults to 100
	@param index 				dateType: the current index of the array of frames. Defaults to 0
	@param loop 				bool: a boolean value that determines if the animation should loop or not. Defaults to true
	@param bounce 				bool: a boolean value that determines if the animation should 'bounce'. A bounce means that when the animation completes, it loops back in reverse order. Defaults to false
	@param frame_direction 		int: this value should only be 1 or -1. It indicates the direction the animation plays. A 1 indicates it plays forward, and a -1 indicates the animation will play in reverse. Defaults to 1
	@param frame_size 			int[]: an array of integers representing the width and height of a single animation frame. There should only ever be two elements in this array. No default, this parameter is required
	@param orientation 			string: the orientation of an animation frame. Defaults to 'down'
	@param on_end 				function: a function that is called when an animation completes. This will never be called if an animation loops or bounces. Defaults to null
	@param offset 				int: an integer that represents the offset in pixels for the spritesheet. Defaults to 0
	@param sprite_sheet 		SpriteSheet: this is another Firestorm object that handles a the slicing of sprites. Either this or a frames array is required. No default
	@param scale_image 			bool: a boolean value that determines the scale of each animation frame. No default, this parameter is required
*/
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
	this.loop = (options.loop == undefined) ? true : options.loop;
	this.bounce = (options.bounce == undefined) ? false : options.bounce;
	this.frame_direction = options.frame_direction || 1;
	this.frame_size = options.frame_size;
	this.orientation = options.orientation || "down";
	this.on_end = options.on_end || null;
	this.offset = options.offset || 0;

	if(options.sprite_sheet)
	{
		var image = (Firestorm.utility.isDrawable(options.sprite_sheet) ? options.sprite_sheet : Firestorm.assetManager.get(options.sprite_sheet));
		var sprite_sheet = new SpriteSheet({image: image, frame_size: this.frame_size, orientation: this.orientation, offset: this.offset});
		this.frames = sprite_sheet.frames;
		if(options.scale_image)
		{
			var image = (Firestorm.utility.isDrawable(options.sprite_sheet) ? options.sprite_sheet : Firestorm.assetManager.get(options.sprite_sheet));
			this.frame_size[0] *= options.scale_image;
			this.frame_size[1] *= options.scale_image;
		}
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