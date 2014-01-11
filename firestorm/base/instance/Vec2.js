Vec2 = function Vec2(options)
{
	if(!(this instanceof arguments.callee))
	{
		return new arguments.callee(options);
	}

	this.set(options);
}

Vec2.prototype.set = function(options)
{
	this.x = options.x;
	this.y = options.y;

	return this;
}

// Adds the passed vector to the current vector
Vec2.prototype.addVec = function(vect)
{
	this.x += vect.x;
	this.y += vect.y;
	return this;
}

// Subtracts the passed vector to the current vector
Vec2.prototype.subVec = function(vect)
{
	this.x -= vect.x;
	this.y -= vect.y;
	return this;
}

// Multiplies the passed vector to the current vector
Vec2.prototype.multVec = function(vect)
{
	this.x *= vect.x;
	this.y *= vect.y;
	return this;
}

// Divides the passed vector to the current vector
Vec2.prototype.divVec = function(vect)
{
	this.x /= vect.x;
	this.y /= vect.y;
	return this;
}

// Returns difference of current vector and passed vector
Vec2.prototype.add = function(vect)
{
	var newVec = new Vec2({x: this.x + vect.x, y: this.y + vect.y});
	return newVec;
}

// Returns difference of current vector and passed vector
Vec2.prototype.sub = function(vect)
{
	var newVec = new Vec2({x: this.x - vect.x, y: this.y - vect.y});
	return newVec;
}

// Returns product of current vector and passed vector
Vec2.prototype.mult = function(vect)
{
	var newVec = new Vec2({x: this.x * vect.x, y: this.y * vect.y});
	return newVec;
}

// Returns quotient of current vector and passed vector
Vec2.prototype.div = function(vect)
{
	var newVec = new Vec2({x: this.x / vect.x, y: this.y / vect.y});
	return newVec;
}

// Returns sum of current vector and scalar value
Vec2.prototype.addScalar = function(scal)
{
	var newVec = new Vec2({x: this.x + scal, y: this.y + scal});
	return newVec;
}

// Returns difference of current vector and scalar value
Vec2.prototype.subScalar = function(scal)
{
	var newVec = new Vec2({x: this.x - scal, y: this.y - scal});
	return newVec;
}

// Returns product of current vector and scalar value
Vec2.prototype.multScalar = function(scal)
{
	var newVec = new Vec2({x: this.x * scal, y: this.y * scal});
	return newVec;
}

// Returns quotient of current vector and scalar value
Vec2.prototype.divScalar = function(scal)
{
	var newVec = new Vec2({x: this.x / scal, y: this.y / scal});
	return newVec;
}

// Returns dot product of current vector and passed vector
Vec2.prototype.dot = function(vect)
{
	return (this.x * vect.x) + (this.y * vect.y);
}

// Returns magnitude of current vector
Vec2.prototype.magnitude = function()
{
	var mag = Math.sqrt((this.x * this.x + this.y * this.y));
	return mag;
}

// Returns vector that is between current vector and passed vector, where second parameter is percentage distance between both vectors
// (Linear interpolation between 2 vectors)
Vec2.prototype.lerp = function(vect, scal)
{
	var temp = new Vec2({x: this.x, y: this.y});
	var temp2 = new Vec2({x: vect.x, y: vect.y});
	temp.set(temp.sub(temp2));
	temp.set(temp.scalMult(scal));
	temp.set(temp.add(temp2));
	return temp;
}

// Returns distance between current vector and passed vector
Vec2.prototype.distance = function(vect)
{
	var distance = Math.sqrt((vect.x - this.x) * (vect.x - this.x) + (vect.y - this.y) * (vect.y - this.y));
	return distance;
}

// Returns angle in degrees between origin and current vector
Vec2.prototype.curAngleDegrees = function()
{
	var angle = Math.atan2(this.y, this.x);
	angle = angle / Math.PI * 180;
	return angle;
}

// Returns angle in radians between origin and current vector
Vec2.prototype.curAngleRad = function()
{
	var angle = Math.atan2(this.y, this.x);
	return angle;
}

// Returns normalized version of current vector
Vec2.prototype.normalize = function()
{
	var mag = this.magnitude();
	if(mag == 0)
	{
		mag = 1;
	}
	var newVec = new Vec2({x: this.x / mag, y: this.y / mag});
	return newVec;
}

// Returns the normal vector of current vector
Vec2.prototype.normal = function()
{
	return new Vec2({x: -this.y, y: this.x});
}

// Returns the inverse of the normal vector of current vector
Vec2.prototype.inverseNormal = function()
{
	return new Vec2({x: this.y, y: -this.x});
}

// Returns boolean indicating if current vector and passed vector are equal
Vec2.prototype.equal = function(vect)
{
	if(this.x == vect.x && this.y == vect.y)
	{
		return true;
	}
	return false;
}




// Returns magnitude of a vector created by the given points
Vec2.magnitude = function(x, y)
{
	var mag = Math.sqrt((x * x + y * y));
	return mag;
}

// Returns distance between two passed vectors
Vec2.distance = function(vect1, vect2)
{
	var distance = Math.sqrt((vect2.x - vect1.x) * (vect2.x - vect1.x) + (vect2.y - vect1.y) * (vect2.y - vect1.y));
	return distance;
}

// Converts degrees to radians
Vec2.degreesToRadians = function(degrees)
{
	var radians = degrees * Math.PI / 180;
	return radians;
}

// Converts radians to degrees
Vec2.radiansToDegrees = function(radians)
{
	var degrees = radians / Math.PI * 180;
	return degrees;
}

// Returns angle in degrees between two vectors
Vec2.angleDegrees = function(start, end)
{
	var angle = Math.atan2((end.y - start.y), (end.x - start.x));
	angle = angle / Math.PI * 180;
	return angle;
}

// Returns angle in radians between two vectors
Vec2.angleRad = function(start, end)
{
	var angle = Math.atan2((end.y - start.y), (end.x - start.x));
	return angle;
}

// Reduce magnitude of vector
Vec2.reduceMagnitude = function(vector1, reductionLength) 
{
	var vector2 = vector1;
	vector2 = vector2.scalMult(1 - reductionLength / vector1.magnitude());
	return vector2;
}

// Returns a vector from a given angle
Vec2.vectorFromAngle = function(angle)
{
	return new Vec2({x: -Math.sin(angle), y: Math.cos(angle)});
}

// Returns magnitude of current vector
Vec2.magnitude = function(vect)
{
	var mag = Math.sqrt((vect.x * vect.x + vect.y * vect.y));
	return mag;
}

// Returns magnitude of current vector
Vec2.magnitude = function(x, y)
{
	var mag = Math.sqrt((x * x + y * y));
	return mag;
}

Vec2.reduceMagnitude = function(vector1, reductionLength) 
{
	var vector2 = vector1;
	vector2 = vector2.multScalar(1 - reductionLength / vector1.magnitude());
	return vector2;
}

// Converts degrees to radians
Vec2.degreesToRadians = function(degrees)
{
	var radians = degrees * Math.PI / 180;
	return radians;
}

// Converts radians to degrees
Vec2.radiansToDegrees = function(radians)
{
	var degrees = radians / Math.PI * 180;
	return degrees;
}