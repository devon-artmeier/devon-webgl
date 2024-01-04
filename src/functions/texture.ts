import { Resource } from "../resources/resource";
import { ResourceManager } from "../resources/resource-manager";
import { ContextObject } from "../resources/context";
import { TextureFilter, TextureWrap } from "../types/texture-enums";
import { Color } from "../types/color";

export class Texture extends Resource
{
	protected _texture: WebGLTexture;
	protected _width: number = 1;
	protected _height: number = 1;
	protected _filter: TextureFilter = TextureFilter.Bilinear;
	protected _wrapX: TextureWrap = TextureWrap.Repeat;
	protected _wrapY: TextureWrap = TextureWrap.Repeat;
	private _tempBind: boolean = false;
	
	get width(): number { return this._width; }
	get height(): number { return this._height; }
	get filter(): TextureFilter { return this._filter; }
	get wrapX(): TextureWrap { return this._wrapX; }
	get wrapY(): TextureWrap { return this._wrapY; }
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	private constructor(context: ContextObject, id: string)
	{
		super(context, id);
		let gl = context.gl;

		this._texture = gl.createTexture();
		this.tempBind();
		
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		
		this.tempUnbind();
	}
	
	// Temporary bind
	public tempBind()
	{
		if (this._context.textures.bind.id != this.id) {
			let gl = this._context.gl;
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			this._tempBind = true;
		}
	}
	
	// Unbind temporary bind
	public tempUnbind()
	{
		if (this._tempBind) {
			Texture.rebind(this._context.id);
			this._tempBind = false;
		}
	}
	
	// Set filter
	public setFilter(filter: TextureFilter)
	{
		let gl = this._context.gl;
		this.tempBind();
		
		this._filter = filter;
		if (this._filter == TextureFilter.Bilinear) {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		}
		
		this.tempUnbind();
	}
	
	// Get wrap mode
	private getWrapMode(mode: TextureWrap): number
	{
		let gl = this._context.gl;
		return [gl.CLAMP_TO_EDGE, gl.REPEAT, gl.MIRRORED_REPEAT][mode];
	}
	
	// Set horizontal wrap mode
	public setWrapX(mode: TextureWrap)
	{
		let gl = this._context.gl;
		this.tempBind();
		
		this._wrapX = mode;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.getWrapMode(mode));
		
		this.tempUnbind();
	}
	
	// Set vertical wrap mode
	public setWrapY(mode: TextureWrap)
	{
		let gl = this._context.gl;
		this.tempBind();
		
		this._wrapY = mode;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.getWrapMode(mode));
		
		this.tempUnbind();
	}
	
	// Set wrap modes
	public setWrap(modeX: TextureWrap, modeY: TextureWrap)
	{
		let gl = this._context.gl;
		this.tempBind();
		
		this._wrapX = modeX;
		this._wrapY = modeY;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.getWrapMode(modeX));
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.getWrapMode(modeY));
		
		this.tempUnbind();
	}
	
	// Generate with color
	public generate(color: Color)
	{
		let gl = this._context.gl;
		this.tempBind();
		
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA,
			gl.UNSIGNED_BYTE, color.data8);
		this._width = 1;
		this._height = 1;
		
		this.tempUnbind();
	}
	
	// Load image file
	public loadImage(path: string)
	{
		let image = new Image();
		image.crossOrigin = "anonymous";
		image.src = path;
			
		image.onload = () => {
			if (this._texture != null) {
				let gl = this._context.gl;
				this.tempBind();
				
				this._width = image.width;
				this._height = image.height;
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
					gl.UNSIGNED_BYTE, image);
					
				this.tempUnbind();
			}
		};
	}
	
	// Delete
	public delete()
	{
		let gl = this._context.gl;
		if (this._context.textures.bind.id == this.id) {
			Texture.unbind(this._context.id);
		}
		gl.deleteTexture(this._texture);
		this._texture = null;
		this._width = 0;
		this._height = 0;
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Get texture
	private static getTexture(contextID: string, textureID: string): Texture
	{
		return ContextObject.get(contextID).textures.get(textureID) as Texture;
	}

	// Create
	public static create(contextID: string, textureID: string)
	{
		let context = ContextObject.get(contextID);
		if (context != null) {
			let texture = new Texture(context, textureID);
			ContextObject.get(contextID).textures.add(contextID, texture);
		}
	}
	
	// Bind
	public static bind(contextID: string, textureID: string)
	{
		let gl = ContextObject.get(contextID)?.gl;
		let texture = this.getTexture(contextID, textureID);
		if (gl != null) {
			if (ContextObject.get(contextID).textures.bind != texture) {
				gl.bindTexture(gl.TEXTURE_2D, texture._texture);
				ContextObject.get(contextID).textures.bind = texture;
			}
		}
	}
	
	// Unbind
	public static unbind(contextID: string)
	{
		let gl = ContextObject.get(contextID)?.gl;
		if (gl != null) {
			gl.bindTexture(gl.TEXTURE_2D, null);
			ContextObject.get(contextID).textures.bind = null;
		}
	}
	
	// Rebind
	private static rebind(contextID: string)
	{
		let gl = ContextObject.get(contextID).gl;
		let texture = this.getTexture(contextID, ContextObject.get(contextID).textures.bind.id);
		if (gl != null && texture != null) {
			gl.bindTexture(gl.TEXTURE_2D, texture._texture);
		}
	}
	
	// Get width
	public static getWidth(contextID: string, textureID: string): number
	{
		return this.getTexture(contextID, textureID)?.width;
	}
	
	// Get height
	public static getHeight(contextID: string, textureID: string): number
	{
		return this.getTexture(contextID, textureID)?.height;
	}
	
	// Get filter
	public static getFilter(contextID: string, textureID: string): TextureFilter
	{
		return this.getTexture(contextID, textureID)?.height;
	}
	
	// Get horizontal wrap mode
	public static getWrapX(contextID: string, textureID: string): TextureWrap
	{
		return this.getTexture(contextID, textureID)?.wrapX;
	}
	
	// Get vertical wrap mode
	public static getWrapY(contextID: string, textureID: string): TextureWrap
	{
		return this.getTexture(contextID, textureID)?.wrapY;
	}
	
	// Set filter
	public static setFilter(contextID: string, textureID: string, filter: TextureFilter)
	{
		this.getTexture(contextID, textureID)?.setFilter(filter);
	}
	
	// Set horizontal wrap mode
	public static setWrapX(contextID: string, textureID: string, wrap: TextureWrap)
	{
		this.getTexture(contextID, textureID)?.setWrapX(wrap);
	}
	
	// Set vertical wrap mode
	public static setWrapY(contextID: string, textureID: string, wrap: TextureWrap)
	{
		this.getTexture(contextID, textureID)?.setWrapY(wrap);
	}
	
	// Set wrap modes
	public static setWrap(contextID: string, textureID: string, wrapX: TextureWrap, wrapY: TextureWrap)
	{
		this.getTexture(contextID, textureID)?.setWrap(wrapX, wrapY);
	}
	
	// Set active texture number
	public static setActive(contextID: string, num: number)
	{
		let gl = ContextObject.get(contextID)?.gl;
		if (gl != null) {
			gl.activeTexture(gl.TEXTURE0 + num);
		}
	}
	
	// Generate with color
	public static generate(contextID: string, textureID: string, color: Color)
	{
		this.getTexture(contextID, textureID)?.generate(color);
	}
	
	// Load image
	public static loadImage(contextID: string, textureID: string, path: string)
	{
		this.getTexture(contextID, textureID)?.loadImage(path);
	}
	
	// Delete
	public static delete(contextID: string, textureID: string)
	{
		ContextObject.get(contextID).textures.delete(textureID);
	}
	
	// Delete all textures
	public static clear(contextID: string)
	{
		ContextObject.get(contextID).textures.clear();
	}
}