Parallax = function Parallax(options)
{
	if(!(this instanceof arguments.callee))
	{
		return new arguments.callee(options);
	}

	this.options = options || {};
	this.set(options);
}

Parallax.prototype.set = function(options)
{
	this.layers = [];

	return this;
}

Parallax.prototype.add = function(layer)
{
	this.layers.push(layer);
	this.layers.sort(function(a, b)
	{
		if (a.depth < b.depth)
		{ return -1; }
		if (a.depth > b.depth)
		{ return 1; }
		return 0;
	});
}

Parallax.prototype.update = function()
{
	for(var i = 0; i < this.layers.length; i++)
	{
		this.layers[i].update();
	}
}

Parallax.prototype.updateVelocity = function(velocity)
{
	for(var i = 0; i < this.layers.length; i++)
	{
		this.layers[i].scrollVelocity = velocity.divScalar(Math.floor(Math.abs(this.layers[i].depth)));
	}
}

Parallax.prototype.draw = function()
{
	for(var i = 0; i < this.layers.length; i++)
	{
		this.layers[i].draw();
	}
}