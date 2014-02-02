/*
	@param scale_horizontal 		int: indicates the amount the camera will scale everything horizontally. Defaults to 1
	@param scale_vertical 			int: indicates the amount the camera will scale everything vertically. Defaults to 1
	@param skew_horizontal 			int: indicates the amount the camera will skew everything horizontally. Defaults to 0
	@param skew_vertical 			int: indicates the amount the camera will skew everything vertically. Defaults to 0
	@param translate_horizontal 	int: indicates the amount the camera will translate everything horizontally. Defaults to 0
	@param translate_vertical 		int: indicates the amount the camera will translate everything vertically. Defaults to 0
	@param x 						int: the world x coordinate for this object. Defaults to half canvas width
	@param y 						int: the world y coordinate for this object. Defaults to half canvas height
	@param follow_speed 			float: the speed at which the camera will move to the point it is following. Defaults to 0.5
	@param zoom_level 				int: the current zoom level of the camers. Defaults to 1
*/
Camera = function Camera(options)
{
	if(!(this instanceof arguments.callee))
	{
		return new arguments.callee(options);
	}

	this.options = options;
	this.set(options);
}

Camera.prototype.set = function(options)
{
	this.scale_horizontal		= options.scale_horizontal || 1;
	this.scale_vertical			= options.scale_vertical || 1;
	this.skew_horizontal		= options.skew_horizontal || 0;
	this.skew_vertical			= options.skew_vertical || 0;
	this.translate_horizontal	= options.translate_horizontal || 0;
	this.translate_vertical		= options.translate_vertical || 0;

	this.position = new Vec2({x: options.x || Firestorm.canvas.width * 0.5, y: options.y || Firestorm.canvas.height * 0.5});
	this.follow_speed = options.follow_speed || 0.5;
	this.zoom_level = options.zoom_level || 1;

	return this;
}

Camera.prototype.update = function(translate, velocity)
{
	// Zoom
	this.scale_horizontal = Firestorm.utility.Lerp(this.scale_horizontal, this.zoom_level);
	this.scale_vertical = Firestorm.utility.Lerp(this.scale_vertical, this.zoom_level);

	// Follow
	if(velocity)
	{
		this.position.x = Firestorm.utility.Lerp(this.position.x, translate.x + (velocity.x * this.follow_speed));
		this.position.y = Firestorm.utility.Lerp(this.position.y, translate.y + (velocity.y * this.follow_speed));
	}
	else
	{
		this.position = translate;
	}
	this.translate_horizontal = -this.position.x * this.scale_horizontal + Firestorm.canvas.width * 0.5;
	this.translate_vertical = -this.position.y * this.scale_vertical + Firestorm.canvas.height * 0.5;
}

Camera.prototype.zoom = function(value)
{
	this.zoom_level += value;
	// Lock between 0 and 1.666
	this.zoom_level = this.zoom_level > 2 ? 2 : this.zoom_level < 0 ? 0.1 : this.zoom_level;
}

Camera.prototype.draw = function()
{
	Firestorm.context.setTransform(	this.scale_horizontal,
									this.skew_horizontal,
									this.skew_vertical,
									this.scale_vertical,
									this.translate_horizontal,
									this.translate_vertical
								);
}