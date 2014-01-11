SpriteSheet = function SpriteSheet(options)
{
	if(!(this instanceof arguments.callee))
	{
		return new arguments.callee(options);
	}

	this.options = options;
	this.set(options);
}

SpriteSheet.prototype.set = function(options)
{
	function cutImage(image, x, y, width, height)
	{
		var cut = document.createElement("canvas");
		cut.width = width;
		cut.height = height;

		var ctx = cut.getContext("2d");
		ctx.drawImage(image, x, y, width, height, 0, 0, cut.width, cut.height);

		return cut;
	};
	
	this.image = Firestorm.utility.isDrawable(options.image) ? options.image : Firestorm.assetManager.data[options.image];
	this.orientation = options.orientation || "down";
	this.frame_size = options.frame_size || [32,32];
	this.frames = [];
	this.offset = options.offset || 0;

	if(options.scale_image)
	{
		var image = (Firestorm.utility.isDrawable(options.image) ? options.image : Firestorm.assetManager.get(options.image));
		this.frame_size[0] *= options.scale_image;
		this.frame_size[1] *= options.scale_image;
	}

	var index = 0;

	if(this.orientation == "down")
	{
		for(var y=this.offset; y < this.image.height; y += this.frame_size[1])
		{
			for(var x=0; x < this.image.width; x += this.frame_size[0])
			{
				this.frames.push( cutImage(this.image, x, y, this.frame_size[0], this.frame_size[1]) );
			}
		}
	}
	else
	{
		for(var x=this.offset; x < this.image.width; x += this.frame_size[0])
		{
			for(var y=0; y < this.image.height; y += this.frame_size[1])
			{
				this.frames.push( cutImage(this.image, x, y, this.frame_size[0], this.frame_size[1]) );
			}
		}
	}
}