// Texture filter modes
export enum TextureFilter
{
	Nearest,
	Bilinear
}

// Texture wrap modes
export enum TextureWrap
{
	Clamp,
	Repeat,
	Mirror
}

// Texture class
export class Texture
{
	private static _gl: WebGL2RenderingContext;
	private static _textures: Map<string, Map<string, Texture>> = new Map<string, Map<string, Texture>>();
	private static _initialized: boolean = false;
	
	private _texture;
	private _width: number = 0;
	private _height: number = 0;
	private _filter: TextureFilter;
	private _wrapX: TextureWrap;
	private _wrapY: TextureWrap;
	
	get width(): number { return this._width };
	get height(): number { return this._height };
	get filter(): TextureFilter { return this._filter };
	get wrapX(): TextureWrap { return this._wrapX };
	get wrapY(): TextureWrap { return this._wrapY };
	
	// Initialize
	public static initialize(gl: WebGL2RenderingContext)
	{
		if (!this._initialized) {
			this._gl = gl;
			this._initialized = true;
		} else {
			console.log("Cannot reinitialize texture manager.");
		}
	}
	
	// Delete texture
	public static delete(poolID: string, textureID: string)
	{
		if (Texture._textures.has(poolID)) {
			let pool = Texture._textures.get(poolID);
			if (pool.has(textureID)) {
				let texture = pool.get(textureID);
				texture.delete();
			}
		}
	}
	
	// Clear texture pool
	public static clearPool(poolID: string)
	{
		if (Texture._textures.has(poolID)) {
			let pool = Texture._textures.get(poolID);
			for (const [id, texture] of pool.entries()) {
				texture.deleteData();
			}
			pool.clear();
		}
		Texture._textures.delete(poolID);
	}
	
	// Clear all texture pools
	public static clearAllPools()
	{
		for (const [id, pool] of Texture._textures.entries()) {
			this.clearPool(id);
		}
	}
	
	// Constructor
	constructor(private _poolID: string, private _textureID: string)
	{
		let gl = Texture._gl;
		
		if (Texture._textures.has(this._poolID)) {
			let pool = Texture._textures.get(this._poolID);
			if (!pool.has(this._textureID)) {
				pool.set(this._textureID, this);
			} else {
				gl.deleteTexture(this._texture);
			}
		} else {
			Texture._textures.set(this._poolID, new Map<string, Texture>());
		}
		
		this._texture = gl.createTexture();
		
		this.setFilter(TextureFilter.Bilinear);
		this.setWrapX(TextureWrap.Repeat);
		this.setWrapY(TextureWrap.Repeat);
		
		this.generateBlank(1, 1);
		
		console.log(`Created texture "${this._textureID}" in pool "${this._poolID}"`);
	}
	
	// Set filter mode
	public setFilter(filter: TextureFilter)
	{
		let gl = Texture._gl;
		
		gl.bindTexture(gl.TEXTURE_2D, this._texture);
		this._filter = filter;
		if (this._filter == TextureFilter.Bilinear) {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		}
	}
	
	// Get wrap mode
	private getWrapMode(mode: TextureWrap): number
	{
		let gl = Texture._gl;
		return [gl.CLAMP_TO_EDGE, gl.REPEAT, gl.MIRRORED_REPEAT][mode];
	}
	
	// Set horizontal wrap mode
	public setWrapX(mode: TextureWrap)
	{
		let gl = Texture._gl;
		gl.bindTexture(gl.TEXTURE_2D, this._texture);
		this._wrapX = mode;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.getWrapMode(mode));
	}
	
	// Set vertical wrap mode
	public setWrapY(mode: TextureWrap)
	{
		let gl = Texture._gl;
		gl.bindTexture(gl.TEXTURE_2D, this._texture);
		this._wrapX = mode;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.getWrapMode(mode));
	}
	
	// Set wrap modes
	public setWrap(modeX: TextureWrap, modeY: TextureWrap)
	{
		this.setWrapX(modeX);
		this.setWrapY(modeY);
	}
	
	// Bind for drawing
	public bind(num: number)
	{
		let gl = Texture._gl;
		gl.activeTexture(gl.TEXTURE0 + num);
		gl.bindTexture(gl.TEXTURE_2D, this._texture);
	}
	
	// Generate blank texture
	public generateBlank(width: number, height: number)
	{
		let gl = Texture._gl;
		if (this._texture != null) {
			this._width = width;
			this._height = height;
			
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
				gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(width * height * 4));
		}
	}
	
	// Load image file
	public loadImage(path: string)
	{
		let gl = Texture._gl;
		
		if (this._texture != null) {
			var image = new Image();
			image.crossOrigin = "anonymous";
			image.src = path;
			
			image.onload = () => {
				this._width = image.width;
				this._height = image.height;
				
				gl.bindTexture(gl.TEXTURE_2D, this._texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			
				console.log(`Loaded "${path}" into texture "${this._textureID}" in pool "${this._poolID}"`);
			};
		}
	}
	
	// Delete from pool
	public delete()
	{
		if (Texture._textures.has(this._poolID)) {
			let pool = Texture._textures.get(this._poolID);
			if (pool.has(this._textureID)) {
				pool.delete(this._textureID);
			}
		}
		this.deleteData();
	}
	
	// Delete data
	private deleteData()
	{
		if (this._texture != null) {
			Texture._gl.deleteTexture(this._texture);
		}
		this._texture = null;
		this._width = 0;
		this._height = 0;
	}
};