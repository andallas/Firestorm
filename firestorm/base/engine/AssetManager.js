function AssetManager()
{
	this.loaded = [];
	this.loading = [];
	this.srcList = [];
	this.data = [];

	this.bustCache = false;
	this.isImageToCanvas = true;
	this.isFuchiaToTransparent = true;
	this.root = '';

	this.fileType = {};
	this.fileType['json'] = 'json';
	this.fileType['wav'] = 'audio';
	this.fileType['mp3'] = 'audio';
	this.fileType['ogg'] = 'audio';
	this.fileType['png'] = 'image';
	this.fileType['jpg'] = 'image';
	this.fileType['jpeg'] = 'image';
	this.fileType['gif'] = 'image';
	this.fileType['bmp'] = 'image';
	this.fileType['tiff'] = 'image';

	var that = this;

	this.length = function()
	{
		return this.srcList.length;
	}

	this.get = function(src)
	{
		if(Firestorm.utility.isArray(src))
		{
			return src.map(function(i)
			{
				return that.data[i];
			});
		}
		else
		{
			if(this.loaded[src])
			{
				return this.data[src];
			}
			else
			{
				console.warn('Asset cannot be found: ' + src);
			}
		}
	}

	this.isLoading = function(src)
	{
		return this.loading[src];
	}

	this.isLoaded = function(src)
	{
		return this.loaded[src];
	}

	this.getPostFix = function(src)
	{
		postfix_regexp = /\.([a-zA-z0-9]+)/;
		return postfix_regexp.exec(src)[1];
	}

	this.getType = function(src)
	{
		var postFix = this.getPostFix(src);
		return (this.fileType[postFix] ? this.fileType[postFix] : postFix);
	}

	this.add = function(src)
	{
		if(Firestorm.utility.isArray(src))
		{
			for(var i = 0; src[i]; i++)
			{
				this.add(src[i]);
			}
		}
		else
		{
			this.srcList.push(src);
		}
		return this;
	}

	this.loadAll = function(options)
	{
		this.loadCount = 0;
		this.errorCount = 0;

		this.onload = options.onload;
		this.onerror = options.onerror;
		this.onfinish = options.onfinish;

		for(var i = 0; this.srcList[i]; i++)
		{
			this.load(this.srcList[i]);
		}
	}

	this.getOrLoad = function(src, onload, onerror)
	{
		if(this.data[src])
		{
			onload();
		}
		else
		{
			this.load(src, onload, onerror);
		}
	}

	this.load = function(src, onload, onerror)
	{
		var asset = {};
		asset.src = src;
		asset.onload = onload;
		asset.onerror = onerror;
		this.loading[src] = true;

		var resolvedSrc = this.root + asset.src;
		if(this.bustCache)
		{
			resolvedSrc += '?' + parseInt(Math.random() * 10000000);
		}

		switch(this.getType(asset.src))
		{
			case 'image':
				asset.image = new Image();
				asset.image.asset = asset;
				asset.image.onload = this.assetLoaded;
				asset.image.onerror = this.assetError;
				asset.image.src = resolvedSrc;
			break;
			case 'audio':
				asset.audio = new Audio(resolvedSrc);
				asset.audio.asset = asset;
				this.data[asset.src] = asset.audio;
				asset.audio.addEventListener('canplay', this.assetLoaded, false);
				asset.audio.addEventListener('error', this.assetError, false);
				asset.audio.load();
			break;
			default:
				var req = new XMLHttpRequest();
				req.asset = asset;
				req.onreadystatechange = this.assetLoaded;
				req.open('GET', resolvedSrc, true);
				req.send(null);
			break;
		}
	}

	this.assetLoaded = function(e)
	{
		var asset = this.asset;
		var src = asset.src;
		var fileType = that.getType(asset.src);

		that.loaded[src] = true;
		that.loading[src] = false;

		if(fileType == 'json')
		{
			if(this.readyState != 4)
			{
				return;
			}
			that.data[asset.src] = JSON.parse(this.responseText);
		}
		else if(fileType = 'image')
		{
			var newImage = that.isImageToCanvas ? Firestorm.utility.imageToCanvas(asset.image) : asset.image;
			if(that.isFuchiaToTransparent && that.getPostFix(asset.src) == 'bmp')
			{
				newImage = fuchiaToTransparent(newImage);
			}
			that.data[asset.src] = newImage;
		}
		else if(fileType == 'audio')
		{
			asset.audio.removeEventListener('canplay', that.assetLoaded, false);
			that.data[asset.src] = asset.audio;
		}

		that.loadCount++;
		that.processCallbacks(asset, true);
	}

	this.assetError = function(e)
	{
		var asset = this.asset;
		that.errorCount++;
		that.processCallbacks(asset, false);
	}

	this.processCallbacks = function(asset, isOK)
	{
		var percentLoaded = parseInt((that.loadCount + that.errorCount) / that.srcList.length * 100);
		
		if(isOK)
		{
			if(that.onload)
			{
				that.onload(asset.src, percentLoaded);
			}
			if(asset.onload)
			{
				asset.onload();
			}
		}
		else
		{
			if(that.onerror)
			{
				that.onerror(asset.src, percentLoaded);
			}
			if(asset.onerror)
			{
				asset.onerror(asset);
			}
		}

		if(percentLoaded == 100)
		{
			if(that.onfinish)
			{
				that.onfinish();
			}
			that.onload = null;
			that.onerror = null;
			that.onfinish = null;
		}
	}

	function fuchiaToTransparent(image)
	{
		var canvas = Firestorm.utility.isImage(image) ? Firestorm.utility.imageToCanvas(image) : image;
		var context = canvas.getContext('2d');
		var imageData = context.getImagedata(0, 0, canvas.width, canvas.height);
		var pixels = imageData.data;

		for(var i = 0; i < pixels.length; i += 4)
		{
			if(pixels[i] == 255 && pixels[i + 1] == 0 && pixels[i + 2] == 255)
			{
				pixels[i + 3] = 0;
			}
		}
		context.putImageData(imageData, 0, 0);
		return canvas;
	}
}