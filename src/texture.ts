import { Color } from "./color";
import { Resource } from "./resource";

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
export class Texture extends Resource
{
	private static _curTexture: WebGLProgram;
	
	private _texture: WebGLTexture;
	private _width: number = 0;
	private _height: number = 0;
	private _filter: TextureFilter;
	private _wrapX: TextureWrap;
	private _wrapY: TextureWrap;
	
	get width(): number { return this._width; }
	get height(): number { return this._height; }
	get filter(): TextureFilter { return this._filter; }
	get wrapX(): TextureWrap { return this._wrapX; }
	get wrapY(): TextureWrap { return this._wrapY; }
	
	// Constructor
	constructor(gl: WebGL2RenderingContext)
	{
		super(gl);
		this._texture = this._gl.createTexture();
		this.setFilter(TextureFilter.Bilinear);
		this.setWrapX(TextureWrap.Repeat);
		this.setWrapY(TextureWrap.Repeat);
		this.generate(Color.FromRGBA(0, 0, 0, 0));
	}
	
	// Set filter mode
	public setFilter(filter: TextureFilter)
	{
		if (this._texture != null) {
			this.bind();
			this._filter = filter;
			if (this._filter == TextureFilter.Bilinear) {
				this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
				this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
			} else {
				this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
				this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
			}
		}
	}
	
	// Get wrap mode
	private getWrapMode(mode: TextureWrap): number
	{
		return [this._gl.CLAMP_TO_EDGE, this._gl.REPEAT, this._gl.MIRRORED_REPEAT][mode];
	}
	
	// Set horizontal wrap mode
	public setWrapX(mode: TextureWrap)
	{
		if (this._texture != null) {
			this.bind();
			this._wrapX = mode;
			this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this.getWrapMode(mode));
		}
	}
	
	// Set vertical wrap mode
	public setWrapY(mode: TextureWrap)
	{
		if (this._texture != null) {
			this.bind();
			this._wrapY = mode;
			this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this.getWrapMode(mode));
		}
	}
	
	// Set wrap modes
	public setWrap(modeX: TextureWrap, modeY: TextureWrap)
	{
		this.setWrapX(modeX);
		this.setWrapY(modeY);
	}
	
	// Bind for drawing
	public bind()
	{
		if (this._texture != null && Texture._curTexture != this._texture) {
			this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
			Texture._curTexture = this._texture;
		}
	}
	
	// Set active texture
	public setActive(num: number)
	{
		this._gl.activeTexture(this._gl.TEXTURE0 + num);
		this.bind();
	}
	
	// Generate with color
	public generate(color: Color)
	{
		if (this._texture != null) {
			this.bind();
			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, 1, 1, 0, this._gl.RGBA,
				this._gl.UNSIGNED_BYTE, color.data8);
			this._width = 1;
			this._height = 1;
		}
	}
	
	// Load image file
	public loadImage(path: string)
	{
		if (this._texture != null) {
			let image = new Image();
			image.crossOrigin = "anonymous";
			image.src = path;
			
			image.onload = () => {
				if (this._texture != null) {
					this.bind();
					this._width = image.width;
					this._height = image.height;
					this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA,
						this._gl.UNSIGNED_BYTE, image);
				}
			};
		}
	}
	
	// Delete
	public delete()
	{
		if (Texture._curTexture == this._texture) {
			Texture._curTexture = null;
			this._gl.bindTexture(this._gl.TEXTURE_2D, null);
		}
		if (this._texture != null) {
			this._gl.deleteTexture(this._texture);
		}
		this._texture = null;
		this._width = 0;
		this._height = 0;
	}
};