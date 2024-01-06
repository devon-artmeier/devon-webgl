import { Color } from "./color";
import { TextureFilter, TextureWrap } from "./enums";
import { Resource } from "../private/resource";
import { ResourceManager } from "../private/resource-manager"
import { Context } from "./context";
import { ContextCollection } from "../private/context-collection";

export class Texture extends Resource
{
	protected _texture: WebGLTexture;
	protected _width: number = 1;
	protected _height: number = 1;
	protected _filter: TextureFilter = TextureFilter.Bilinear;
	protected _wrapX: TextureWrap = TextureWrap.Repeat;
	protected _wrapY: TextureWrap = TextureWrap.Repeat;
	
	get width(): number { return this._width; }
	get height(): number { return this._height; }
	get filter(): TextureFilter { return this._filter; }
	get wrapX(): TextureWrap { return this._wrapX; }
	get wrapY(): TextureWrap { return this._wrapY; }
	
	/**************************/
	/* CLASS OBJECT FUNCTIONS */
	/**************************/
	
	// Constructor
	protected constructor(context: Context, id: string, manager: ResourceManager)
	{
		super(context, id, manager);
		let gl = this._context.gl;

		this._texture = gl.createTexture();

		this.tempBind();
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		this.tempUnbind();
	}
	
	// Bind
	public bind()
	{
		let gl = this._context.gl;
		gl.bindTexture(gl.TEXTURE_2D, this._texture);
	}
	
	// Unbind
	public unbind()
	{
		let gl = this._context.gl;
		gl.bindTexture(gl.TEXTURE_2D, null);
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
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

				this.tempUnbind();
			}
		};
	}
	
	// Delete
	public delete()
	{
		let gl = this._context.gl;
		this._manager.unbind(this.id);
		gl.deleteTexture(this._texture);
	}
	
	/********************/
	/* STATIC FUNCTIONS */
	/********************/
	
	// Get texture
	private static getTexture(textureID: string): Texture
	{
		return ContextCollection.getBind()?.textures.get(textureID) as Texture;
	}

	// Create
	public static create(textureID: string)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let manager = context.textures;
			let texture = new Texture(context, textureID, manager);
			manager.add(textureID, texture);
		}
	}
	
	// Bind
	public static bind(textureID: string)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let manager = context.textures;
			manager.bind(textureID);
		}
	}
	
	// Unbind
	public static unbind()
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			context.textures.unbindCurrent();
		}
	}
	
	// Get width
	public static getWidth(textureID: string): number
	{
		return this.getTexture(textureID)?.width;
	}
	
	// Get height
	public static getHeight(textureID: string): number
	{
		return this.getTexture(textureID)?.height;
	}
	
	// Get filter
	public static getFilter(textureID: string): TextureFilter
	{
		return this.getTexture(textureID)?.height;
	}
	
	// Get horizontal wrap mode
	public static getWrapX(textureID: string): TextureWrap
	{
		return this.getTexture(textureID)?.wrapX;
	}
	
	// Get vertical wrap mode
	public static getWrapY(textureID: string): TextureWrap
	{
		return this.getTexture(textureID)?.wrapY;
	}
	
	// Set filter
	public static setFilter(textureID: string, filter: TextureFilter)
	{
		this.getTexture(textureID)?.setFilter(filter);
	}
	
	// Set horizontal wrap mode
	public static setWrapX(textureID: string, wrap: TextureWrap)
	{
		this.getTexture(textureID)?.setWrapX(wrap);
	}
	
	// Set vertical wrap mode
	public static setWrapY(textureID: string, wrap: TextureWrap)
	{
		this.getTexture(textureID)?.setWrapY(wrap);
	}
	
	// Set wrap modes
	public static setWrap(textureID: string, wrapX: TextureWrap, wrapY: TextureWrap)
	{
		this.getTexture(textureID)?.setWrap(wrapX, wrapY);
	}
	
	// Set active texture number
	public static setActive(num: number)
	{
		let context = ContextCollection.getBind();
		if (context != null) {
			let gl = context.gl;
			gl.activeTexture(gl.TEXTURE0 + num);
		}
	}
	
	// Generate with color
	public static generate(textureID: string, color: Color)
	{
		this.getTexture(textureID)?.generate(color);
	}
	
	// Load image
	public static loadImage(textureID: string, path: string)
	{
		this.getTexture(textureID)?.loadImage(path);
	}
	
	// Delete
	public static delete(textureID: string)
	{
		ContextCollection.getBind().textures.delete(textureID);
	}
	
	// Delete all textures
	public static clear()
	{
		ContextCollection.getBind().textures.clear();
	}
}