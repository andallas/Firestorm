TabGroup = function TabGroup(options)
{
	if(!(this instanceof arguments.callee))
	{
		return new arguments.callee(options);
	}
	this.options = options || {};
	this.tabs = this.options.tabs || [];
}

TabGroup.prototype.update = function()
{
	for(var i = 0; i < this.tabs.length; i++)
	{
		this.tabs[i].update();
		/*if(this.tabs[i].update())
		{
			for(var j = 0; j < this.tabs.length; j++)
			{
				console.log('test');
				if(j == i)
				{
					continue;
				}
				this.tabs[j].active = false;
				this.tabs[j].state = 'default';
			}
		}*/
	}
}

TabGroup.prototype.draw = function()
{
	for(var i = 0; i < this.tabs.length; i++)
	{
		this.tabs[i].draw();
	}
}

TabGroup.prototype.addTab = function(tab)
{
	this.tabs.push(tab);
}