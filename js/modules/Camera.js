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
	this.scale_horizontal		= 1;
	this.scale_vertical			= 1;
	this.skew_horizontal		= 0;
	this.skew_vertical			= 0;
	this.translate_horizontal	= 0;
	this.translate_vertical		= 0;

	this.position = new Vec2({x: Firestorm.canvas.width / 2, y: Firestorm.canvas.height / 2});
	this.followSpeed = 0.5;
	this.zoomLevel = 1;

	return this;
}

Camera.prototype.update = function(translate, velocity)
{
	// Zoom
	this.scale_horizontal = Firestorm.utility.Lerp(this.scale_horizontal, this.zoomLevel);
	this.scale_vertical = Firestorm.utility.Lerp(this.scale_vertical, this.zoomLevel);

	// Follow
	if(velocity)
	{
		this.position.x = Firestorm.utility.Lerp(this.position.x, translate.x + (velocity.x * this.followSpeed));
		this.position.y = Firestorm.utility.Lerp(this.position.y, translate.y + (velocity.y * this.followSpeed));
	}
	else
	{
		this.position = translate;
	}
	this.translate_horizontal = -this.position.x * this.scale_horizontal + Firestorm.canvas.width / 2;
	this.translate_vertical = -this.position.y * this.scale_vertical + Firestorm.canvas.height / 2;
}

Camera.prototype.zoom = function(value)
{
	this.zoomLevel += value;
	// Lock between 0 and 1.666
	this.zoomLevel = this.zoomLevel > 2 ? 2 : this.zoomLevel < 0 ? 0.1 : this.zoomLevel;
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