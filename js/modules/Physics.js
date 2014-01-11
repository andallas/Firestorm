function Physics()
{
	var GRAVITY = 9.8;
	var FRICTION = 0.99;
	var MAX_SPEED = 1000;

	this.gravity = function()
	{
		return GRAVITY;
	}

	this.friction = function()
	{
		return FRICTION;
	}

	this.maxSpeed = function()
	{
		return MAX_SPEED;
	}

	this.AABBCollide = function(circle, rect)
	{
		if(circle.radius)
		{
			if(
					(((circle.position.x - circle.radius > rect.position.x - rect.width * 0.5)
					&&
					(circle.position.x - circle.radius < rect.position.x + rect.width * 0.5))
				||
					((rect.position.x - rect.width * 0.5 > circle.position.x - circle.radius)
					&&
				 	(rect.position.x - rect.width * 0.5 < circle.position.x + circle.radius)))
			&&
		   			(((circle.position.y - circle.radius > rect.position.y - rect.height * 0.5)
	   				&&
					(circle.position.y - circle.radius < rect.position.y + rect.height * 0.5))
				||
		    		((rect.position.y - rect.height * 0.5 > circle.position.y - circle.radius)
	    			&&
			 		(rect.position.y - rect.height * 0.5 < circle.position.y + circle.radius))))
			{
				return true;
			}
		}
		else
		{
			if(
					(((circle.position.x - circle.width * 0.5 > rect.position.x - rect.width * 0.5)
					&&
					(circle.position.x - circle.width * 0.5 < rect.position.x + rect.width * 0.5))
				||
					((rect.position.x - rect.width * 0.5 > circle.position.x - circle.width * 0.5)
					&&
				 	(rect.position.x - rect.width * 0.5 < circle.position.x + circle.width * 0.5)))
			&&
		   			(((circle.position.y - circle.height * 0.5 > rect.position.y - rect.height * 0.5)
	   				&&
					(circle.position.y - circle.height * 0.5 < rect.position.y + rect.height * 0.5))
				||
		    		((rect.position.y - rect.height * 0.5 > circle.position.y - circle.height * 0.5)
	    			&&
			 		(rect.position.y - rect.height * 0.5 < circle.position.y + circle.height * 0.5))))
			{
				return true;
			}
		}
		return false;
	}

	this.AABBCollisionSide = function(circle, rect)
	{
		var x;
		var y;
		var xAxis;
		var yAxis;

		if(circle.position.x < rect.position.x)
		{
			x = Math.abs((rect.position.x + rect.width * 0.5) - (circle.position.x + circle.radius));
			xAxis = 3;
		}
		else
		{
			x = Math.abs((circle.position.x + circle.radius) - (rect.position.x + rect.width * 0.5));
			xAxis = 1;
		}

		if(circle.position.y > rect.position.y)
		{
			y = Math.abs((rect.position.y + rect.height * 0.5) - (circle.position.y + circle.radius));
			yAxis = 2;			
		}
		else
		{
			y = Math.abs((circle.position.y + circle.radius) - (rect.position.y + rect.height * 0.5));
			yAxis = 0;
		}

		if(x < y)
		{
			return xAxis;
		}
		else
		{
			return yAxis;
		}
	}

	this.LineIntersectionPoint = function(start1, end1, start2, end2)
	{
		// Get A,B,C of first line - points : start1 to end1
		var A1 = end1.y - start1.y;
		var B1 = start1.x - end1.x;
		var C1 = A1 * start1.x + B1 * start1.y;

		// Get A,B,C of second line - points : start2 to end2
		var A2 = end2.y - start2.y;
		var B2 = start2.x - end2.x;
		var C2 = A2 * start2.x + B2 * start2.y;

		// Get delta and check if the lines are parallel
		var delta = A1 * B2 - A2 * B1;
		if(delta == 0)
		{
			console.warn("Lines are parallel");
			return false;
		}

		// Return the Vec2 intersection point
		return new Vec2({	x: (B2 * C1 - B1 * C2) / delta,
							y: (A1 * C2 - A2 * C1) / delta
						});
	}

	this.reflection = function(velocity, normal)
	{
		var norm = normal.normalize();
		var norm2 = norm.multScalar(2);
		var normDot = norm.dot(velocity);
		var norm2Dot = norm2.multScalar(normDot);
		velocity = velocity.sub(norm2Dot);
		return velocity;
	}
}