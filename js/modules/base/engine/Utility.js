function Utility()
{
	this.isFunction = function(possibleFunction)
	{
		return (Object.prototype.toString.call(possibleFunction) === '[object Function]');
	}

	this.isString = function(possibleString)
	{
		return (typeof possibleString == 'string');
	}

	this.isArray = function(possibleArray)
	{
		if(possibleArray === undefined)
		{
			return false;
		}

		return !(possibleArray.constructor.toString().indexOf('Array') == -1);
	}

	this.isImage = function(possibleImage)
	{
		return Object.prototype.toString.call(possibleImage) === '[object HTMLImageElement]';
	}

	this.isCanvas = function(possibleCanvas)
	{
		return Object.prototype.toString.call(possibleCanvas) === '[object HTMLCanvasElement]';
	}

	this.isDrawable = function(possibleDrawable)
	{
		return this.isImage(possibleDrawable) || this.isCanvas(possibleDrawable);
	}

	this.imageToCanvas = function(image)
	{
		var canvas = document.createElement('canvas');
		canvas.src = image.src;
		canvas.width = image.width;
		canvas.height = image.height;

		var context = canvas.getContext('2d');
		context.drawImage(image, 0, 0, image.width, image.height);
		return canvas;
	}

	this.getColor = function(color)
	{
		if(color === undefined)
		{
			return undefined;
		}
		if(typeof color == "string")
		{
			return color;
		}
		if(color.alpha)
		{
			return "rgba(" + color.red + ", " + color.green + ", " + color.blue + ", " + color.alpha + ")";
		}
		return "rgb(" + color.red + ", " + color.green + ", " + color.blue + ")";
	}

	this.getRandomInt = function(min, max)
	{
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	this.roundToDec = function(num, dec)
	{
		var decVal = Math.pow(10, dec);
		var tempNum = Math.floor(num * decVal);
		tempNum = tempNum / decVal;
		return tempNum;
	}

	this.degreeToRadian = function(degree)
	{
		return degree * (Math.PI / 180);
	}

	this.radianToDegree = function(radian)
	{
		return radian * (180 / Math.PI);
	}

	this.Lerp = function(a, b)
	{
		return a + Firestorm.clock.getDelta() * (b - a);
	}

	this.Lerpt = function(a, b, t)
	{
		return a + t * (b - a);
	}
}


Function.prototype.method = function(name, func)
{
	this.prototype[name] = func;
	return this;
}

Function.method('inherits', function(parent)
{
	this.prototype = new parent();
	var d = {};
	var p = this.prototype;
	this.prototype.constructor = parent;
	this.method('uber', function uber(name)
	{
		if(!(name in d))
		{
			d[name] = 0;
		}
		var f, r, t = d[name], v = parent.prototype;
		if(t)
		{
			while(t)
			{
				v = v.constructor.prototype;
				t -= 1;
			}
			f = v[name];
		}
		else
		{
			f = p[name];
			if(f == this[name])
			{
				f = v[name];
			}
		}
		d[name] -= 1;
		r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
		d[name] -= 1;
		return r;
	});
});